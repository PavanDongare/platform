'use client'

import { useCallback, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useRecorder } from './lib/use-recorder'

type WarmStatus = 'idle' | 'loading' | 'ready' | 'error'

type ASRPipeline = (audio: Float32Array, options?: Record<string, unknown>) => Promise<{ text?: string }>

type HistoryEntry = {
  text: string
}

type TranscriptEntry = {
  id: string
  text: string
  ts: number
}

type ConceptCard = {
  id: string
  ts: number
  bullets: string[]
}

type ConceptApiResponse = {
  concepts?: string[]
  source?: 'model' | 'fallback'
  debug?: {
    requestId?: string
    reason?: string
    model?: string
    rawPreview?: string
  }
}

const MODEL_ID = 'Xenova/whisper-tiny.en'

async function blobToMonoFloat32(blob: Blob): Promise<Float32Array> {
  const arrayBuffer = await blob.arrayBuffer()

  const decodeWith = async (context: AudioContext): Promise<Float32Array> => {
    try {
      const decoded = await context.decodeAudioData(arrayBuffer.slice(0))
      return new Float32Array(decoded.getChannelData(0))
    } finally {
      await context.close()
    }
  }

  try {
    return await decodeWith(new AudioContext({ sampleRate: 16000 }))
  } catch {
    return decodeWith(new AudioContext())
  }
}

function dedupeConcepts(items: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []

  for (const raw of items) {
    const text = raw.trim()
    const key = text.toLowerCase()
    if (!text || seen.has(key)) continue
    seen.add(key)
    out.push(text)
    if (out.length >= 10) break
  }

  return out
}

function normalizeConceptKey(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ')
}

