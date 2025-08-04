import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLeadCapture = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email,
          source: 'website_homepage'
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Lead capture failed:', error);
    }
  };

  return (
    <>
      <Head>
        <title>WebLaunch Lab - Get Your Local Business Online in 7 Days</title>
        <meta name="description" content="Professional websites for local businesses. No tech headaches, no confusing options. Just a high-quality website designed to attract local customers, launched in 7 days guaranteed." />
        <meta name="keywords" content="local business website, website design, small business web development, 7 day website launch, professional web design" />
        <meta name="author" content="WebLaunch Lab" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://weblaunchlab.com/" />
        <meta property="og:title" content="WebLaunch Lab - Get Your Local Business Online in 7 Days" />
        <meta property="og:description" content="Professional websites for local businesses. No tech headaches, no confusing options. Just a high-quality website designed to attract local customers, launched in 7 days guaranteed." />
        <meta property="og:image" content="/images/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://weblaunchlab.com/" />
        <meta property="twitter:title" content="WebLaunch Lab - Get Your Local Business Online in 7 Days" />
        <meta property="twitter:description" content="Professional websites for local businesses. No tech headaches, no confusing options. Just a high-quality website designed to attract local customers, launched in 7 days guaranteed." />
        <meta property="twitter:image" content="/images/og-image.jpg" />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.svg" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <link rel="canonical" href="https://weblaunchlab.com/" />
      </Head>
      
      <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">WebLaunch Lab</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Features
              </Link>
              <Link href="#work" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Our Work
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                Pricing
              </Link>
              <a href="https://form.typeform.com/to/kOOoaNxX" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105">
                Book Discovery Call
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Get Your Local Business
            <span className="block">Online in 7 Days — Guaranteed</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            No tech headaches. No confusing options. Just a high-quality website designed to attract local customers, fast.
          </p>

          {/* Lead Capture Form */}
          <div className="max-w-sm mx-auto mb-12">
            {!isSubmitted ? (
              <form onSubmit={handleLeadCapture} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-base"
                  required
                />
                <a href="https://form.typeform.com/to/kOOoaNxX" target="_blank" rel="noopener noreferrer" className="w-full bg-black text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 inline-flex items-center justify-center">
                  Book Your Free Discovery Call
                </a>
              </form>
            ) : (
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 font-semibold">Thanks! Let's schedule your discovery call.</p>
                <a href="https://form.typeform.com/to/kOOoaNxX" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  Book Now
                </a>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-3">7-day launch guarantee</p>
          </div>

          {/* Social Proof */}
          <div className="flex justify-center items-center space-x-12 mb-16 text-gray-400">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">7 Days</div>
              <div className="text-sm">Launch guarantee</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">$497</div>
              <div className="text-sm">All-inclusive setup</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your 7-Day Launch Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our proven plug-and-play system gets your local business online fast
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Planning + Wireframe</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Discovery call and site architecture planning. Complete in 1 day.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Branding + Content</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Custom design and professional copy creation. Takes 2-3 days.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Revise + Refine</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Your feedback and final adjustments. Completed in 1-2 days.  
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Connect + Launch</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Domain connection and go-live. Your site is online in 1 day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What's Included in Your Website
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to attract local customers and grow your business online
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Custom design</h3>
              <p className="text-gray-600">Tailored specifically for your local business</p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Local SEO ready</h3>
              <p className="text-gray-600">Optimized to attract customers in your area</p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Hosting & security</h3>
              <p className="text-gray-600">All-inclusive hosting with SSL certificates</p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Dedicated support</h3>
              <p className="text-gray-600">Personal support team for all your needs</p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">You own everything</h3>
              <p className="text-gray-600">Full ownership of your website and content</p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Mobile optimized</h3>
              <p className="text-gray-600">Looks perfect on phones, tablets, and desktops</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Recent Work Section */}
      <section id="work" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Recent Work
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how we've helped local businesses establish their online presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Restaurant Portfolio */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-3xl mb-2">🍝</div>
                  <div className="text-lg font-semibold">Bella's Italian Kitchen</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Restaurant</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Modern Italian restaurant website with online reservations and menu showcase.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Restaurant • Food Service</span>
                  <a 
                    href="#" 
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    View Site
                  </a>
                </div>
              </div>
            </div>

            {/* Dental Practice Portfolio */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-teal-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-3xl mb-2">🦷</div>
                  <div className="text-lg font-semibold">Downtown Dentistry</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dental Practice</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Professional dental practice site with appointment booking and service details.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Healthcare • Dental</span>
                  <a 
                    href="#" 
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    View Site
                  </a>
                </div>
              </div>
            </div>

            {/* Law Firm Portfolio */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-3xl mb-2">⚖️</div>
                  <div className="text-lg font-semibold">Miller & Associates</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Law Firm</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Trustworthy law firm website with practice areas and attorney profiles.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Legal • Professional Services</span>
                  <a 
                    href="#" 
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    View Site
                  </a>
                </div>
              </div>
            </div>

            {/* Plumbing Service Portfolio */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-3xl mb-2">🔧</div>
                  <div className="text-lg font-semibold">ProFix Plumbing</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Home Services</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  24/7 plumbing service website with emergency contact and service areas.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Home Services • Plumbing</span>
                  <a 
                    href="#" 
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    View Site
                  </a>
                </div>
              </div>
            </div>

            {/* Fitness Studio Portfolio */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-3xl mb-2">💪</div>
                  <div className="text-lg font-semibold">Peak Fitness Studio</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fitness Studio</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Modern fitness studio with class schedules and membership options.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Fitness • Health & Wellness</span>
                  <a 
                    href="#" 
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    View Site
                  </a>
                </div>
              </div>
            </div>

            {/* Auto Repair Portfolio */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-3xl mb-2">🚗</div>
                  <div className="text-lg font-semibold">Elite Auto Repair</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Auto Service</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Professional auto repair shop with service booking and warranty info.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Automotive • Repair Services</span>
                  <a 
                    href="#" 
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    View Site
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 mb-6">
              Ready to get your business online with a professional website?
            </p>
            <a 
              href="https://form.typeform.com/to/kOOoaNxX" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 inline-block"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>

      {/* Recent Work Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See What We've Built
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real websites for real businesses — launched in 7 days or less
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Artistry Inc */}
            <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="text-white text-center z-10">
                    <div className="text-4xl mb-3">📸</div>
                    <div className="text-2xl font-bold">Artistry Inc</div>
                    <div className="text-sm opacity-90 mt-2">Photography Studio</div>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Creative Photography Studio</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Stunning portfolio website showcasing professional photography services with modern design and seamless user experience.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Photography</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Portfolio</span>
                  </div>
                  <a 
                    href="https://artistry-pnojb4yzj-weblaunchlab.vercel.app" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105 group-hover:shadow-lg"
                  >
                    View Live Site →
                  </a>
                </div>
              </div>
            </div>

            {/* Idaho Cleaning Pros */}
            <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-blue-500 via-teal-500 to-green-500 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="text-white text-center z-10">
                    <div className="text-4xl mb-3">🧽</div>
                    <div className="text-2xl font-bold">Idaho Cleaning Pros</div>
                    <div className="text-sm opacity-90 mt-2">Cleaning Service</div>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Cleaning Service</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Complete cleaning service website with booking system, service pages, and customer-focused design for maximum conversions.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Cleaning</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Local Service</span>
                  </div>
                  <a 
                    href="https://idaho-cleaning-pros-1cta8h5k5-weblaunchlab.vercel.app" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105 group-hover:shadow-lg"
                  >
                    View Live Site →
                  </a>
                </div>
              </div>
            </div>

            {/* Rooks Barbering */}
            <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="text-white text-center z-10">
                    <div className="text-4xl mb-3">✂️</div>
                    <div className="text-2xl font-bold">Rooks Barbering</div>
                    <div className="text-sm opacity-90 mt-2">Barbershop</div>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Modern Barbershop</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Sleek barbershop website with appointment booking, service showcase, and masculine design that attracts the right clientele.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Barbershop</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Grooming</span>
                  </div>
                  <a 
                    href="https://rooks-barbering-cpup9bbzy-weblaunchlab.vercel.app" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105 group-hover:shadow-lg"
                  >
                    View Live Site →
                  </a>
                </div>
              </div>
            </div>

            {/* Uraban */}
            <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-slate-600 via-gray-700 to-zinc-800 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="text-white text-center z-10">
                    <div className="text-4xl mb-3">🏙️</div>
                    <div className="text-2xl font-bold">Uraban</div>
                    <div className="text-sm opacity-90 mt-2">Lifestyle Brand</div>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Urban Lifestyle Brand</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Sophisticated product showcase website with e-commerce functionality and urban aesthetic that perfectly captures the brand identity.
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">Lifestyle</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">E-commerce</span>
                  </div>
                  <a 
                    href="https://uraban-n62r6b148-weblaunchlab.vercel.app" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105 group-hover:shadow-lg"
                  >
                    View Live Site →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 mb-6">
              Want a professional website like these for your business?
            </p>
            <a 
              href="https://form.typeform.com/to/kOOoaNxX" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 inline-flex items-center gap-2"
            >
              Book Your Discovery Call
              <span className="text-sm">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              All-Inclusive Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No hidden fees, no long-term commitment, cancel anytime
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Website Package</h3>
                <p className="text-gray-600">Everything you need to get online and grow</p>
              </div>
              
              <div className="text-center mb-8">
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">$497</span>
                  <span className="text-gray-600 text-lg ml-2">Setup (one-time)</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-900">$49</span>
                  <span className="text-gray-600">/month — All-Inclusive Hosting & Support</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Custom design & professional content</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Local SEO optimization</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">All-inclusive hosting & security</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Dedicated support team</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">You own your website</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">7-day launch guarantee</span>
                </li>
              </ul>

              <a href="https://form.typeform.com/to/kOOoaNxX" target="_blank" rel="noopener noreferrer" className="w-full bg-black text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 inline-flex items-center justify-center">
                Book Your Free Discovery Call
              </a>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                No long-term commitment • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Don't Wait — Launch This Week!
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join local businesses who've gotten online fast with our proven system
          </p>
          
          <div className="max-w-sm mx-auto">
            <form onSubmit={handleLeadCapture} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your business email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent text-base"
                required
              />
              <a href="https://form.typeform.com/to/kOOoaNxX" target="_blank" rel="noopener noreferrer" className="w-full bg-white text-black px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 inline-flex items-center justify-center">
                Book Your Free Discovery Call
              </a>
            </form>
            <p className="text-sm text-gray-400 mt-3">7-day launch guarantee • No contracts • Free consultation</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">WebLaunch Lab</span>
            </div>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Professional websites that help local businesses thrive online. 
              From concept to launch in just 7 days.
            </p>
            <div className="flex justify-center space-x-8">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-900 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-900 text-sm">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-900 text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}