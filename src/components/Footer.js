import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <footer className={`bg-gray-800 text-white w-full z-40 transition-all duration-300 ease-in-out overflow-hidden ${isScrollingUp ? 'h-16' : 'h-auto'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrollingUp ? 'py-2' : 'py-6 lg:py-8'}`}>
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${isScrollingUp ? 'opacity-0 h-0' : 'opacity-100'}`}>
          <div className="space-y-2">
            <h3 className="text-base font-semibold">About Us</h3>
            <p className="text-gray-300 text-sm">
              Kolla Agencies - Your trusted partner for quality products and services.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white">About</a></li>
              <li><a href="/products" className="text-gray-300 hover:text-white">Products</a></li>
              <li><a href="/blogs" className="text-gray-300 hover:text-white">Blogs</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Contact</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>Main Bazar</li>
              <li>Vinukonda, Andhra Pradesh 522647</li>
              <li>Phone: +91 9502386466</li>
              <li>Email: kollaagencyes@gmail.com</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold">Follow Us</h3>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
            </div>
          </div>
        </div>
        <div className={`border-t border-gray-700 ${isScrollingUp ? 'mt-0 pt-2' : 'mt-4 pt-4'} text-center transition-all duration-300`}>
          <div className="flex justify-between items-center">
            <p className="text-gray-300 text-sm">&copy; 2025 Kolla Agencies. All rights reserved.</p>
            {isScrollingUp && (
              <div className="flex space-x-4 text-sm">
                <a href="tel:+919502386466" className="text-gray-300 hover:text-white">+91 9502386466</a>
                <a href="mailto:kollaagencyes@gmail.com" className="text-gray-300 hover:text-white">kollaagencyes@gmail.com</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;