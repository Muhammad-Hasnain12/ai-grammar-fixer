import { useEffect, useMemo, useState, useLayoutEffect } from 'react'
import Editor from './components/Editor'
import Toast from './components/Toast'
import About from './components/About'
import PolicyModal from './components/PolicyModal'

function getInitialTheme() {
  const stored = localStorage.getItem('theme')
  if (stored) return stored
  // Default to dark mode instead of system preference
  return 'dark'
}

export default function App() {
  const initialTheme = getInitialTheme()
  const [theme, setTheme] = useState(initialTheme)
  const [currentPage, setCurrentPage] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [text, setText] = useState('')
  const [correctedText, setCorrectedText] = useState('')
  const [corrections, setCorrections] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [policyModal, setPolicyModal] = useState(null) // 'privacy' | 'terms' | 'support' | null
  const apiBaseUrl = import.meta.env.VITE_API_URL || ''

  // Apply theme class before first paint to avoid flash
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [initialTheme])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  async function onSubmit() {
    setLoading(true)
    setCorrections([])
    try {
      const res = await fetch(`${apiBaseUrl}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      setCorrectedText(data.correctedText || '')
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
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated background elements - optimized for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse gpu-accelerated"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-pulse gpu-accelerated" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-600/5 to-blue-600/5 animate-pulse gpu-accelerated" style={{animationDelay: '0.5s'}}></div>
      </div>

      <header className="sticky top-0 z-50 border-b border-gray-800/50 bg-gray-900/95 backdrop-blur-xl theme-transition">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">
              AI Grammar Fixer
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
              className={`${
                currentPage === 'home' 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              } text-sm font-medium transition-colors duration-200`}
            >
              Features
            </a>
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); setCurrentPage('about'); }}
              className={`${
                currentPage === 'about' 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              } text-sm font-medium transition-colors duration-200`}
            >
              About
            </a>
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200 theme-transition"
            >
              {theme === 'dark' ? (
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* GitHub Link */}
            <a 
              href="https://github.com/Muhammad-Hasnain12"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
            >
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-800/50 bg-gray-900/95 backdrop-blur-xl shadow-lg">
          <div className="px-6 py-4 space-y-3">
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); setCurrentPage('home'); setMobileMenuOpen(false); }}
              className={`block text-sm font-medium transition-colors duration-200 ${
                currentPage === 'home' 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Features
            </a>
            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); setCurrentPage('about'); setMobileMenuOpen(false); }}
              className={`block text-sm font-medium transition-colors duration-200 ${
                currentPage === 'about' 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              About
            </a>
            <a 
              href="https://github.com/Muhammad-Hasnain12"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
            >
              GitHub
            </a>
          </div>
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-6xl px-6 overflow-hidden">
        {currentPage === 'home' ? (
          <>
            {/* Hero Section */}
            <div className="pt-20 pb-16 text-center">
              <div className="mb-12">
                {/* Badge */}
                <div className="inline-flex items-center rounded-full bg-blue-600/10 border border-blue-600/20 px-4 py-2 text-sm font-medium text-blue-400 mb-8">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  ✨ AI-Powered Grammar Correction
                </div>
                
                {/* Main Heading */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                  <span className="text-blue-500">Perfect Your</span>
                  <br />
                  <span className="text-white">Grammar Instantly</span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
                  Upload your text and get instant extraction of grammar corrections, spelling fixes, 
                  and punctuation improvements with our advanced AI technology.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                  <button 
                    onClick={() => setCurrentPage('about')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-600 px-8 py-4 text-lg font-semibold text-gray-300 hover:border-gray-500 hover:text-white transition-colors duration-200"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Editor Section */}
            <div className="pb-20">
              <Editor
                text={text}
                setText={setText}
                correctedText={correctedText}
                loading={loading}
                onSubmit={onSubmit}
                corrections={corrections}
                onToast={setToast}
              />
            </div>
          </>
        ) : (
          <About />
        )}
      </main>

      <footer className="relative z-10 border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Technology Stack
              </h3>
              <div className="space-y-2 text-sm text-gray-400">
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
                  <span>LanguageTool API</span>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span>Vercel Deployment</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Features
              </h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>⚡ Real-time Processing</div>
                <div>🔒 Privacy-focused</div>
                <div>📱 Responsive Design</div>
                <div>🎨 Modern Interface</div>
                <div>🚀 Fast Performance</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                AI Capabilities
              </h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>📝 Grammar Correction</div>
                <div>🔍 Error Detection</div>
                <div>💡 Smart Suggestions</div>
                <div>📊 Detailed Analysis</div>
                <div>🎯 Context-aware</div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800/50">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-gray-400">
                © 2025 AI Grammar Fixer. Built with modern technologies.
              </p>
              <div className="flex space-x-6">
                <button onClick={() => setPolicyModal('privacy')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </button>
                <button onClick={() => setPolicyModal('terms')} className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </button>
                <button onClick={() => setPolicyModal('support')} className="text-sm text-gray-400 hover:text-white transition-colors">
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

      <PolicyModal type={policyModal} onClose={() => setPolicyModal(null)} />
    </div>
  )
}


