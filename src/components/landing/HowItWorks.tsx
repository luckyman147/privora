export function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Create a form',
      desc: 'Add questions from 7 types — short text, multiple choice, rating, matrix, and more. Toggle privacy settings per form.',
    },
    {
      num: '2',
      title: 'Configure trust',
      desc: 'Set anonymity level, submission limits, IP storage, and retention. Your Trust Score updates in real time.',
    },
    {
      num: '3',
      title: 'Share & collect',
      desc: 'Share the link. Respondents see your Trust Score before submitting. Results stream into your dashboard.',
    },
  ]
  return (
    <section className='py-20 px-12 bg-white' id='features'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center mb-16'>
          <p className='text-xs font-bold text-sky-600 uppercase tracking-widest mb-3'>
            How it works
          </p>
          <h2 className='text-5xl font-800 text-slate-900 mb-4'>
            Three steps to trust
          </h2>
          <p className='text-lg text-slate-600 max-w-md mx-auto'>
            From blank page to collecting responses in minutes.
          </p>
        </div>
        <div className='grid grid-cols-3 gap-8'>
          {steps.map((s, i) => (
            <div key={i} className='text-center'>
              <div className='w-14 h-14 bg-gradient-to-br from-blue-600 to-emerald-600 text-white text-xl font-bold rounded-2xl flex items-center justify-center mx-auto mb-6'>
                {s.num}
              </div>
              <h3 className='text-xl font-700 text-slate-900 mb-3'>{s.title}</h3>
              <p className='text-sm text-slate-600 leading-relaxed'>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
