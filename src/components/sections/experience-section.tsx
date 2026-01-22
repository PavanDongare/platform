export function ExperienceSection() {
  const experiences = [
    {
      company: 'Leucine',
      subtitle: 'AI for Pharma',
      role: 'Technical Product Manager',
      period: 'Sep 2025 - Present',
      product: 'Rich Data Platform & Ontology Engine for pharmaceutical manufacturing software',
      achievements: [
        'Built Palantir-styled Ontology Engine that auto-generates APIs, schema, and UI from metadata',
        'Designed multi-tenant defaults & override system for client-specific configurations without code',
        'Reduced app build time from weeks to hours',
      ],
    },
    {
      company: 'Unilever',
      subtitle: 'Contract',
      role: 'Product Lead - OneTrust Consent Management',
      period: 'Feb 2024 - Sep 2025',
      product: 'OneTrust Compliance platform for 1000+ consumer websites',
      achievements: [
        'Built and deployed agentic AI compliance bot for automated daily checks and fixes; scaled to 1000+ sites',
        'Implemented OneTrust supporting 30M MAU & 7M DAU; led migration for 30+ business units',
        '10X compliance (10% → 96% across 1000+ sites), +20% NPS',
      ],
    },
    {
      company: 'Vahak',
      role: 'Technical Product Manager',
      period: 'Mar 2022 - Feb 2023',
      product: 'B2B transport marketplace platform',
      achievements: [
        'Led A/B experimentation for onboarding; launched marketplace features & user-to-user calls',
        'Executed security audit, auth revamp; led React to Next.js migration',
        '10X DAU, 10X SEO coverage, 4X conversion rate, 2X organic traffic',
      ],
    },
    {
      company: 'Morgan Stanley',
      role: 'Senior Associate - Technology',
      period: 'Aug 2018 - Mar 2021',
      product: 'Financial Wellness Game & Common UI Library',
      achievements: [
        'Led 0→1 development for Financial Wellness Game; UX research for Uber & Pinterest IPOs',
        'Built Common UI library used by 12 teams (250+ developers)',
        '$1M ARR product, +20% IPO conversions, +12% retention via AARRR optimization',
      ],
    },
  ]

  return (
    <section id="experience" className="scroll-mt-20 py-20 px-8 md:px-16 lg:px-24 border-b border-zinc-100">
      <div className="max-w-5xl">
        <p className="text-zinc-400 text-xs uppercase tracking-widest mb-12">Experience</p>

        <div className="space-y-8">
          {experiences.map((experience) => (
            <div
              key={experience.company}
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

              {/* Product */}
              <p className="text-xs text-zinc-500 mb-4 italic">
                Product: {experience.product}
              </p>

              {/* Achievements */}
              <ul className="space-y-2">
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
