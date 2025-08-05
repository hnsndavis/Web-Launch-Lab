import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showTypeform, setShowTypeform] = useState(false);

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
        // Open Typeform after successful email capture
        setTimeout(() => {
          window.open('https://form.typeform.com/to/kOOoaNxX', '_blank');
        }, 1000);
      }
    } catch (error) {
      console.error('Lead capture failed:', error);
    }
  };

  const handleCTAClick = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      // Show validation message for empty email
      const emailInput = document.querySelector('#hero-form input');
      if (emailInput) {
        emailInput.focus();
        emailInput.setCustomValidity('Please fill out this field.');
        emailInput.reportValidity();
        // Clear the custom validity after user starts typing
        emailInput.oninput = () => emailInput.setCustomValidity('');
      }
      return;
    }
    // If email exists, capture it first then open Typeform
    handleLeadCapture(e);
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
              <button onClick={handleCTAClick} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105">
                Book Discovery Call
              </button>
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
          <div id="hero-form" className="max-w-sm mx-auto mb-12">
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
                <button onClick={handleCTAClick} className="w-full bg-black text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 inline-flex items-center justify-center">
                  Book Your Free Discovery Call
                </button>
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

      {/* Your 7-Day Launch Process Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your 7-Day Launch Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our proven plug-and-play system gets your local business online fast
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <p className="text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">Step 1</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Planning + Wireframe</h3>
              </div>
              <div className="mb-6">
                <img 
                  src="/images/process/step-01.jpg" 
                  alt="Planning and Wireframe Step"
                  className="w-full rounded-lg shadow-md"
                  loading="lazy"
                width="384"
                height="320"
                />
              </div>
              <p className="text-gray-600 text-center mb-4">
                We outline all site pages and sections to get a clear idea of what the site will look like.
              </p>
              <p className="text-sm font-semibold text-gray-800 text-center bg-gray-100 px-4 py-2 rounded-full">
                🕓 Timeline: 1 Day
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <p className="text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">Step 2</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Branding + Content</h3>
              </div>
              <div className="mb-6 grid grid-cols-2 gap-2">
                <img 
                  src="/images/process/step-02.1.jpg" 
                  alt="Branding Step 1"
                  className="w-full rounded-lg shadow-md"
                  loading="lazy"
                width="384"
                height="320"
                />
                <img 
                  src="/images/process/step-02.2.jpg" 
                  alt="Branding Step 2"
                  className="w-full rounded-lg shadow-md"
                  loading="lazy"
                width="384"
                height="320"
                />
                <img 
                  src="/images/process/step-02.3.jpg" 
                  alt="Branding Step 3"
                  className="w-full rounded-lg shadow-md"
                  loading="lazy"
                width="384"
                height="320"
                />
                <img 
                  src="/images/process/step-02.4.jpg" 
                  alt="Branding Step 4"
                  className="w-full rounded-lg shadow-md"
                  loading="lazy"
                width="384"
                height="320"
                />
              </div>
              <p className="text-gray-600 text-center mb-4">
                We customize your site with your branding and company info.
              </p>
              <p className="text-sm font-semibold text-gray-800 text-center bg-gray-100 px-4 py-2 rounded-full">
                🕓 Timeline: 2-3 Days
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <p className="text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">Step 3</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Revise + Refine</h3>
              </div>
              <div className="mb-6 relative">
                <img 
                  src="/images/process/step-02.3.jpg" 
                  alt="Revise and Refine Step"
                  className="w-full rounded-lg shadow-md"
                  loading="lazy"
                width="384"
                height="320"
                />
                <div className="absolute top-4 left-4 space-y-2">
                  <img 
                    src="/images/process/message-01.jpg" 
                    alt="Message 1"
                    className="w-32 rounded shadow-lg opacity-90"
                    loading="lazy"
                width="384"
                height="320"
                  />
                  <img 
                    src="/images/process/message-02.jpg" 
                    alt="Message 2"
                    className="w-32 rounded shadow-lg opacity-90 ml-8"
                    loading="lazy"
                width="384"
                height="320"
                  />
                  <img 
                    src="/images/process/message-03.jpg" 
                    alt="Message 3"
                    className="w-32 rounded shadow-lg opacity-90"
                    loading="lazy"
                width="384"
                height="320"
                  />
                </div>
              </div>
              <p className="text-gray-600 text-center mb-4">
                Easily leave your feedback so we can quickly make necessary adjustments.
              </p>
              <p className="text-sm font-semibold text-gray-800 text-center bg-gray-100 px-4 py-2 rounded-full">
                🕓 Timeline: 1-2 Days
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <p className="text-lg font-bold text-gray-500 uppercase tracking-wide mb-2">Step 4</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect + Launch</h3>
              </div>
              <div className="mb-6 relative">
                <img 
                  src="/images/process/step-04.jpg" 
                  alt="Connect and Launch Step"
                  className="w-full rounded-lg shadow-md"
                  loading="lazy"
                width="384"
                height="320"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/95 rounded-lg p-4 text-center shadow-lg">
                    <div className="text-green-600 text-4xl mb-2">✓</div>
                    <div className="text-lg font-semibold text-gray-900">Your site has been published to</div>
                    <div className="text-blue-600 font-medium">www.yourbusiness.com</div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-center mb-4">
                After final quality checks, we connect your site to your custom domain and publish!
              </p>
              <p className="text-sm font-semibold text-gray-800 text-center bg-gray-100 px-4 py-2 rounded-full">
                🕓 Timeline: 1 Day
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


      {/* See What We've Built Section */}
      <section id="work" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              See What We've Built
            </h2>
          </div>

          {/* Website Screenshots Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Artistry Inc Screenshot */}
            <a 
              href="https://artistry-inc.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 h-64 lg:h-80 relative block transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <img 
                src="/images/projects/artistry-inc-screenshot.png"
                alt="Artistry Inc Website"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                width="384"
                height="320"
                width="384"
                height="320"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-white/90 text-black px-4 py-2 rounded-lg font-semibold text-sm">View Live Site →</span>
              </div>
            </a>

            {/* Idaho Cleaning Pros Screenshot */}
            <a 
              href="https://idaho-cleaning-pros.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 h-64 lg:h-80 relative block transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <img 
                src="/images/projects/idaho-cleaning-pros-screenshot.png"
                alt="Idaho Cleaning Pros Website"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                width="384"
                height="320"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-white/90 text-black px-4 py-2 rounded-lg font-semibold text-sm">View Live Site →</span>
              </div>
            </a>

            {/* Rooks Barbering Screenshot */}
            <a 
              href="https://rooks-barbering.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 h-64 lg:h-80 relative block transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <img 
                src="/images/projects/rooks-barbering-screenshot.png"
                alt="Rooks Barbering Website"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                width="384"
                height="320"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-white/90 text-black px-4 py-2 rounded-lg font-semibold text-sm">View Live Site →</span>
              </div>
            </a>

            {/* Uraban Screenshot */}
            <a 
              href="https://uraban.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 h-64 lg:h-80 relative block transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <img 
                src="/images/projects/uraban-screenshot.png"
                alt="Uraban Website"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                width="384"
                height="320"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-white/90 text-black px-4 py-2 rounded-lg font-semibold text-sm">View Live Site →</span>
              </div>
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

              <button onClick={handleCTAClick} className="w-full bg-black text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 inline-flex items-center justify-center">
                Book Your Free Discovery Call
              </button>
              
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
            {!isSubmitted ? (
              <form onSubmit={handleLeadCapture} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent text-base"
                  required
                />
                <button type="submit" className="w-full bg-white text-black px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105 inline-flex items-center justify-center">
                  Book Your Free Discovery Call
                </button>
              </form>
            ) : (
              <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800 font-semibold">Thanks! Your discovery call form is opening...</p>
              </div>
            )}
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