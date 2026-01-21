export function AboutSection() {
  const skills = [
    {
      category: 'Product Management',
      items: ['PRDs & Roadmaps', 'A/B Testing', 'Retention Analysis', 'Data Insights', 'Experimentation'],
    },
    {
      category: 'Technical & Data',
      items: ['SQL', 'Mixpanel, GA4', 'PowerBI, Firebase', 'Postman', 'Python'],
    },
    {
      category: 'Tools & Frameworks',
      items: ['React, JavaScript', 'Jira, Figma', 'LangChain, n8n', 'Workflow Automation'],
    },
  ]

  return (
    <section id="about" className="scroll-mt-20 py-20 px-8 md:px-16 lg:px-24 border-b border-zinc-100">
      <div className="max-w-5xl">
        <p className="text-zinc-400 text-xs uppercase tracking-widest mb-12">About</p>

        {/* Professional Summary */}
        <div className="mb-16">
          <p className="text-lg text-zinc-600 leading-relaxed mb-6">
            7+ years in product management across investment banking, B2B SaaS, and enterprise platforms.
            I've led 30+ member teams, launched 0→1 products with 100+ A/B tests, and delivered 10X onboarding,
            $1M ARR products, and 10X compliance KPIs.
          </p>
          <p className="text-lg text-zinc-600 leading-relaxed">
            Recently built and deployed AI agents with LangChain and n8n workflow automation.
            I write specs, build prototypes, and ship working software that solves real problems.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="mb-16">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-8">Core Skills</p>
          <div className="grid md:grid-cols-3 gap-12">
            {skills.map((skillGroup) => (
              <div key={skillGroup.category}>
                <p className="text-sm font-medium text-zinc-900 mb-4">{skillGroup.category}</p>
                <ul className="space-y-2">
                  {skillGroup.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-zinc-600 flex items-start gap-2"
                    >
                      <span className="text-zinc-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="border-t border-zinc-100 pt-8">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-4">Education</p>
          <div>
            <p className="text-sm font-medium text-zinc-900">M.Tech in Computer Science & Engineering</p>
            <p className="text-sm text-zinc-600">Machine Learning • NIT Trichy, 2018 • CGPA: 8.8/10</p>
            <p className="text-sm text-zinc-500 mt-2">
              Published research papers in IEEE on applied ML in online education
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
