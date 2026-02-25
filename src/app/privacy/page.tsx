import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import { fetchStaticPageByRoute } from '@/lib/staticPages/sanity';
import { getEmailSettingsForAppRouter } from '@/lib/appRouterUtils';
import { EmailSettings } from '@/lib/getEmailSettings';

interface PrivacyPageProps {
  emailSettings: EmailSettings;
}

export default async function PrivacyPage({ emailSettings }: PrivacyPageProps) {
  const sp = await fetchStaticPageByRoute('/privacy');
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#E1F0D1] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{sp?.heroTitle || 'Privacy Policy'}</h1>
            <p className="text-xl max-w-3xl mx-auto">
              {sp?.heroSubtitle || 'How we collect, use, and protect your information'}
            </p>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose max-w-none">
              {sp?.body ? (
                <PortableTextRenderer value={sp.body} />
              ) : (
                <>
                  <h2>Information We Collect</h2>
                  <p>We collect information you provide directly to us, such as when you:</p>
                  <ul>
                    <li>Sign up for our newsletter</li>
                    <li>Purchase event tickets</li>
                    <li>Contact us through our website</li>
                    <li>Join our membership</li>
                  </ul>
                  <h2>How We Use Your Information</h2>
                  <p>We use the information we collect to:</p>
                  <ul>
                    <li>Provide and maintain our services</li>
                    <li>Process your event registrations and ticket purchases</li>
                    <li>Send you updates about events and activities</li>
                    <li>Respond to your inquiries and support requests</li>
                    <li>Improve our website and services</li>
                  </ul>
                  <h2>Information Sharing</h2>
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
                  </p>
                  <h2>Data Security</h2>
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <h2>Your Rights</h2>
                  <p>You have the right to:</p>
                  <ul>
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt out of marketing communications</li>
                  </ul>
                  <h2>Contact Us</h2>
                  <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                  <p>
                    <strong>Email:</strong> {emailSettings.privacyEmail}
                    <br />
                    <strong>Address:</strong> Jewish Vegan Society, 853 Finchley Road, London, NW11 1LX
                  </p>
                  <p className="text-sm text-gray-600 mt-8">
                    <em>Last updated: July 2025</em>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// This function runs at build time and fetches email settings
export async function generateStaticParams() {
  try {
    const emailSettings = await getEmailSettingsForAppRouter();
    console.log('Building privacy page with email:', emailSettings.privacyEmail);
  } catch (error) {
    console.warn('Failed to fetch email settings for privacy page:', error);
  }
  
  return [];
} 