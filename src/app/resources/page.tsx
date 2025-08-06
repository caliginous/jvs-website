import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuickNav from '@/components/QuickNav';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            🌿 JVS Resources
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            A central hub for Jewish vegan learning, community, and inspiration
          </p>
          <div className="w-24 h-1 bg-green-500 mx-auto mt-8 rounded-full"></div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <QuickNav />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        
        {/* Why Veganism Makes Sense in Judaism */}
        <section id="why-vegan" className="scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center mb-8">
              <span className="text-4xl mr-4">✡️</span>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Why Veganism Makes Sense in Judaism
                </h2>
                <p className="text-lg text-gray-600">
                  Jewish tradition promotes values that align naturally with a vegan lifestyle.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { principle: "Tza'ar ba'alei chayim", meaning: "Preventing animal suffering" },
                { principle: "Bal tashchit", meaning: "Avoiding waste and protecting the Earth" },
                { principle: "Pikuach nefesh", meaning: "Guarding human life and health" },
                { principle: "Tzedakah", meaning: "Using food systems to reduce hunger" },
                { principle: "Genesis 1:29", meaning: "A vision of a peaceful, plant-based Eden" }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.principle}</h3>
                  <p className="text-gray-700">{item.meaning}</p>
                </div>
              ))}
            </div>
            
            <Link 
              href="/resources/why-vegan"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📖 Read More
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Festival Resource Packs */}
        <section id="festivals" className="scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center mb-8">
              <span className="text-4xl mr-4">🎉</span>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Festival Resource Packs
                </h2>
                <p className="text-lg text-gray-600">
                  Everything you need to celebrate Jewish holidays with delicious, ethical, and sustainable plant-based meals.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { holiday: "Passover", items: ["Vegan Seder Plate Guide", "Plant-based Matzah Recipes", "Passover Ethics Discussion"] },
                { holiday: "Hanukkah", items: ["Vegan Latke Variations", "Hanukkah Story & Ethics", "Sustainable Celebrations"] },
                { holiday: "Rosh Hashanah", items: ["Sweet New Year Recipes", "Tashlich Ceremony Guide", "Jewish Environmental Ethics"] }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">{item.holiday}</h3>
                  <ul className="space-y-2">
                    {item.items.map((listItem, idx) => (
                      <li key={idx} className="text-gray-700 text-sm">• {listItem}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <Link 
              href="/resources/festival-packs"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📥 Download Festival Packs
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center mb-8">
              <span className="text-4xl mr-4">💬</span>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Jewish and Vegan FAQs
                </h2>
                <p className="text-lg text-gray-600">
                  Find answers to common questions about combining Jewish practice with plant-based living.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { category: "Kosher & Kashrut", questions: ["Is vegan food automatically kosher?", "Can I keep kosher while being vegan?", "What about wine and grape products?"] },
                { category: "Jewish Law & Tradition", questions: ["What does Jewish tradition say about veganism?", "Is it okay to be vegan on Shabbat?", "How do I explain my choices to family?"] },
                { category: "Family & Community", questions: ["How do I raise vegan Jewish children?", "What if my synagogue doesn&apos;t offer vegan options?", "Are there vegan Jewish communities?"] },
                { category: "Health & Nutrition", questions: ["Is a vegan diet healthy for all life stages?", "What about protein on a vegan diet?", "How do I get enough B12?"] }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-l-4 border-yellow-500">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">{item.category}</h3>
                  <ul className="space-y-2">
                    {item.questions.map((question, idx) => (
                      <li key={idx} className="text-gray-700 text-sm">• {question}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <Link 
              href="/resources/faqs"
              className="inline-flex items-center px-8 py-4 bg-yellow-600 text-white font-semibold rounded-full hover:bg-yellow-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              💬 Read the FAQs
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>



        {/* Caterers & Restaurants */}
        <section id="caterers" className="scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center mb-8">
              <span className="text-4xl mr-4">🍽️</span>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Vegan-friendly Kosher Caterers & Restaurants in London
                </h2>
                <p className="text-lg text-gray-600">
                  Discover London&apos;s finest kosher establishments that offer delicious plant-based options.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { type: "Fine Dining", features: ["Elegant restaurants with vegan options", "Private dining rooms", "Shabbat meals", "Wine pairings"] },
                { type: "Casual Dining", features: ["Relaxed atmosphere", "Family-friendly options", "Takeaway available", "Daily specials"] },
                { type: "Event Catering", features: ["Wedding and celebration catering", "Corporate events", "Custom menu planning", "Full-service coordination"] }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">{item.type}</h3>
                  <ul className="space-y-2">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-700 text-sm">• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <Link 
              href="/resources/caterers"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🍽️ View Listings
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Magazine Archive */}
        <section id="magazine" className="scroll-mt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center mb-8">
              <span className="text-4xl mr-4">📚</span>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  The Jewish Vegetarian Magazine
                </h2>
                <p className="text-lg text-gray-600">
                  Explore decades of insightful articles, recipes, and perspectives on Jewish veganism and vegetarianism.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { feature: "Rich Archive", description: "50+ years of content from rabbis, scholars, and activists" },
                { feature: "Traditional Recipes", description: "Classic Jewish dishes reimagined with plant-based ingredients" },
                { feature: "Ethical Discussions", description: "Deep dives into Jewish teachings on animal welfare and environmental protection" }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">{item.feature}</h3>
                  <p className="text-gray-700 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
            
            <Link 
              href="/resources/magazine"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📚 Browse Archive
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 