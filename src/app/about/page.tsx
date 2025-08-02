import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#E1F0D1] via-[#C8E6C9] to-[#A5D6A7] text-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-[#2E7D32] rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-4 border-[#4CAF50] rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-4 border-[#66BB6A] rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
          <div className="text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-6 py-2 mb-4 md:mb-6">
              <span className="text-[#2E7D32] font-semibold text-sm md:text-base">Est. 1960s</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] bg-clip-text text-transparent">
              About JVS
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed px-4">
              Jewish, Vegan, Sustainable - Building community through shared values and compassionate living
            </p>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
              <div className="flex items-center justify-center space-x-2 bg-white/30 backdrop-blur-sm rounded-full px-3 md:px-4 py-2">
                <span className="text-[#2E7D32] text-sm md:text-base">🌱</span>
                <span className="font-medium text-sm md:text-base">Plant-Based</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-white/30 backdrop-blur-sm rounded-full px-3 md:px-4 py-2">
                <span className="text-[#2E7D32] text-sm md:text-base">🤝</span>
                <span className="font-medium text-sm md:text-base">Community</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-white/30 backdrop-blur-sm rounded-full px-3 md:px-4 py-2">
                <span className="text-[#2E7D32] text-sm md:text-base">🌍</span>
                <span className="font-medium text-sm md:text-base">Sustainable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="space-y-4 md:space-y-6">
              <div className="inline-block bg-[#E1F0D1] rounded-full px-3 md:px-4 py-2 mb-3 md:mb-4">
                <span className="text-[#2E7D32] font-semibold text-xs md:text-sm">Our Purpose</span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight">
                Our Mission
              </h2>
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-neutral-700 leading-relaxed">
                <p>
                  JVS promotes Jewish values through veganism and sustainability, building community through education and advocacy. 
                  We believe that caring for animals, protecting the environment, and maintaining good health are deeply rooted in Jewish tradition.
                </p>
                <p>
                  Our organization brings together Jews from all backgrounds who share a commitment to plant-based living, 
                  environmental stewardship, and social justice. We provide resources, education, and community support 
                  to help individuals and families embrace sustainable, compassionate choices.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-3 md:pt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 md:w-3 h-2 md:h-3 bg-[#4CAF50] rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium text-neutral-600">Education</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 md:w-3 h-2 md:h-3 bg-[#66BB6A] rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium text-neutral-600">Advocacy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 md:w-3 h-2 md:h-3 bg-[#81C784] rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium text-neutral-600">Community</span>
                </div>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="bg-gradient-to-br from-[#E1F0D1] to-[#C8E6C9] rounded-xl md:rounded-2xl p-6 md:p-8">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="bg-white rounded-full p-2 md:p-3 flex-shrink-0">
                      <span className="text-lg md:text-2xl">📚</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2E7D32] text-sm md:text-base">Education</h3>
                      <p className="text-xs md:text-sm text-neutral-600">Sharing knowledge about sustainable living</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="bg-white rounded-full p-2 md:p-3 flex-shrink-0">
                      <span className="text-lg md:text-2xl">🌱</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2E7D32] text-sm md:text-base">Sustainability</h3>
                      <p className="text-xs md:text-sm text-neutral-600">Protecting our planet for future generations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="bg-white rounded-full p-2 md:p-3 flex-shrink-0">
                      <span className="text-lg md:text-2xl">🤝</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2E7D32] text-sm md:text-base">Community</h3>
                      <p className="text-xs md:text-sm text-neutral-600">Building connections and support networks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-white to-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <div className="inline-block bg-[#E1F0D1] rounded-full px-3 md:px-4 py-2 mb-3 md:mb-4">
              <span className="text-[#2E7D32] font-semibold text-xs md:text-sm">What Drives Us</span>
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 md:mb-6">Our Core Values</h2>
            <p className="text-base md:text-xl text-neutral-600 max-w-3xl mx-auto px-4">
              These fundamental principles guide everything we do and shape our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-[#FFE0B2] to-[#FFCC80] rounded-xl md:rounded-2xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl md:text-3xl">💚</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-3 md:mb-4 text-center">Compassion</h3>
              <p className="text-sm md:text-base text-neutral-600 text-center leading-relaxed">
                Showing kindness and respect to all living beings, reflecting the Jewish value of <em>tza&apos;ar ba&apos;alei chayim</em>.
              </p>
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-2 text-xs md:text-sm text-[#2E7D32]">
                  <span>🌱</span>
                  <span className="font-medium">Kindness to All</span>
                </div>
              </div>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-[#C8E6C9] to-[#A5D6A7] rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4 text-center">Sustainability</h3>
              <p className="text-neutral-600 text-center leading-relaxed">
                Caring for the Earth as stewards of creation, embodying the principle of <em>bal tashchit</em>.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-2 text-sm text-[#2E7D32]">
                  <span>♻️</span>
                  <span className="font-medium">Environmental Care</span>
                </div>
              </div>
            </div>
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-[#BBDEFB] to-[#90CAF9] rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4 text-center">Community</h3>
              <p className="text-neutral-600 text-center leading-relaxed">
                Building connections and supporting each other in our shared journey toward a more just world.
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-2 text-sm text-[#2E7D32]">
                  <span>🏘️</span>
                  <span className="font-medium">Strong Connections</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-[#E1F0D1] rounded-full px-4 py-2 mb-4">
                <span className="text-[#2E7D32] font-semibold text-sm">Our Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
                Our History
              </h2>
              <div className="space-y-6 text-lg text-neutral-700 leading-relaxed">
                <p>
                  The Jewish Vegetarian Society (now JVS) was founded in the 1960s, sparked by a letter from Vivien Pick to <em>The Jewish Chronicle</em>. 
                  She asked whether there were other Jewish vegetarians interested in meeting up. The response led to the formation of a new community, 
                  with her father, Philip Pick—a lifelong advocate for a more compassionate world—as its first President.
                </p>
                <p>
                  Philip believed deeply in a society free from cruelty to both animals and humans. The Society quickly found common ground in Jewish teachings—particularly 
                  the Torah&apos;s emphasis on compassion and the idea that &ldquo;the herbs of the field&rdquo; were given to us for food.
                </p>
                <p>
                  The first JVS meetings were held in committee members&apos; homes around Highgate, north London. Thanks to a growing membership and several generous donations, 
                  the Society acquired a small property in Swiss Cottage.
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex items-center space-x-2 bg-[#E1F0D1] rounded-full px-4 py-2">
                  <span className="text-[#2E7D32]">📅</span>
                  <span className="text-sm font-medium text-[#2E7D32]">1960s</span>
                </div>
                <div className="flex items-center space-x-2 bg-[#E1F0D1] rounded-full px-4 py-2">
                  <span className="text-[#2E7D32]">🏠</span>
                  <span className="text-sm font-medium text-[#2E7D32]">Highgate</span>
                </div>
                <div className="flex items-center space-x-2 bg-[#E1F0D1] rounded-full px-4 py-2">
                  <span className="text-[#2E7D32]">🏢</span>
                  <span className="text-sm font-medium text-[#2E7D32]">Swiss Cottage</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] rounded-2xl p-8 h-full">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="font-bold text-[#2E7D32] text-lg mb-2">The Letter</h3>
                    <p className="text-sm text-neutral-600">Vivien Pick&apos;s letter to The Jewish Chronicle sparked a movement</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👨‍👧</span>
                    </div>
                    <h3 className="font-bold text-[#2E7D32] text-lg mb-2">Philip Pick</h3>
                    <p className="text-sm text-neutral-600">First President and lifelong advocate for compassion</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🏘️</span>
                    </div>
                    <h3 className="font-bold text-[#2E7D32] text-lg mb-2">Community Growth</h3>
                    <p className="text-sm text-neutral-600">From home meetings to a dedicated property</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-[#2E7D32] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                60+
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a
              href="/history"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] text-white hover:from-[#1B5E20] hover:to-[#2E7D32] px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <span>Read Full History</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-[#2E7D32] via-[#388E3C] to-[#4CAF50] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-white rounded-full"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <span className="font-semibold">Join Our Community</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get Involved</h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Join our community and help us build a more compassionate, sustainable world.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Become a Member</h3>
              <p className="text-lg mb-6 opacity-90">
                Join our growing community and access exclusive resources, events, and support networks.
              </p>
              <a
                href="/membership"
                className="inline-flex items-center space-x-2 bg-white text-[#2E7D32] hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <span>Join Now</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
              <p className="text-lg mb-6 opacity-90">
                Have questions? Want to learn more? Get in touch with our friendly team.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center space-x-2 border-2 border-white text-white hover:bg-white hover:text-[#2E7D32] px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <span>Get in Touch</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <span className="font-medium">Plant-Based Living</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🤝</span>
              <span className="font-medium">Community Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌍</span>
              <span className="font-medium">Environmental Care</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 