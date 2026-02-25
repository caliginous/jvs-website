'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Turnstile } from '@marsidev/react-turnstile';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'already_subscribed'>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<any>(null);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [subscribeEvents, setSubscribeEvents] = useState(true);

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
  };

  const handleTurnstileError = () => {
    setTurnstileToken('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubmitStatus('error');
      return;
    }

    if (!turnstileToken) {
      setSubmitStatus('error');
      return;
    }

    if (!subscribeNewsletter && !subscribeEvents) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          turnstileToken,
          subscribeNewsletter,
          subscribeEvents
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message.includes('already subscribed')) {
          setSubmitStatus('already_subscribed');
        } else {
          setSubmitStatus('success');
          setEmail('');
        }
        // Reset Turnstile
        if (turnstileRef.current) {
          turnstileRef.current.reset();
        }
        setTurnstileToken('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#E1F0D1] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Stay Connected with JVS</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Join our mailing lists to receive updates about events, news, and resources from the Jewish Vegetarian Society.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Mailing List Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Newsletter */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#8BC34A] rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Newsletter</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Our main newsletter keeps you informed about everything happening at JVS.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#8BC34A] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Latest articles and blog posts
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#8BC34A] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                New recipes and cooking tips
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#8BC34A] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Community news and updates
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#8BC34A] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Resources and educational content
              </li>
            </ul>
          </div>

          {/* Event Updates */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#4FC3F7] rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Event Updates</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Be the first to know about our upcoming events and activities.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#4FC3F7] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Friday Night Dinners
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#4FC3F7] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Cooking classes and workshops
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#4FC3F7] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Festival celebrations
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-[#4FC3F7] mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Community gatherings and talks
              </li>
            </ul>
          </div>
        </div>

        {/* Subscription Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Subscribe Now</h2>
          
          {submitStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Please check your email to confirm your subscription.
              </div>
            </div>
          )}

          {submitStatus === 'already_subscribed' && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                You&apos;re already subscribed to our mailing lists!
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              Please enter a valid email and select at least one mailing list.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your mailing lists
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    disabled={isSubmitting}
                    className="w-5 h-5 rounded border-gray-300 text-[#8BC34A] focus:ring-[#8BC34A]"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-gray-900">Newsletter</span>
                    <p className="text-sm text-gray-500">Articles, recipes, and community updates</p>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={subscribeEvents}
                    onChange={(e) => setSubscribeEvents(e.target.checked)}
                    disabled={isSubmitting}
                    className="w-5 h-5 rounded border-gray-300 text-[#4FC3F7] focus:ring-[#4FC3F7]"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-gray-900">Event Updates</span>
                    <p className="text-sm text-gray-500">Upcoming events, dinners, and workshops</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-center">
              <Turnstile
                ref={turnstileRef}
                siteKey="0x4AAAAAAB3p-V-5tOja4wWN"
                onSuccess={handleTurnstileSuccess}
                onError={handleTurnstileError}
                options={{
                  theme: 'light',
                  size: 'normal'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !email || !turnstileToken || (!subscribeNewsletter && !subscribeEvents)}
              className="w-full bg-[#8BC34A] hover:bg-[#558B2F] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
