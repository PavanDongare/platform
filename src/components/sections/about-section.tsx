export function AboutSection() {
  return (
    <section className="py-8 px-8 md:px-16 lg:px-24 border-b border-zinc-100">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-zinc-600 leading-relaxed mb-6">
          Technical Product Manager who ships live products, not mockups.
          I write specs, build prototypes, and validate with real users.
        </p>
        <p className="text-sm text-zinc-500 italic">
          "Push logic down to the database. PostgreSQL handles constraints better than your ORM."
        </p>
      </div>
    </section>
  )
}
