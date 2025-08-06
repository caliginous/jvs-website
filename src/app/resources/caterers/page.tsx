import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuickNav from '@/components/QuickNav';

export default function CaterersPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <QuickNav />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            🍽️ Vegan-friendly Kosher Caterers & Restaurants in London
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            A validated list of London&apos;s kosher establishments that offer plant-based options, 
            verified by JVS volunteers
          </p>
          <div className="w-24 h-1 bg-green-500 mx-auto mt-8 rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        
        {/* Introduction */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Verified Kosher Vegan Options
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              JVS volunteers regularly contact kosher establishments across London to verify their vegan offerings. 
              This list represents establishments that have confirmed they provide plant-based options while maintaining 
              the highest standards of kashrut. Each listing includes the date of our last verification.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg inline-block">
              <p className="text-blue-800 text-sm">
                <strong>Last updated:</strong> January 2025 • <strong>Next verification:</strong> April 2025
              </p>
            </div>
          </div>
        </section>

        {/* Kosher Home Delivery */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Kosher Home Delivery in London with Vegan Options
          </h2>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  <a href="https://1070kitchen.com" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900 underline">
                    1070 Kitchen
                  </a>
                </h3>
                <p className="text-green-600 font-medium">Home Delivery • London</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Jan 2025</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Offers a range of vegan items, all labelled on their website
            </p>
            <ul className="space-y-1 mb-4">
              <li className="text-gray-700 text-sm">• Taboule</li>
              <li className="text-gray-700 text-sm">• Red cabbage slaw</li>
              <li className="text-gray-700 text-sm">• Sweet and sour gherkin slices</li>
              <li className="text-gray-700 text-sm">• Babaganoush</li>
              <li className="text-gray-700 text-sm">• Houmous</li>
              <li className="text-gray-700 text-sm">• Bagels</li>
              <li className="text-gray-700 text-sm">• Golden cauliflower with couscous</li>
              <li className="text-gray-700 text-sm">• Apple strudel</li>
            </ul>
          </div>
        </section>

        {/* Kosher Caterers */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Kosher Caterers with Vegan Options
          </h2>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Jasmine Catering</h3>
                  <p className="text-green-600 font-medium">Catering Service</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Jan 2025</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Professional kosher catering with vegan options available
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Malcolm Green</h3>
                  <p className="text-green-600 font-medium">Catering Service</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Jan 2025</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Contact: 020 3393 6823, koshercaterer@yahoo.co.uk
              </p>
              <ul className="space-y-1 mb-4">
                <li className="text-gray-700 text-sm">• Oven roasted vegetables sweet potato with vegan mayo</li>
                <li className="text-gray-700 text-sm">• Grilled vegetable antipasti with herb crostini</li>
                <li className="text-gray-700 text-sm">• Vegan chocolate terrine</li>
              </ul>
            </div>
          </div>
        </section>

        {/* KLBD Kosher Bakeries */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            KLBD Kosher Bakeries
          </h2>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <a href="https://thebagelplace.co.uk" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900 underline">
                      The Bagel Place
                    </a>
                  </h3>
                  <p className="text-green-600 font-medium">Mill Hill • 020 8922 9454</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Jan 2025</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Offers a range of vegan items including:
              </p>
              <ul className="space-y-1 mb-4">
                <li className="text-gray-700 text-sm">• Biscuits (jam, chocolate chip, date, chocolate filled)</li>
                <li className="text-gray-700 text-sm">• Mini sultana iced buns</li>
                <li className="text-gray-700 text-sm">• Chocolate chip mini dough buns</li>
                <li className="text-gray-700 text-sm">• Bagels and challah on request</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <a href="https://grodzs.com" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900 underline">
                      Grodzs of Edgware
                    </a>
                  </h3>
                  <p className="text-green-600 font-medium">Edgware • 020 8958 1205</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Jan 2025</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Offers a range of vegan biscuits, which are clearly labelled
              </p>
              <ul className="space-y-1 mb-4">
                <li className="text-gray-700 text-sm">• Cakes can be ordered eggless from their website</li>
                <li className="text-gray-700 text-sm">• Bagels are also vegan</li>
                <li className="text-gray-700 text-sm">• Water challah available</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Sharon&apos;s Bakery</h3>
                  <p className="text-green-600 font-medium">Edgware • 020 8958 4789</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Jan 2025</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Sells vegan bagels
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Renbake Patisserie</h3>
                  <p className="text-green-600 font-medium">Hackney • 020 8800 2525</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Jan 2025</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Offers a range of vegan patisserie items
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Coco Bakery</h3>
                  <p className="text-green-600 font-medium">Golders Green • 020 8458 8984</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Jan 2025</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Has a range of vegan salads and a vegan flapjack, and plans to introduce more vegan items soon
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Hendon Bagel Bakery</h3>
                  <p className="text-green-600 font-medium">Hendon • 020 8203 6919</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Jan 2025</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Has a vegan version for every salad, all bread is vegan (except the challah, where there is a water challah that is vegan instead)
              </p>
              <ul className="space-y-1 mb-4">
                <li className="text-gray-700 text-sm">• Selection of vegan burekas and foccacia</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    <a href="https://sweetdoris.co.uk" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900 underline">
                      Sweet Doris
                    </a>
                  </h3>
                  <p className="text-green-600 font-medium">*Soon to be kosher supervised</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Jan 2025</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Offers a selection of vegan buns
              </p>
              <ul className="space-y-1 mb-4">
                <li className="text-gray-700 text-sm">• Classic, apple cinnamon, apple crumble</li>
                <li className="text-gray-700 text-sm">• Lotus biscoff, caramel pecan</li>
                <li className="text-gray-700 text-sm">• Mini cinnamon kebab, cinnamon bun waffles</li>
                <li className="text-gray-700 text-sm">• Minimum spend for hand delivery: £15.00 + possible mileage/distance charge</li>
                <li className="text-gray-700 text-sm">• Postal delivery available</li>
              </ul>
              <p className="text-gray-600 text-sm">Email: neil@yourcelebration.co.uk</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Parkway Patisserie</h3>
                  <p className="text-green-600 font-medium">020 8346 0344</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Jan 2025</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                *Call ahead for vegan options:
              </p>
              <ul className="space-y-1 mb-4">
                <li className="text-gray-700 text-sm">• Vegan strudel, crumble</li>
                <li className="text-gray-700 text-sm">• Chocolate chip cookies, brownies</li>
                <li className="text-gray-700 text-sm">• Chocolate cake, chocolate cookies</li>
                <li className="text-gray-700 text-sm">• Hazelnut chocolate cake and chocolate babka</li>
              </ul>
            </div>
          </div>
        </section>

        {/* KLBD Kosher Restaurants */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            KLBD Kosher Restaurants
          </h2>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  <a href="https://novellino.co.uk" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900 underline">
                    Novellino
                  </a>
                </h3>
                <p className="text-green-600 font-medium">Golders Green • 020 8458 7273</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Jan 2025</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Vegan options include:
            </p>
            <ul className="space-y-1 mb-4">
              <li className="text-gray-700 text-sm">• Grilled antipasti</li>
              <li className="text-gray-700 text-sm">• Healthy salad</li>
              <li className="text-gray-700 text-sm">• Pomodoro pasta</li>
              <li className="text-gray-700 text-sm">• Veggie noodles</li>
              <li className="text-gray-700 text-sm">• Mediterranean pasta</li>
              <li className="text-gray-700 text-sm">• All side dishes: rice, chips, grilled veg, steamed broccoli, small salad</li>
            </ul>
            <p className="text-gray-600 text-sm">
              Some dishes can be made vegan on request such as mezze platter, grilled aubergine and more.
            </p>
          </div>
        </section>

        {/* Non-Kosher Vegan Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Non-Kosher Vegan Catering Options
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            The following are not kosher but are vegan - you might want to consider using them for your events:
          </p>
          
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                <a href="https://cashewcatering.co.uk" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-900 underline">
                  Cashew Catering
                </a>
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Vegan catering, vegan weddings, vegetarian catering, vegetarian weddings & raw foods, plus raw food classes, 
                vegan & vegetarian cookery courses in London, Sussex, Brighton, Kent, the South East of England & occasionally further afield.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                <a href="https://plantedcatering.co.uk" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-900 underline">
                  Planted
                </a>
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                From healthy, beautiful salads and sharing plates to our bright and flavoursome canapé selection, 
                we can cater to your needs. We&apos;re happy to travel to the space of your choice and create a bespoke 
                menu to make your event special and memorable.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                <a href="https://thefieldsbeneath.com" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-900 underline">
                  The Fields Beneath
                </a>
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                There&apos;s not much you can&apos;t do with plants these days and we&apos;ve been putting some pretty fine food 
                on the counter since turning our menu plant based in 2017. We have a whole-food approach to our ingredients 
                focussing as much as possible on seasonal and British. If you&apos;re after catering for an event we can do that too. 
                We can cater anything from small birthdays to big corporate events of over 100 people having worked with the likes 
                of LUSH, Vevolution, Google and Oatly. Contact us here to enquire. We also do cakes for collection so get in touch 
                if you want one of those bad boys.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                <a href="https://falafelfeast.co.uk" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-900 underline">
                  Falafel Feast
                </a>
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Vegan catering service specializing in Middle Eastern cuisine.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                <a href="https://pomodorobasilico.co.uk" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-900 underline">
                  Pomodoro E Basilico
                </a>
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Offers spectacular handmade, artisan vegan Italian food including breads and cheeses.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Neil Samuels</h3>
              <p className="text-gray-600 text-sm mb-4">
                Offers boutique catering with plenty of vegan options, soon to be kosher supervised.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                <a href="https://shambhusvegancatering.co.uk" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-900 underline">
                  Shambhu&apos;s Vegan Catering
                </a>
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Vegan desserts, vegan pizzas, snacks, meals, curry, drinks and many more. For full product listing click here.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                <a href="https://littlecookingpot.co.uk" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-900 underline">
                  Little Cooking Pot (Sarah Cotterell)
                </a>
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                A supper club and catering company that brings vegan & vegetarian food from around the world to the hungry tums 
                of London Town (and beyond!). Catering for brands, businesses and individuals, we specialise in beautifully 
                presented, fresh, nutritionally balanced food that&apos;s packed with flavour, goodness and colour from the 
                countries that inspired the recipes.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nomadic Green Chef – Zoe Marks</h3>
              <p className="text-gray-600 text-sm mb-4">
                My cooking has been inspired by my travels and I am often found hovering around local kitchens and persuading 
                the chefs to teach me their tricks of the trade. Food is a powerful way of connecting and understanding people 
                and I love collecting recipes and the stories behind them from my travels. I love to collaborate and connect 
                with others who are also passionate about good food, so please get in contact if you are interested in hiring me.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                <a href="https://veganpeasantcatering.co.uk" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-900 underline">
                  Vegan Peasant Catering
                </a>
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Vegan Peasant Catering is for anyone looking for a formal 100% plant-based dining experience. They specialise 
                in creating the most elegant canapés and delicious bowl foods, that are pure vegetarian – sustainable, ethical 
                and inclusive too! Clients love the globally inspired cuisine. Vegan Peasant Catering love that they are able 
                to that to impress their client&apos;s guests, vegetarian and non-vegetarian alike. But most of all, they are 
                happy to provide bespoke solutions and they are great to work with too.
              </p>
            </div>
          </div>
        </section>

        {/* Verification Process */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Our Verification Process
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Direct Contact</h3>
              <p className="text-gray-600">JVS volunteers call each establishment to verify vegan options</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Menu Review</h3>
              <p className="text-gray-600">We review current menus and discuss specific vegan offerings</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Regular Updates</h3>
              <p className="text-gray-600">Listings are updated quarterly to ensure accuracy</p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Important Note</h3>
            <p className="text-blue-800 text-sm">
              While we verify vegan options with each establishment, menus and availability may change. 
              We recommend calling ahead to confirm current offerings, especially for special dietary requirements.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Find Your Perfect Vegan Dining Experience
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Whether you&apos;re looking for kosher vegan options or exploring the wider vegan catering scene, 
            London has something for everyone. All kosher establishments listed have been personally verified by JVS volunteers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/resources"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              📚 Back to Resources
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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