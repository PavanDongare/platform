'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Github, Linkedin } from 'lucide-react'
import { Header } from '@/components/navigation/header'
import { AboutSection } from '@/components/sections/about-section'
import { MetricsShowcase } from '@/components/sections/metrics-showcase'
import { ExperienceSection } from '@/components/sections/experience-section'
import { ProjectsSection } from '@/components/sections/projects-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'projects' | 'testimonials'>('about')

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero - Compact */}
      {activeTab === 'about' && (
      <section className="min-h-[40vh] flex flex-col justify-center px-8 md:px-16 lg:px-24 border-b border-zinc-100 pt-12">
        <div className="max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex-1 max-w-2xl">
            <p className="text-zinc-400 text-sm tracking-wide mb-4">Pavan Dongare</p>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.1] mb-4">
              I spec it, build it, ship it.
            </h1>
            <p className="text-sm text-zinc-500">7.5 years • M.Tech NIT Trichy • IEEE Publications</p>
          </div>

          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-2xl -rotate-3"></div>
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-zinc-200">
                <Image
                  src="/pavan.png"
                  alt="Pavan Dongare"
                  fill
                  sizes="(max-width: 768px) 192px, (max-width: 1024px) 224px, 256px"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {activeTab === 'about' && <MetricsShowcase />}

      {activeTab === 'about' && <AboutSection />}

      {activeTab === 'experience' && <ExperienceSection />}

      {activeTab === 'projects' && <ProjectsSection />}

      {activeTab === 'testimonials' && <TestimonialsSection />}

      {/* Footer */}
      <footer className="py-8 px-8 md:px-16 lg:px-24 border-t border-zinc-100">
        <div className="max-w-4xl flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-zinc-900 font-medium mb-1">Pavan Dongare</p>
            <p className="text-zinc-400 text-sm">Technical Product Manager</p>
          </div>
          <div className="flex gap-6 text-sm">
            <a
              href="https://www.linkedin.com/in/pavan-dongare/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/pavandongare"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
