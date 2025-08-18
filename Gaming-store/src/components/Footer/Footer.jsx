import { FaFacebookF, FaTwitter, FaPinterestP, FaLinkedinIn } from "react-icons/fa";

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
          <h4 className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">Gamiz</h4>
          <p className="text-sm mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            Gamiz marketplace the relase etras thats sheets continig passag.
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
              <FaFacebookF />
            </a>
            <a href="#" className="bg-sky-500 hover:bg-sky-600 p-3 rounded-lg text-white transition-colors duration-200 shadow-sm hover:shadow-md">
              <FaTwitter />
            </a>
            <a href="#" className="bg-red-500 hover:bg-red-600 p-3 rounded-lg text-white transition-colors duration-200 shadow-sm hover:shadow-md">
              <FaPinterestP />
            </a>
            <a href="#" className="bg-blue-700 hover:bg-blue-800 p-3 rounded-lg text-white transition-colors duration-200 shadow-sm hover:shadow-md">
              <FaLinkedinIn />
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
          <p>© 2024 Gamiz. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Privacy Policy</span>
            <span className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Terms of Service</span>
            <span className="hover:text-blue-600 dark:hover:text-orange-400 cursor-pointer transition-colors duration-200">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
