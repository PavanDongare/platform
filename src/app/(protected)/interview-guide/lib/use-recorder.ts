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
  volume: number  // Current volume level 0-100
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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const chunksRef = useRef<Blob[]>([])
  const speechStartRef = useRef<number | null>(null)
  const silenceStartRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const processAudio = useCallback(() => {
    if (!analyserRef.current || !isRecording) return

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
      // Speech detected
      silenceStartRef.current = null
      if (!speechStartRef.current) {
        speechStartRef.current = now
        setIsSpeaking(true)
      }
    } else {
      // Silence detected
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
        if (speechDuration >= minSpeechDuration && chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          onChunk?.(blob)
        }

        // Reset for next utterance
        chunksRef.current = []
        speechStartRef.current = null
        silenceStartRef.current = null
        setIsSpeaking(false)
      }
    }

    rafRef.current = requestAnimationFrame(processAudio)
  }, [isRecording, silenceThreshold, silenceDuration, minSpeechDuration, onChunk])

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

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      })

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onerror = (e) => {
        onError?.(new Error('MediaRecorder error'))
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(100) // Collect data every 100ms

      setIsRecording(true)
      chunksRef.current = []
      speechStartRef.current = null
      silenceStartRef.current = null

    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Failed to start recording'))
    }
  }, [onError])

  const stop = useCallback(() => {
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

    // Send any remaining audio
    if (chunksRef.current.length > 0 && speechStartRef.current) {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      onChunk?.(blob)
    }

    chunksRef.current = []
    speechStartRef.current = null
    silenceStartRef.current = null
    setIsRecording(false)
    setIsSpeaking(false)
    setVolume(0)
  }, [onChunk])

  // Start audio processing loop when recording
  useEffect(() => {
    if (isRecording) {
      rafRef.current = requestAnimationFrame(processAudio)
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isRecording, processAudio])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return {
    isRecording,
    isSpeaking,
    start,
    stop,
    volume,
  }
}
