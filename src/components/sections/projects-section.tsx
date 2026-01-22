'use client'

import Link from 'next/link'
import { Zap, Target, FileText, PenTool } from 'lucide-react'

export function ProjectsSection() {
  return (
    <section className="py-20 px-8 md:px-16 lg:px-24 border-b border-zinc-100">
      <div className="max-w-6xl">
        <p className="text-zinc-400 text-xs uppercase tracking-widest mb-12">Selected Work</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metaflow */}
          <Link href="/metaflow" className="group">
            <div className="border border-zinc-100 rounded-lg p-6 hover:border-zinc-200 transition-colors h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                  <Zap className="w-6 h-6 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium group-hover:text-zinc-600 transition-colors">Metaflow</h3>
                  <p className="text-xs text-zinc-400">Workflow Engine</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 mb-4 flex-1">
                Push logic to database. Define workflows as JSON configs. PostgreSQL handles execution.
              </p>
              <p className="text-xs text-zinc-400 group-hover:text-zinc-900 transition-colors">
                View live demo →
              </p>
            </div>
          </Link>

          {/* Cited */}
          <a href="https://cited.pavandongare.com" target="_blank" rel="noopener noreferrer" className="group">
            <div className="border border-zinc-100 rounded-lg p-6 hover:border-zinc-200 transition-colors h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                  <Target className="w-6 h-6 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium group-hover:text-zinc-600 transition-colors">Cited</h3>
                  <p className="text-xs text-zinc-400">GEO Readiness Score</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 mb-4 flex-1">
                AI evaluates content structure for LLMs. Get recommendations to become quotable.
              </p>
              <p className="text-xs text-zinc-400 group-hover:text-zinc-900 transition-colors">
                View live app →
              </p>
            </div>
          </a>

          {/* Document Intelligence */}
          <Link href="/dms" className="group">
            <div className="border border-zinc-100 rounded-lg p-6 hover:border-zinc-200 transition-colors h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                  <FileText className="w-6 h-6 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium group-hover:text-zinc-600 transition-colors">Document Intelligence</h3>
                  <p className="text-xs text-zinc-400">AI-Powered DMS</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 mb-4 flex-1">
                Upload documents. AI extracts metadata, categorizes, and makes searchable.
              </p>
              <p className="text-xs text-zinc-400 group-hover:text-zinc-900 transition-colors">
                View live demo →
              </p>
            </div>
          </Link>

          {/* Spatial Notes */}
          <Link href="/onenote" className="group">
            <div className="border border-zinc-100 rounded-lg p-6 hover:border-zinc-200 transition-colors h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                  <PenTool className="w-6 h-6 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium group-hover:text-zinc-600 transition-colors">Spatial Notes</h3>
                  <p className="text-xs text-zinc-400">Canvas-Based Notes</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 mb-4 flex-1">
                TLDraw canvas for freeform organization. Notes with spatial freedom.
              </p>
              <p className="text-xs text-zinc-400 group-hover:text-zinc-900 transition-colors">
                View live demo →
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
