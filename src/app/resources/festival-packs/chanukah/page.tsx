'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Chanukah color palette - warm golds and deep blues
const colors = {
  deepBlue: '#1a365d',
  royalBlue: '#2c5282',
  gold: '#d69e2e',
  warmGold: '#ecc94b',
  lightGold: '#faf089',
  cream: '#fffbeb',
  softBlue: '#ebf4ff',
};

export default function ChanukahPackPage() {
  const printableRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    // Dynamic import to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;
    
    const element = printableRef.current;
    if (!element) return;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'JVS-Chanukah-Resource-Pack.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section with Chanukah imagery */}
      <section className="relative overflow-hidden" style={{ backgroundColor: colors.deepBlue }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 border-2 border-yellow-400 transform rotate-45" />
          <div className="absolute top-20 right-20 w-16 h-16 border-2 border-yellow-400 transform rotate-12" />
          <div className="absolute bottom-10 left-1/4 w-20 h-20 border-2 border-yellow-400 transform -rotate-12" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white z-10">
              <div className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: colors.gold, color: colors.deepBlue }}>
                Festival Resource Pack
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Chanukah
                <span className="block text-2xl md:text-3xl font-normal mt-2" style={{ color: colors.warmGold }}>
                  The Festival of Lights
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                Celebrate with traditional vegan recipes, meaningful traditions, 
                and Jewish values that honour both our heritage and our commitment to compassion.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105"
                  style={{ backgroundColor: colors.gold, color: colors.deepBlue }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
                <Link
                  href="/resources/festival-packs"
                  className="inline-flex items-center px-6 py-3 rounded-full font-semibold border-2 border-white text-white hover:bg-white hover:text-blue-900 transition-all duration-200"
                >
                  ← Back to Festival Packs
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/chanukah/hero-scene.png"
                  alt="Chanukah celebration scene with menorah, sufganiyot, and festive decorations"
                  width={500}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Printable Section */}
      <div ref={printableRef} className="print:p-8">
        {/* PDF Header - only visible in print */}
        <div className="hidden print:block print:mb-8 print:text-center">
          <h1 className="text-3xl font-bold" style={{ color: colors.deepBlue }}>JVS Chanukah Resource Pack</h1>
          <p className="text-gray-600">Jewish, Vegan, Sustainable • www.jvs.org.uk</p>
        </div>

        <main className="max-w-6xl mx-auto px-4 py-12 print:py-4">
          
          {/* The Eight Nights of Chanukah */}
          <section className="mb-16 print:mb-8 print:break-inside-avoid">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200">
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">🕯️</span>
                  <h2 className="text-3xl font-bold" style={{ color: colors.deepBlue }}>
                    The Eight Nights of Chanukah
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="mb-4">
                    Chanukah, also known as the Festival of Lights, is an eight-day Jewish holiday that celebrates 
                    the rededication of the Second Temple in Jerusalem following the victory of the Maccabees, 
                    a small group of Jewish fighters, over the powerful Syrian-Greek army in the 2nd century BCE. 
                    According to the story, the Maccabees&apos; triumph was both a spiritual victory, restoring Jewish 
                    worship in the Temple after years of oppression.
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl p-6 my-6 border-l-4" style={{ borderColor: colors.gold }}>
                    <h3 className="text-xl font-semibold mb-3" style={{ color: colors.deepBlue }}>The Miracle of the Oil</h3>
                    <p className="text-gray-700 mb-0">
                      The miracle of the oil refers to the Temple&apos;s menorah, when there was only enough olive oil 
                      to last for one day, but miraculously it burned for eight days. To celebrate this miracle, 
                      we light candles on a Hanukkiah each night of the festival, adding one flame until all eight glow.
                    </p>
                  </div>
                  <p>
                    Chanukah is a time for joy and gratitude, celebrated with songs, games like spinning the dreidel, 
                    and traditional foods such as latkes and sufganiyot, both fried in oil to recall the miracle that inspired the holiday.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Traditional Foods Section */}
          <section className="mb-16 print:mb-8">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3" style={{ color: colors.deepBlue }}>
              <span className="text-4xl">🥔</span>
              Traditional Foods Made Vegan
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Latkes */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200 print:break-inside-avoid">
                <div className="aspect-video relative">
                  <Image
                    src="/images/chanukah/latkes.png"
                    alt="Golden crispy latkes"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.deepBlue }}>Latkes</h3>
                  <p className="text-gray-700 text-sm">
                    Chanukah latkes are fried potato pancakes, often made with eggs to bind them together. 
                    Vegan versions use aquafaba or flaxseed &quot;eggs&quot; to achieve the same crisp texture without animal products. 
                    This swap avoids supporting the egg industry. Additionally, potatoes, onions, and plant oils have a 
                    far smaller carbon footprint than eggs and dairy, making vegan latkes compassionate and sustainable.
                  </p>
                </div>
              </div>

              {/* Sufganiyot */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200 print:break-inside-avoid">
                <div className="aspect-video relative">
                  <Image
                    src="/images/chanukah/sufganiyot.png"
                    alt="Jam-filled sufganiyot doughnuts"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.deepBlue }}>Sufganiyot</h3>
                  <p className="text-gray-700 text-sm">
                    Chanukah sufganiyot (doughnuts) are often full of butter and eggs, while plant-based versions 
                    use soy or oat milk, vegan butter, and baking powder for fluffiness. The halakhic significance 
                    of doughnuts is being fried in oil; this means that a plant-based doughnut is equally as meaningful. 
                    These substitutions eliminate animal suffering and reduce greenhouse gases.
                  </p>
                </div>
              </div>

              {/* Gelt */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200 print:break-inside-avoid">
                <div className="aspect-video relative">
                  <Image
                    src="/images/chanukah/gelt.png"
                    alt="Chocolate gelt coins"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.deepBlue }}>Gelt</h3>
                  <p className="text-gray-700 text-sm">
                    Gelt (chocolate coins) is a sweet traditional food, sometimes made with milk chocolate which 
                    is used when playing dreidels. Choosing dairy-free gelt prevents the exploitation of dairy cows 
                    and reduces the environmental toll of milk production. Plenty of Chanukah gelt is pareve, 
                    making this an easy compassionate choice.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Chanukah Traditions */}
          <section className="mb-16 print:mb-8 print:break-inside-avoid">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3" style={{ color: colors.deepBlue }}>
              <span className="text-4xl">✡️</span>
              Chanukah Traditions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Hanukkiah */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200">
                <div className="md:flex">
                  <div className="md:w-2/5 relative min-h-[200px]">
                    <Image
                      src="/images/chanukah/hanukkiah.png"
                      alt="Lit hanukkiah with all candles burning"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="md:w-3/5 p-6">
                    <h3 className="text-xl font-bold mb-3" style={{ color: colors.deepBlue }}>The Hanukkiah</h3>
                    <p className="text-gray-700 text-sm">
                      The hanukkiah symbolises the miracle of the oil in the Second Temple, when there was enough 
                      olive oil for one night, but instead lasted for eight. This story highlights olive oil as 
                      both a sacred and sustainable resource. Jewish vegans embrace this symbolism by choosing 
                      plant-based oils or waxes for lighting, out of traditional respect for natural resources 
                      and modern ethical values.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dreidel */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-200">
                <div className="md:flex">
                  <div className="md:w-2/5 relative min-h-[200px]">
                    <Image
                      src="/images/chanukah/dreidel-art.png"
                      alt="Decorative dreidel illustration"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="md:w-3/5 p-6">
                    <h3 className="text-xl font-bold mb-3" style={{ color: colors.deepBlue }}>The Dreidel Game</h3>
                    <p className="text-gray-700 text-sm">
                      The dreidel game, historically linked to Jewish perseverance under oppression, is profound. 
                      The Hebrew letters nun, gimel, hei, and shin form an acronym for &quot;A great miracle happened there&quot;, 
                      referencing the miracle of the lasting oil in the temple. When playing the dreidel game, 
                      choosing plant-based gelt honours the Jewish principles of ethical eating and sustainability.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Music Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-8 print:bg-gray-50">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-1/4">
                  <Image
                    src="/images/chanukah/music.png"
                    alt="Musical instruments illustration"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: colors.deepBlue }}>
                    <span>🎵</span> Chanukah Music
                  </h3>
                  <p className="text-gray-700">
                    Chanukah&apos;s music spans ancient prayers, traditional folk songs, and modern classics, all celebrating 
                    light, community and renewal. After lighting the hannukiah, songs like <em>Hanerot Halalu</em> and <em>Ma&apos;oz Tzur</em> are 
                    sung to remember the miracles and victories of the Maccabees, while the prayer <em>Al HaNissim</em> is added 
                    to the Amidah and Birkat HaMazon in gratitude. Folk songs such as <em>Sevivon Sov Sov Sov</em>, <em>Mi Yimalel</em>, 
                    and <em>Yemei HaChanukah</em> are popular at home and community gatherings. Yiddish and Ladino pieces 
                    like <em>Oy Chanukah</em> and <em>Ocho Kandelikas</em> reflect the diversity of Jewish life across generations and cultures.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Key Values Section */}
          <section className="mb-16 print:mb-8">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3" style={{ color: colors.deepBlue }}>
              <span className="text-4xl">💚</span>
              Key Jewish Values
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Tzedakah',
                  icon: '🤝',
                  description: 'Giving tzedakah during this season reflects our ethical values and our hopes for a more compassionate and just world. When we give our time and money to important causes, we ought to consider supporting impactful organisations which align with Jewish values like tikkun olam (repairing our world) and tza\'ar ba\'alei chaim (kindness to animals).'
                },
                {
                  title: "Tza'ar Ba'alei Chayim",
                  icon: '🐄',
                  description: 'This principle calls us to prevent unnecessary suffering to animals. Choosing plant-based foods during this holiday allows us to respect the Jewish value of compassion to other living beings, whilst still celebrating our heritage and traditions.'
                },
                {
                  title: 'Tikkun Olam',
                  icon: '🌍',
                  description: 'Tikkun olam (repairing the world), encourages us to take action for social justice and the environment. Opting for plant-based foods, reducing waste, supporting ethical businesses and volunteering are all ways to make a positive impact.'
                },
                {
                  title: 'Gemilut Chesedim',
                  icon: '❤️',
                  description: 'Acts of gemilut chesedim (loving-kindness) can manifest in many ways during Chanukah - not only in the way we act towards others, but in choosing to eat compassionately towards the planet and other living creatures.'
                },
                {
                  title: 'Baal Tashchit',
                  icon: '♻️',
                  description: 'Baal tashchit reminds us not to be wasteful. Mindful consumption, avoiding food waste, thoughtful gift-giving and choosing sustainable and plant-based foods are all ways to celebrate Chanukah responsibly while protecting the planet.'
                }
              ].map((value, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow print:shadow-none print:border print:border-gray-200 print:break-inside-avoid"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{value.icon}</span>
                    <h3 className="text-lg font-bold" style={{ color: colors.deepBlue }}>{value.title}</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
              
              {/* Animals illustration card */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 flex items-center justify-center print:shadow-none print:border print:border-gray-200">
                <Image
                  src="/images/chanukah/animals.png"
                  alt="Farm animals illustration representing compassion for animals"
                  width={250}
                  height={200}
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </section>

          {/* Recipes Section */}
          <section className="mb-16 print:mb-8 print:break-inside-avoid">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3" style={{ color: colors.deepBlue }}>
              <span className="text-4xl">👩‍🍳</span>
              Vegan Chanukah Recipes
            </h2>
            
            <p className="text-gray-700 mb-6">
              Discover a varied &amp; yummy selection of vegan recipes for Chanukah, all available on the JVS website!
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Latkes Recipes */}
              <div className="bg-white rounded-xl shadow-lg p-6 print:shadow-none print:border print:border-gray-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.gold }}>
                  🥔 Latkes
                </h3>
                <ul className="space-y-3">
                  {[
                    { name: 'Baked Latkes', url: '/recipes/baked-latkes-chanukah' },
                    { name: 'Beetroot Latkes', url: '/recipes/beetroot-latkes-chanukah' },
                    { name: 'Sweet & Savoury Latkes', url: '/recipes/sweet-savoury-latkes' },
                    { name: 'Easy Potato Latkes', url: '/recipes/easy-potato-latkes' },
                  ].map((recipe, index) => (
                    <li key={index}>
                      <Link 
                        href={recipe.url}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {recipe.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sufganiyot Recipes */}
              <div className="bg-white rounded-xl shadow-lg p-6 print:shadow-none print:border print:border-gray-200">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.gold }}>
                  🍩 Sufganiyot
                </h3>
                <ul className="space-y-3">
                  {[
                    { name: 'Chocolate Glazed Doughnuts', url: '/recipes/chocolate-glazed-doughnuts' },
                    { name: 'Chai Hot Chocolate Doughnuts', url: '/recipes/chai-hot-chocolate-doughnuts' },
                    { name: 'Mini Doughnuts & Quick Raspberry Sauce', url: '/recipes/mini-doughnuts-quick-raspberry-sauce' },
                  ].map((recipe, index) => (
                    <li key={index}>
                      <Link 
                        href={recipe.url}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {recipe.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="mb-16 print:mb-8">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3" style={{ color: colors.deepBlue }}>
              <span className="text-4xl">❓</span>
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  q: 'Is it possible to celebrate Chanukah traditionally while staying vegan and environmentally conscious?',
                  a: 'Absolutely. The central traditions such as lighting the menorah, reciting the blessings and telling the story need no modification. Most of the sustainable or vegan choices relate to food, gifts, and materials, not the tradition itself.'
                },
                {
                  q: 'What kind of hanukkiah is considered eco-friendly?',
                  a: 'A hanukkiah you reuse every year is arguably the most sustainable option. However, long-lasting materials like metal, glass, or ceramic tend to have the lowest long-term footprint. Many people also enjoy hanukkiahs made from reclaimed or locally crafted materials.'
                },
                {
                  q: 'Are there vegan or environmentally safe candles?',
                  a: 'Yes. Plant-based wax candles (soy, rapeseed, coconut) or an olive-oil hanukiah work beautifully. Ideally, look for candles without paraffin, synthetic scents, or heavy packaging.'
                },
                {
                  q: 'Can I keep the food traditions while cooking vegan?',
                  a: 'Latkes are easy to make without eggs; flaxseed, chia and chickpea flour all bind well. Vegan sufganiyot can be made with plant milks and dairy-free butter. The traditional importance of foods being cooked in oil remains the same.'
                },
                {
                  q: 'Is olive oil vegan and sustainable?',
                  a: 'Olive oil is vegan. To make the choice more sustainable, many people look for organic or fair-trade brands or buy from local producers if that\'s an option.'
                },
                {
                  q: 'What themes of Chanukah connect naturally to sustainability and vegan values?',
                  a: 'The miracle of the oil suggests careful use of resources; the rededication of the Temple echoes the idea of rededicating ourselves to good stewardship and the light of the menorah reflects hope and compassion.'
                }
              ].map((faq, index) => (
                <details 
                  key={index} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden group print:shadow-none print:border print:border-gray-200 print:break-inside-avoid"
                >
                  <summary className="p-6 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <span>{faq.q}</span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform print:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Further Reading */}
          <section className="mb-16 print:mb-8 print:break-inside-avoid">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3" style={{ color: colors.deepBlue }}>
              <span className="text-4xl">📚</span>
              Further Reading
            </h2>
            
            <div className="bg-white rounded-xl shadow-lg p-6 print:shadow-none print:border print:border-gray-200">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">📖</span>
                  <div>
                    <Link 
                      href="https://hazon.org/wp-content/uploads/2020/11/Greening-Hanukkah-2020-Final-1.pdf"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Hazon: Greening Chanukah - Make it a Plant-Forward Meal (2020)
                    </Link>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">📖</span>
                  <div>
                    <Link 
                      href="https://blogs.timesofisrael.com/chanukah-and-veganism/"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Richard H. Schwartz: Chanukah and Veganism (2024)
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </section>

        </main>
      </div>

      {/* Call to Action */}
      <section className="py-16 px-4" style={{ backgroundColor: colors.deepBlue }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Chag Chanukah Sameach!</h2>
          <p className="text-xl text-blue-100 mb-8">
            May your Festival of Lights be filled with joy, compassion, and delicious vegan food.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ backgroundColor: colors.gold, color: colors.deepBlue }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Version
            </button>
            <Link
              href="/recipes"
              className="inline-flex items-center px-8 py-4 rounded-full font-semibold border-2 border-white text-white hover:bg-white transition-all duration-200"
              style={{ ['--tw-text-opacity' as string]: 1 }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.deepBlue}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Explore All Recipes
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          nav, footer, button, .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          section[style*="backgroundColor"] {
            background-color: transparent !important;
          }
        }
      `}</style>
    </div>
  );
}




