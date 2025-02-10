import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white px-10 py-8">
      <div className="max-w-[1440px] mx-auto grid grid-cols-4 gap-8">
        {/* Network Status */}
        <div>
          <h3 className="font-medium mb-4">Network Status</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-sm font-normal text-gray-300">
              All systems operational
            </span>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-sm mb-4">Support</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-sm font-normal text-gray-300 hover:text-white"
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm font-normal text-gray-300 hover:text-white"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-sm mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-sm font-normal text-gray-300 hover:text-white"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm font-normal text-gray-300 hover:text-white"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold mb-4">Social</h3>
          <div className="flex gap-4">
            <a href="#" className="text-gray-300 hover:text-white">
              <Image src="/icons/X.svg" alt="Twitter" width={24} height={24} />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <Image
                src="/icons/dischord.svg"
                alt="Discord"
                width={24}
                height={24}
              />
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <Image
                src="/icons/telegram.png"
                alt="Telegram"
                width={24}
                height={24}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
