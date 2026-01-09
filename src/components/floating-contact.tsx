'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Linkedin, Mail, Calendar } from 'lucide-react'

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
    }
  }
}

const contactLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/pavan-dongare/',
    icon: Linkedin,
  },
  {
    label: 'Email',
    href: 'mailto:dongare.pavan25@gmail.com',
    icon: Mail,
  },
]

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/pavan-dongare/intro'
      })
    }
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
      {/* Expanded panel */}
      <div
        className={`absolute bottom-16 right-0 bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden transition-all duration-200 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
        style={{ minWidth: '200px' }}
      >
        <div className="p-2">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
            >
              <link.icon className="w-4 h-4 text-zinc-400" />
              <span>{link.label}</span>
            </a>
          ))}
        </div>

        <div className="border-t border-zinc-100 p-2">
          <button
            onClick={openCalendly}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
          >
            <Calendar className="w-4 h-4 text-zinc-600" />
            <span>Schedule a call</span>
          </button>
        </div>
      </div>

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          isOpen
            ? 'bg-zinc-900 text-white'
            : 'bg-white text-zinc-900 hover:bg-zinc-50 border border-zinc-200'
        }`}
        aria-label={isOpen ? 'Close contact menu' : 'Open contact menu'}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}
