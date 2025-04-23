import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">

        {/* Footer content grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Company section */}
          <div>
            <h3 className="font-semibold text-xl mb-4 text-blue-400">Company</h3>
            <ul>
              <li><a href="/about" className="hover:text-blue-500">About Us</a></li>
              <li><a href="/services" className="hover:text-blue-500">Services</a></li>
              <li><a href="/careers" className="hover:text-blue-500">Careers</a></li>
              <li><a href="/blog" className="hover:text-blue-500">Blog</a></li>
            </ul>
          </div>

          {/* Support section */}
          <div>
            <h3 className="font-semibold text-xl mb-4 text-blue-400">Support</h3>
            <ul>
              <li><a href="/contact" className="hover:text-blue-500">Contact</a></li>
              <li><a href="/faq" className="hover:text-blue-500">FAQ</a></li>
              <li><a href="/privacy-policy" className="hover:text-blue-500">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-blue-500">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Social media section */}
          <div>
            <h3 className="font-semibold text-xl mb-4 text-blue-400">Follow Us</h3>
            <div className="flex gap-6 ">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-500 transition duration-300"
              >
                <FaFacebookF size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-500 transition duration-300"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-500 transition duration-300"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-500 transition duration-300"
              >
                <FaLinkedinIn size={24} />
              </a>
            </div>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-semibold text-xl mb-4 text-blue-400">Contact Us</h3>
            <ul>
              <li><p className="text-gray-400">123 Travel St, City</p></li>
              <li><p className="text-gray-400">Email: info@destivia.com</p></li>
              <li><p className="text-gray-400">Phone: +123 456 7890</p></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">&copy; 2025 Your Travel Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
