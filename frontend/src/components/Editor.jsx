import { useMemo } from 'react'
import { computeWordDiff } from '../lib/diff'

export default function Editor({ text, setText, correctedText, loading, onSubmit, corrections, onToast }) {
  const apiDiff = useMemo(() => corrections || [], [corrections])
  const wordDiff = useMemo(() => computeWordDiff(text, correctedText), [text, correctedText])

  const inputWordCount = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text])
  const inputCharCount = text.length
  const correctedWordCount = useMemo(() => (correctedText.trim() ? correctedText.trim().split(/\s+/).length : 0), [correctedText])
  const correctedCharCount = correctedText.length

  return (
    <div className="space-y-10">
      <div className="group rounded-3xl bg-gradient-to-br from-white/70 to-white/50 p-8 shadow-2xl backdrop-blur-md border border-white/30 dark:from-gray-800/70 dark:to-gray-800/50 dark:border-gray-700/40 hover:shadow-3xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center space-x-3 text-xl font-bold text-gray-800 dark:text-white">
            <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-2 text-white shadow-lg">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span>Input Your Text</span>
          </label>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setText('')}
              className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors"
              disabled={!text}
            >
              Clear
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(text)
                onToast?.({ message: 'Text copied to clipboard! 📋', type: 'info' })
              }}
              className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              disabled={!text}
            >
              Copy
            </button>
          </div>
        </div>
        
        <div className="relative group">
          <textarea
            className="w-full min-h-[280px] rounded-2xl border-2 border-gray-200/50 bg-white/90 p-6 text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:bg-white resize-none dark:border-gray-600/50 dark:bg-gray-800/90 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-500 dark:focus:bg-gray-800"
            placeholder="🎯 Start typing or paste your text here for AI-powered grammar correction...

💡 Tips:
• Works with any length of text
• Supports multiple languages
• Real-time processing
• Privacy-focused (your text stays secure)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          {text && (
            <div className="absolute right-4 top-4 flex items-center space-x-2">
              <div className="rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
                {inputWordCount} words
              </div>
            </div>
          )}
          
          {!text && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="text-center opacity-60">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ready for your content</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M7 8h10M7 8H5a2 2 0 00-2 2v10a2 2 0 002 2h2M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
              </svg>
              <span>{inputWordCount} words</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 15h16M4 11h16" />
              </svg>
              <span>{inputCharCount} characters</span>
            </div>
          </div>
          <button
            onClick={onSubmit}
            disabled={loading || !text.trim()}
            className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all duration-300 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 hover:shadow-3xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-blue-600 before:via-purple-600 before:to-indigo-600 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-20"
          >
            <div className="relative z-10 flex items-center gap-3">
              {loading ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="spinner" />
                    <svg className="h-5 w-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="font-semibold">AI Processing...</span>
                </>
              ) : (
                <>
                  <svg className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Fix Grammar with AI</span>
                  <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Quick Examples Section */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 p-6 shadow-xl backdrop-blur-sm border border-indigo-100/50 dark:from-indigo-900/30 dark:to-purple-900/30 dark:border-indigo-800/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 p-2 text-white shadow-lg">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Quick Examples</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">Try these sample texts</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Business Email",
              text: "Dear sir, I am writing to you in regards to our previous meeting. I hope you will consider our proposal and let me know you're thoughts.",
              category: "Professional"
            },
            {
              title: "Academic Writing",
              text: "The research shows that students whom study regularly performs better than those who don't. This phenomena is well documented in various studies.",
              category: "Academic"
            },
            {
              title: "Casual Text", 
              text: "me and my friend went to the store yesterday and we seen some really good deals on electronics and stuff like that.",
              category: "Casual"
            }
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setText(example.text)}
              className="group text-left p-4 rounded-xl bg-white/60 hover:bg-white/80 border border-white/40 hover:border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300 dark:bg-gray-800/60 dark:hover:bg-gray-800/80 dark:border-gray-700/40 dark:hover:border-indigo-700"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800 dark:text-white">{example.title}</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {example.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>
                {example.text}
              </p>
              <div className="mt-3 flex items-center text-xs text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Click to use this example
              </div>
            </button>
          ))}
        </div>
      </div>

      {correctedText && (
        <div className="rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-sm border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/30">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Corrected Text
            </h3>
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400">
                {correctedWordCount} words
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(correctedText)
                  onToast?.({ message: 'Corrected text copied! ✨', type: 'success' })
                }}
                className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 transition-colors"
              >
                Copy Corrected
              </button>
            </div>
          </div>
          <div className="min-h-[140px] max-w-full overflow-hidden break-words whitespace-pre-wrap rounded-xl border-2 border-green-200 bg-green-50/50 p-4 text-gray-900 dark:border-green-700 dark:bg-green-900/20 dark:text-gray-100">
            {correctedText}
          </div>
          <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4v10a2 2 0 002 2h6a2 2 0 002-2V8M7 8h10M7 8H5a2 2 0 00-2 2v10a2 2 0 002 2h2M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
              </svg>
              <span>{correctedWordCount} words</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 15h16M4 11h16" />
              </svg>
              <span>{correctedCharCount} characters</span>
            </div>
          </div>
        </div>
      )}

      {wordDiff.length > 0 && (
        <div className="rounded-2xl bg-white/60 p-6 shadow-xl backdrop-blur-sm border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/30">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Changes Made
          </h3>
          <div className="max-w-full overflow-hidden rounded-xl border-2 border-orange-200 bg-orange-50/30 p-4 text-sm dark:border-orange-700 dark:bg-orange-900/10">
            <p className="break-words leading-7">
              {wordDiff.map((seg, idx) => {
                if (seg.type === 'same') return <span key={idx} className="break-words">{seg.text} </span>
                if (seg.type === 'added') return <mark key={idx} className="bg-green-300/70 text-green-900 dark:bg-green-600/40 dark:text-green-200 rounded-md px-1.5 py-0.5 font-medium break-words">{seg.text}</mark>
                return <del key={idx} className="bg-red-300/50 text-red-900 dark:bg-red-600/30 dark:text-red-200 rounded-md px-1.5 py-0.5 mr-1 break-words line-through">{seg.text}</del>
              })}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-green-400"></div>
              <span>Added</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-red-400"></div>
              <span>Removed</span>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}


