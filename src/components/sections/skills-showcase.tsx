'use client'

import { Code2, Database, Cpu, Layout, CheckCircle2 } from 'lucide-react'

export function SkillsShowcase() {
  const skillCategories = [
    {
      title: 'Systems & Architecture',
      icon: Database,
      description: 'Designing robust backend architectures, type-safe data schemas, and scalable API pipelines.',
      skills: [
        'PostgreSQL & SQLite design',
        'Supabase SSR integration',
        'Type-safe REST / GraphQL APIs',
        'Dockerized deployments',
      ],
    },
    {
      title: 'Frontend Engineering',
      icon: Layout,
      description: 'Building high-performance, modular UI systems with deep focus on state-management and interactivity.',
      skills: [
        'React 19 & Next.js 16',
        'TypeScript (Strict Type-Safety)',
        'State Management (Zustand, Redux)',
        'Responsive layout engines',
      ],
    },
    {
      title: 'AI & Automation Pipelines',
      icon: Cpu,
      description: 'Integrating LLMs, prompt engineering, agent orchestration, and automated code review flows.',
      skills: [
        'LLM API Orchestration',
        'Autonomous agent SDKs (Composio)',
        'Local-first data workflows',
        'Background job queues',
      ],
    },
    {
      title: 'Rich Interactive UIs',
      icon: Code2,
      description: 'Creating interactive user experiences like infinite canvas interfaces and real-time streaming tools.',
      skills: [
        'Infinite Canvas (Tldraw)',
        'Workflow Visualization (React Flow)',
        'Real-time WebSockets',
        'Voice-to-command UI utilities',
      ],
    },
  ]

  return (
    <section className="py-16 px-8 md:px-16 lg:px-24 border-b border-zinc-100 bg-zinc-50/50">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-10 text-center md:text-left">
          Technical Expertise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category) => {
            const Icon = category.icon
            return (
              <div
                key={category.title}
                className="bg-white border border-zinc-200/60 rounded-xl p-6 hover:border-zinc-300 hover:shadow-sm transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100 text-zinc-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 text-lg">{category.title}</h3>
                </div>
                <p className="text-sm text-zinc-600 mb-6 leading-relaxed flex-grow">
                  {category.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-100/60">
                  {category.skills.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 text-xs text-zinc-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
