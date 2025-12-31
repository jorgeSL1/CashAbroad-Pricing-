import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const navItems = [
    {
      label: 'Services',
      items: [
        { label: 'Visa Match', href: '#' },
        { label: 'Timeline Calculator', href: '#' },
        { label: 'Compare Visas', href: '#' },
      ]
    },
    {
      label: 'Resources',
      items: [
        { label: 'Visa Guides', href: '#' },
        { label: 'FAQs', href: '#' },
        { label: 'Blog', href: '#' },
      ]
    },
    {
      label: 'Company',
      items: [
        { label: 'About Us', href: '#' },
        { label: 'Testimonials', href: '#' },
        { label: 'Press', href: '#' },
      ]
    },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.a 
            href="#"
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-800 to-accent-blue flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-lg">CA</span>
              </div>
              <span className="text-xl font-semibold text-primary-900 hidden sm:block">CashAbroad</span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <div 
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-1 px-4 py-2 text-neutral-600 hover:text-primary-800 
                           transition-colors duration-200 rounded-lg hover:bg-neutral-50"
                >
                  {item.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 
                    ${activeDropdown === item.label ? 'rotate-180' : ''}`} 
                  />
                </motion.button>
                
                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-elevated 
                               border border-neutral-100 overflow-hidden"
                    >
                      {item.items.map((subItem, subIndex) => (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          className="block px-4 py-3 text-neutral-600 hover:text-primary-800 
                                   hover:bg-neutral-50 transition-colors duration-200"
                          style={{ animationDelay: `${subIndex * 50}ms` }}
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block"
          >
            <a 
              href="#" 
              className="btn-primary inline-flex items-center gap-2"
            >
              Schedule a free call
            </a>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-neutral-100"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-neutral-400 uppercase tracking-wide">
                    {item.label}
                  </div>
                  {item.items.map((subItem) => (
                    <a
                      key={subItem.label}
                      href={subItem.href}
                      className="block px-3 py-2 text-neutral-600 hover:text-primary-800 
                               hover:bg-neutral-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {subItem.label}
                    </a>
                  ))}
                </div>
              ))}
              <div className="pt-4 border-t border-neutral-100">
                <a href="#" className="btn-primary w-full text-center block">
                  Schedule a free call
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
