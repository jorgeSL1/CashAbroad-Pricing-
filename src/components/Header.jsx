import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import logo from '../assets/cashabroad-black.png'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileActiveSection, setMobileActiveSection] = useState(null)

  const navItems = [
    {
      label: 'Servicios',
      items: [
        { label: 'Compatibilidad de Visa', href: '#' },
        { label: 'Calculadora de Tiempo', href: '#' },
        { label: 'Comparar Visas', href: '#' },
      ]
    },
    {
      label: 'Recursos',
      items: [
        { label: 'Guías de Visa', href: '#' },
        { label: 'Preguntas Frecuentes', href: '#' },
        { label: 'Blog', href: '#' },
      ]
    },
    {
      label: 'Empresa',
      items: [
        { label: 'Sobre Nosotros', href: '#' },
        { label: 'Testimonios', href: '#' },
        { label: 'Prensa', href: '#' },
      ]
    },
  ]

  const toggleMobileSection = (label) => {
    setMobileActiveSection(mobileActiveSection === label ? null : label)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-neutral-100 safe-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
       
          <motion.a 
            href="#"
            className="flex items-center gap-2 touch-manipulation"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={logo}
              alt="CashAbroad"
              className="h-16"
            />
          </motion.a>

          
          <nav className="hidden lg:flex items-center gap-1">
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
                  className="flex items-center gap-1 px-3 md:px-4 py-2 text-sm md:text-base text-neutral-600 hover:text-[#3d5de2] 
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
                          className="block px-4 py-3 text-sm md:text-base text-neutral-600 hover:text-[#3d5de2] 
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

      
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block"
          >
            <a 
              href="#" 
              className="btn-primary inline-flex items-center gap-2 text-sm md:text-base"
            >
              Agendar una llamada gratuita
            </a>
          </motion.div>

         
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors touch-manipulation"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-neutral-100 overflow-hidden"
          >
            <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-neutral-100 last:border-0">
                  <button
                    onClick={() => toggleMobileSection(item.label)}
                    className="w-full flex items-center justify-between px-3 py-3 text-sm sm:text-base font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors touch-manipulation"
                  >
                    {item.label}
                    <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 transition-transform duration-200
                      ${mobileActiveSection === item.label ? 'rotate-90' : ''}`} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {mobileActiveSection === item.label && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pb-2 space-y-1">
                          {item.items.map((subItem) => (
                            <a
                              key={subItem.label}
                              href={subItem.href}
                              className="block px-3 py-2.5 text-sm text-neutral-600 hover:text-[#3d5de2] 
                                       hover:bg-neutral-50 rounded-lg transition-colors touch-manipulation"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subItem.label}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              <div className="pt-3 sm:pt-4">
                <a 
                  href="#" 
                  className="btn-primary w-full text-center block text-sm sm:text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Agendar una llamada gratuita
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