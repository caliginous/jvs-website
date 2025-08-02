'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function VenueHirePage() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    mobile: '',
    email: '',
    spaces: '',
    dates: '',
    times: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/venue-hire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          organization: '',
          mobile: '',
          email: '',
          spaces: '',
          dates: '',
          times: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#E1F0D1] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Venue Hire</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Host your next event at our beautiful venue in Golders Green
            </p>
          </div>
        </div>
      </section>

      {/* Venue Overview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Our Venue</h2>
              <div className="prose prose-lg text-neutral-700">
                <p className="mb-6">
                  Located at 853-855 Finchley Road, London, NW11 8LX, our venue offers versatile spaces perfect for a wide range of events. 
                  Our facilities are strictly vegan with no exceptions, and we&apos;re on hand to offer advice and guidance for your event.
                </p>
                <p>
                  Any profit made from hiring our facilities is used to support the work of the JVS. We&apos;re happy to host most events 
                  and invite you to get in touch with us first to check suitability.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <img 
                src="/images/venue-hire/HallEmpty.png" 
                alt="JVS Venue - Main Hall"
                className="w-full h-auto rounded-lg"
              />
              <p className="text-sm text-neutral-600 mt-3 text-center italic">
                Our spacious main hall - perfect for any event
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Spaces */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Available Spaces</h2>
          
          {/* Main Hall */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">The Main Hall</h3>
                <p className="text-neutral-600 mb-4">
                  Our newly refurbished versatile hall is suitable for meetings, training, conferences, AGM&apos;s, yoga, meditation, workshops, classes, pop-up restaurants, prayer services and more.
                </p>
                <ul className="text-sm text-neutral-600 mb-6">
                  <li>• 80 people around dining tables</li>
                  <li>• 100+ people in conference setup</li>
                  <li>• 96 square meters (1050 sq ft)</li>
                  <li>• High spec projector & speakers</li>
                  <li>• Free wifi included</li>
                  <li>• Available 9am-10pm daily</li>
                </ul>
              </div>
              <div className="bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/HallConferenceSetup.png" 
                  alt="Main Hall - Conference Setup"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Conference setup - seats 100+ people
                </p>
              </div>
            </div>
            
            {/* Hall Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/HallPartyTables.png" 
                  alt="Main Hall - Party Tables Setup"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Party tables setup
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/HallwithTablesandChairs.png" 
                  alt="Main Hall - Tables and Chairs"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Flexible table and chair arrangement
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/HallYogaSetup.png" 
                  alt="Main Hall - Yoga Setup"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Yoga and meditation setup
                </p>
              </div>
            </div>
          </div>

          {/* Kitchen */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl font-semibold mb-4">The Kitchen</h3>
                <p className="text-neutral-600 mb-4">
                  Fully kitted-out kitchen available for demo kitchen, pop-ups or catering. All food must be vegan.
                </p>
                <ul className="text-sm text-neutral-600 mb-6">
                  <li>• 31 square meters (330 sq ft)</li>
                  <li>• 3 ovens, 5 hobs, 3 fridges</li>
                  <li>• Large urn, microwave, blender</li>
                  <li>• Fully stocked with equipment</li>
                  <li>• Tea and coffee provided</li>
                  <li>• Hand washing station</li>
                </ul>
              </div>
              <div className="order-1 lg:order-2 bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/Kitchen1.png" 
                  alt="Kitchen - Main View"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Fully equipped commercial kitchen
                </p>
              </div>
            </div>
            
            {/* Kitchen Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/Kitchen2.png" 
                  alt="Kitchen - Equipment"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Professional cooking equipment
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/Kitchen3.png" 
                  alt="Kitchen - Preparation Area"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Food preparation area
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/Kitchen4.png" 
                  alt="Kitchen - Additional Equipment"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Additional kitchen facilities
                </p>
              </div>
            </div>
          </div>

          {/* Boardroom */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">The Boardroom</h3>
                <p className="text-neutral-600 mb-4">
                  State of the art boardroom suitable for business meetings, presentations, board meetings, and training.
                </p>
                <ul className="text-sm text-neutral-600 mb-6">
                  <li>• Comfortably seats 15 people</li>
                  <li>• Smart TV recently installed</li>
                  <li>• Free wifi included</li>
                  <li>• Direct access to patio</li>
                  <li>• Professional environment</li>
                  <li>• Garden access (when booked)</li>
                </ul>
              </div>
              <div className="bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/BoardRoom.png" 
                  alt="Boardroom"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Professional boardroom for meetings and presentations
                </p>
              </div>
            </div>
          </div>

          {/* Garden */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl font-semibold mb-4">The Garden</h3>
                <p className="text-neutral-600 mb-4">
                  Tranquil and spacious garden available for events. Can be combined with kitchen, boardroom and library access.
                </p>
                <ul className="text-sm text-neutral-600 mb-6">
                  <li>• 324 square meters total area</li>
                  <li>• Space for large marquee</li>
                  <li>• Blank canvas for events</li>
                  <li>• Includes main hall access</li>
                  <li>• Beautiful outdoor setting</li>
                  <li>• Perfect for summer events</li>
                </ul>
              </div>
              <div className="order-1 lg:order-2 bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/GardenPlants.png" 
                  alt="Garden - Plants and Greenery"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Beautiful garden setting with plants and greenery
                </p>
              </div>
            </div>
            
            {/* Garden Image Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/GardenGroupofPeople.png" 
                  alt="Garden - Group Event"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Perfect for group events and gatherings
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/OutsideMarqueeinGarden.png" 
                  alt="Garden - Outside Marquee"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Space for marquee events
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg shadow-md p-4">
                <img 
                  src="/images/venue-hire/InsideMarqueeinGarden.png" 
                  alt="Garden - Inside Marquee"
                  className="w-full h-auto rounded-lg"
                />
                <p className="text-sm text-neutral-600 mt-2 text-center italic">
                  Indoor-outdoor event space
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Venue Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Location & Access</h3>
              <ul className="text-neutral-600 space-y-2">
                <li>• 853-855 Finchley Road, London, NW11 8LX</li>
                <li>• Free on-site parking for up to 5 cars</li>
                <li>• Two ground floor toilets</li>
                <li>• Additional accessible toilet coming soon</li>
                <li>• Available 9am-10pm, seven days a week</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Main Hall Equipment</h3>
              <ul className="text-neutral-600 space-y-2">
                <li>• High spec projector, speakers and mixer</li>
                <li>• HDMI and music cables provided</li>
                <li>• Corded microphone and microphone stand</li>
                <li>• 80 chairs and 10 large tables</li>
                <li>• Tablecloths and coat storage</li>
                <li>• Free wifi throughout</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Kitchen Equipment</h3>
              <ul className="text-neutral-600 space-y-2">
                <li>• 3 ovens, 5 hobs, 3 fridges, 1 freezer</li>
                <li>• Large urn, microwave, blender, food processor</li>
                <li>• Two hotplates</li>
                <li>• Fully stocked with crockery and utensils</li>
                <li>• Tea and coffee provided</li>
                <li>• Hand washing station</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Policies & Support</h3>
              <ul className="text-neutral-600 space-y-2">
                <li>• Strictly vegan venue - no exceptions</li>
                <li>• Music allowed (respectful to neighbors)</li>
                <li>• Hall viewings available by appointment</li>
                <li>• Catering advice and recommendations</li>
                <li>• Support for most event types</li>
                <li>• Profits support JVS charitable work</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Request Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral-50 rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6 text-center">Request a Quote</h2>
            <p className="text-center text-neutral-600 mb-8">
              Tell us about your event and we&apos;ll get back to you within 2 working days with a personalized quote.
            </p>

            {submitStatus === 'success' && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                Thank you for your enquiry! We&apos;ll get back to you within 2 working days.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                Sorry, there was an error sending your enquiry. Please try again or contact us directly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-neutral-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-neutral-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="spaces" className="block text-sm font-medium text-neutral-700 mb-2">
                  Which spaces would you like to hire? *
                </label>
                <select
                  id="spaces"
                  name="spaces"
                  value={formData.spaces}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Please select...</option>
                  <option value="The Main Hall">The Main Hall</option>
                  <option value="The Kitchen">The Kitchen</option>
                  <option value="The Boardroom">The Boardroom</option>
                  <option value="The Garden">The Garden</option>
                  <option value="Main Hall + Kitchen">Main Hall + Kitchen</option>
                  <option value="Main Hall + Boardroom">Main Hall + Boardroom</option>
                  <option value="Garden + Kitchen">Garden + Kitchen</option>
                  <option value="Garden + Boardroom">Garden + Boardroom</option>
                  <option value="Full Venue">Full Venue (All Spaces)</option>
                  <option value="Other">Other (please specify in message)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="dates" className="block text-sm font-medium text-neutral-700 mb-2">
                    Preferred Dates *
                  </label>
                  <input
                    type="text"
                    id="dates"
                    name="dates"
                    value={formData.dates}
                    onChange={handleInputChange}
                    placeholder="e.g., 15th-16th March 2025"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="times" className="block text-sm font-medium text-neutral-700 mb-2">
                    Preferred Times *
                  </label>
                  <input
                    type="text"
                    id="times"
                    name="times"
                    value={formData.times}
                    onChange={handleInputChange}
                    placeholder="e.g., 9am-5pm"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                  Tell us about your event *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Please describe what you plan to use the venue for, expected number of attendees, and any special requirements..."
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  {isSubmitting ? 'Sending...' : 'Request Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 