'use client'

import Link from 'next/link'
import {
  Zap,
  Target,
  FileText,
  PenTool,
  Check,
  Github,
  TerminalSquare,
  BarChart3,
  NotebookText,
  SlidersHorizontal,
  Timer,
  House,
  Users,
} from 'lucide-react'

const projects = [
  {
    id: 'metaflow',
    title: 'Metaflow',
    subtitle: 'Workflow Engine',
    icon: Zap,
    description: 'Workflow orchestration platform with ontology management and process visualization.',
    href: 'https://metaflow-app.vercel.app',
    isExternal: true,
    features: [
      'JSON-based workflow configuration',
      'PostgreSQL-native execution engine',
      'Real-time state management'
    ],
    githubUrl: 'https://github.com/PavanDongare/metaflow-app',
  },
  {
    id: 'interview-guide',
    title: 'Interview Guide',
    subtitle: 'Real-time Assistant',
    icon: Target,
    description: 'Real-time assistant with live transcription and dynamic concept cards using Whisper AI.',
    href: 'https://interview-guide-app.vercel.app',
    isExternal: true,
    features: [
      'Live speech-to-text transcription',
      'AI-powered dynamic concept cards',
      'Real-time interview gap analysis'
    ],
    githubUrl: 'https://github.com/PavanDongare/interview-guide-app',
  },
  {
    id: 'web-ssh-gateway',
    title: 'Web SSH Gateway',
    subtitle: 'Browser Terminal',
    icon: TerminalSquare,
    description: 'Run SSH sessions in the browser with real-time terminal streaming and voice input support.',
    href: 'https://github.com/PavanDongare/web-ssh-gateway',
    isExternal: true,
    features: [
      'WebSocket-based live terminal transport',
      'Voice-to-terminal command support',
      'Next.js + TypeScript gateway architecture'
    ],
    githubUrl: 'https://github.com/PavanDongare/web-ssh-gateway',
  },
  {
    id: 'services-info',
    title: 'Services Info',
    subtitle: 'Analytics Dashboard',
    icon: BarChart3,
    description: 'Service intelligence dashboard with visual analytics, regional data views, and privacy-law insights.',
    href: 'https://services-info.vercel.app',
    isExternal: true,
    features: [
      'Recharts-powered analytics visualizations',
      'Country-specific service intelligence',
      'Supabase-backed data pipeline'
    ],
    githubUrl: 'https://github.com/PavanDongare/services-info',
  },
  {
    id: 'dms',
    title: 'Document Intelligence',
    subtitle: 'AI-Powered DMS',
    icon: FileText,
    description: 'Document Management System with AI-powered chat interface for interactive document analysis.',
    href: 'https://dms-app-swart.vercel.app',
    isExternal: true,
    features: [
      'Automatic metadata extraction',
      'AI-powered categorization',
      'Full-text semantic search'
    ],
    githubUrl: 'https://github.com/PavanDongare/dms-app',
  },
  {
    id: 'spatial-notes',
    title: 'Spatial Notes',
    subtitle: 'Canvas-Based Notes',
    icon: PenTool,
    description: 'Digital notebook application with hierarchical organization and infinite canvas workspace.',
    href: 'https://onenote-app.vercel.app',
    isExternal: true,
    features: [
      'Infinite canvas workspace',
      'Drag-and-drop note organization',
      'Multi-section notebook system'
    ],
    githubUrl: 'https://github.com/PavanDongare/onenote-app',
  },
  {
    id: 'classic-onenote',
    title: 'Classic OneNote',
    subtitle: 'Retro Productivity UI',
    icon: NotebookText,
    description: 'A OneNote 2010-inspired notes app rebuilt with modern React architecture and persistent data.',
    href: 'https://github.com/PavanDongare/classic-onenote',
    isExternal: true,
    features: [
      'Notebook > Section > Page hierarchy',
      'Classic desktop-inspired navigation model',
      'Next.js + Supabase implementation'
    ],
    githubUrl: 'https://github.com/PavanDongare/classic-onenote',
  },
  {
    id: 'configcraft-ui',
    title: 'ConfigCraft UI',
    subtitle: 'Design System Demo',
    icon: SlidersHorizontal,
    description: 'Component-rich configuration wizard and UI system built for rapid product setup workflows.',
    href: 'https://github.com/PavanDongare/configcraft-ui',
    isExternal: true,
    features: [
      'Step-based configuration wizard',
      'shadcn/ui + Radix component patterns',
      'Form and chart-heavy admin UX'
    ],
    githubUrl: 'https://github.com/PavanDongare/configcraft-ui',
  },
  {
    id: 'wip-workbench',
    title: 'WIP Workbench',
    subtitle: 'Project Tracking',
    icon: FileText,
    description: 'Work management workspace for timelines, media, and collaboration-style task context.',
    href: 'https://wip-pavan.vercel.app',
    isExternal: true,
    features: [
      'Timeline and activity-oriented planning',
      'Chat-style interaction patterns',
      'Next.js + Supabase stack'
    ],
    githubUrl: 'https://github.com/PavanDongare/wip',
  },
  {
    id: 'timer-app',
    title: 'Timer App',
    subtitle: 'React Native Focus',
    icon: Timer,
    description: 'Cross-platform focus timer built with Expo, native animation flows, and synced productivity data.',
    href: 'https://github.com/PavanDongare/timer-app',
    isExternal: true,
    features: [
      'React Native + Expo foundation',
      'Native-feeling animations and interactions',
      'Supabase sync for persistence'
    ],
    githubUrl: 'https://github.com/PavanDongare/timer-app',
  },
  {
    id: 'onetouchweb',
    title: 'OneTouchWeb',
    subtitle: 'Home Automation',
    icon: House,
    description: 'Early large-scale home automation platform with backend APIs and device control workflows.',
    href: 'https://github.com/PavanDongare/OneTouchWeb',
    isExternal: true,
    features: [
      'IoT-style device control endpoints',
      'Backend-integrated web dashboard',
      'Production-style automation workflows'
    ],
    githubUrl: 'https://github.com/PavanDongare/OneTouchWeb',
  },
  {
    id: 'mern-network',
    title: 'MERN Network',
    subtitle: 'Developer Community',
    icon: Users,
    description: 'Full-stack developer social platform built on MongoDB, Express, React, and Node.',
    href: 'https://github.com/PavanDongare/mern',
    isExternal: true,
    features: [
      'JWT auth and profile management',
      'Redux-driven app state',
      'End-to-end MERN architecture'
    ],
    githubUrl: 'https://github.com/PavanDongare/mern',
  },
]

export function ProjectsSection() {
  return (
    <section className="py-20 px-8 md:px-16 lg:px-24 border-b border-zinc-100">
      <div className="max-w-6xl mx-auto">
        <p className="text-zinc-400 text-xs uppercase tracking-widest mb-12">Selected Work</p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] xl:grid-cols-3 gap-6">
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
