import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuickNav from '@/components/QuickNav';

export default function MagazinePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <QuickNav />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            📚 The Jewish Vegetarian Magazine Archive
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Explore our complete archive of The Jewish Vegetarian Magazine (1970-2018), 
            featuring decades of insights on Jewish veganism and vegetarianism
          </p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-8 rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        
        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              A Legacy of Jewish Vegan Thought
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              For nearly 50 years, The Jewish Vegetarian Magazine was at the forefront of exploring the intersection 
              of Jewish values and plant-based living. Our complete archive contains thousands of articles from rabbis, 
              scholars, activists, and community members sharing insights on ethical eating, environmental stewardship, 
              and Jewish tradition.
            </p>
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg inline-block">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> The magazine was discontinued in 2018. This is a complete archive of all published issues.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rich Archive</h3>
              <p className="text-gray-600">48 years of content (1970-2018)</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Contributors</h3>
              <p className="text-gray-600">Rabbis, scholars, activists</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Timeless Wisdom</h3>
              <p className="text-gray-600">Relevant insights for today</p>
            </div>
          </div>
        </section>

        {/* What You'll Find */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            What You&apos;ll Find in the Archive
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl mb-4">🍽️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Traditional Recipes</h3>
              <p className="text-gray-600 text-sm">Classic Jewish dishes reimagined with plant-based ingredients, from holiday favorites to everyday meals.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ethical Discussions</h3>
              <p className="text-gray-600 text-sm">Deep dives into Jewish teachings on animal welfare, environmental protection, and ethical consumption.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl mb-4">🎉</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Holiday Guides</h3>
              <p className="text-gray-600 text-sm">Comprehensive guides for celebrating Jewish holidays with compassion and sustainability.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl mb-4">👨‍👩‍👧‍👦</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Community Stories</h3>
              <p className="text-gray-600 text-sm">Personal journeys and experiences from Jewish vegans around the world.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Environmental Focus</h3>
              <p className="text-gray-600 text-sm">Articles on Jewish environmental responsibility and sustainable living practices.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl mb-4">🏛️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Religious Perspectives</h3>
              <p className="text-gray-600 text-sm">Insights from rabbis and scholars on Jewish law and plant-based living.</p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Our Journey Through Time
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1970</span>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">The Beginning</h3>
                <p className="text-gray-600">The Jewish Vegetarian Magazine launches as a quarterly publication, featuring articles on Jewish ethics and vegetarianism.</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1985</span>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Growing Influence</h3>
                <p className="text-gray-600">The magazine expands to include environmental topics and attracts contributions from prominent rabbis and scholars.</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">2000</span>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Transition</h3>
                <p className="text-gray-600">The magazine begins its digital transformation, making content more accessible to a global audience.</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">2018</span>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Final Issue</h3>
                <p className="text-gray-600">The Jewish Vegetarian Magazine publishes its final issue, concluding nearly 50 years of publication.</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">2020</span>
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Archive</h3>
                <p className="text-gray-600">Complete digital archive launched, featuring searchable content and enhanced accessibility for the modern Jewish vegan community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Issues */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Featured Issues
          </h2>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Spring 2018</h3>
              <p className="text-blue-600 font-medium mb-4">Final Issue: Passover Special</p>
              <p className="text-gray-600 text-sm mb-4">Complete guide to vegan Passover celebrations with traditional recipes.</p>
              <ul className="space-y-1 mb-4">
                <li className="text-gray-700 text-sm">• Vegan Seder Plate Guide</li>
                <li className="text-gray-700 text-sm">• Plant-based Matzah Recipes</li>
                <li className="text-gray-700 text-sm">• Passover Ethics Discussion</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                View PDF
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Winter 2017</h3>
              <p className="text-blue-600 font-medium mb-4">Hanukkah Edition</p>
              <p className="text-gray-600 text-sm mb-4">Celebrating the Festival of Lights with compassion and sustainability.</p>
              <ul className="space-y-1 mb-4">
                <li className="text-gray-700 text-sm">• Vegan Latke Variations</li>
                <li className="text-gray-700 text-sm">• Hanukkah Story & Ethics</li>
                <li className="text-gray-700 text-sm">• Sustainable Celebrations</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                View PDF
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fall 2017</h3>
              <p className="text-blue-600 font-medium mb-4">Rosh Hashanah Special</p>
              <p className="text-gray-600 text-sm mb-4">New beginnings and ethical eating in the Jewish New Year.</p>
              <ul className="space-y-1 mb-4">
                <li className="text-gray-700 text-sm">• Sweet New Year Recipes</li>
                <li className="text-gray-700 text-sm">• Tashlich Ceremony Guide</li>
                <li className="text-gray-700 text-sm">• Jewish Environmental Ethics</li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                View PDF
              </button>
            </div>
          </div>
        </section>

        {/* Search & Browse */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Search & Browse the Archive
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🔍 Search Archive</h3>
              <div className="space-y-4">
                <button className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="font-medium text-blue-900">Recipes</span>
                </button>
                <button className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="font-medium text-blue-900">Ethics</span>
                </button>
                <button className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="font-medium text-blue-900">Holidays</span>
                </button>
                <button className="w-full text-left p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="font-medium text-blue-900">Environment</span>
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">📅 Browse by Year</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="font-medium text-green-900">2010s</span>
                  <p className="text-sm text-green-700">Latest issues</p>
                </button>
                <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="font-medium text-blue-900">2000s</span>
                  <p className="text-sm text-blue-700">Digital era</p>
                </button>
                <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <span className="font-medium text-purple-900">1990s</span>
                  <p className="text-sm text-purple-700">Transition period</p>
                </button>
                <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <span className="font-medium text-orange-900">1970s-80s</span>
                  <p className="text-sm text-orange-700">Classic issues</p>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Explore Our Complete Archive
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Dive into decades of Jewish vegan wisdom, from traditional recipes to modern ethical discussions. 
            Our complete archive (1970-2018) is available as searchable PDFs, preserving the rich history 
            of Jewish vegetarianism and veganism for future generations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/resources"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📚 Back to Resources
            </Link>
            <Link 
              href="/magazine/"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📖 Browse Complete Archive
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 