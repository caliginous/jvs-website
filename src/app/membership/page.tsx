import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-12">
        
        {/* Hero / Introduction Section */}
        <section aria-label="Support JVS Introduction">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#263238] mb-6">Support JVS</h1>
            <p className="text-lg leading-relaxed text-[#263238]">
              The Jewish Vegetarian Society (JVS) relies on the generous support of people like you to keep our work going.
            </p>
            <p className="text-lg leading-relaxed text-[#263238] mt-4">
              We&apos;ve moved away from formal memberships and now invite you to support us monthly through Patreon — a simple way to sustain our mission and grow our impact together.
            </p>
          </div>
        </section>

        {/* Why Support JVS Section */}
        <section aria-label="Why Support JVS">
          <h2 className="text-2xl font-semibold text-[#263238] mb-6">Why Support JVS?</h2>
          <p className="text-base leading-relaxed text-[#263238] mb-6">
            Your monthly support helps us:
          </p>
          <ul className="space-y-3 text-base leading-relaxed text-[#263238]">
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              Run free and low-cost vegan events and workshops
            </li>
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              Create resources exploring veganism, Jewish values, animal ethics, and sustainability
            </li>
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              Develop engaging content like Friday Night Dinner packs and Jewish holiday guides
            </li>
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              Provide micro-grants to support students and campus communities
            </li>
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              Maintain our online magazine, recipe archive, and learning materials
            </li>
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              Amplify diverse voices across the Jewish vegan community
            </li>
          </ul>
        </section>

        {/* Patron Benefits Section */}
        <section aria-label="Patron Benefits">
          <h2 className="text-2xl font-semibold text-[#263238] mb-6">What You Receive as a Patron</h2>
          <p className="text-base leading-relaxed text-[#263238] mb-6">
            By supporting us through Patreon, you&apos;ll stay closely connected to the JVS community. Our patrons receive:
          </p>
          <ul className="space-y-3 text-base leading-relaxed text-[#263238] mb-6">
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              Early access to event registration and discounted tickets
            </li>
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              Exclusive digital content and behind-the-scenes updates
            </li>
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              Optional name acknowledgments in newsletters
            </li>
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              The satisfaction of sustaining compassionate, community-rooted activism
            </li>
          </ul>
          <p className="text-base leading-relaxed text-[#263238]">
            Your support helps us remain free, independent, and powered by people who care.
          </p>
        </section>

        {/* Become a Patron Section */}
        <section aria-label="Become a Patron">
          <h2 className="text-2xl font-semibold text-[#263238] mb-6">Become a Patron</h2>
          <p className="text-base leading-relaxed text-[#263238] mb-8">
            Your monthly contribution — even just £3 — makes a real difference.
          </p>
          <a
            href="https://www.patreon.com/jvs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#8BC34A] hover:bg-[#558B2F] text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            aria-label="Become a Patron on Patreon"
          >
            Become a Patron
          </a>
        </section>

        {/* Historic Life Members Section */}
        <section aria-label="For Historic Life Members" className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-[#263238] mb-6">For Historic Life Members</h2>
          <p className="text-base leading-relaxed text-[#263238] mb-6">
            JVS no longer offers new Life Memberships, but we are deeply grateful to those who supported us in this way in the past.
          </p>
          <p className="text-base leading-relaxed text-[#263238] mb-6">
            If you are a historic Life Member and would like to:
          </p>
          <ul className="space-y-2 text-base leading-relaxed text-[#263238] mb-8">
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              Update your contact details
            </li>
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              Continue receiving our newsletter and updates
            </li>
            <li className="flex items-start">
              <span className="text-[#FFCA28] mr-3 mt-1">•</span>
              Stay in touch with the JVS community
            </li>
          </ul>
          <p className="text-base leading-relaxed text-[#263238] mb-6">
            Please click the link below to update your information:
          </p>
          <a
            href="https://forms.gle/aSdksqucxVFE8oHy9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-[#8BC34A] text-[#8BC34A] hover:bg-[#8BC34A] hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            aria-label="Update your Life Member details"
          >
            Update Your Details
          </a>
        </section>

        {/* Legacy Giving Section */}
        <section aria-label="Leave a Lasting Legacy" className="bg-[#DCECC9] rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-[#263238] mb-6">Leave a Lasting Legacy</h2>
          <p className="text-base leading-relaxed text-[#263238] mb-6">
            By remembering JVS in your will, you help ensure that our work can continue for generations to come. A legacy gift is one of the most meaningful ways to support our mission.
          </p>
          <p className="text-base leading-relaxed text-[#263238] mb-6">
            We recommend speaking with a solicitor or professional advisor. If you would like to include JVS in your will, please use the following suggested wording:
          </p>
          <blockquote className="bg-white p-6 rounded-lg border-l-4 border-[#8BC34A] mb-6">
            <p className="text-base leading-relaxed text-[#263238] italic">
              I leave the sum of £___ (or ___% of my estate) to The Jewish Vegetarian Society, Registered Charity Number 258581, of 853–855 Finchley Road, London NW11 8LX, to be used for its general charitable purposes.
            </p>
          </blockquote>
          <p className="text-base leading-relaxed text-[#263238] mb-6">
            If you are considering a legacy or would like to speak to someone, please contact us directly.
          </p>
          <a
            href="mailto:info@jvs.org.uk"
            className="inline-block bg-[#4FC3F7] hover:bg-[#1976D2] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            aria-label="Contact us about leaving a legacy"
          >
            Contact us about leaving a legacy
          </a>
        </section>

      </main>

      <Footer />
    </div>
  );
} 