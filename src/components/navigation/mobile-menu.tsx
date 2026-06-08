'use client'

import Link from 'next/link'
import { Mail, Calendar } from 'lucide-react'

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void
    }
  }
}

interface MobileMenuProps {
  activeTab: 'about' | 'projects' | 'testimonials'
  onTabChange: (tab: 'about' | 'projects' | 'testimonials') => void
  onClose: () => void
}

const navLinks = [
  { label: 'About', tab: 'about' as const },
  { label: 'Projects', tab: 'projects' as const },
  { label: 'Recommendations', tab: 'testimonials' as const },
]

const contactLinks = [
  {
    label: 'Email',
    href: 'mailto:dongare.pavan25@gmail.com',
    icon: Mail,
  },
]

export function MobileMenu({ activeTab, onTabChange, onClose }: MobileMenuProps) {
  const openCalendly = () => {
    if (!document.querySelector('link[href*="calendly"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      document.head.appendChild(link)
    }
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/pavan-dongare/intro'
      })
    }
    onClose()
  }

  return (
    <div className="fixed top-16 left-0 right-0 bottom-0 bg-white border-b border-zinc-100 lg:hidden z-40">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Navigation Links */}
        <nav className="mb-8 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                onTabChange(link.tab)
                onClose()
              }}
              className={`text-left text-sm transition-colors px-4 py-2 rounded-lg ${
                activeTab === link.tab
                  ? 'text-zinc-900 font-medium bg-zinc-50'
                  : 'text-zinc-600'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>


        {/* Contact Links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-zinc-400 px-4">Contact</p>
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
              onClick={onClose}
            >
              <link.icon className="w-4 h-4 text-zinc-400" />
              <span>{link.label}</span>
            </a>
          ))}
          <button
            onClick={openCalendly}
            className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors text-left"
          >
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span>Schedule a call</span>
          </button>
        </div>
      </div>
    </div>
  )
}
