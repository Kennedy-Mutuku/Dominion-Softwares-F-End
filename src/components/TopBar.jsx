import { FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function TopBar() {
  return (
    <div className="bg-primary text-white text-[11px] md:text-sm py-2 md:py-2.5 px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="tel:+254740881485" className="flex items-center gap-2 hover:text-white/70 transition-colors">
            <FaPhone className="text-[10px]" />
            <span className="hidden sm:inline">Call us : 0740881485</span>
            <span className="sm:hidden">0740881485</span>
          </a>
          <span className="hidden md:inline text-white/70">|</span>
          <a href="mailto:info@dominionsoftwares.com" className="hidden md:flex items-center gap-2 hover:text-white/70 transition-colors">
            <FaEnvelope className="text-[10px]" />
            info@dominionsoftwares.com
          </a>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden lg:inline mr-4 text-white/80">Building software that empowers organizations</span>
          <div className="flex items-center gap-4">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
              <a key={i} href="#" className="hover:text-white/70 transition-colors">
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
