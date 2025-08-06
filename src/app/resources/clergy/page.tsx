import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuickNav from '@/components/QuickNav';

export default function ClergyPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <QuickNav />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            🙏 Vegan Jewish Clergy
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            A directory of rabbis and spiritual leaders who support plant-based living within Jewish tradition
          </p>
          <div className="w-24 h-1 bg-purple-500 mx-auto mt-8 rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        


        {/* All Clergy Members */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Vegan Jewish Clergy Directory
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Aaron Goldstein</h3>
              <p className="text-purple-600 font-medium mb-2">Liberal Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Senior Rabbi of Northwood Pinner Liberal Synagogue and Chair of the Conference of Liberal Rabbis and Cantors
              </p>
              <p className="text-gray-500 text-xs">Croxley Green, UK</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Adam Frank</h3>
              <p className="text-purple-600 font-medium mb-2">Conservative Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Social activism and community engagement
              </p>
              <p className="text-gray-500 text-xs">Jerusalem, Israel</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Adam Grossman</h3>
              <p className="text-purple-600 font-medium mb-2">Reform Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Director, North American (NA) Audience Engagement, Union for Reform Judaism
              </p>
              <p className="text-gray-500 text-xs">USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Alex Shuval-Weiner</h3>
              <p className="text-purple-600 font-medium mb-2">Reform Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Senior Rabbi at Temple Beth Tikvah
              </p>
              <p className="text-gray-500 text-xs">Los Angeles, CA, USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Ari Hart</h3>
              <p className="text-purple-600 font-medium mb-2">Modern Orthodox</p>
              <p className="text-gray-600 text-sm mb-4">
                Rabbi at Skokie Valley Agudath Jacob Synagogue
              </p>
              <p className="text-gray-500 text-xs">Skokie Valley, IL, USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👩‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Ariann Weitzman</h3>
              <p className="text-purple-600 font-medium mb-2">Reconstructionist Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Associate Rabbi and Director of Congregational Learning, Bnai Keshet Reconstructionist Synagogue
              </p>
              <p className="text-gray-500 text-xs">Montclair, NJ, USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👩‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Beth Kramer-Mazer</h3>
              <p className="text-purple-600 font-medium mb-2">Reform Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Rabbi-Educator at Temple Sinai of Bergen County
              </p>
              <p className="text-gray-500 text-xs">Bergen County, NJ, USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Binyamin (Ben) Biber</h3>
              <p className="text-purple-600 font-medium mb-2">Humanist Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Humanist Chaplain at American University
              </p>
              <p className="text-gray-500 text-xs">Washington, DC, USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi David Rosen</h3>
              <p className="text-purple-600 font-medium mb-2">Orthodox Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                International Director of Interreligious Affairs, AJC. President, Religions for Peace. Hon. President, International Jewish Vegetarian and Ecological Society.
              </p>
              <p className="text-gray-500 text-xs">Jerusalem, Israel</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👩‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Eliana Light</h3>
              <p className="text-purple-600 font-medium mb-2">Jewish Service Leader</p>
              <p className="text-gray-600 text-sm mb-4">
                Professional Jewish service leader, sacred musician, song-writer and educator
              </p>
              <p className="text-gray-500 text-xs">Durham, NC, USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Gersh Zylberman</h3>
              <p className="text-purple-600 font-medium mb-2">Reform Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Senior Rabbi at Temple Bat Yahm
              </p>
              <p className="text-gray-500 text-xs">Newport Beach, CA, USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Joel Pitkowsky</h3>
              <p className="text-purple-600 font-medium mb-2">Conservative Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Rabbi at Congregation Beth Shalom
              </p>
              <p className="text-gray-500 text-xs">Teaneck, NJ, USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Lior Bar-Ami</h3>
              <p className="text-purple-600 font-medium mb-2">Liberal/Reform Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Congregational Rabbi at the Jewish Liberal Community Or Chadasch
              </p>
              <p className="text-gray-500 text-xs">Vienna, Austria</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Reuven Greenvald</h3>
              <p className="text-purple-600 font-medium mb-2">Progressive/Pluralistic</p>
              <p className="text-gray-600 text-sm mb-4">
                Director of Israel Engagement, Union for Reform Judaism
              </p>
              <p className="text-gray-500 text-xs">New York, NY, USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👩‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Rayna Gevurtz</h3>
              <p className="text-purple-600 font-medium mb-2">Reform Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Rabbi at Temple Bat Yahm
              </p>
              <p className="text-gray-500 text-xs">Newport Beach, CA, USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👩‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Robyn Ashworth-Steen</h3>
              <p className="text-purple-600 font-medium mb-2">Reform Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Rabbi at Manchester Reform Synagogue
              </p>
              <p className="text-gray-500 text-xs">Manchester, UK</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👩‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Sandra Lawson</h3>
              <p className="text-purple-600 font-medium mb-2">Reconstructionist Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Associate Chaplain for Jewish Life at Elon University
              </p>
              <p className="text-gray-500 text-xs">Burlington, NC, USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Shmuly Yanklowitz</h3>
              <p className="text-purple-600 font-medium mb-2">Modern Orthodox</p>
              <p className="text-gray-600 text-sm mb-4">
                President & Dean of the Valley Beit Midrash, Founder & President of Uri L&apos;Tzedek, Founder and CEO of Shamayim, Founder and President of YATOM
              </p>
              <p className="text-gray-500 text-xs">Scottsdale, AZ, USA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👩‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Kohenet Yael Tischler</h3>
              <p className="text-purple-600 font-medium mb-2">Progressive, Earth-based, Feminist</p>
              <p className="text-gray-600 text-sm mb-4">
                Priestess at Yelala, Student Rabbi at Leo Baeck College
              </p>
              <p className="text-gray-500 text-xs">London, UK</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Yisroel Bernath</h3>
              <p className="text-purple-600 font-medium mb-2">Chabad</p>
              <p className="text-gray-600 text-sm mb-4">
                Spiritual Director at Rohr Chabad NDG and Associate Chaplain at Concordia University
              </p>
              <p className="text-gray-500 text-xs">Montreal, Canada</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <div className="text-3xl mb-4">👨‍🦳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rabbi Yonatan Neril</h3>
              <p className="text-purple-600 font-medium mb-2">Orthodox Judaism</p>
              <p className="text-gray-600 text-sm mb-4">
                Founder and Director of the Interfaith Center for Sustainable Development
              </p>
              <p className="text-gray-500 text-xs">Jerusalem, Israel</p>
            </div>
          </div>
        </section>

        {/* Denominations */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Represented Denominations
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-3xl mb-4">🕊️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reform</h3>
              <p className="text-gray-600 text-sm">Progressive Jewish practice</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-3xl mb-4">⚖️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Conservative</h3>
              <p className="text-gray-600 text-sm">Traditional yet modern approach</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-3xl mb-4">📜</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Orthodox</h3>
              <p className="text-gray-600 text-sm">Traditional Jewish observance</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-3xl mb-4">🌟</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Reconstructionist</h3>
              <p className="text-gray-600 text-sm">Evolving Jewish civilization</p>
            </div>
          </div>
        </section>



        {/* Call to Action */}
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Supporting Jewish Vegan Values
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            This directory represents clergy who publicly support the alignment of Jewish values with plant-based living. 
            Their presence demonstrates the growing recognition within the Jewish community of the ethical, environmental, 
            and health benefits of veganism.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/resources"
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📚 Back to Resources
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📞 Contact JVS
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 