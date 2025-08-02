import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuickNav from '@/components/QuickNav';

export default function FestivalPacksPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <QuickNav />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Festival Resource Packs
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Everything you need to celebrate Jewish holidays with delicious, 
            ethical, and sustainable plant-based meals.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Celebrate Jewish Holidays the Vegan Way
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Our comprehensive festival resource packs provide everything you need to create meaningful, 
            delicious, and ethical Jewish holiday celebrations. Each pack includes recipes, educational materials, 
            spiritual guidance, and practical tips for hosting vegan Jewish gatherings.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">🍽️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Delicious Recipes</h3>
              <p className="text-gray-600">Traditional dishes made vegan</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold text-gray-900 mb-2">Educational Content</h3>
              <p className="text-gray-600">Learn about holiday traditions</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="font-semibold text-gray-900 mb-2">Celebration Guides</h3>
              <p className="text-gray-600">Complete hosting instructions</p>
            </div>
          </div>
        </div>

        {/* Festival Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Festival Packs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <div className="text-4xl">🕯️</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hanukkah</h3>
                <p className="text-gray-600 mb-4">
                  Celebrate the Festival of Lights with traditional latkes, sufganiyot, and more - all plant-based!
                </p>
                <ul className="text-sm text-gray-600 mb-4">
                  <li>• Vegan Latkes (3 variations)</li>
                  <li>• Plant-based Sufganiyot</li>
                  <li>• Hanukkah Story & Traditions</li>
                  <li>• Menorah Lighting Guide</li>
                </ul>
                <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                  Download Pack
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <div className="text-4xl">🍷</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Passover</h3>
                <p className="text-gray-600 mb-4">
                  A complete guide to celebrating Passover with plant-based ingredients while maintaining tradition.
                </p>
                <ul className="text-sm text-gray-600 mb-4">
                  <li>• Vegan Seder Plate Guide</li>
                  <li>• Plant-based Matzah Recipes</li>
                  <li>• Passover Story & Meaning</li>
                  <li>• Seder Planning Checklist</li>
                </ul>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Download Pack
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <div className="text-4xl">🌙</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Rosh Hashanah</h3>
                <p className="text-gray-600 mb-4">
                  Welcome the Jewish New Year with sweet, symbolic, and sustainable plant-based dishes.
                </p>
                <ul className="text-sm text-gray-600 mb-4">
                  <li>• Vegan Honey Alternatives</li>
                  <li>• Symbolic Food Guide</li>
                  <li>• Rosh Hashanah Traditions</li>
                  <li>• Tashlich Ceremony Guide</li>
                </ul>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  Download Pack
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <div className="text-4xl">🏛️</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Yom Kippur</h3>
                <p className="text-gray-600 mb-4">
                  Prepare for the Day of Atonement with meaningful pre and post-fast meals.
                </p>
                <ul className="text-sm text-gray-600 mb-4">
                  <li>• Pre-fast Meal Ideas</li>
                  <li>• Break-fast Recipes</li>
                  <li>• Yom Kippur Reflections</li>
                  <li>• Fasting Guidelines</li>
                </ul>
                <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                  Download Pack
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <div className="text-4xl">🎭</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Purim</h3>
                <p className="text-gray-600 mb-4">
                  Celebrate Purim with vegan hamantaschen, festive meals, and the story of Esther.
                </p>
                <ul className="text-sm text-gray-600 mb-4">
                  <li>• Vegan Hamantaschen</li>
                  <li>• Purim Feast Ideas</li>
                  <li>• Megillah Reading Guide</li>
                  <li>• Mishloach Manot Ideas</li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Download Pack
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
                <div className="text-4xl">🌿</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tu B&apos;Shevat</h3>
                <p className="text-gray-600 mb-4">
                  Celebrate the New Year for Trees with sustainable, plant-based foods and environmental awareness.
                </p>
                <ul className="text-sm text-gray-600 mb-4">
                  <li>• Tree Fruit Recipes</li>
                  <li>• Environmental Activities</li>
                  <li>• Tu B&apos;Shevat Seder</li>
                  <li>• Tree Planting Guide</li>
                </ul>
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                  Download Pack
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* What&apos;s Included */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What&apos;s Included in Each Pack</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📖 Educational Materials</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Historical background and significance
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Traditional customs and practices
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Jewish ethical teachings related to food
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Environmental and sustainability connections
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🍽️ Recipe Collections</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Traditional dishes made vegan
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Modern plant-based interpretations
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Dietary accommodation options
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Cooking tips and techniques
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What Our Community Says</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👩‍👧‍👦</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Goldstein</h4>
                  <p className="text-gray-600 text-sm">London, UK</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;The Passover pack transformed our Seder. The vegan recipes were not only delicious 
                but also helped us explain the ethical reasons behind our food choices to our guests.&quot;
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl">👨‍👩‍👧‍👦</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">David Cohen</h4>
                  <p className="text-gray-600 text-sm">Manchester, UK</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                &quot;As a new vegan, I was worried about maintaining Jewish traditions. These festival packs 
                showed me how to honor both my faith and my ethical commitments.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Start Your Vegan Jewish Journey</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Download our festival resource packs and discover how to celebrate Jewish holidays 
            with compassion, sustainability, and delicious plant-based food.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/resources"
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📚 Back to Resources
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <button className="inline-flex items-center px-8 py-4 bg-green-700 text-white font-semibold rounded-full hover:bg-green-800 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              📥 Download All Packs
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 