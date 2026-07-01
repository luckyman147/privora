export default function StatsBar() {
  return (
    <div className='border-t border-slate-200 mt-16 pt-6'>
      <div className='text-xs font-500 text-slate-500 text-center mb-4'>
        Used by organizations at
      </div>
      <div className='flex justify-center gap-12 flex-wrap'>
        {['MIT','Stanford','UC Berkeley','Harvard','Columbia','Cornell','NYU'].map((school) => (
          <span key={school} className='text-sm font-700 text-slate-400'>{school}</span>
        ))}
      </div>
    </div>
  )
}
