export default function UseCases() {
  const cases = [
    {
      icon: '⭐',
      title: 'Student Clubs',
      desc: 'Run elections, collect event feedback, and survey members with full transparency about how their data is handled.',
      tags: [
        { label: 'Elections', color: 'bg-emerald-100 text-emerald-700' },
        { label: 'Surveys', color: 'bg-blue-100 text-blue-700' },
        { label: 'Anonymous', color: 'bg-purple-100 text-purple-700' },
      ],
    },
    {
      icon: '🏛️',
      title: 'Student Government',
      desc: 'Conduct anonymous votes and referendums with audit-ready results your whole campus community can verify.',
      tags: [
        { label: 'Auditable', color: 'bg-emerald-100 text-emerald-700' },
        { label: 'Referendums', color: 'bg-blue-100 text-blue-700' },
      ],
    },
    {
      icon: '🎓',
      title: 'Universities',
      desc: 'Run course evaluations, department surveys, and institutional research with FERPA-aligned privacy defaults built in.',
      tags: [
        { label: 'FERPA-aligned', color: 'bg-amber-100 text-amber-700' },
        { label: 'Multi-team', color: 'bg-blue-100 text-blue-700' },
      ],
    },
  ]

  return (
    <section className='py-20 px-12 bg-slate-50 border-y border-slate-200'>
      <div className='max-width-5xl mx-auto max-w-5xl'>
        <div className='text-center mb-16'>
          <p className='text-xs font-bold text-sky-600 uppercase tracking-widest mb-3'>
            Built for
          </p>
          <h2 className='text-5xl font-extrabold text-slate-900 mb-4'>
            Your community, your data
          </h2>
          <p className='text-lg text-slate-600 max-w-md mx-auto'>
            Whether you run a small club or a university department, Privora
            adapts.
          </p>
        </div>

        <div className='grid grid-cols-3 gap-6'>
          {cases.map((uc, i) => (
            <div
              key={i}
              className='bg-white border border-slate-200 rounded-2xl p-7 hover:border-sky-500 hover:shadow-md transition'
            >
              <div className='text-4xl mb-4'>{uc.icon}</div>
              <h3 className='text-xl font-700 text-slate-900 mb-2'>
                {uc.title}
              </h3>
              <p className='text-sm text-slate-600 mb-4 leading-relaxed'>
                {uc.desc}
              </p>
              <div className='flex gap-2 flex-wrap'>
                {uc.tags.map((tag, j) => (
                  <span
                    key={j}
                    className={`text-xs font-600 px-2.5 py-1 rounded-full ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
