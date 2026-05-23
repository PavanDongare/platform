export function ExperienceSection() {
  const experiences = [
    {
      company: 'Leucine',
      subtitle: 'AI for Pharma',
      role: 'Software Engineer, Metadata Platform',
      period: 'Sep 2025 – Jan 2026',
      achievements: [
        'Led end-to-end development of metadata-driven platform for pharma compliance',
        'Designed EAV/JSONB architecture enabling configuration-driven application generation',
        'Built core backend services (Supabase) and dynamic schema, API, and UI generation',
        'Implemented multi-tenant compliance rule engine reducing onboarding time from weeks to hours',
        'Led a team of 5 engineers, owning core system architecture and technical direction',
      ],
    },
    {
      company: 'Unilever',
      subtitle: 'via Neem Consulting and Publicis Sapient',
      role: 'Software Engineer, Compliance Systems',
      period: 'Feb 2024 – Sep 2025',
      achievements: [
        'Built automation scripts and monitoring systems for large-scale compliance workflows',
        'Designed real-time scanning and rule enforcement pipelines across 1000+ websites',
        'Reduced manual workload for a 10-member operations team through automation',
        'Scaled compliance coverage from 10% to 96% across global web properties',
        'Implemented backend services and integrations using Next.js and Express',
      ],
    },
    {
      company: 'Vahak',
      subtitle: 'Epictus Solutions Pvt Ltd',
      role: 'Technical Product Manager, Platform',
      period: 'Mar 2022 – Feb 2023',
      achievements: [
        'Led frontend migration from React to Next.js for B2B transport marketplace',
        'Implemented authentication, API integration, and performance optimizations',
        'Migrated infrastructure from AWS to Vercel improving deployment speed and reliability',
        'Impact: DAU increased 10x, conversion rate 4x, organic traffic 2x',
      ],
    },
    {
      company: 'Side Projects',
      role: 'Full-Stack Architect & Consultant',
      period: 'Mar 2021 – Present',
      achievements: [
        'DreamCare (Maharashtra Police): Built and maintain workflow applications and websites supporting police department operations',
        'EdTech & IoT: Architected and shipped full-stack web applications for product teams in EdTech and IoT, owning frontend, backend, and integration layers',
        'Masai School: Industry mentor for full-stack development, guiding students through real-world project work',
      ],
    },
    {
      company: 'Morgan Stanley',
      role: 'Senior Software Engineer',
      period: 'Aug 2018 – Mar 2021',
      achievements: [
        'Migrated AngularJS codebases to TypeScript and modern frontend architecture',
        'Built shared UI component library adopted by 250+ developers',
        'Developed enterprise regulatory reporting applications',
        'Built the frontend wizard journey for the pre-IPO stock distribution platform used by employees claiming IPO shares, including flows that supported Uber and Pinterest IPOs',
      ],
    },
  ]

  return (
    <section className="py-20 px-8 md:px-16 lg:px-24 border-b border-zinc-100">
      <div className="max-w-5xl">
        <p className="text-zinc-400 text-xs uppercase tracking-widest mb-12">Experience</p>

        <div className="space-y-8">
          {experiences.map((experience, idx) => (
            <div
              key={`${experience.company}-${idx}`}
              className="border border-zinc-100 rounded-lg p-6 hover:border-zinc-200 transition-colors"
            >
              {/* Company Header */}
              <div className="flex items-start justify-between mb-2 gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-medium text-zinc-900">{experience.company}</h3>
                    {experience.subtitle && (
                      <span className="text-xs text-zinc-500">• {experience.subtitle}</span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-600 mt-1">{experience.role}</p>
                </div>
                <span className="text-xs text-zinc-400 whitespace-nowrap flex-shrink-0">
                  {experience.period}
                </span>
              </div>

              {/* Achievements */}
              <ul className="space-y-2 mt-4">
                {experience.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-zinc-600">
                    <span className="text-zinc-400 mt-0.5 flex-shrink-0">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
