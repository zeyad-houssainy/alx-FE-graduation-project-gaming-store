import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 pt-12 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Newsletter Top Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm flex flex-col sm:flex-row justify-center items-center relative rounded-t-[3rem] py-6 sm:py-8 px-4 sm:px-0 border-b border-gray-100 dark:border-gray-700 gap-4 sm:gap-0">
        <h3 className="text-gray-800 dark:text-gray-100 font-bold text-base sm:text-lg mr-0 sm:mr-4 text-center sm:text-left">
          OUR <span className="text-blue-600 dark:text-orange-400">NEWSLETTER</span>
        </h3>
        <div className="flex shadow-sm w-full sm:w-auto">
          <input
            type="email"
            placeholder="Enter your email..."
            className="px-4 py-3 w-full sm:w-72 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-blue-500 dark:focus:border-orange-500 dark:placeholder-gray-400"
          />
          <button className="bg-blue-600 dark:bg-orange-500 px-6 rounded-r-lg font-semibold text-white hover:bg-blue-700 dark:hover:bg-orange-600 transition-colors duration-200 shadow-sm">
            SUBSCRIBE
          </button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-6 py-8 sm:py-12 bg-gray-50 dark:bg-gray-900">
        {/* Column 1 */}
        <div>
          <h4 className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">GAMING STORE</h4>
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            GAMING STORE marketplace the release etras thats sheets continig passag.
          </p>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-orange-400">📍</span>
              <span>Address : PO Box W75 Street Ian West new queens</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">📞</span>
              <span>Phone : +24 1245 654 235</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500">📧</span>
              <span>Email : info@exemple.com</span>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-4">PRODUCTS</h4>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Graphics (26)</li>
            <li className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Backgrounds (11)</li>
            <li className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Fonts (9)</li>
            <li className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Music (3)</li>
            <li className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Photography (3)</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-4">NEED HELP?</h4>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Terms & Conditions</li>
            <li className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Privacy Policy</li>
            <li className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Refund Policy</li>
            <li className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Affiliate</li>
            <li className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Use Cases</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-4">FOLLOW US</h4>
          <div className="flex space-x-3 mb-6">
            <a href="#" className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white transition-colors duration-200 shadow-sm hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="bg-sky-500 hover:bg-sky-600 p-3 rounded-lg text-white transition-colors duration-200 shadow-sm hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            <a href="#" className="bg-red-500 hover:bg-red-600 p-3 rounded-lg text-white transition-colors duration-200 shadow-sm hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-pinterest"><path d="M12 20S5 10 5 6a5 5 0 0 1 10 0c0 4-7 14-7 14z"/></svg>
            </a>
            <a href="#" className="bg-blue-700 hover:bg-blue-800 p-3 rounded-lg text-white transition-colors duration-200 shadow-sm hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7H4v-7a6 6 0 0 1 6-6c1.66 0 3 1.34 3 3v2H9v-2c0-1.66 1.34-3 3-3z"/></svg>
            </a>
          </div>

          <h4 className="text-gray-900 dark:text-gray-100 text-lg font-semibold mb-4">NEWSLETTER SIGN UP</h4>
          <div className="flex shadow-sm">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-orange-500 focus:border-blue-500 dark:focus:border-orange-500 dark:placeholder-gray-400"
            />
            <button className="bg-blue-600 dark:bg-orange-500 px-4 rounded-r-lg font-semibold text-white hover:bg-blue-700 dark:hover:bg-orange-600 transition-colors duration-200 shadow-sm">
              🚀
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400 gap-4 md:gap-0">
          <p>© 2024 GAMING STORE. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Cookie Policy</span>
            <span className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Contact Us</span>
            <span className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
