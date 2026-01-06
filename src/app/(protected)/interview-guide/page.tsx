'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { useRecorder } from './lib/use-recorder'

interface Utterance {
  text: string
  isQuestion: boolean
  hint?: string
  timestamp: number
}

export default function InterviewGuidePage() {
  const [history, setHistory] = useState<Utterance[]>([])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChunk = useCallback(async (blob: Blob) => {
    setProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', blob, 'audio.webm')
      formData.append('history', JSON.stringify(history))

      const res = await fetch('/interview-guide/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Transcription failed')
      }

      const data = await res.json()

      if (data.text) {
        setHistory(prev => [...prev, {
          text: data.text,
          isQuestion: data.isQuestion,
          hint: data.hint,
          timestamp: Date.now(),
        }])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process audio')
    } finally {
      setProcessing(false)
    }
  }, [history])

  const handleError = useCallback((err: Error) => {
    setError(err.message)
  }, [])

  const { isRecording, isSpeaking, start, stop, volume } = useRecorder({
    onChunk: handleChunk,
    onError: handleError,
  })

  const toggleRecording = () => {
    if (isRecording) {
      stop()
    } else {
      setHistory([])
      setError(null)
      start()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-background border-b flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Interview Guide</h1>
          <div className="flex items-center gap-4">
            {isRecording && (
              <div className="flex items-center gap-2">
                <div
                  className="h-2 bg-primary/20 rounded-full w-24 overflow-hidden"
                >
                  <div
                    className="h-full bg-primary transition-all duration-100"
                    style={{ width: `${volume}%` }}
                  />
                </div>
                {isSpeaking && (
                  <span className="text-xs text-muted-foreground">Speaking...</span>
                )}
                {processing && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            )}
            <Button
              onClick={toggleRecording}
              variant={isRecording ? 'destructive' : 'default'}
              size="lg"
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}

          {history.length === 0 && !isRecording && (
            <div className="text-center py-12 text-muted-foreground">
              <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Click Start to begin recording</p>
              <p className="text-sm mt-2">Questions will be detected and hints provided automatically</p>
            </div>
          )}

          {history.map((utterance, i) => (
            <div
              key={utterance.timestamp}
              className={`p-4 rounded-lg border ${
                utterance.isQuestion
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-muted/50 border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className={utterance.isQuestion ? 'font-medium' : ''}>
                    {utterance.text}
                  </p>
                  {utterance.isQuestion && (
                    <span className="inline-block mt-1 text-xs text-primary font-medium">
                      Question detected
                    </span>
                  )}
                </div>
              </div>

              {utterance.hint && (
                <div className="mt-3 pt-3 border-t border-primary/10">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Suggested answer:</p>
                  <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none">
                    {utterance.hint}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isRecording && history.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="animate-pulse">Listening...</div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
