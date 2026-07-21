import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'Who We Are' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/contact', label: 'Contact' },
  { to: '/apply', label: 'Apply Now' },
];

const serviceLinks = [
  'Custom Software',
  'Mobile Apps',
  'Cloud Solutions',
  'UI/UX Design',
  'IT Security',
  'System Integration',
];

const socials = [
  { icon: FaFacebook, href: '#' },
  { icon: FaTwitter, href: '#' },
  { icon: FaLinkedin, href: '#' },
  { icon: FaInstagram, href: '#' },
  { icon: FaGithub, href: '#' },
];

export default function Footer() {
  return (
    <footer className="relative">
      <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      <div className="bg-dark text-white section-padding !py-14">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Company Info */}
            <div>
              <div className="mb-4">
                <span className="text-xl font-bold">DOMINION</span>
                <span className="text-xl font-bold text-primary"> SOFTWARES</span>
              </div>
              <div className="flex items-center w-max mb-5 mt-3">
                <div className="h-[2px] rounded-full bg-gradient-to-r from-transparent to-secondary/60 w-10"></div>
                <span className="px-3 text-secondary text-[24px] font-bold tracking-wide drop-shadow-sm" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  Heavenly Inspired
                </span>
                <div className="h-[2px] rounded-full bg-gradient-to-l from-transparent to-secondary/60 w-10"></div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                A technology-focused enterprise delivering practical and reliable
                software solutions for organizations making a difference.
                <br /><br />
                <span className="text-primary/80 font-medium italic">Automation our ultimate goal.</span>
              </p>
              <div className="flex gap-2.5">
                {socials.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="w-9 h-9 rounded-full bg-white/8 border border-white/10
                               flex items-center justify-center text-white/50
                               hover:bg-primary hover:text-white hover:border-primary
                               transition-all duration-300"
                  >
                    <s.icon className="text-xs" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-base mb-5">Quick Links</h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-white/50 hover:text-primary transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-base mb-5">Services</h4>
              <ul className="space-y-2.5">
                {serviceLinks.map((service) => (
                  <li key={service}>
                    <Link to="/services" className="text-white/50 hover:text-primary transition-colors text-sm">
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-base mb-5">Contact Us</h4>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary mt-0.5 shrink-0 text-sm" />
                  <span className="text-white/50 text-sm">Nairobi, Kenya<br />East Africa</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaPhone className="text-primary shrink-0 text-sm" />
                  <span className="text-white/50 text-sm">0740881485</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-primary shrink-0 text-sm" />
                  <span className="text-white/50 text-sm">info@dominionsoftwares.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-sm">
              &copy; {new Date().getFullYear()} Dominion Softwares. All rights reserved.
            </p>
            <p className="text-white/40 text-sm">
              Crafted with passion in Kisii, Kenya
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
