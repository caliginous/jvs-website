import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuickNav from '@/components/QuickNav';

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <QuickNav />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Jewish and Vegan FAQs
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Find answers to common questions about combining Jewish practice with plant-based living, 
            from kashrut concerns to holiday celebrations.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Whether you&apos;re new to veganism, exploring Jewish practice, or looking to combine both, 
            you&apos;ll find answers to the most common questions here. Our comprehensive FAQ covers 
            everything from basic concepts to complex ethical considerations.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">🍽️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Kosher & Kashrut</h3>
              <p className="text-gray-600">Understanding Jewish dietary laws</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">📖</div>
              <h3 className="font-semibold text-gray-900 mb-2">Jewish Law & Tradition</h3>
              <p className="text-gray-600">Religious and ethical considerations</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
              <h3 className="font-semibold text-gray-900 mb-2">Family & Community</h3>
              <p className="text-gray-600">Practical living and social aspects</p>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="#kosher" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">🍽️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      Kosher & Kashrut
                    </h3>
                    <p className="text-gray-600 text-sm">Dietary laws and food preparation</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="#jewish-law" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">📖</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      Jewish Law & Tradition
                    </h3>
                    <p className="text-gray-600 text-sm">Religious practice and ethics</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="#family" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">👨‍👩‍👧‍👦</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      Family & Community
                    </h3>
                    <p className="text-gray-600 text-sm">Social and practical considerations</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="#health" className="group">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">💚</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      Health & Nutrition
                    </h3>
                    <p className="text-gray-600 text-sm">Wellness and dietary concerns</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Kosher & Kashrut FAQs */}
        <section id="kosher" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Kosher & Kashrut</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Is vegan food automatically kosher?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                While plant-based foods are generally kosher, there are still considerations. Fruits, vegetables, 
                grains, and legumes are inherently kosher, but processed foods may contain non-kosher ingredients 
                or be processed on equipment that handles non-kosher items. Always check labels and look for 
                reliable kosher certification when needed.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Can I keep kosher while being vegan?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Absolutely! Many people find that being vegan actually makes keeping kosher easier, as you 
                eliminate many of the complex meat and dairy separation requirements. Plant-based foods are 
                generally pareve (neutral) and don&apos;t require the same level of separation as meat and dairy products.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                What about wine and grape products?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Traditional kosher wine requires special handling, but many vegan wines are also kosher. 
                Look for wines that are both vegan and kosher certified. Some grape products like grape juice 
                may also require kosher certification depending on your level of observance.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                How do I handle Passover as a vegan?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Passover can be challenging but is very manageable as a vegan. Many plant-based foods are 
                naturally kosher for Passover, including fruits, vegetables, nuts, and certain grains. 
                Look for certified kosher for Passover products and consider using quinoa, which is accepted 
                by many authorities as kosher for Passover.
              </p>
            </div>
          </div>
        </section>

        {/* Jewish Law & Tradition FAQs */}
        <section id="jewish-law" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Jewish Law & Tradition</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                What does Jewish tradition say about veganism?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Jewish tradition contains many teachings that support plant-based living. The concept of 
                tza&apos;ar ba&apos;alei chayim (preventing animal suffering), bal tashchit (avoiding waste), 
                and pikuach nefesh (preserving life) all align with vegan principles. Many rabbis and scholars 
                argue that veganism is the ideal Jewish diet.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Is it okay to be vegan on Shabbat and holidays?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Yes, absolutely! Many Jewish vegans find that plant-based meals enhance their Shabbat and 
                holiday celebrations. You can create beautiful, traditional meals using plant-based ingredients 
                that honor both Jewish tradition and ethical eating principles.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                What about the commandment to be fruitful and multiply?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The commandment to be fruitful and multiply refers to human reproduction, not animal consumption. 
                In fact, many Jewish scholars argue that reducing animal consumption helps fulfill the commandment 
                to care for the Earth and its inhabitants.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                How do I explain my vegan choices to traditional family members?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Focus on the Jewish values that support your choice: compassion for animals, environmental 
                stewardship, and health. Share resources from respected rabbis and scholars who support 
                plant-based living. Remember that Jewish tradition values questioning and ethical reasoning.
              </p>
            </div>
          </div>
        </section>

        {/* Family & Community FAQs */}
        <section id="family" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Family & Community</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                How do I raise vegan Jewish children?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Start by teaching Jewish values of compassion and environmental stewardship. Create positive 
                associations with plant-based foods through fun, traditional recipes. Connect with other 
                vegan Jewish families and find supportive communities both online and in person.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                What if my synagogue doesn&apos;t offer vegan options?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Many synagogues are open to accommodating dietary needs. Speak with the rabbi or community 
                leaders about adding vegan options. You might also offer to help organize vegan-friendly 
                events or bring your own food to community meals.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                How do I handle family gatherings and holidays?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Communicate your dietary needs in advance and offer to bring vegan dishes to share. Focus 
                on the joy of being together rather than food differences. Many families find that vegan 
                dishes become popular additions to traditional meals.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Are there vegan Jewish communities I can join?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Yes! There are growing networks of vegan Jewish communities both online and in person. 
                Look for Facebook groups, local meetups, and organizations like JVS that connect vegan 
                Jews. Many cities have vegan Jewish groups that organize events and provide support.
              </p>
            </div>
          </div>
        </section>

        {/* Health & Nutrition FAQs */}
        <section id="health" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Health & Nutrition</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Is a vegan diet healthy for all life stages?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Yes, a well-planned vegan diet can be healthy for people of all ages, including children, 
                pregnant women, and seniors. The key is ensuring adequate intake of nutrients like B12, 
                iron, calcium, and omega-3 fatty acids through fortified foods or supplements.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                What about protein on a vegan diet?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Plant-based protein sources are abundant and include legumes, tofu, tempeh, seitan, nuts, 
                seeds, and whole grains. Most people easily meet their protein needs on a varied vegan diet 
                without needing to track protein intake carefully.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                How do I get enough B12?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                B12 is primarily found in animal products, so vegans should take a B12 supplement or consume 
                fortified foods like plant milks, breakfast cereals, and nutritional yeast. Regular B12 
                testing is recommended to ensure adequate levels.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Can I be vegan and athletic?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Absolutely! Many elite athletes follow plant-based diets. Focus on adequate calories, 
                protein, and nutrients. Many plant-based athletes find they recover faster and have more 
                energy on a vegan diet.
              </p>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">📚 Recommended Reading</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• &quot;Judaism and Vegetarianism&quot; by Richard Schwartz</li>
                <li>• &quot;The Jewish Vegan&quot; by Roberta Kalechofsky</li>
                <li>• &quot;Veganism in an Oppressive World&quot; by Julia Feliz Brueck</li>
                <li>• &quot;Jewish Ethics and Animal Welfare&quot; by various authors</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🌐 Online Resources</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• JVS Website and Resources</li>
                <li>• Jewish Vegan Facebook Groups</li>
                <li>• Plant-Based Jewish Cooking Blogs</li>
                <li>• Vegan Jewish Community Forums</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            If you didn&apos;t find the answer you&apos;re looking for, our community is here to help. 
            Connect with other vegan Jews and get personalized guidance.
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
              💬 Ask a Question
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 