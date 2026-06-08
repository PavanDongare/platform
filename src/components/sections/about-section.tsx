export function AboutSection() {
  return (
    <section className="py-12 px-8 md:px-16 lg:px-24 border-b border-zinc-100 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-zinc-400 text-xs uppercase tracking-widest mb-6">
          Engineering Philosophy
        </h2>
        <p className="text-zinc-600 leading-relaxed mb-8 text-base">
          I build metadata-driven architectures, type-safe data pipelines, and highly interactive user interfaces. 
          My focus is on designing configuration-driven platforms that simplify complexity, minimize manual intervention, 
          and streamline system integrations.
        </p>
        <div className="inline-block px-6 py-4 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-700 text-sm max-w-xl">
          <span className="block font-medium mb-1">Architectural Principle:</span>
          <span className="text-zinc-500 italic">
            "Software architecture should be configuration-driven. Designing systems around flexible metadata turns weeks of manual coding into minutes of rule configuration."
          </span>
        </div>
      </div>
    </section>
  )
}
