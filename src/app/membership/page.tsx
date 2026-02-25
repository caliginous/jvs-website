import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getEmailSettingsForAppRouter } from '../../lib/appRouterUtils';
import { EmailSettings } from '../../lib/getEmailSettings';

export default async function MembershipPage() {
  const emailSettings = await getEmailSettingsForAppRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#8BC34A] to-[#4CAF50] text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <span className="inline-block bg-white bg-opacity-90 text-[#4CAF50] px-4 py-2 rounded-full text-sm font-medium mb-4">
              🌱 Join Our Community
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Support Jewish Veganism
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Help us build a more compassionate, sustainable world through Jewish values and plant-based living
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://patreon.com/u84615181"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#4CAF50] hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Become a Patron
            </a>
            <a
              href="#how-it-works"
              className="border-2 border-white text-white hover:bg-white hover:text-[#4CAF50] font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-[#8BC34A] mb-2">100+</div>
              <div className="text-gray-600">Events & Workshops</div>
              <div className="text-sm text-gray-500">Free and low-cost</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#8BC34A] mb-2">265+</div>
              <div className="text-gray-600">Vegan Recipes</div>
              <div className="text-sm text-gray-500">Jewish-inspired</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#8BC34A] mb-2">1000+</div>
              <div className="text-gray-600">Community Members</div>
              <div className="text-sm text-gray-500">Growing daily</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#263238] mb-4">How Your Support Makes a Difference</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your monthly contribution helps us create meaningful change in the Jewish community and beyond
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#8BC34A] rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-[#263238] mb-4">Education & Resources</h3>
              <p className="text-gray-600 mb-4">
                Create engaging content exploring veganism, Jewish values, and sustainability
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Friday Night Dinner packs</li>
                <li>• Jewish holiday guides</li>
                <li>• Educational workshops</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-[#263238] mb-4">Community Building</h3>
              <p className="text-gray-600 mb-4">
                Organize events and activities that bring people together
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Monthly meetups</li>
                <li>• Holiday celebrations</li>
                <li>• Networking events</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-[#FF9800] rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-[#263238] mb-4">Environmental Impact</h3>
              <p className="text-gray-600 mb-4">
                Promote sustainable practices and reduce our ecological footprint
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Carbon footprint reduction</li>
                <li>• Sustainable living guides</li>
                <li>• Environmental advocacy</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Patron Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#263238] mb-4">What You Get as a Patron</h2>
            <p className="text-xl text-gray-600">
              Exclusive benefits and early access to our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#8BC34A] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#263238] mb-1">Early Event Access</h3>
                    <p className="text-gray-600">Priority registration and discounted tickets for all events</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#8BC34A] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#263238] mb-1">Exclusive Content</h3>
                    <p className="text-gray-600">Behind-the-scenes updates and special digital resources</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#8BC34A] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#263238] mb-1">Community Recognition</h3>
                    <p className="text-gray-600">Optional name acknowledgments in newsletters and events</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#8BC34A] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#263238] mb-1">Direct Impact</h3>
                    <p className="text-gray-600">See your support in action through regular impact reports</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#8BC34A] to-[#4CAF50] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Start Supporting Today</h3>
              <p className="mb-6">Even £3 per month makes a real difference in our community</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>£3/month</span>
                  <span className="text-sm opacity-90">Basic Patron</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>£5/month</span>
                  <span className="text-sm opacity-90">Community Patron</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>£10/month</span>
                  <span className="text-sm opacity-90">Sustaining Patron</span>
                </div>
              </div>
              <a
                href="https://patreon.com/u84615181"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-[#4CAF50] text-center font-bold py-3 px-6 rounded-lg mt-6 hover:bg-gray-100 transition-colors duration-200"
              >
                Choose Your Level
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#263238] mb-4">What Our Patrons Say</h2>
            <p className="text-xl text-gray-600">
              Join hundreds of supporters making a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#8BC34A] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <div className="font-semibold text-[#263238]">Sarah M.</div>
                  <div className="text-sm text-gray-500">£5/month Patron</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "JVS has helped me connect my Jewish identity with my vegan lifestyle. The community is warm and welcoming."
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#4CAF50] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">D</span>
                </div>
                <div>
                  <div className="font-semibold text-[#263238]">David L.</div>
                  <div className="text-sm text-gray-500">£10/month Patron</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The resources and events have been invaluable for our family. I'm proud to support this important work."
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#FF9800] rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">R</span>
                </div>
                <div>
                  <div className="font-semibold text-[#263238]">Rachel K.</div>
                  <div className="text-sm text-gray-500">£3/month Patron</div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Even a small monthly contribution makes me feel connected to this amazing community and mission."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#263238] to-[#37474F] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-gray-200">
            Join our community of supporters and help us build a more compassionate world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://patreon.com/u84615181"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#8BC34A] hover:bg-[#4CAF50] text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
            >
              Become a Patron Now
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-[#263238] font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#E8F5E8] to-[#F3E5F5] rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-[#263238] mb-6 text-center">Leave a Lasting Legacy</h2>
            <p className="text-lg text-gray-700 mb-6 text-center">
              Consider including JVS in your will to ensure our work continues for future generations
            </p>
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-[#263238] mb-3">Suggested Wording for Your Will:</h3>
              <p className="text-gray-700 italic text-sm leading-relaxed">
                "I leave the sum of £___ (or ___% of my estate) to The Jewish Vegetarian Society, Registered Charity Number 258581, of 853–855 Finchley Road, London NW11 8LX, to be used for its general charitable purposes."
              </p>
            </div>
            <div className="text-center">
              <a
                href="/contact"
                className="inline-block bg-[#4FC3F7] hover:bg-[#1976D2] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Contact Us About Legacy Giving
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Historic Members Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-[#263238] mb-6 text-center">For Historic Life Members</h2>
            <p className="text-lg text-gray-700 mb-6 text-center">
              We're deeply grateful to our historic Life Members who supported us in the past
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-[#263238] mb-3">Update Your Information</h3>
                <p className="text-gray-600 mb-4">
                  Keep your contact details current to continue receiving our newsletter and updates
                </p>
                <a
                  href="https://forms.gle/aSdksqucxVFE8oHy9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#8BC34A] hover:bg-[#4CAF50] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Update Your Details
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-[#263238] mb-3">Stay Connected</h3>
                <p className="text-gray-600 mb-4">
                  Continue to be part of our community and receive exclusive updates
                </p>
                <a
                  href="/contact"
                  className="inline-block border-2 border-[#8BC34A] text-[#8BC34A] hover:bg-[#8BC34A] hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

 