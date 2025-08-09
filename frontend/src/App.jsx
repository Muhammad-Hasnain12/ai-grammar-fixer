import { useEffect, useMemo, useState } from 'react'
import Editor from './components/Editor'
import Toast from './components/Toast'

function getInitialTheme() {
  const stored = localStorage.getItem('theme')
  if (stored) return stored
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme())
  const [text, setText] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [corrections, setCorrections] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const apiBaseUrl = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  async function onSubmit() {
    setLoading(true)
    setCorrections([])
    try {
      const res = await fetch(`${apiBaseUrl}/api/correct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      setCorrectedText(data.corrected_text || '')
      setCorrections(Array.isArray(data.corrections) ? data.corrections : [])
      setToast({
        message: 'Grammar correction completed successfully! ✨',
        type: 'success'
      })
    } catch (err) {
      console.error(err)
      setCorrectedText('')
      setCorrections([])
      setToast({
        message: 'Failed to process your text. Please try again.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-400/10 to-blue-400/10 animate-pulse delay-500"></div>
      </div>

      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-lg dark:border-gray-700/30 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                AI Grammar Fixer
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                ✨ Powered by Advanced AI Technology
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="group flex items-center space-x-2 rounded-full border border-slate-200/50 bg-white/60 px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-white/90 hover:shadow-lg hover:scale-105 dark:border-slate-600/50 dark:bg-slate-800/60 dark:hover:bg-slate-800/90"
            >
              {theme === 'dark' ? (
                <>
                  <svg className="h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-12 overflow-hidden">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center rounded-full bg-blue-100/50 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 mb-6">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI-Powered Grammar Correction
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            Perfect Your Writing
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              with Artificial Intelligence
            </span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Transform your writing instantly with our advanced AI grammar correction engine. 
            Get professional-grade suggestions in real-time.
          </p>
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">0.5s</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Private</div>
            </div>
          </div>
        </div>

        <Editor
          text={text}
          setText={setText}
          correctedText={correctedText}
          loading={loading}
          onSubmit={onSubmit}
          corrections={corrections}
          onToast={setToast}
        />
      </main>

      <footer className="relative z-10 border-t border-slate-200/50 bg-white/40 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Technology Stack
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>React + Tailwind CSS</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Node.js + Express</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Python FastAPI</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span>Hugging Face Transformers</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Features
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>⚡ Real-time Processing</div>
                <div>🔒 Privacy-focused</div>
                <div>📱 Responsive Design</div>
                <div>🎨 Modern Interface</div>
                <div>🚀 Fast Performance</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                AI Capabilities
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>📝 Grammar Correction</div>
                <div>🔍 Error Detection</div>
                <div>💡 Smart Suggestions</div>
                <div>📊 Detailed Analysis</div>
                <div>🎯 Context-aware</div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2024 AI Grammar Fixer. Built with ❤️ using modern technologies.
              </p>
              <div className="flex space-x-6">
                <button className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </button>
                <button className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </button>
                <button className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                  Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}


