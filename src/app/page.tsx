'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/navigation/header'
import { AboutSection } from '@/components/sections/about-section'
import { ExperienceSection } from '@/components/sections/experience-section'

export default function PortfolioPage() {
  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      <Header />

      {/* Hero - Confident with trust signals */}
      <section id="about" className="scroll-mt-20 min-h-[70vh] flex flex-col justify-center px-8 md:px-16 lg:px-24 border-b border-zinc-100 pt-16">
        <div className="max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-12">
          <div className="flex-1 max-w-2xl">
            <p className="text-zinc-400 text-sm tracking-wide mb-6">Pavan Dongare</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-8">
              I spec it, build it, ship it.
            </h1>
            <p className="text-lg text-zinc-600 mb-8">
              Technical Product Manager with 7.5 years of experience building enterprise platforms
              and early-stage products. I write specs, build prototypes, and ship.
            </p>

            {/* Trust signals - prominent */}
            <div className="flex flex-wrap gap-6 text-sm mb-8">
              <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded">
                <span className="text-zinc-400">Experience</span>
                <span className="font-medium">7.5 years</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded">
                <span className="text-zinc-400">Education</span>
                <span className="font-medium">M.Tech, NIT Trichy</span>
              </div>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-2xl -rotate-3"></div>
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-zinc-200">
                <Image
                  src="/pavan.png"
                  alt="Pavan Dongare"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />

      <ExperienceSection />

      {/* Projects - Full-width showcase cards */}
      <section id="projects" className="scroll-mt-20 py-20 px-8 md:px-16 lg:px-24 border-b border-zinc-100">
        <div className="max-w-5xl">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-20">Selected Work</p>

          {/* Metaflow - 01 of 04 */}
          <div className="border border-zinc-100 rounded-lg p-6 mb-12 hover:border-zinc-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-400">Workflow Engine</span>
              <span className="text-xs uppercase tracking-widest text-zinc-400">01 of 04</span>
            </div>

            <Link href="/metaflow" className="group">
              <h2 className="text-2xl lg:text-3xl font-medium mb-4 group-hover:text-zinc-600 transition-colors">
                Metaflow
              </h2>
            </Link>

            <p className="text-sm text-zinc-600 mb-4">
              <span className="font-medium">Problem:</span> Workflows hardcoded in application code. Adding new processes required weeks of development.
            </p>
            <p className="text-sm text-zinc-600 mb-4">
              <span className="font-medium">Solution:</span> Push logic to database. Define workflows as JSON configs. PostgreSQL handles execution, validation, state transitions.
            </p>

            <div className="border-t border-zinc-50 my-4"></div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Core engine</span>
                <span className="text-zinc-900 font-mono">1,300 LOC PL/pgSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Criteria evaluation</span>
                <span className="text-zinc-900">Expression trees</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Relationship traversal</span>
                <span className="text-zinc-900">Dynamic SQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Setup</span>
                <span className="text-zinc-900">JSON config</span>
              </div>
            </div>

            <Link href="/metaflow" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">
              View live demo →
            </Link>
          </div>

          {/* Cited - 02 of 04 */}
          <div className="border border-zinc-100 rounded-lg p-6 mb-12 hover:border-zinc-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-400">GEO Readiness Score</span>
              <span className="text-xs uppercase tracking-widest text-zinc-400">02 of 04</span>
            </div>

            <a href="https://cited.pavandongare.com" target="_blank" rel="noopener noreferrer" className="group">
              <h2 className="text-2xl lg:text-3xl font-medium mb-4 group-hover:text-zinc-600 transition-colors">
                Cited
              </h2>
            </a>

            <p className="text-sm text-zinc-600 mb-4">
              <span className="font-medium">Problem:</span> Brands invisible to AI search. Content must be structured for LLMs, not traditional SEO.
            </p>
            <p className="text-sm text-zinc-600 mb-4">
              <span className="font-medium">Solution:</span> Submit URL, get GEO score across 8 dimensions. AI evaluates structure, metadata, formatting. Get recommendations to become quotable.
            </p>

            <div className="border-t border-zinc-50 my-4"></div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Scoring dimensions</span>
                <span className="text-zinc-900">8 factors</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Analysis</span>
                <span className="text-zinc-900">AI-powered</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Extraction</span>
                <span className="text-zinc-900">URL parsing</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Access</span>
                <span className="text-zinc-900">Free audits</span>
              </div>
            </div>

            <a href="https://cited.pavandongare.com" target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">
              View live app →
            </a>
          </div>

          {/* Document Intelligence - 03 of 04 */}
          <div className="border border-zinc-100 rounded-lg p-6 mb-12 hover:border-zinc-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-400">AI-Powered DMS</span>
              <span className="text-xs uppercase tracking-widest text-zinc-400">03 of 04</span>
            </div>

            <Link href="/dms" className="group">
              <h2 className="text-2xl lg:text-3xl font-medium mb-4 group-hover:text-zinc-600 transition-colors">
                Document Intelligence
              </h2>
            </Link>

            <p className="text-sm text-zinc-600 mb-4">
              <span className="font-medium">Problem:</span> Manual document management is tedious. Folder hierarchies, inconsistent metadata, hard to find anything.
            </p>
            <p className="text-sm text-zinc-600 mb-4">
              <span className="font-medium">Solution:</span> Upload documents. AI extracts metadata, categorizes, makes searchable. Chat interface with tool-use for natural language operations.
            </p>

            <div className="border-t border-zinc-50 my-4"></div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Extraction</span>
                <span className="text-zinc-900">Claude Haiku</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Formats</span>
                <span className="text-zinc-900">PDF, images</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Interface</span>
                <span className="text-zinc-900">Chat + tool-use</span>
              </div>
            </div>

            <Link href="/dms" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">
              View live demo →
            </Link>
          </div>

          {/* Spatial Notes - 04 of 04 */}
          <div className="border border-zinc-100 rounded-lg p-6 mb-12 hover:border-zinc-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-400">Canvas-Based Notes</span>
              <span className="text-xs uppercase tracking-widest text-zinc-400">04 of 04</span>
            </div>

            <Link href="/onenote" className="group">
              <h2 className="text-2xl lg:text-3xl font-medium mb-4 group-hover:text-zinc-600 transition-colors">
                Spatial Notes
              </h2>
            </Link>

            <p className="text-sm text-zinc-600 mb-4">
              Notes shouldn&apos;t be trapped in linear documents. TLDraw canvas for freeform organization. Notebooks, sections, pages — with spatial freedom within each.
            </p>

            <div className="border-t border-zinc-50 my-4"></div>

            <div className="grid md:grid-cols-3 gap-x-8 gap-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Canvas</span>
                <span className="text-zinc-900">TLDraw</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">State</span>
                <span className="text-zinc-900">Zustand</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Interaction</span>
                <span className="text-zinc-900">Drag + drop</span>
              </div>
            </div>

            <Link href="/onenote" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">
              View live demo →
            </Link>
          </div>
        </div>
      </section>

      {/* What I do - with specifics */}
      <section className="py-16 px-8 md:px-16 lg:px-24 border-b border-zinc-100">
        <div className="max-w-4xl">
          <div className="grid md:grid-cols-3 gap-12 text-sm">
            <div>
              <p className="text-zinc-900 font-medium mb-2">Product Strategy</p>
              <p className="text-zinc-500 leading-relaxed">
                Roadmaps, PRDs, stakeholder alignment. Translating business goals into technical requirements.
              </p>
            </div>
            <div>
              <p className="text-zinc-900 font-medium mb-2">Technical Depth</p>
              <p className="text-zinc-500 leading-relaxed">
                System design, database architecture, API specs. I prototype to validate before committing engineering resources.
              </p>
            </div>
            <div>
              <p className="text-zinc-900 font-medium mb-2">Execution</p>
              <p className="text-zinc-500 leading-relaxed">
                Ship fast, learn faster. The projects below are live — not mockups, not ideas, working software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Philosophy */}
      <section className="py-20 px-8 md:px-16 lg:px-24 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-3xl">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-8">Approach</p>

          <div className="space-y-6 text-zinc-600 leading-relaxed">
            <p>
              <span className="text-zinc-900 font-medium">Push logic down.</span>{' '}
              If the database can enforce it, don&apos;t enforce it in the application.
              Constraints, validations, complex queries — PostgreSQL handles it better than your ORM.
            </p>
            <p>
              <span className="text-zinc-900 font-medium">Configuration over code.</span>{' '}
              Every workflow that requires a code change is a missed abstraction.
              The goal is JSON configs interpreted at runtime.
            </p>
            <p>
              <span className="text-zinc-900 font-medium">Ship to learn.</span>{' '}
              Specs are guesses. Working software reveals the real requirements.
              These projects are live because that&apos;s where the learning happens.
            </p>
          </div>
        </div>
      </section>

      {/* Stack - minimal */}
      <section className="py-12 px-8 md:px-16 lg:px-24 border-b border-zinc-100">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-400">
          {['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Supabase', 'Claude API', 'ReactFlow', 'TLDraw'].map(tech => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="scroll-mt-20 py-16 px-8 md:px-16 lg:px-24">
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
              className="text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/pavandongare"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
