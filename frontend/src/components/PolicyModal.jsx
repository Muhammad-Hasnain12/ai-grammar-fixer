import React from 'react'

export default function PolicyModal({ type, onClose }) {
  if (!type) return null

  const titleMap = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    support: 'Support'
  }

  const contentMap = {
    privacy:
      'We respect your privacy. Your text is sent only to the grammar API to compute corrections and is not stored on our servers. No personal data is persisted. For questions, contact hasnainmemon02@outlook.com.',
    terms:
      'This tool is provided as‑is for personal and professional use. By using it, you agree not to submit unlawful content. Availability and accuracy are not guaranteed. Use at your own discretion.',
    support:
      'Need help or have feedback? Reach out via email at hasnainmemon02@outlook.com or open an issue on GitHub: github.com/Muhammad-Hasnain12.'
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-white">{titleMap[type]}</h2>
          <button onClick={onClose} className="rounded-md p-2 text-gray-400 hover:text-white">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-4 text-sm leading-6 text-gray-300">
          {contentMap[type]}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
