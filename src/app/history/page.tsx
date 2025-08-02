import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#E1F0D1] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">History of the JVS</h1>
            <p className="text-xl max-w-3xl mx-auto">
              How the Jewish Vegetarian Society began—and why it still matters today
            </p>
          </div>
        </div>
      </section>

      {/* Founding Story Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Founding Story</h2>
              <div className="prose prose-lg text-neutral-700">
                <p className="mb-6">
                  The Jewish Vegetarian Society (now JVS) was founded in the 1960s, sparked by a letter from Vivien Pick to <em>The Jewish Chronicle</em>. 
                  She asked whether there were other Jewish vegetarians interested in meeting up. The response led to the formation of a new community, 
                  with her father, Philip Pick—a lifelong advocate for a more compassionate world—as its first President.
                </p>
                <p className="mb-6">
                  Philip believed deeply in a society free from cruelty to both animals and humans. The Society quickly found common ground in Jewish teachings—particularly 
                  the Torah&apos;s emphasis on compassion and the idea that &ldquo;the herbs of the field&rdquo; were given to us for food. Many early members had felt alone in their discomfort 
                  with killing animals for food; now, they had a community where their values aligned with their faith.
                </p>
                <p>
                  The first JVS meetings were held in committee members&apos; homes around Highgate, north London. But it soon became clear that this was more than a small gathering—it 
                  was meeting a wider need. Thanks to a growing membership and several generous donations, the Society acquired a small property in Swiss Cottage.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <img 
                src="/images/history/philip-pick.png" 
                alt="Philip Pick, founder of JVS"
                className="w-full h-auto rounded-lg"
              />
              <p className="text-sm text-neutral-600 mt-3 text-center italic">
                Philip Pick, founder and first President of JVS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bet Teva Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-neutral-50 rounded-lg shadow-lg p-6">
              <img 
                src="/images/history/bet-teva.png" 
                alt="Bet Teva - House of Nature"
                className="w-full h-auto rounded-lg"
              />
              <p className="text-sm text-neutral-600 mt-3 text-center italic">
                Bet Teva (House of Nature) - JVS headquarters in Golders Green from the 1970s
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">A Home in Golders Green</h2>
              <div className="prose prose-lg text-neutral-700">
                <p className="mb-6">
                  In 1971, under Philip Pick&apos;s leadership, JVS moved into a new and larger space: <em>Bet Teva</em> (House of Nature), in Golders Green. 
                  This became the Society&apos;s official base and remains its office and event space today.
                </p>
                <p>
                  This move marked a significant milestone in JVS&apos;s growth, providing a permanent home for our community and a hub for all our activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Education Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Community, Education & Celebration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-primary-600 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Social Events</h3>
              <p className="text-neutral-600">
                Suppers, quizzes, parties, balls, concerts, and buffets brought our community together in celebration and friendship.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-primary-600 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Educational Programs</h3>
              <p className="text-neutral-600">
                Cookery classes, yoga sessions, and talks on nutrition, acupuncture, naturopathy, animal welfare, and environmental ethics.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-primary-600 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Themed Evenings</h3>
              <p className="text-neutral-600">
                &ldquo;Ask the Rabbi&rdquo; and &ldquo;Gardeners&apos; Question Time&rdquo; alongside monthly committee meetings with cookery demos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Publishing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Publishing & Spreading the Message</h2>
              <div className="prose prose-lg text-neutral-700">
                <p className="mb-6">
                  We launched a quarterly magazine, <em>The Jewish Vegetarian</em>, which was posted to all members and also sold in vegetarian-friendly shops 
                  including Holland & Barrett and W.H. Smith. It advertised events and shared recipes, articles, and thought pieces.
                </p>
                <p>
                  Over time, the Society attracted members from across the UK and around the world. Local chapters (&ldquo;branches&rdquo;) were founded in Europe, 
                  South Africa, Australia, the United States, South America, and Israel.
                </p>
              </div>
            </div>
            <div className="bg-neutral-50 rounded-lg shadow-lg p-6">
              <img 
                src="/images/history/jewish-vegetarian-magazine.png" 
                alt="The Jewish Vegetarian Magazine"
                className="w-full h-auto rounded-lg"
              />
              <p className="text-sm text-neutral-600 mt-3 text-center italic">
                The Jewish Vegetarian Magazine - our quarterly publication
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dining Room Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6 text-center">Feeding the Community</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">The Members&apos; Dining Room</h3>
                <div className="prose prose-lg text-neutral-700">
                  <p className="mb-6">
                    In 1980, JVS opened <em>The Members&apos; Dining Room</em>, a vegetarian restaurant open to the public as well as members. 
                    It served meals from Sunday to Thursday, both at lunch and dinner.
                  </p>
                  <p>
                    The restaurant also provided pre-ordered takeaway meals for Shabbat—a much-appreciated service for the community.
                  </p>
                </div>
              </div>
              <div className="bg-neutral-50 rounded-lg p-6">
                <img 
                  src="/images/history/dining-room.png" 
                  alt="The Members' Dining Room"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-3 text-center italic">
                  The Members&apos; Dining Room - serving the community since 1980
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* International Impact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">International Impact</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-neutral-50 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold mb-4">Expanding to Israel</h3>
              <div className="prose prose-lg text-neutral-700">
                <p className="mb-6">
                  In the early 1990s, a generous bequest from a long-standing member made it possible to establish an affiliated Society in Israel. 
                  The Vegetarian Community Centre was opened on Balfour Street in Jerusalem.
                </p>
                <p>
                  Today, this space continues as <em>Ginger</em>, a hub for potlucks, dinners, and vegan advocacy events.
                </p>
              </div>
            </div>
            <div className="bg-neutral-50 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold mb-4">Supporting Children at Risk</h3>
              <div className="prose prose-lg text-neutral-700">
                <p className="mb-6">
                  In 1984, JVS also began supporting <em>Orr Shalom</em>, a vegetarian children&apos;s home offering a safe haven for at-risk children and youth.
                </p>
                <p>
                  Orr Shalom has since grown into a national network supporting over 1,300 children in Israel. These children are cared for in foster homes, 
                  therapeutic family homes, girls&apos; homes, emergency care centres, and intensive support facilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">A Lasting Legacy</h2>
            <div className="prose prose-lg text-neutral-700 mx-auto">
              <p className="mb-6">
                Philip Pick passed away in 1992. Through his passion, charisma, and leadership, he had become the heart of the Society and a guiding force for many. 
                His legacy continues in everything JVS stands for today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 21st Century Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Into the 21st Century: Growth, Renewal and a Vegan Vision</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Modernisation & Growth</h3>
              <div className="prose prose-lg text-neutral-700">
                <p className="mb-6">
                  As we entered the 2000s, JVS continued to evolve—staying rooted in our founding values while embracing the tools and challenges of a new era. 
                  Interest in plant-based living was growing, and JVS was ready to meet the moment.
                </p>
                <p className="mb-6">
                  In 2011, we hired our first professional Director, Suzanne Barnard, who began a period of modernisation for the Society. Suzanne relaunched our website, 
                  refreshed <em>The Jewish Vegetarian</em> magazine, and expanded our events programme—laying the foundations for a more visible and vibrant JVS.
                </p>
                <p>
                  In 2014, Lara Balsam (formerly Smallman) took over as Director, leading the organisation for nearly a decade. Under Lara&apos;s leadership, JVS underwent a major transformation.
                </p>
              </div>
            </div>
            <div className="bg-neutral-50 rounded-lg shadow-lg p-6">
              <img 
                src="/images/history/modern1.jpeg" 
                alt="Modern JVS activities and events"
                className="w-full h-auto rounded-lg"
              />
              <p className="text-sm text-neutral-600 mt-3 text-center italic">
                Modern JVS events and community activities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Building Transformation</h3>
              <div className="prose prose-lg text-neutral-700">
                <p>
                  Lara oversaw a large-scale building project that gave us a state-of-the-art hall, a multi-use vegan kitchen, and a fully equipped conference room 
                  at our Golders Green base. These upgrades helped turn Bet Teva into a hub for community, education, and activism—welcoming people of all ages and backgrounds.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Becoming Vegan</h3>
              <div className="prose prose-lg text-neutral-700">
                <p>
                  It was also during Lara&apos;s tenure that JVS formally became a vegan organisation, recognising that cruelty-free vegetarianism is virtually impossible 
                  in the modern food system. This decision aligned our practices more fully with our values and ensured our events, resources, and messaging were ethically consistent and forward-looking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Michael Freedman Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-50 rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">A Constant Presence</h2>
            <div className="prose prose-lg text-neutral-700 mx-auto">
              <p className="mb-6">
                Throughout these changes, one constant has been Michael Freedman, who has played a critical role in JVS&apos;s journey. Michael began leading the Board of Trustees 
                from the 1980s through to the 2010s and continues to serve as our Treasurer to this day—at the age of 87.
              </p>
              <p>
                During times of financial uncertainty, Michael&apos;s commitment, wisdom and integrity helped ensure the Society&apos;s survival and long-term sustainability. 
                His quiet but vital leadership preserved the legacy of JVS and made its revival possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Today Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">JVS Today</h2>
              <div className="prose prose-lg text-neutral-700">
                <p className="mb-6">
                  In recent years, JVS has embraced digital platforms and social media to connect with a wider, younger audience. We&apos;ve hosted everything from 
                  vegan challah workshops and climate-focused seders to interfaith panels and plant-based cookery demos.
                </p>
                <p className="mb-6">
                  Today, our work continues from our home in Golders Green, while our community spans the UK and beyond. JVS is a place where Jewish values meet 
                  ecological awareness, where compassion for animals is celebrated, and where tradition inspires positive change.
                </p>
                <p>
                  We honour the legacy of our founders, leaders, and long-time members—and we invite you to help shape the next chapter.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <img 
                src="/images/history/modern2.jpeg" 
                alt="JVS community today"
                className="w-full h-auto rounded-lg"
              />
              <p className="text-sm text-neutral-600 mt-3 text-center italic">
                The JVS community today - continuing our mission
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 