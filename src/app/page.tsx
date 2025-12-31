'use client'

import Link from 'next/link'

export default function PortfolioPage() {
  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 border-b border-zinc-200">
        <div className="max-w-5xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none mb-8">
            Pavan
            <br />
            <span className="text-zinc-300">Dongare</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-lg leading-relaxed mb-16">
            Building systems at the intersection of product thinking and technical depth.
          </p>

          {/* Metaflow Architecture Diagram */}
          <div className="font-mono text-[9px] md:text-[11px] text-zinc-400 overflow-x-auto pb-4">
            <pre className="leading-tight">{`
                            ┌─────────────────────────────────────────┐
                            │            METAFLOW ENGINE              │
                            │      Declarative Workflow Platform      │
                            └────────────────────┬────────────────────┘
                                                 │
          ┌──────────────────────────────────────┼──────────────────────────────────────┐
          │                                      │                                      │
          ▼                                      ▼                                      ▼
┌───────────────────────┐            ┌───────────────────────┐            ┌───────────────────────┐
│    ONTOLOGY LAYER     │            │    ACTIONS ENGINE     │            │   PROCESS CANVAS      │
│  ─────────────────    │            │  ─────────────────    │            │  ─────────────────    │
│                       │            │                       │            │                       │
│  ObjectTypes {        │            │  {                    │            │   ┌─────┐   ┌─────┐   │
│    properties: {...}  │───────────▶│    parameters: [...], │───────────▶│   │Draft│──▶│ Rev │   │
│    relations: [...]   │            │    criteria: [...],   │            │   └─────┘   └──┬──┘   │
│  }                    │            │    rules: [...]       │            │        ╲      │      │
│         │             │            │  }                    │            │         ╲     ▼      │
│         ▼             │            │         │             │            │          ┌─────┐    │
│  ┌─────────────┐      │            │         ▼             │            │          │Appr │    │
│  │   JSONB     │      │            │  ┌─────────────┐      │            │          └─────┘    │
│  │   Config    │      │            │  │  PL/pgSQL   │      │            │                      │
│  └─────────────┘      │            │  │  1300 LOC   │      │            │  ReactFlow + Auto    │
└───────────────────────┘            │  └──────┬──────┘      │            │  State Transitions   │
                                     │         │             │            └───────────────────────┘
                                     └─────────┼─────────────┘
                                               │
                    ┌──────────────────────────┴──────────────────────────┐
                    │                                                      │
                    ▼                                                      ▼
     ┌────────────────────────────────┐             ┌────────────────────────────────┐
     │      CRITERIA EVALUATION       │             │        RULE EXECUTION          │
     │  ────────────────────────────  │             │  ────────────────────────────  │
     │                                │             │                                │
     │  Expression Tree (recursive)   │             │  • modify_object               │
     │                                │             │  • create_object               │
     │     ┌─────┐                    │             │  • delete_object               │
     │     │ AND │                    │             │  • link_objects                │
     │     └──┬──┘                    │             │                                │
     │    ┌───┴───┐                   │             │  Property Sources:             │
     │    ▼       ▼                   │             │  ─────────────────             │
     │  ┌───┐   ┌───┐                 │             │  static | parameter            │
     │  │ = │   │OR │                 │             │  current_user | timestamp      │
     │  └───┘   └─┬─┘                 │             │  object_property               │
     │        ┌───┴───┐               │             │         │                      │
     │        ▼       ▼               │             │         ▼                      │
     │      ┌───┐   ┌───┐             │             │  ┌─────────────────┐           │
     │      │ > │   │ANY│─ M:N ──────┼─────────────┼─▶│ ATOMIC COMMIT   │           │
     │      └───┘   └───┘             │             │  │ (transaction)   │           │
     │                                │             │  └─────────────────┘           │
     │  order.customer.status = ?     │             │                                │
     │  └─┬──┘└──┬───┘└──┬──┘         │             │                                │
     │    │     │      │              │             │                                │
     │   base  M:1   property         │             │                                │
     │    │   join     │              │             │                                │
     │    └─────┴──────┘              │             │                                │
     │          │                     │             │                                │
     │          ▼                     │             │                                │
     │   Dynamic SQL Generation       │             │                                │
     └────────────────────────────────┘             └────────────────────────────────┘
                    │                                               │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
                         ┌─────────────────────────────────────┐
                         │            POSTGRESQL               │
                         │  ─────────────────────────────────  │
                         │   metaflow.objects    (JSONB data)  │
                         │   metaflow.relations  (M:N links)   │
                         │   metaflow.action_types (configs)   │
                         └─────────────────────────────────────┘
            `}</pre>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl">
          <p className="text-zinc-300 text-sm uppercase tracking-widest mb-16">Recent Work</p>

          <div className="space-y-24">
            {/* Metaflow */}
            <div className="group">
              <Link href="/metaflow" className="block">
                <div className="flex items-baseline justify-between border-b border-zinc-100 pb-6 mb-6">
                  <h3 className="text-3xl md:text-4xl font-bold group-hover:text-zinc-500 transition-colors">Metaflow</h3>
                  <span className="text-zinc-300 text-sm">Workflow Engine</span>
                </div>
                <p className="text-zinc-500 max-w-2xl leading-relaxed">
                  Declarative workflow automation. Define object types, configure actions in JSON,
                  let PostgreSQL handle execution. 1300 lines of PL/pgSQL for recursive criteria
                  evaluation and relationship traversal.
                </p>
              </Link>
            </div>

            {/* DMS */}
            <div className="group">
              <Link href="/dms" className="block">
                <div className="flex items-baseline justify-between border-b border-zinc-100 pb-6 mb-6">
                  <h3 className="text-3xl md:text-4xl font-bold group-hover:text-zinc-500 transition-colors">Documents</h3>
                  <span className="text-zinc-300 text-sm">AI-Powered DMS</span>
                </div>
                <p className="text-zinc-500 max-w-2xl leading-relaxed">
                  Upload PDFs and images. Claude Haiku extracts metadata automatically.
                  Chat interface with tool-use for search, organization, and document management.
                </p>
              </Link>
            </div>

            {/* Notes */}
            <div className="group">
              <Link href="/onenote" className="block">
                <div className="flex items-baseline justify-between border-b border-zinc-100 pb-6 mb-6">
                  <h3 className="text-3xl md:text-4xl font-bold group-hover:text-zinc-500 transition-colors">Notes</h3>
                  <span className="text-zinc-300 text-sm">Canvas-Based</span>
                </div>
                <p className="text-zinc-500 max-w-2xl leading-relaxed">
                  Notebooks, sections, pages. TLDraw canvas for freeform spatial organization.
                  Zustand for state management. Drag and drop throughout.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Notes */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-3xl">
          <p className="text-zinc-300 text-sm uppercase tracking-widest mb-12">Notes</p>

          <div className="space-y-12 text-zinc-500 leading-relaxed">
            <p>
              The interesting problem was pushing business logic to the database. Actions are
              JSON configs—parameters, criteria trees, execution rules. The PL/pgSQL engine
              interprets them at runtime. No application code for each new workflow.
            </p>
            <p>
              Criteria evaluation is recursive. AND/OR operators, comparison operators,
              property path traversal across relationships. <span className="font-mono text-sm">order.customer.status</span> resolves
              to a JOIN at query time. M:N relationships support ANY/ALL quantifiers.
            </p>
            <p>
              What I'd revisit: tests from day one, vector search for document similarity,
              and a proper query builder instead of string concatenation in SQL generation.
            </p>
          </div>
        </div>
      </section>

      {/* Stack - minimal */}
      <section className="py-16 px-8 md:px-16 lg:px-24 border-b border-zinc-200">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
          {['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Claude AI', 'ReactFlow', 'TLDraw'].map(tech => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      </section>

      {/* Background */}
      <section className="py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl">
          <div className="grid md:grid-cols-3 gap-12 text-sm">
            <div>
              <p className="text-zinc-300 uppercase tracking-widest mb-3">Education</p>
              <p className="text-zinc-900 font-medium">NIT Trichy</p>
              <p className="text-zinc-400">M.Tech, Machine Learning</p>
            </div>
            <div>
              <p className="text-zinc-300 uppercase tracking-widest mb-3">Experience</p>
              <p className="text-zinc-900 font-medium">Morgan Stanley</p>
              <p className="text-zinc-400">7.5 years in Product</p>
            </div>
            <div>
              <p className="text-zinc-300 uppercase tracking-widest mb-3">Connect</p>
              <div className="space-y-1">
                <a href="https://linkedin.com/in/pavandongare" target="_blank" rel="noopener noreferrer" className="block text-zinc-900 hover:text-zinc-500 transition-colors">
                  LinkedIn
                </a>
                <a href="https://github.com/pavandongare" target="_blank" rel="noopener noreferrer" className="block text-zinc-900 hover:text-zinc-500 transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 md:px-16 lg:px-24 border-t border-zinc-100">
        <p className="text-zinc-300 text-sm">
          Personal project. Code available on request.
        </p>
      </footer>
    </div>
  )
}
