'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function PortfolioPage() {
  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Floating Resume Button */}
      <a
        href="/pavandongare.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-2 px-5 py-2 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition-colors shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        View Resume
      </a>

      {/* Hero - Confident with trust signals */}
      <section className="min-h-[70vh] flex flex-col justify-center px-8 md:px-16 lg:px-24 border-b border-zinc-100">
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

      {/* Companies - Logo-style trust bar */}
      <section className="py-8 px-8 md:px-16 lg:px-24 border-b border-zinc-100 bg-zinc-50">
        <div className="max-w-4xl">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-6">Previously At</p>
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <div>
              <p className="text-zinc-900 font-semibold">Morgan Stanley</p>
              <p className="text-zinc-500 text-sm">Associate · Wealth Management Tech</p>
            </div>
            <div>
              <p className="text-zinc-900 font-semibold">Deutsche Bank</p>
              <p className="text-zinc-500 text-sm">Product Manager · Trading Platforms</p>
            </div>
            <div>
              <p className="text-zinc-900 font-semibold">Series A Startups</p>
              <p className="text-zinc-500 text-sm">Founding PM · 0→1 Products</p>
            </div>
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

      {/* Projects - Case study style */}
      <section className="py-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-16">Selected Work</p>

          {/* Metaflow */}
          <div className="mb-24">
            <div className="flex items-baseline justify-between mb-4">
              <Link href="/metaflow" className="group">
                <h2 className="text-2xl md:text-3xl font-medium group-hover:text-zinc-500 transition-colors">
                  Metaflow
                </h2>
              </Link>
              <span className="text-zinc-400 text-sm">Workflow Engine</span>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-8">
              <div>
                <p className="text-zinc-500 leading-relaxed mb-6">
                  The problem: every new workflow required custom application code. Approval chains,
                  status transitions, validation rules — all hardcoded. Adding a new process meant
                  weeks of development.
                </p>
                <p className="text-zinc-500 leading-relaxed">
                  The solution: push the logic to the database. Define workflows as JSON configurations.
                  Let PostgreSQL handle execution, validation, and state transitions at runtime.
                </p>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">Core engine</span>
                  <span className="text-zinc-900 font-mono">1,300 LOC PL/pgSQL</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">Criteria evaluation</span>
                  <span className="text-zinc-900">Recursive expression trees</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">Relationship traversal</span>
                  <span className="text-zinc-900">Dynamic SQL generation</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">New workflow setup</span>
                  <span className="text-zinc-900">JSON config only</span>
                </div>
              </div>
            </div>

            {/* Technical detail - shows depth */}
            <div className="bg-zinc-50 rounded-lg p-6 font-mono text-xs text-zinc-600 overflow-x-auto">
              <p className="text-zinc-400 mb-3"># Example: Criteria evaluation path resolution</p>
              <p className="text-zinc-700">order.customer.account.status = &apos;active&apos;</p>
              <p className="text-zinc-500 mt-2">→ Resolves to JOINs at query time: orders → customers → accounts</p>
              <p className="text-zinc-500">→ Supports M:N with ANY/ALL quantifiers</p>
            </div>

            <Link href="/metaflow" className="inline-block mt-6 text-sm text-zinc-400 hover:text-zinc-900 transition-colors">
              View live demo →
            </Link>
          </div>

          {/* Cited */}
          <div className="mb-24">
            <div className="flex items-baseline justify-between mb-4">
              <a href="https://cited.pavandongare.com" target="_blank" rel="noopener noreferrer" className="group">
                <h2 className="text-2xl md:text-3xl font-medium group-hover:text-zinc-500 transition-colors">
                  Cited
                </h2>
              </a>
              <span className="text-zinc-400 text-sm">Generative Engine Optimization</span>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-8">
              <div>
                <p className="text-zinc-500 leading-relaxed mb-6">
                  The problem: Search is shifting. Instead of ranking #1 on Google, brands need to be sources that AI cites.
                  Content is invisible if it's not structured for how LLMs consume it.
                </p>
                <p className="text-zinc-500 leading-relaxed">
                  The solution: Submit your URL, get a GEO readiness score across 8 optimization dimensions.
                  AI evaluates structure, metadata, data formatting, brand mentions. Get specific recommendations
                  to become quotable.
                </p>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">Scoring dimensions</span>
                  <span className="text-zinc-900">8 optimization factors</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">Content extraction</span>
                  <span className="text-zinc-900">URL parsing + analysis</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">Recommendations</span>
                  <span className="text-zinc-900">AI-generated optimization</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">Access</span>
                  <span className="text-zinc-900">Free audits via /autopilot</span>
                </div>
              </div>
            </div>

            <a href="https://cited.pavandongare.com" target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-zinc-400 hover:text-zinc-900 transition-colors">
              View live app →
            </a>
          </div>

          {/* DMS */}
          <div className="mb-24">
            <div className="flex items-baseline justify-between mb-4">
              <Link href="/dms" className="group">
                <h2 className="text-2xl md:text-3xl font-medium group-hover:text-zinc-500 transition-colors">
                  Document Intelligence
                </h2>
              </Link>
              <span className="text-zinc-400 text-sm">AI-Powered DMS</span>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-8">
              <div>
                <p className="text-zinc-500 leading-relaxed mb-6">
                  Upload a document. AI extracts metadata, categorizes it, makes it searchable.
                  No manual tagging, no folder hierarchies to maintain.
                </p>
                <p className="text-zinc-500 leading-relaxed">
                  Chat interface with tool-use: search documents, create folders, organize —
                  all through natural language.
                </p>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">Extraction model</span>
                  <span className="text-zinc-900">Claude Haiku</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">Supported formats</span>
                  <span className="text-zinc-900">PDF, images</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">Chat interface</span>
                  <span className="text-zinc-900">Tool-use for actions</span>
                </div>
              </div>
            </div>

            <Link href="/dms" className="inline-block text-sm text-zinc-400 hover:text-zinc-900 transition-colors">
              View live demo →
            </Link>
          </div>

          {/* Notes */}
          <div className="mb-24">
            <div className="flex items-baseline justify-between mb-4">
              <Link href="/onenote" className="group">
                <h2 className="text-2xl md:text-3xl font-medium group-hover:text-zinc-500 transition-colors">
                  Spatial Notes
                </h2>
              </Link>
              <span className="text-zinc-400 text-sm">Canvas-Based</span>
            </div>

            <div className="grid md:grid-cols-2 gap-12 mb-8">
              <div>
                <p className="text-zinc-500 leading-relaxed">
                  Notes shouldn&apos;t be trapped in linear documents. TLDraw canvas for freeform
                  organization. Notebooks, sections, pages — with spatial freedom within each.
                </p>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">Canvas</span>
                  <span className="text-zinc-900">TLDraw</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">State</span>
                  <span className="text-zinc-900">Zustand</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-400">Interaction</span>
                  <span className="text-zinc-900">Drag and drop</span>
                </div>
              </div>
            </div>

            <Link href="/onenote" className="inline-block text-sm text-zinc-400 hover:text-zinc-900 transition-colors">
              View live demo →
            </Link>
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
      <footer className="py-16 px-8 md:px-16 lg:px-24">
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
