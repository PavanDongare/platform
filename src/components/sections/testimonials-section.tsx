'use client'

const recommendations = [
  {
    name: 'Sunkari Nirmal',
    title: 'Senior Manager · Data COE, Publicis Sapient',
    details:
      'May 14, 2025 · Sunkari was senior to Pavan but didn’t manage him directly',
    highlight:
      '“Pavan’s hands-on approach drove the compliance turnaround and his long-term vision added clear value to the business.”',
  },
  {
    name: 'Oliver MacPherson',
    title: 'COO · Neem Consulting / Opteca',
    details: 'April 10, 2025 · Oliver was senior but did not manage Pavan day-to-day',
    highlight:
      '“A technical leader who balanced governance depth with human collaboration while shipping our consent overhaul.”',
  },
  {
    name: 'Jens Geisler',
    title: 'Digital Governance Lead · Germany, Austria, Swiss & Poland',
    details: 'March 12, 2025 · Jens was senior to Pavan but they didn’t work in the same direct chain',
    highlight:
      '“His blended product sense and tech depth delivered compliant solutions that kept evolving with privacy demands.”',
  },
  {
    name: 'Navaneeth Kishore',
    title: 'Senior Software Engineer · Distributed Systems',
    details: 'December 11, 2022 · Worked with Pavan on adjacent teams',
    highlight:
      '“Pavan’s technical leadership, curiosity, and user-first mindset made him a go-to partner on every release.”',
  },
]

export function TestimonialsSection() {
  return (
    <section className="px-8 md:px-16 lg:px-24 py-20 bg-zinc-950 text-white min-h-[80vh]">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="rounded-3xl border border-white/20 bg-gradient-to-b from-white/10 to-white/5 p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-3xl font-semibold tracking-tight">Testimonials</h2>
            <p className="text-xs uppercase tracking-widest text-white/60">Direct from my LinkedIn profile</p>
          </div>
          <p className="text-sm text-white/70">
            These were shared by cross-industry partners, leaders, and mentors while I was shepherding enterprise consent, retail, and data programs. I’m keeping this feed live so fresh endorsements appear as new work lands.
          </p>
          <div className="flex gap-3 text-xs uppercase tracking-widest text-white/50">
            {['Received', 'Given', 'Pending'].map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-full border border-white/20 px-3 py-1 text-white/80 hover:border-white/60"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {recommendations.map((entry) => (
            <article key={entry.name} className="rounded-2xl border border-white/20 bg-white/5 p-5 space-y-3">
              <header className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-lg font-semibold">{entry.name}</p>
                  <p className="text-xs uppercase tracking-widest text-white/40">{entry.title}</p>
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">Verified</span>
              </header>
              <p className="text-sm text-white/80">{entry.highlight}</p>
              <p className="text-xs text-white/50">{entry.details}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
