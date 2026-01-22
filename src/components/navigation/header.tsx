'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { MobileMenu } from './mobile-menu'
import { ContactDropdown } from './contact-dropdown'

const navLinks = [
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
]

export function Header() {
  const [activeSection, setActiveSection] = useState<string>('about')
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  // Scroll spy to detect active section
  useEffect(() => {
    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    // Observe main sections
    const sections = ['experience', 'projects']
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  // Scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 h-16 border-b border-zinc-100 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm'
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-8 md:px-16 lg:px-24 flex items-center justify-between">
          {/* Left: Avatar + Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/pavan.png"
                alt="Pavan Dongare"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">Pavan Dongare</p>
            </div>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={(e) => {
                  e.preventDefault()
                  if (link.href.startsWith('#')) {
                    scrollToSection(link.href.slice(1))
                  }
                }}
                className={`text-sm transition-colors ${
                  link.href.startsWith('#') && activeSection === link.href.slice(1)
                    ? 'text-zinc-900 font-medium'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right: Resume + Contact Dropdown + Mobile Menu */}
          <div className="flex items-center gap-4 md:gap-6">
            <a
              href="/pavandongare.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-900 border border-zinc-200 rounded-lg hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </a>

            <ContactDropdown />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu
          activeSection={activeSection}
          onLinkClick={(sectionId) => scrollToSection(sectionId)}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
