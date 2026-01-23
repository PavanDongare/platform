'use client'

import Link from 'next/link'
import { Zap, Target, FileText, PenTool, Check, Github } from 'lucide-react'

const projects = [
  {
    id: 'metaflow',
    title: 'Metaflow',
    subtitle: 'Workflow Engine',
    icon: Zap,
    description: 'Push logic to database. Define workflows as JSON configs. PostgreSQL handles execution.',
    href: '/metaflow',
    isExternal: false,
    features: [
      'JSON-based workflow configuration',
      'PostgreSQL-native execution engine',
      'Real-time state management'
    ],
    githubUrl: null,
  },
  {
    id: 'cited',
    title: 'Cited',
    subtitle: 'GEO Readiness Score',
    icon: Target,
    description: 'AI evaluates content structure for LLMs. Get recommendations to become quotable.',
    href: 'https://cited.pavandongare.com',
    isExternal: true,
    features: [
      'AI-powered content structure analysis',
      'LLM optimization recommendations',
      'Real-time quotability scoring'
    ],
    githubUrl: 'https://github.com/PavanDongare/ai-ready-app',
  },
  {
    id: 'dms',
    title: 'Document Intelligence',
    subtitle: 'AI-Powered DMS',
    icon: FileText,
    description: 'Upload documents. AI extracts metadata, categorizes, and makes searchable.',
    href: '/dms',
    isExternal: false,
    features: [
      'Automatic metadata extraction',
      'AI-powered categorization',
      'Full-text semantic search'
    ],
    githubUrl: null,
  },
  {
    id: 'spatial-notes',
    title: 'Spatial Notes',
    subtitle: 'Canvas-Based Notes',
    icon: PenTool,
    description: 'TLDraw canvas for freeform organization. Notes with spatial freedom.',
    href: '/onenote',
    isExternal: false,
    features: [
      'Infinite canvas workspace',
      'Drag-and-drop note organization',
      'Multi-section notebook system'
    ],
    githubUrl: null,
  },
]

export function ProjectsSection() {
  return (
    <section className="py-20 px-8 md:px-16 lg:px-24 border-b border-zinc-100">
      <div className="max-w-6xl">
        <p className="text-zinc-400 text-xs uppercase tracking-widest mb-12">Selected Work</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => {
            const IconComponent = project.icon
            const isExternalLink = project.isExternal || project.href.startsWith('http')

            const CardContent = (
              <div className="relative group h-full">
                <div className="border border-zinc-100 rounded-lg hover:border-zinc-200 hover:shadow-md transition-all p-6 bg-white h-full flex flex-col">
                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    {/* Icon + Title Section */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-200 transition-colors">
                        <IconComponent className="w-6 h-6 text-zinc-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-zinc-900 mb-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-zinc-500">
                          {project.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2 mb-6">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600">
                          <Check className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA + GitHub (pushed to bottom) */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-auto">
                      <span className="text-sm text-zinc-400 group-hover:text-zinc-900 transition-colors">
                        {isExternalLink ? 'View live app →' : 'View live demo →'}
                      </span>

                      {project.githubUrl && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            window.open(project.githubUrl, '_blank', 'noopener,noreferrer')
                          }}
                          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer bg-none border-none p-0"
                        >
                          <Github className="w-4 h-4" />
                          <span>Source</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )

            return (
              <div key={project.id}>
                {isExternalLink ? (
                  <a href={project.href} target="_blank" rel="noopener noreferrer">
                    {CardContent}
                  </a>
                ) : (
                  <Link href={project.href}>
                    {CardContent}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
