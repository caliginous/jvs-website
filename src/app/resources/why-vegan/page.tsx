import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuickNav from '@/components/QuickNav';

export default function WhyVeganPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <QuickNav />
      
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Veganism Makes Sense in Judaism
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Jewish tradition promotes values that align naturally with a vegan lifestyle.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Judaism and Veganism: Natural Partners
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Judaism and veganism go hand in hand. Included in their common ideals are kindness to animals, 
            promotion of other mitzvot, the way of life before Noah, and aspiration for the future.
          </p>
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Key Jewish Values</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Tza&apos;ar ba&apos;alei chayim - Preventing animal suffering</li>
              <li>• Bal tashchit - Avoiding waste and protecting the Earth</li>
              <li>• Pikuach nefesh - Guarding human life and health</li>
              <li>• Tzedakah - Using food systems to reduce hunger</li>
            </ul>
          </div>
        </div>

        {/* Kindness to Animals Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" id="kindness">
            1. Kindness to Animals (Tza&apos;ar ba&apos;alei chayim)
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Consideration for the well-being of animals features in several Torah commandments. The Torah teaches us to prevent unnecessary suffering and to treat all living creatures with compassion.
          </p>
          
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Biblical Examples:</h4>
            <div className="space-y-3 text-gray-700">
              <p><strong>Exodus 23:5:</strong> &ldquo;If thou see the ass of him that hateth thee lying under its burden, thou shalt forebear to pass by him; thou shalt surely release it with him.&rdquo;</p>
              <p><strong>Deuteronomy 25:4:</strong> &ldquo;Thou shall not muzzle the ox when he treadeth the corn.&rdquo;</p>
              <p><strong>Deuteronomy 5:14:</strong> The Sabbath rest extends to animals: &ldquo;the seventh day is a Sabbath unto the Lord thy God, in it thou shall not do any manner of work, thou, nor thy son, nor thy daughter, nor thy man-servant, nor thy maid-servant, nor thine ox, nor thine ass, nor any of thy cattle...&rdquo;</p>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Rabbinic Teachings:</h4>
            <div className="space-y-4 text-gray-700">
              <blockquote className="border-l-4 border-yellow-400 pl-4 italic">
                &ldquo;It is prohibited to kill an animal with its young on the same day, in order that people should be restrained and prevented from killing the two together in such a manner that the young is slain in the sight of the mother; for the pain of animals under such circumstances is very great. There is no difference in this case between the pain of people and the pain of other living beings.&rdquo;
                <footer className="text-sm mt-2">— Maimonides, Guide for the Perplexed, 3:48</footer>
              </blockquote>
              
              <blockquote className="border-l-4 border-yellow-400 pl-4 italic">
                &ldquo;It is forbidden, according to the law of the Torah, to inflict pain upon any living creature. On the contrary, it is our duty to relieve pain of any creature, even if it is ownerless or belongs to a non-Jew.&rdquo;
                <footer className="text-sm mt-2">— Rabbi Solomon Granzfried, Code of Jewish Law</footer>
              </blockquote>
              
              <blockquote className="border-l-4 border-yellow-400 pl-4 italic">
                &ldquo;G-d&apos;s teaching, which obliges you not only to refrain from inflicting unnecessary pain on any animal, but to help and, when you can, to lessen the pain whenever you see an animal suffering, even though no fault of yours.&rdquo;
                <footer className="text-sm mt-2">— Rabbi Samson Raphael Hirsch, Horeb</footer>
              </blockquote>
            </div>
          </div>

          <p className="text-gray-700">
            Jewish tradition is filled with compassion for animals. Many commentators, drawing on the statement, 
            &ldquo;<em>A righteous man regardeth the life of his beast</em>&rdquo; (Proverbs 12:10), argue that it is impossible 
            to be righteous if one is unkind to animals.
          </p>
        </div>

        {/* Support for Other Mitzvot Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" id="mitzvot">
            2. Support for Other Mitzvot
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Jewish Law requires us to give food to the hungry, protect the environment, conserve natural resources, 
            and preserve human health. In each case, vegetarianism accords with these requirements while meat-eating 
            practices often conflict with them.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3" id="hungry">Giving Food to the Hungry</h4>
              <p className="text-gray-700 mb-3">
                In the Passover Haggadah we read, <em>&ldquo;This is the bread of affliction which our ancestors ate in the land of Egypt. Let all who are hungry come and eat&rdquo;</em>, and the Talmud states that <em>&ldquo;Providing charity for poor and hungry people weighs as heavily as all the other commandments of the Torah combined&rdquo;</em> (Baba Batra 9a).
              </p>
              <p className="text-gray-700">
                Jean Mayer, a leading twentieth-century expert on hunger issues, showed how vegetarianism can help fulfil this mitzvah when he estimated that if people reduced their meat consumption by just 10 percent, enough grain would be released to feed 60 million people.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3" id="environment">Protecting the Environment</h4>
              <p className="text-gray-700 mb-3">
                The Talmud asserts that people&apos;s role is to enhance the world as &ldquo;co-partners of G-d in the work of creation&rdquo; (Shabbat 7a). The Midrash teaches us to think upon G-d&apos;s works and not destroy or desolate the world.
              </p>
              <p className="text-gray-700">
                A 2006 report by the United Nations Food and Agriculture Organization (FAO) stated that animal agriculture is &ldquo;one of the top two or three most significant contributors to the most serious environmental problems, at every scale from local to global.&rdquo; The FAO estimates that livestock production is responsible for up to 18% of global greenhouse gas emissions, with more recent estimates putting the figure as high as 51%.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3" id="resources">Conserving Natural Resources</h4>
              <p className="text-gray-700 mb-3">
                The Psalms celebrate the harmony of creation and the provision of water for all living beings. The harmony of vegetarianism with these sentiments is emphatically illustrated by the statistical estimate that 634 gallons of fresh water are required to produce a single beef burger.
              </p>
              <p className="text-gray-700">
                In short, reducing meat consumption saves water and aligns with Jewish values of stewardship over creation.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3" id="health">Preserving Human Health</h4>
              <p className="text-gray-700 mb-3">
                In the Mishneh Torah, Maimonides stated: &ldquo;Since maintaining a healthy and sound body is among the ways of G-d – for one cannot understand or have knowledge of the Creator if one is ill – therefore one must avoid that which harms the body and accustom oneself to that which is helpful and helps the body become stronger.&rdquo;
              </p>
              <p className="text-gray-700">
                A recent study carried out at Oxford University found that eating meat no more than three times a week could prevent 31,000 deaths from heart disease, 9,000 deaths from cancer, and 5,000 deaths from stroke, as well as save the NHS £1.2 billion in costs each year.
              </p>
            </div>
          </div>
        </div>

        {/* Original Intention Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" id="intention">
            3. The Original Intention: Life Before Noah
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Many leading Jewish commentators throughout the ages have held that G-d originally intended human beings to be vegetarian. They argue that the permission to eat meat given to the generation of Noah after the flood was only a temporary concession.
          </p>

          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">The Original Diet in Genesis:</h4>
            <blockquote className="border-l-4 border-green-400 pl-4 italic text-gray-700">
              &ldquo;And G-d said: &apos;Behold, I have given you every herb yielding seed, which is upon the face of all the earth, and every tree, in which is the fruit of a tree yielding seed – to you it shall be for food; and to every beast of the earth, and to every foul of the air, and to every thing that creepeth upon the earth, wherein there is a living soul, [I have given] every green herb for food.&apos; And it was so.&rdquo;
              <footer className="text-sm mt-2">— Genesis 1:29-30</footer>
            </blockquote>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Commentaries on the Original Vegetarian Diet:</h4>
            <div className="space-y-4 text-gray-700">
              <blockquote className="border-l-4 border-yellow-400 pl-4 italic">
                &ldquo;G-d did not permit Adam and his wife to kill a creature and to eat its flesh, but all alike were to eat herbs.&rdquo;
                <footer className="text-sm mt-2">— Rashi (1040-1105)</footer>
              </blockquote>
              
              <blockquote className="border-l-4 border-yellow-400 pl-4 italic">
                &ldquo;Living creatures possess a moving soul and a certain spiritual superiority which in this respect make them similar to those who possess intellect (people) and they have the power of affecting their welfare and their food and they flee from pain and death.&rdquo;
                <footer className="text-sm mt-2">— Nachmanides (1194-1270)</footer>
              </blockquote>
              
              <blockquote className="border-l-4 border-yellow-400 pl-4 italic">
                &ldquo;In the killing of animals there is cruelty, rage, and the accustoming of oneself to the bad habit of shedding innocent blood...&rdquo;
                <footer className="text-sm mt-2">— Rabbi Joseph Albo (died 1444)</footer>
              </blockquote>
              
              <blockquote className="border-l-4 border-yellow-400 pl-4 italic">
                &ldquo;You are permitted to use the animals and employ them for work, have dominion over them in order to utilize their services for your subsistence, but must not hold their life cheap nor slaughter them for food. Your natural diet is vegetarian...&rdquo;
                <footer className="text-sm mt-2">— Moses Cassuto (1883-1951)</footer>
              </blockquote>
            </div>
          </div>

          <p className="text-gray-700">
            It is also stated in the Talmud that <em>&ldquo;Adam was not permitted meat for purposes of eating&rdquo;</em> (Sanhedrin 59b). 
            The permission to eat meat after the flood was not unconditional and came with immediate restrictions, such as the 
            prohibition against eating blood (Genesis 9:4).
          </p>
        </div>

        {/* Aspirational Future Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6" id="aspirational">
            4. Aspiration for the Future: The Messianic Vision
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Many commentators believe that in the days of the Messiah, people will again be vegetarians, returning to the original 
            ideal state of harmony between all living beings.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">The Messianic Vision in Isaiah:</h4>
            <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-700">
              &ldquo;And the wolf shall dwell with the lamb,<br />
              And the leopard shall lie down with the kid;<br />
              And the calf and the young lion and the fatling together;<br />
              And a little child shall lead them.<br />
              And the cow and the bear shall feed;<br />
              Their young ones shall lie down together;<br />
              And the lion shall eat straw like the ox...<br />
              They shall not hurt nor destroy in all My holy mountain.&rdquo;
              <footer className="text-sm mt-2">— Isaiah 11:6-9</footer>
            </blockquote>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Rabbinic Interpretations:</h4>
            <div className="space-y-4 text-gray-700">
              <blockquote className="border-l-4 border-purple-400 pl-4 italic">
                &ldquo;In the primitive ideal age (as also in the Messianic future …), the animals were not to prey on one another.&rdquo;
                <footer className="text-sm mt-2">— Rabbi Joseph Hertz</footer>
              </blockquote>
              
              <blockquote className="border-l-4 border-purple-400 pl-4 italic">
                &ldquo;The effect of knowledge will spread even to animals...and sacrifices in the Temple will consist of vegetation, and it will be pleasing to God as in days of old...&rdquo;
                <footer className="text-sm mt-2">— Isaac Arama (1420-1494) and Rabbi Abraham Isaac Kook</footer>
              </blockquote>
              
              <blockquote className="border-l-4 border-purple-400 pl-4 italic">
                &ldquo;A day will come when people will detest the eating of the flesh of animals because of a moral loathing, and then it shall be said that &apos;because your soul does not long to eat meat, you will not eat meat.&apos;&rdquo;
                <footer className="text-sm mt-2">— Rabbi Abraham Isaac Kook</footer>
              </blockquote>
            </div>
          </div>

          <p className="text-gray-700">
            Rabbi Kook believed that the high moral level involved in the vegetarianism of the generations before Noah is a virtue 
            of such great value that it cannot be lost forever. The laws of kashrut, while permitting some meat consumption, 
            greatly limited people&apos;s permission to eat meat and served as a constant reminder of the concession and compromise 
            that eating meat represents.
          </p>
        </div>

        {/* Additional Resources Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Further Reading and Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Recommended Reading:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• <a href="https://archive.org/stream/JewishVegetarianism#page/n0/mode/2up" className="text-green-600 hover:text-green-800 underline">A Case for Jewish Vegetarianism</a> - endorsed by JVS Patron Rabbi David Rosen</li>
                <li>• <a href="http://www.jewishvirtuallibrary.org/jsource/Judaism/rabbinicveg.html" className="text-green-600 hover:text-green-800 underline">Rabbinic teachings on Judaism and vegetarianism</a></li>
                <li>• <a href="http://www.jewishveg.com/schwartz" className="text-green-600 hover:text-green-800 underline">Professor Richard Schwartz&apos;s webpage</a></li>
                <li>• <a href="http://www.jewishveg.com" className="text-green-600 hover:text-green-800 underline">Jewish Vegetarians of North America</a></li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Related Topics:</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• <Link href="/resources/feeding-the-world" className="text-green-600 hover:text-green-800 underline">Feeding the World</Link></li>
                <li>• <Link href="/resources/environment" className="text-green-600 hover:text-green-800 underline">Environmental Impact</Link></li>
                <li>• <Link href="/resources/health" className="text-green-600 hover:text-green-800 underline">Health Benefits</Link></li>
                <li>• <Link href="/resources/faqs" className="text-green-600 hover:text-green-800 underline">Jewish and Vegan FAQs</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 