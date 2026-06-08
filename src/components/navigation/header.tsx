'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { MobileMenu } from './mobile-menu'
import { ContactDropdown } from './contact-dropdown'

const navLinks = [
  { label: 'About', tab: 'about' as const },
  { label: 'Projects', tab: 'projects' as const },
  { label: 'Recommendations', tab: 'testimonials' as const },
]

interface HeaderProps {
  activeTab: 'about' | 'projects' | 'testimonials'
  setActiveTab: (tab: 'about' | 'projects' | 'testimonials') => void
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
                sizes="48px"
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
                onClick={() => setActiveTab(link.tab)}
                className={`text-sm transition-colors ${
                  activeTab === link.tab
                    ? 'text-zinc-900 font-medium'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right: Contact Dropdown + Mobile Menu */}
          <div className="flex items-center gap-4 md:gap-6">
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
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
