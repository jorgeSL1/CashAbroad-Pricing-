import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, DollarSign, MessageCircle, ArrowRight } from 'lucide-react'
import { Header, Quiz, GanttTimeline, PricingChart, Footer } from './components'

function App() {
  const [answers, setAnswers] = useState({})
  const [activeTab, setActiveTab] = useState('timeline')
  const [scenario, setScenario] = useState('intermediate')

  const tabs = [
    {
      id: 'timeline',
      label: 'Línea de Tiempo',
      description: 'Visualización del tiempo de proceso',
      icon: Clock
    },
    {
      id: 'pricing',
      label: 'Precios',
      description: 'Visualización del costo del proceso',
      icon: DollarSign
    },
  ]

 
  const summary = useMemo(() => {
    if (!answers.visaType) {
      return { totalCost: 0, totalTime: '-' }
    }

    const baseCost = answers.visaType.cost || 0
    const statusAdjustment = answers.currentStatus?.costAdjustment || 0
    const dependentCount = answers.dependents?.count || 0
    const dependentCost = dependentCount * (answers.dependents?.costPerDependent || 0)
    const premiumCost = answers.premium?.cost || 0
    const totalCost = baseCost + statusAdjustment + dependentCost + premiumCost

    const baseTime = answers.visaType.time?.[scenario] || 12
    const countryMultiplier = answers.country?.timeMultiplier || 1
    const premiumReduction = answers.premium?.timeReduction || 1
    const totalTime = Math.round(baseTime * countryMultiplier * premiumReduction)

    return { totalCost, totalTime: `${totalTime} months` }
  }, [answers, scenario])

  return (
    <div className="min-h-screen bg-neutral-50 overflow-x-hidden">
      <Header />
      
    
      <section className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-4 sm:pb-6 md:pb-8 lg:pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-primary-900 tracking-tight mb-2 sm:mb-3 md:mb-4">
              <span className="gradient-text">PRECIOS Y LÍNEA DE TIEMPO</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 font-normal px-2">
              Estima el tiempo y costo de tu proceso de visa
            </p>
          </motion.div>

        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mt-4 sm:mt-6 md:mt-8"
          >
            <div className="inline-flex p-1 sm:p-1.5 bg-neutral-100 rounded-xl w-full sm:w-auto max-w-xs sm:max-w-md">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 sm:flex-initial px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium text-xs sm:text-sm md:text-base transition-all duration-300 touch-manipulation
                      ${isActive
                        ? 'text-[#3d5de2]'
                        : 'text-neutral-500 hover:text-neutral-700'
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white rounded-lg shadow-soft"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{tab.label}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          
          <motion.p
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs sm:text-sm md:text-base text-neutral-500 mt-2 sm:mt-3"
          >
            {tabs.find(t => t.id === activeTab)?.description}
          </motion.p>
        </div>
      </section>

 
      <section className="py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-4 order-1"
            >
              <div className="lg:sticky lg:top-24">
                <Quiz answers={answers} onAnswersChange={setAnswers} />
              </div>
            </motion.div>

           
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-8 order-2"
            >
        
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6 lg:hidden">
                <div className="card p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-neutral-500 mb-0.5 sm:mb-1">Costo Total</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary-900">
                    ${summary.totalCost.toLocaleString()}
                  </p>
                </div>
                <div className="card p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-neutral-500 mb-0.5 sm:mb-1">Tiempo Total</p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary-900">
                    {summary.totalTime}
                  </p>
                </div>
              </div>

           
              <AnimatePresence mode="wait">
                {activeTab === 'timeline' ? (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <GanttTimeline 
                      answers={answers} 
                      scenario={scenario}
                      onScenarioChange={setScenario}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="pricing"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PricingChart answers={answers} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-elevated z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
      
            <div className="flex items-center gap-2 lg:gap-4 flex-wrap">
              <span className="text-xs lg:text-sm font-medium text-neutral-600">Escenario:</span>
              <div className="flex gap-1.5 lg:gap-2">
                {['optimistic', 'intermediate', 'pessimistic'].map((s) => {
                  const labels = { optimistic: 'Optimista', intermediate: 'Intermedio', pessimistic: 'Pesimista' }
                  return (
                    <button
                      key={s}
                      onClick={() => setScenario(s)}
                      className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all touch-manipulation
                        ${scenario === s
                          ? 'bg-[#3d5de2] text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                    >
                      {labels[s]}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 bg-amber-50 rounded-full text-amber-700 text-xs lg:text-sm">
                <span>RFE</span>
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-amber-500 rounded-full animate-pulse" />
              </div>
            </div>

        
            <div className="flex items-center gap-4 lg:gap-8">
              <div>
                <p className="text-xs lg:text-sm text-neutral-500">Costo total</p>
                <p className="text-lg lg:text-2xl font-bold text-primary-900">
                  ${summary.totalCost.toLocaleString()}
                </p>
                <p className="text-xs text-neutral-400">Pago en cuotas</p>
              </div>
              <div className="h-10 lg:h-12 w-px bg-neutral-200" />
              <div>
                <p className="text-xs lg:text-sm text-neutral-500">Tiempo total</p>
                <p className="text-lg lg:text-2xl font-bold text-primary-900">
                  {summary.totalTime}
                </p>
                <p className="text-xs text-neutral-400">Estimación de alto nivel</p>
              </div>
              <button className="btn-primary flex items-center gap-1.5 lg:gap-2 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base">
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden xl:inline">Hablar sobre mis resultados</span>
                <span className="xl:hidden">Resultados</span>
                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

     
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t border-neutral-200 shadow-elevated z-40 fixed-bottom-safe">
        <div className="max-w-lg mx-auto">
          
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div>
                <p className="text-[10px] sm:text-xs text-neutral-500">Costo</p>
                <p className="text-sm sm:text-base font-bold text-primary-900">
                  ${summary.totalCost.toLocaleString()}
                </p>
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div>
                <p className="text-[10px] sm:text-xs text-neutral-500">Tiempo</p>
                <p className="text-sm sm:text-base font-bold text-primary-900">
                  {summary.totalTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-full text-amber-700 text-[10px] sm:text-xs">
              <span>RFE</span>
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            </div>
          </div>
          
          <button className="btn-primary w-full flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Hablar sobre mis resultados</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      
      <div className="h-28 sm:h-32 lg:h-28" />

      <Footer />
    </div>
  )
}

export default App