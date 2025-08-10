import React from 'react'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated background elements - optimized for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse gpu-accelerated"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-pulse gpu-accelerated" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-600/5 to-blue-600/5 animate-pulse gpu-accelerated" style={{animationDelay: '0.5s'}}></div>
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-20 overflow-hidden">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center rounded-full bg-blue-600/10 border border-blue-600/20 px-4 py-2 text-sm font-medium text-blue-400 mb-8">
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            About the Developer
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-white">Meet</span>
            <br />
            <span className="text-blue-500">Muhammad Hasnain</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            GrammaCheck is an AI‑powered grammar correction tool that helps you instantly detect and fix grammar, spelling, and punctuation errors in your text. Built with modern web technologies and advanced AI, it is designed for accuracy, speed, and a seamless user experience.
            <br className="hidden md:block" />
            <br className="hidden md:block" />
            This project was created by Muhammad Hasnain, a Cyber Security student at FAST University Karachi, who is passionate about developing AI‑driven tools that make everyday tasks smarter and more efficient.
            <br className="hidden md:block" />
            <br className="hidden md:block" />
            Whether you are a student, writer, content creator, or professional, GrammaCheck makes error‑free writing effortless and reliable.
          </p>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-400">
              Connect with me on various platforms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a 
              href="mailto:hasnainmemon02@outlook.com"
              className="group bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Email</h3>
                <p className="text-sm text-gray-400 break-all">hasnainmemon02@outlook.com</p>
              </div>
            </a>

            <a 
              href="https://www.linkedin.com/in/muhammad-hasnain-61b4aa379/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">LinkedIn</h3>
                <p className="text-sm text-gray-400">muhammad-hasnain</p>
              </div>
            </a>

            <a 
              href="https://github.com/Muhammad-Hasnain12"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">GitHub</h3>
                <p className="text-sm text-gray-400">Muhammad-Hasnain12</p>
              </div>
            </a>

            <a 
              href="https://hasnainportfolio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-600 flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Portfolio</h3>
                <p className="text-sm text-gray-400">hasnainportfolio.vercel.app</p>
              </div>
            </a>
          </div>
        </div>

        {/* Grammar Checker Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Grammar Checker Features
            </h2>
            <p className="text-lg text-gray-400">
              What makes our AI-powered grammar correction special
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Correction</h3>
              <p className="text-gray-400">Instant grammar, spelling, and punctuation correction as you type.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">70-80% Accuracy</h3>
              <p className="text-gray-400">Safe and realistic performance for reliable grammar checking.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">English Focus</h3>
              <p className="text-gray-400">Specialized in English language with comprehensive grammar rules.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Mobile-Friendly</h3>
              <p className="text-gray-400">Responsive design that works perfectly on all devices.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Interface</h3>
              <p className="text-gray-400">Simple, intuitive design for instant feedback and corrections.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Performance Analytics</h3>
              <p className="text-gray-400">Detailed analysis and suggestions for writing improvement.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
