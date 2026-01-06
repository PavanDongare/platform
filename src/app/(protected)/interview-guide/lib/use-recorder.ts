'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

interface UseRecorderOptions {
  silenceThreshold?: number      // Volume level considered silence (0-255), default 15
  silenceDuration?: number       // Ms of silence before triggering, default 1500
  minSpeechDuration?: number     // Min ms of speech to send, default 500
  onChunk?: (blob: Blob) => void
  onError?: (error: Error) => void
}

interface UseRecorderReturn {
  isRecording: boolean
  isSpeaking: boolean
  start: () => Promise<void>
  stop: () => void
  volume: number
}

export function useRecorder(options: UseRecorderOptions = {}): UseRecorderReturn {
  const {
    silenceThreshold = 15,
    silenceDuration = 1500,
    minSpeechDuration = 500,
    onChunk,
    onError,
  } = options

  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [volume, setVolume] = useState(0)

  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const rafRef = useRef<number | null>(null)

  const speechStartRef = useRef<number | null>(null)
  const silenceStartRef = useRef<number | null>(null)
  const isActiveRef = useRef(false)

  const onChunkRef = useRef(onChunk)
  const onErrorRef = useRef(onError)
  onChunkRef.current = onChunk
  onErrorRef.current = onError

  // Create a new MediaRecorder instance
  const createMediaRecorder = useCallback(() => {
    if (!streamRef.current) return null

    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'audio/webm',
    })

    const chunks: Blob[] = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      if (chunks.length > 0) {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        onChunkRef.current?.(blob)
      }

      // Start a new recorder if still active
      if (isActiveRef.current && streamRef.current) {
        const newRecorder = createMediaRecorder()
        if (newRecorder) {
          mediaRecorderRef.current = newRecorder
          newRecorder.start(100)
        }
      }
    }

    mediaRecorder.onerror = () => {
      onErrorRef.current?.(new Error('MediaRecorder error'))
    }

    return mediaRecorder
  }, [])

  // Process audio levels
  const processAudio = useCallback(() => {
    if (!analyserRef.current || !isActiveRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.fftSize)
    analyserRef.current.getByteTimeDomainData(dataArray)

    // Calculate volume (RMS)
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
      const val = (dataArray[i] - 128) / 128
      sum += val * val
    }
    const rms = Math.sqrt(sum / dataArray.length)
    const volumeLevel = Math.min(100, Math.round(rms * 500))
    setVolume(volumeLevel)

    const now = Date.now()
    const isSpeakingNow = volumeLevel > silenceThreshold

    if (isSpeakingNow) {
      silenceStartRef.current = null
      if (!speechStartRef.current) {
        speechStartRef.current = now
        setIsSpeaking(true)
      }
    } else {
      if (speechStartRef.current && !silenceStartRef.current) {
        silenceStartRef.current = now
      }

      // Check if silence duration exceeded
      if (
        speechStartRef.current &&
        silenceStartRef.current &&
        now - silenceStartRef.current >= silenceDuration
      ) {
        const speechDuration = silenceStartRef.current - speechStartRef.current

        // Only send if enough speech was captured
        if (speechDuration >= minSpeechDuration) {
          // Stop current recorder - this triggers onstop which sends the blob
          // and starts a new recorder
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop()
          }
        }

        // Reset for next utterance
        speechStartRef.current = null
        silenceStartRef.current = null
        setIsSpeaking(false)
      }
    }

    rafRef.current = requestAnimationFrame(processAudio)
  }, [silenceThreshold, silenceDuration, minSpeechDuration])

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Set up audio analysis
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      // Create and start first media recorder
      const mediaRecorder = createMediaRecorder()
      if (mediaRecorder) {
        mediaRecorderRef.current = mediaRecorder
        mediaRecorder.start(100)
      }

      isActiveRef.current = true
      setIsRecording(true)
      speechStartRef.current = null
      silenceStartRef.current = null

      // Start audio processing loop
      rafRef.current = requestAnimationFrame(processAudio)

    } catch (err) {
      onErrorRef.current?.(err instanceof Error ? err : new Error('Failed to start recording'))
    }
  }, [createMediaRecorder, processAudio])

  const stop = useCallback(() => {
    isActiveRef.current = false

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    speechStartRef.current = null
    silenceStartRef.current = null
    setIsRecording(false)
    setIsSpeaking(false)
    setVolume(0)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return {
    isRecording,
    isSpeaking,
    start,
    stop,
    volume,
  }
}
