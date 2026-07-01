const ITEMS = [
  { label: 'Visibility', value: 'Creator only', emoji: '👁' },
  { label: 'Identity', value: 'Anonymous', emoji: '👤' },
  { label: 'IP Address', value: 'Not stored', emoji: '📍' },
  { label: 'Submissions', value: '1 per person', emoji: '🔄' },
  { label: 'Data retention', value: '90 days', emoji: '📅' },
]

export default function TrustScorePreview() {
  return (
    <div className='bg-slate-50 rounded-2xl p-5 border border-slate-200'>
      <div className='text-xs font-500 text-slate-500 text-center mb-4'>
        Student Satisfaction Survey 2025
      </div>
      <div className='bg-white rounded-xl border-2 border-emerald-200 p-6 shadow-sm'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-600 to-sky-500 flex items-center justify-center'>
              <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
              </svg>
            </div>
            <div>
              <div className='font-600 text-sm text-slate-900'>Trust Score</div>
              <div className='text-xs text-slate-500'>Fully transparent</div>
            </div>
          </div>
          <div className='bg-emerald-100 text-emerald-700 font-700 text-sm px-3 py-1 rounded-full border border-emerald-200'>5/5</div>
        </div>
        <div className='space-y-3'>
          {ITEMS.map((item, i) => (
            <div key={i} className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-xs'>{item.emoji}</div>
                <span className='text-xs text-slate-600'>{item.label}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-xs font-500 text-slate-900'>{item.value}</span>
                <div className='w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg className='w-2.5 h-2.5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100'>
          This form is committed to transparency. Your data will never be sold or shared.
        </div>
      </div>
      <button className='w-full mt-4 bg-sky-500 text-white font-600 py-2.5 rounded-lg hover:bg-sky-600 transition'>
        Start survey →
      </button>
    </div>
  )
}
