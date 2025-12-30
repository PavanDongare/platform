'use client'

import Link from 'next/link'

export default function PortfolioPage() {
  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Hero - Full viewport intro */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 border-b border-zinc-200">
        <div className="max-w-5xl">
          <p className="text-zinc-400 mb-4 text-sm tracking-wide">Product Manager & Builder</p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none mb-8">
            Pavan
            <br />
            <span className="text-zinc-300">Dongare</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-500 max-w-xl leading-relaxed mb-12">
            I build systems that turn messy business processes into clean, working software.
          </p>

          {/* ASCII Architecture Diagram */}
          <div className="font-mono text-[10px] md:text-xs text-zinc-500 overflow-x-auto pb-4">
            <pre className="leading-snug">{`
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                              PLATFORM ARCHITECTURE                                     ║
║  ─────────────────────────────────────────────────────────────────────────────────    ║
║  Shared: Auth • Multi-tenant • Supabase • TypeScript • Tailwind                       ║
╠═══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                        ║
║  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐  ║
║  │       METAFLOW          │ │          DMS            │ │        ONENOTE          │  ║
║  │  ───────────────────    │ │  ───────────────────    │ │  ───────────────────    │  ║
║  │                         │ │                         │ │                         │  ║
║  │  ObjectTypes ──┐        │ │  Upload ──┐             │ │  Notebooks              │  ║
║  │  Fields        │        │ │  (PDF,    │             │ │    └─► Sections         │  ║
║  │  Relations     ▼        │ │   IMG)    ▼             │ │          └─► Pages      │  ║
║  │           ┌────────┐    │ │      ┌─────────┐        │ │               │         │  ║
║  │  Actions ─┤ Engine │    │ │      │ Claude  │        │ │               ▼         │  ║
║  │  (JSON)   │ 1300   │    │ │      │ Haiku   │        │ │         ┌─────────┐     │  ║
║  │  Criteria │ LOC    │    │ │      │ Extract │        │ │         │ TLDraw  │     │  ║
║  │           └────────┘    │ │      └────┬────┘        │ │         │ Canvas  │     │  ║
║  │               │         │ │           │             │ │         └─────────┘     │  ║
║  │               ▼         │ │           ▼             │ │               │         │  ║
║  │  ┌───────────────────┐  │ │  ┌───────────────────┐  │ │               ▼         │  ║
║  │  │ Process Canvas    │  │ │  │ Chat + Tools      │  │ │  ┌───────────────────┐  │  ║
║  │  │ (ReactFlow)       │  │ │  │ (Claude Sonnet)   │  │ │  │ Zustand Store     │  ║
║  │  │ State Machines    │  │ │  │ Search/Move/Del   │  │ │  │ Drag & Drop       │  │  ║
║  │  └───────────────────┘  │ │  └───────────────────┘  │ │  └───────────────────┘  │  ║
║  │                         │ │                         │ │                         │  ║
║  │  Schema: metaflow.*     │ │  Schema: dms.*          │ │  Schema: onenote.*      │  ║
║  └─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘  ║
║                                        │                                              ║
║                                        ▼                                              ║
║  ┌────────────────────────────────────────────────────────────────────────────────┐  ║
║  │                              POSTGRESQL                                         │  ║
║  │  ────────────────────────────────────────────────────────────────────────────  │  ║
║  │  4 schemas: public │ metaflow │ dms │ onenote                                   │  ║
║  │  RLS policies per tenant  •  PL/pgSQL functions  •  JSONB storage              │  ║
║  └────────────────────────────────────────────────────────────────────────────────┘  ║
║                                                                                        ║
║  + New App?  Create schema  ──►  Add routes  ──►  Build UI  ──►  Done                 ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝
            `}</pre>
          </div>
        </div>
      </section>

      {/* Numbers strip */}
      <section className="border-b border-zinc-200 py-16 px-8 md:px-16 lg:px-24 bg-zinc-50">
        <div className="flex flex-wrap gap-16 md:gap-24">
          <div>
            <p className="text-5xl md:text-6xl font-bold text-zinc-900">7.5+</p>
            <p className="text-zinc-400 mt-2">Years in Product</p>
          </div>
          <div>
            <p className="text-5xl md:text-6xl font-bold text-zinc-900">1300+</p>
            <p className="text-zinc-400 mt-2">Lines of PL/pgSQL</p>
          </div>
          <div>
            <p className="text-5xl md:text-6xl font-bold text-zinc-900">4</p>
            <p className="text-zinc-400 mt-2">Database Schemas</p>
          </div>
          <div>
            <p className="text-5xl md:text-6xl font-bold text-zinc-900">3</p>
            <p className="text-zinc-400 mt-2">Integrated Apps</p>
          </div>
        </div>
      </section>

      {/* The Project - Big statement */}
      <section className="py-32 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl">
          <p className="text-zinc-400 mb-6 text-sm uppercase tracking-widest">Featured Build</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-12">
            A workflow platform where business logic lives in config,{' '}
            <span className="text-zinc-300">not code.</span>
          </h2>
          <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
            Built from scratch to explore declarative workflow automation. Define data models visually.
            Configure actions in JSON. Let the database handle the complexity.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="py-16 border-y border-zinc-200">
        <div className="px-8 md:px-16 lg:px-24 mb-8">
          <p className="text-zinc-400 text-sm uppercase tracking-widest">What It Does</p>
        </div>
        <div className="flex gap-0 overflow-x-auto md:overflow-visible">
          <div className="min-w-[300px] md:min-w-0 flex-1 p-8 md:p-16 border-r border-zinc-200">
            <p className="text-7xl md:text-8xl font-bold text-zinc-100 mb-4">01</p>
            <h3 className="text-2xl font-bold mb-4">Ontology Builder</h3>
            <p className="text-zinc-500 leading-relaxed">
              Define object types with custom fields. Create relationships.
              Runtime schemas via JSONB. Visual graph editor with ReactFlow.
            </p>
          </div>
          <div className="min-w-[300px] md:min-w-0 flex-1 p-8 md:p-16 border-r border-zinc-200">
            <p className="text-7xl md:text-8xl font-bold text-zinc-100 mb-4">02</p>
            <h3 className="text-2xl font-bold mb-4">Actions Engine</h3>
            <p className="text-zinc-500 leading-relaxed">
              JSON-configured business logic. Recursive expression evaluation with
              ANY/ALL quantifiers. Transactional execution in PostgreSQL.
            </p>
          </div>
          <div className="min-w-[300px] md:min-w-0 flex-1 p-8 md:p-16">
            <p className="text-7xl md:text-8xl font-bold text-zinc-100 mb-4">03</p>
            <h3 className="text-2xl font-bold mb-4">AI Documents</h3>
            <p className="text-zinc-500 leading-relaxed">
              Claude-powered extraction. Metadata from uploads. Chat assistant
              with tool-use for document search and management.
            </p>
          </div>
        </div>
      </section>

      {/* Technical depth - inverted section for contrast */}
      <section className="py-32 px-8 md:px-16 lg:px-24 bg-zinc-900 text-white">
        <div className="max-w-4xl">
          <p className="text-zinc-500 mb-6 text-sm uppercase tracking-widest">Under The Hood</p>
          <div className="space-y-16">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Why push logic to the database?
              </h3>
              <p className="text-xl text-zinc-400 leading-relaxed">
                Application code becomes simple. No distributed transaction headaches.
                The database guarantees atomicity. 1300 lines of PL/pgSQL handles
                action execution, criteria evaluation, relationship traversal.
              </p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Declarative over imperative
              </h3>
              <p className="text-xl text-zinc-400 leading-relaxed">
                Actions are JSON configs, not code. Define what should happen when
                criteria match—create objects, update fields, traverse relationships.
                The engine interprets and executes.
              </p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                What I'd do differently
              </h3>
              <p className="text-xl text-zinc-400 leading-relaxed">
                Tests from day one. The recursive evaluator deserved TDD.
                Vector search for semantic document matching instead of keyword overlap.
                But shipping beats perfect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="py-24 px-8 md:px-16 lg:px-24 border-b border-zinc-200">
        <p className="text-zinc-400 mb-8 text-sm uppercase tracking-widest">Built With</p>
        <div className="flex flex-wrap gap-4 text-lg">
          {['Next.js 16', 'React 19', 'TypeScript', 'Supabase', 'PostgreSQL', 'Claude AI', 'ReactFlow', 'TLDraw', 'Zustand'].map(tech => (
            <span key={tech} className="text-zinc-600 after:content-['·'] after:ml-4 after:text-zinc-300 last:after:content-none">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Try it */}
      <section className="py-32 px-8 md:px-16 lg:px-24 border-b border-zinc-200">
        <div className="max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            See it working
          </h2>
          <p className="text-xl text-zinc-500 mb-12 max-w-xl">
            The apps in this platform are live. Explore the ontology builder,
            run actions, upload documents.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/metaflow"
              className="px-8 py-4 bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors"
            >
              Open Metaflow
            </Link>
            <Link
              href="/dms"
              className="px-8 py-4 border border-zinc-300 text-zinc-900 font-medium hover:bg-zinc-50 transition-colors"
            >
              Open Documents
            </Link>
            <Link
              href="/onenote"
              className="px-8 py-4 border border-zinc-300 text-zinc-900 font-medium hover:bg-zinc-50 transition-colors"
            >
              Open Notes
            </Link>
          </div>
        </div>
      </section>

      {/* Background */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-zinc-50">
        <div className="grid md:grid-cols-2 gap-16 max-w-5xl">
          <div>
            <p className="text-zinc-400 mb-4 text-sm uppercase tracking-widest">Background</p>
            <p className="text-2xl md:text-3xl font-bold leading-snug">
              NIT Trichy
              <br />
              <span className="text-zinc-400 font-normal text-xl">M.Tech Machine Learning</span>
            </p>
          </div>
          <div>
            <p className="text-zinc-400 mb-4 text-sm uppercase tracking-widest">Previously</p>
            <p className="text-2xl md:text-3xl font-bold leading-snug">
              Morgan Stanley
              <br />
              <span className="text-zinc-400 font-normal text-xl">Investment Banking Tech</span>
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-32 px-8 md:px-16 lg:px-24 border-t border-zinc-200">
        <div className="max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            Looking for TPM / PM / EM roles
          </h2>
          <p className="text-xl text-zinc-500 mb-12">
            At companies building complex systems.
          </p>
          <div className="flex flex-wrap gap-8 text-lg">
            <a href="https://linkedin.com/in/pavandongare" target="_blank" rel="noopener noreferrer" className="text-zinc-900 hover:text-zinc-500 transition-colors underline underline-offset-4">
              LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-900 hover:text-zinc-500 transition-colors underline underline-offset-4">
              GitHub
            </a>
            <a href="mailto:contact@example.com" className="text-zinc-900 hover:text-zinc-500 transition-colors underline underline-offset-4">
              Email
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 md:px-16 lg:px-24 border-t border-zinc-200">
        <p className="text-zinc-400 text-sm">
          This is a personal project. Built to learn, not to leak.
        </p>
      </footer>
    </div>
  )
}
