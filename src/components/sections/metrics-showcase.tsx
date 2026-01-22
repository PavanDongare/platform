export function MetricsShowcase() {
  const metrics: Array<{ value: string; label: string }> = [
    { value: '30+', label: 'Teams Led' },
    { value: '100+', label: 'A/B Tests' },
    { value: '10X', label: 'Onboarding' },
    { value: '$1M', label: 'ARR Products' },
    { value: '10X', label: 'Compliance KPIs' },
  ]

  return (
    <section className="py-8 px-8 md:px-16 lg:px-24 border-b border-zinc-100">
      <div className="max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
          {metrics.map((metric: { value: string; label: string }) => (
            <div key={metric.label} className="text-center">
              <p className="text-2xl md:text-3xl font-medium text-zinc-900 mb-1">
                {metric.value}
              </p>
              <p className="text-xs text-zinc-500">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
