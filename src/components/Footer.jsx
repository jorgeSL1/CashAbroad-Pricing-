import { motion } from 'framer-motion'
import { Mail, Phone, Linkedin, MapPin, ArrowUpRight } from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Testimonials', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Blog', href: '#' },
    ],
    services: [
      { label: 'Visa Match', href: '#' },
      { label: 'Timeline Calculator', href: '#' },
      { label: 'Compare Visas', href: '#' },
      { label: 'Pricing', href: '#' },
    ],
    resources: [
      { label: 'Visa Guides', href: '#' },
      { label: 'FAQs', href: '#' },
      { label: 'Visa Courses', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms & Conditions', href: '#' },
    ],
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 sm:mb-6"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10">
                  <span className="text-white font-bold text-lg sm:text-xl">CA</span>
                </div>
                <span className="text-xl sm:text-2xl font-semibold">CashAbroad</span>
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-sm">
                US immigration, but simple. We combine expert legal guidance with
                cutting-edge technology to make your immigration journey seamless
                and transparent.
              </p>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-2 sm:space-y-3"
            >
              <a
                href="mailto:info@cashabroad.one"
                className="flex items-center gap-2 sm:gap-3 text-neutral-300 hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-base">info@cashabroad.one</span>
              </a>
              <a
                href="tel:+19213056586"
                className="flex items-center gap-2 sm:gap-3 text-neutral-300 hover:text-white transition-colors group"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-base">(921) 305-6586</span>
              </a>
              <div className="flex items-center gap-2 sm:gap-3 text-neutral-300">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-base">Miami, FL</span>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-4 sm:mt-6"
            >
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 rounded-lg
                         hover:bg-white/20 transition-colors border border-white/10 text-xs sm:text-base"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Follow on LinkedIn</span>
              </a>
            </motion.div>
          </div>

          {/* Links Columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors inline-flex items-center gap-1 group text-xs sm:text-base"
                  >
                    {link.label}
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors inline-flex items-center gap-1 group text-xs sm:text-base"
                  >
                    {link.label}
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Resources</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors inline-flex items-center gap-1 group text-xs sm:text-base"
                  >
                    {link.label}
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="font-semibold mb-3 sm:mb-4 mt-6 sm:mt-8 text-white text-sm sm:text-base">Legal</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-neutral-300 hover:text-white transition-colors inline-flex items-center gap-1 group text-xs sm:text-base"
                  >
                    {link.label}
                    <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
            <p className="text-xs sm:text-sm text-neutral-400">
              © {currentYear} CashAbroad. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-neutral-400">
              Made with ❤️ in Mexico
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
