import { FaFacebookF, FaTwitter, FaPinterestP, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1c191d] text-gray-300 pt-12">
      {/* Newsletter Top Bar */}
      <div className="bg-[#1c191d] flex justify-center items-center relative rounded-t-[3rem] py-6">
        <h3 className="text-white font-bold text-lg mr-4">
          OUR <span className="text-yellow-500">NEWSLETTER</span>
        </h3>
        <div className="flex">
          <input
            type="email"
            placeholder="Enter your email..."
            className="px-4 py-2 w-72 bg-[#2b282c] text-gray-300 rounded-l-lg focus:outline-none"
          />
          <button className="bg-yellow-500 px-6 rounded-r-lg font-semibold text-black hover:bg-yellow-600">
            SUBSCRIBE
          </button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-12">
        {/* Column 1 */}
        <div>
          <h4 className="text-white text-xl font-bold mb-4">Gamics</h4>
          <p className="text-sm mb-4">
            Gamics marketplace the relase etras thats sheets continig passag.
          </p>
          <ul className="space-y-2 text-sm">
            <li>📍 Address : PO Box W75 Street Ian West new queens</li>
            <li>📞 Phone : +24 1245 654 235</li>
            <li>📧 Email : info@exemple.com</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">PRODUCTS</h4>
          <ul className="space-y-2 text-sm">
            <li>Graphics (26)</li>
            <li>Backgrounds (11)</li>
            <li>Fonts (9)</li>
            <li>Music (3)</li>
            <li>Photography (3)</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">NEED HELP?</h4>
          <ul className="space-y-2 text-sm">
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Refund Policy</li>
            <li>Affiliate</li>
            <li>Use Cases</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">FOLLOW US</h4>
          <div className="flex space-x-3 mb-6">
            <a href="#" className="bg-blue-600 p-2 rounded text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-sky-500 p-2 rounded text-white">
              <FaTwitter />
            </a>
            <a href="#" className="bg-red-600 p-2 rounded text-white">
              <FaPinterestP />
            </a>
            <a href="#" className="bg-blue-700 p-2 rounded text-white">
              <FaLinkedinIn />
            </a>
          </div>

          <h4 className="text-white text-lg font-semibold mb-4">NEWSLETTER SIGN UP</h4>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-full bg-[#2b282c] text-gray-300 rounded-l-lg focus:outline-none"
            />
            <button className="bg-yellow-500 px-4 rounded-r-lg font-semibold text-black hover:bg-yellow-600">
              🚀
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black text-center py-4 text-sm text-gray-400">
        © 2025 Gamiz. All Rights Reserved by{" "}
        <span className="text-yellow-500">Zeyad Alhoussainy</span>
      </div>
    </footer>
  );
}