export default function InterviewGuidePage() {
  const [warmStatus, setWarmStatus] = useState<WarmStatus>('idle')
  const [isProcessingAsr, setIsProcessingAsr] = useState(false)
  const [isCallingLlm, setIsCallingLlm] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [conceptCards, setConceptCards] = useState<ConceptCard[]>([])
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([])

  const asrRef = useRef<ASRPipeline | null>(null)
  const queueRef = useRef<Blob[]>([])
  const processingRef = useRef(false)
  const llmInFlightRef = useRef(false)

  const historyRef = useRef<HistoryEntry[]>([])
  const transcriptsRef = useRef<TranscriptEntry[]>([])
  const lastFedIndexRef = useRef(0)
  const conceptsRef = useRef<string[]>([])
  const seenConceptKeysRef = useRef<Set<string>>(new Set())
  const cardFeedRef = useRef<HTMLDivElement | null>(null)

  const ensureModelLoaded = useCallback(async () => {
    if (asrRef.current) {
      setWarmStatus('ready')
      return asrRef.current
    }

    setWarmStatus('loading')
    setErrorMessage(null)

    try {
      const { pipeline: createPipeline } = (await import('@huggingface/transformers')) as {
        pipeline: (task: string, model: string) => Promise<unknown>
      }
      const asr = (await createPipeline('automatic-speech-recognition', MODEL_ID)) as ASRPipeline
      asrRef.current = asr
      setWarmStatus('ready')
      return asr
    } catch (error) {
      setWarmStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load speech model')
      throw error
    }
  }, [])

  const pushTranscript = useCallback((text: string) => {
    const now = Date.now()
    const prev = transcriptsRef.current[transcriptsRef.current.length - 1]
    if (prev && prev.text.toLowerCase() === text.toLowerCase()) {
      return
    }

    const entry: TranscriptEntry = {
      id: `${now}-${Math.random().toString(16).slice(2)}`,
      text,
      ts: now,
    }

    const next = [...transcriptsRef.current, entry].slice(-60)
    transcriptsRef.current = next
    setTranscripts(next)
  }, [])

  const scrollToLatestCard = useCallback(() => {
    if (!cardFeedRef.current) return
    cardFeedRef.current.scrollTo({
      top: cardFeedRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  const callLlmIfNeeded = useCallback(async () => {
    if (llmInFlightRef.current) return
    const current = transcriptsRef.current
    if (lastFedIndexRef.current >= current.length) return

    const newEntries = current.slice(lastFedIndexRef.current)
    const incrementText = newEntries.map((item) => item.text).join('\n').trim()
    if (!incrementText) {
      lastFedIndexRef.current = current.length
      return
    }

    llmInFlightRef.current = true
    setIsCallingLlm(true)

    try {
      const response = await fetch('/interview-guide/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: incrementText,
          history: historyRef.current.slice(-20),
          previousConcepts: conceptsRef.current,
        }),
      })

      if (response.ok) {
        const body = (await response.json()) as ConceptApiResponse
        const nextConcepts = dedupeConcepts(Array.isArray(body.concepts) ? body.concepts : [])

        if (nextConcepts.length > 0) {
          const novelConcepts = nextConcepts.filter((concept) => {
            const key = normalizeConceptKey(concept)
            if (!key || seenConceptKeysRef.current.has(key)) return false
            return true
          })

          if (novelConcepts.length > 0) {
            novelConcepts.forEach((concept) => seenConceptKeysRef.current.add(normalizeConceptKey(concept)))
            conceptsRef.current = [...conceptsRef.current, ...novelConcepts].slice(-20)
            const card: ConceptCard = {
              id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
              ts: Date.now(),
              bullets: novelConcepts.slice(0, 8),
            }

            setConceptCards((prev) => [...prev, card].slice(-24))
            requestAnimationFrame(scrollToLatestCard)
          }
        }
        if (body.source === 'fallback') {
          const reason = body.debug?.reason ? ` (${body.debug.reason})` : ''
          setErrorMessage(`Concept model unavailable${reason}.`)
        } else {
          setErrorMessage(null)
        }

        historyRef.current = [...historyRef.current, { text: incrementText }].slice(-40)
      }

      lastFedIndexRef.current = current.length
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Concept update failed')
    } finally {
      llmInFlightRef.current = false
      setIsCallingLlm(false)
    }
  }, [scrollToLatestCard])

  const processQueue = useCallback(async () => {
    if (processingRef.current) return

    processingRef.current = true
    setIsProcessingAsr(true)
    let didAppendTranscript = false

    try {
      const asr = await ensureModelLoaded()

      while (queueRef.current.length > 0) {
        const chunk = queueRef.current.shift()
        if (!chunk) continue

        try {
          const monoAudio = await blobToMonoFloat32(chunk)
          const transcription = await asr(monoAudio)
          const text = `${transcription.text || ''}`.trim()
          if (!text) continue
          pushTranscript(text)
          didAppendTranscript = true
        } catch (error) {
          // Some short/incompatible audio chunks can fail decode; continue stream.
          const message = error instanceof Error ? error.message : 'Failed to process audio chunk'
          if (message.toLowerCase().includes('decode')) {
            continue
          }
          setErrorMessage(message)
        }
      }
    } finally {
      processingRef.current = false
      setIsProcessingAsr(false)
      if (didAppendTranscript) {
        void callLlmIfNeeded()
      }
    }
  }, [ensureModelLoaded, pushTranscript, callLlmIfNeeded])

  const onChunk = useCallback(
    async (blob: Blob) => {
      queueRef.current.push(blob)
      await processQueue()
    },
    [processQueue]
  )

  const recorder = useRecorder({
    silenceThreshold: 12,
    silenceDuration: 550,
    minSpeechDuration: 220,
    onChunk,
    onError: (error) => setErrorMessage(error.message),
  })

  const startLiveMode = useCallback(async () => {
    setErrorMessage(null)
    try {
      await ensureModelLoaded()
      await recorder.start()
    } catch {
      // Errors are already reflected in state.
    }
  }, [ensureModelLoaded, recorder])

  const stopLiveMode = useCallback(() => {
    recorder.stop()
    void callLlmIfNeeded()
  }, [recorder, callLlmIfNeeded])

  const statusText =
    warmStatus === 'loading'
      ? 'Loading model...'
      : warmStatus === 'ready'
      ? recorder.isRecording
        ? recorder.isSpeaking
          ? 'Live: speaking detected'
          : 'Live: listening'
        : 'Ready'
      : warmStatus === 'error'
      ? 'Model load failed'
      : 'Model not loaded'

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-3 p-3 sm:p-5">
      <section className="rounded-md border p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={ensureModelLoaded} disabled={warmStatus === 'loading'} className="text-base sm:text-lg">
            {warmStatus === 'ready' ? 'Model Ready' : 'Load Model'}
          </Button>
          {!recorder.isRecording ? (
            <Button type="button" onClick={startLiveMode} disabled={warmStatus === 'loading'} className="text-base sm:text-lg">
              Start Live
            </Button>
          ) : (
            <Button type="button" onClick={stopLiveMode} className="text-base sm:text-lg">
              Stop Live
            </Button>
          )}
          <span className="text-base text-muted-foreground sm:text-lg">{statusText}</span>
          {isProcessingAsr ? <span className="text-base text-blue-600 sm:text-lg">Transcribing...</span> : null}
          {isCallingLlm ? <span className="text-base text-blue-600 sm:text-lg">Finding missed angles...</span> : null}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-md border p-3 sm:p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold sm:text-xl">Missed Angles To Cover</h2>
          <div ref={cardFeedRef} className="mt-3 max-h-[68vh] space-y-3 overflow-y-auto pr-1 snap-y snap-mandatory sm:max-h-[72vh]">
            {conceptCards.length === 0 ? (
              <div className="rounded-md border p-3 text-base text-muted-foreground sm:text-lg">
                New missing points will appear during live mode.
              </div>
            ) : (
              conceptCards.map((card) => (
                <article key={card.id} className="snap-start rounded-md border p-3 sm:p-4">
                  <p className="text-xs text-muted-foreground sm:text-sm">{new Date(card.ts).toLocaleTimeString()}</p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base leading-7 sm:text-xl sm:leading-9">
                    {card.bullets.map((item, index) => (
                      <li key={`${card.id}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="hidden rounded-md border p-3 sm:p-4 lg:col-span-1">
          <h2 className="text-lg font-semibold sm:text-xl">Realtime Transcript</h2>
          <ul className="mt-3 space-y-2 text-base leading-7 sm:text-lg sm:leading-8">
            {transcripts.length > 0 ? (
              transcripts
                .slice(-12)
                .reverse()
                .map((item) => (
                  <li key={item.id} className="rounded border p-2">
                    <p className="text-xs text-muted-foreground sm:text-sm">{new Date(item.ts).toLocaleTimeString()}</p>
                    <p>{item.text}</p>
                  </li>
                ))
            ) : (
              <li className="text-muted-foreground">Transcript appears live here.</li>
            )}
          </ul>
        </div>
      </section>

      {errorMessage ? <div className="rounded-md border border-red-300 bg-red-50 p-3 text-base text-red-700 sm:text-lg">{errorMessage}</div> : null}
    </main>
  )
}
