import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* NITJ Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://www.nitj.ac.in/public/assets/images/logo_250.png" 
                alt="NITJ Logo" 
                className="w-12 h-12"
              />
              <div>
                <h3 className="font-bold text-lg">NIT Jalandhar</h3>
                <p className="text-sm text-gray-400">Lost & Found Portal</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              G.T Road, Barnala - Amritsar Bypass Road, 
              Jalandhar, Punjab-144027
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="https://www.nitj.ac.in" className="hover:text-white transition-colors">
                  NITJ Website
                </a>
              </li>
              <li>
                <a href="https://www.nitj.ac.in/contact_us" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="https://www.nitj.ac.in/campus_life" className="hover:text-white transition-colors">
                  Campus Life
                </a>
              </li>
              <li>
                <a href="https://www.nitj.ac.in/rules_policies" className="hover:text-white transition-colors">
                  Rules & Policies
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="mailto:nitj@nitj.ac.in" className="hover:text-white transition-colors">
                  nitj@nitj.ac.in
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+91-181-2690301, 2690453</span>
              </li>
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Emergency Contacts</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center justify-between">
                <span>Security Office</span>
                <a href="tel:+911812690301" className="text-green-400 hover:text-green-300">
                  +91-181-2690301
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>Health Center</span>
                <a href="tel:+911812690302" className="text-green-400 hover:text-green-300">
                  +91-181-2690302
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()} NIT Jalandhar
            </p>
            <div className="flex flex-wrap justify-center space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Use
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;

