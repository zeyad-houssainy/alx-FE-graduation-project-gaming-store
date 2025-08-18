import { FaFacebookF, FaTwitter, FaPinterestP, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 pt-12 border-t border-gray-200 transition-colors duration-300">
      {/* Newsletter Top Bar */}
      <div className="bg-white shadow-sm flex justify-center items-center relative rounded-t-[3rem] py-8 border-b border-gray-100">
        <h3 className="text-gray-800 font-bold text-lg mr-4">
          OUR <span className="text-blue-600">NEWSLETTER</span>
        </h3>
        <div className="flex shadow-sm">
          <input
            type="email"
            placeholder="Enter your email..."
            className="px-4 py-3 w-72 bg-white text-gray-700 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="bg-blue-600 px-6 rounded-r-lg font-semibold text-white hover:bg-blue-700 transition-colors duration-200 shadow-sm">
            SUBSCRIBE
          </button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-12 bg-gray-50">
        {/* Column 1 */}
        <div>
          <h4 className="text-gray-900 text-xl font-bold mb-4">Gamiz</h4>
          <p className="text-sm mb-4 text-gray-600 leading-relaxed">
            Gamiz marketplace the relase etras thats sheets continig passag.
          </p>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">📍</span>
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
          <h4 className="text-gray-900 text-lg font-semibold mb-4">PRODUCTS</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Graphics (26)</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Backgrounds (11)</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Fonts (9)</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Music (3)</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Photography (3)</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="text-gray-900 text-lg font-semibold mb-4">NEED HELP?</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Terms & Conditions</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Privacy Policy</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Refund Policy</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Affiliate</li>
            <li className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Use Cases</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="text-gray-900 text-lg font-semibold mb-4">FOLLOW US</h4>
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

          <h4 className="text-gray-900 text-lg font-semibold mb-4">NEWSLETTER SIGN UP</h4>
          <div className="flex shadow-sm">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 w-full bg-white text-gray-700 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="bg-blue-600 px-4 rounded-r-lg font-semibold text-white hover:bg-blue-700 transition-colors duration-200 shadow-sm">
              🚀
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© 2024 Gamiz. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Privacy Policy</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Terms of Service</span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors duration-200">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
