import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#E1F0D1] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl max-w-3xl mx-auto">
              The terms and conditions for using our website and services
            </p>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose max-w-none">
              <h2>Acceptance of Terms</h2>
              <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2>Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on JVS&apos;s website for personal, non-commercial transitory viewing only.
              </p>

              <h2>Event Registration and Tickets</h2>
              <p>
                When registering for events or purchasing tickets:
              </p>
              <ul>
                <li>All ticket sales are final unless otherwise stated</li>
                <li>Refunds are subject to our refund policy</li>
                <li>Event details may be subject to change</li>
                <li>We reserve the right to cancel events due to circumstances beyond our control</li>
              </ul>

              <h2>Membership</h2>
              <p>
                Membership benefits and terms are subject to change. We will notify members of any significant changes to membership terms or benefits.
              </p>

              <h2>User Conduct</h2>
              <p>
                You agree not to:
              </p>
              <ul>
                <li>Use the website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper working of the website</li>
                <li>Transmit any harmful or malicious code</li>
              </ul>

              <h2>Intellectual Property</h2>
              <p>
                The content on this website, including text, graphics, logos, and images, is the property of JVS and is protected by copyright laws.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                JVS shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the website or services.
              </p>

              <h2>Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the United Kingdom.
              </p>

              <h2>Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website.
              </p>

              <h2>Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> legal@jvs.org.uk<br />
                <strong>Address:</strong> Jewish Vegetarian Society, 853 Finchley Road, London, NW11 1LX
              </p>

              <p className="text-sm text-gray-600 mt-8">
                <em>Last updated: July 2025</em>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 