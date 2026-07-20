import { FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

export default function TopBar() {
  return (
    <div className="relative z-20 bg-primary text-white text-[10px] md:text-sm h-[39px] flex items-center px-2 sm:px-4 md:px-12 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full gap-2">
        {/* Left: Contact Info (Strictly one line) */}
        <div className="flex items-center gap-1.5 sm:gap-6 whitespace-nowrap shrink-0">
          <a href="tel:+254740881485" className="flex items-center gap-1 hover:text-white/70 transition-colors">
            <FaPhone className="text-[9px] sm:text-[10px]" />
            <span className="hidden sm:inline">Call us : 0740881485</span>
            <span className="sm:hidden">0740881485</span>
          </a>
          <span className="text-white/70 hidden min-[360px]:inline">|</span>
          <a href="mailto:info@dominionsoftwares.com" className="flex items-center gap-1 hover:text-white/70 transition-colors">
            <FaEnvelope className="text-[9px] sm:text-[10px]" />
            <span className="truncate max-w-[130px] sm:max-w-none">info@dominionsoftwares.com</span>
          </a>
        </div>

        {/* Right: Social & Motto */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden lg:inline mr-4 text-white/80 whitespace-nowrap">Motto: Automation our ultimate goal</span>
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
              <a key={i} href="#" className="hover:text-white/70 transition-colors shrink-0">
                <Icon className="text-[11px] sm:text-sm" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
