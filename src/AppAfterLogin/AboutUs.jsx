import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Us & Rules</h1>
          <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* About Us Section */}
        <section className="mb-16 bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-blue-400 mb-6">About NITJ Lost & Found</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Welcome to the NIT Jalandhar Lost & Found Portal, a platform designed to help our campus community connect lost items with their rightful owners. Our mission is to create a simple, efficient system that makes it easy to report lost items and claim found ones.
          </p>
          <p className="text-gray-300 mb-6 leading-relaxed">
            This platform is maintained by the administration of NIT Jalandhar and supervised by our dedicated security team. All found items are securely stored at the security office at the main gate until they are claimed by their owners.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Our goal is to reduce stress and inconvenience caused by losing personal belongings on campus and to promote a helpful, cooperative community spirit.
          </p>
        </section>

        {/* Rules Section */}
        <section className="mb-16 bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-green-400 mb-6">Rules & Guidelines</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Reporting Lost Items</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Provide accurate and detailed information about your lost item, including when and where you last had it.</li>
                <li>Include a clear photo of the item if available.</li>
                <li>Be responsive to communications regarding your lost item.</li>
                <li>Update your listing if you find your item through other means.</li>
                <li>Respect the privacy of others when reporting lost items with personal information.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Reporting Found Items</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>All found items should be handed over to the security office at the main gate.</li>
                <li>Do not open wallets, bags, or other personal containers.</li>
                <li>Provide accurate details about where and when you found the item.</li>
                <li>Do not post personal identification information publicly.</li>
                <li>Security personnel will verify and document all items turned in.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Claiming Items</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>You must provide valid identification (student/faculty/staff ID) when claiming an item.</li>
                <li>You may be asked to describe specific details about the item that wouldn't be visible in photos.</li>
                <li>All claims are tracked and logged by security personnel.</li>
                <li>Unclaimed items will be held for a period of 3 months before being donated or disposed of.</li>
                <li>Valuable items like electronics, jewelry, and IDs have special verification procedures.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-800 rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-purple-400 mb-6">Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Security Office</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Main Gate, NIT Jalandhar
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91-181-2690301
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Available 24/7
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Admin Support</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  lostandfound@nitj.ac.in
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91-181-2690453
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mon-Fri: 9:00 AM - 5:30 PM
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs; 