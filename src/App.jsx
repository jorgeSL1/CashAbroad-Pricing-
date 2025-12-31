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
      label: 'Timeline', 
      description: 'Process time visualization',
      icon: Clock 
    },
    { 
      id: 'pricing', 
      label: 'Pricing', 
      description: 'Process cost visualization',
      icon: DollarSign 
    },
  ]

  // Calculate summary values
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
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 md:pt-32 pb-6 sm:pb-8 md:pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-primary-900 tracking-tight mb-3 sm:mb-4">
              <span className="gradient-text">PRICING AND TIMELINE</span>
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 font-normal">
              Estimate the time and cost of your visa process
            </p>
          </motion.div>

          {/* Tab Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mt-6 sm:mt-8"
          >
            <div className="inline-flex p-1 sm:p-1.5 bg-neutral-100 rounded-xl w-full sm:w-auto max-w-md">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 sm:flex-initial px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300
                      ${isActive
                        ? 'text-primary-800'
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
                      <span className="hidden xs:inline">{tab.label}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Tab Description */}
          <motion.p
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm sm:text-base text-neutral-500 mt-2 sm:mt-3"
          >
            {tabs.find(t => t.id === activeTab)?.description}
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Column - Quiz (más pequeño) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-4"
            >
              <Quiz answers={answers} onAnswersChange={setAnswers} />
            </motion.div>

            {/* Right Column - Results (más grande, centrado) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-8 lg:sticky lg:top-24 lg:self-start"
            >
              {/* Summary Cards - Mobile */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 lg:hidden">
                <div className="card p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-neutral-500 mb-1">Total Cost</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary-900">
                    ${summary.totalCost.toLocaleString()}
                  </p>
                </div>
                <div className="card p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-neutral-500 mb-1">Total Time</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary-900">
                    {summary.totalTime}
                  </p>
                </div>
              </div>

              {/* Tab Content */}
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

      {/* Desktop Summary Bar */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-elevated z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Scenario Selection */}
            <div className="flex items-center gap-2 lg:gap-4 flex-wrap">
              <span className="text-xs lg:text-sm font-medium text-neutral-600">Scenario:</span>
              <div className="flex gap-1.5 lg:gap-2">
                {['optimistic', 'intermediate', 'pessimistic'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScenario(s)}
                    className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all
                      ${scenario === s
                        ? 'bg-primary-800 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 bg-amber-50 rounded-full text-amber-700 text-xs lg:text-sm">
                <span>RFE</span>
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-amber-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Summary Values */}
            <div className="flex items-center gap-4 lg:gap-8">
              <div>
                <p className="text-xs lg:text-sm text-neutral-500">Total cost</p>
                <p className="text-lg lg:text-2xl font-bold text-primary-900">
                  ${summary.totalCost.toLocaleString()}
                </p>
                <p className="text-xs text-neutral-400">Payment in installments</p>
              </div>
              <div className="h-10 lg:h-12 w-px bg-neutral-200" />
              <div>
                <p className="text-xs lg:text-sm text-neutral-500">Total time</p>
                <p className="text-lg lg:text-2xl font-bold text-primary-900">
                  {summary.totalTime}
                </p>
                <p className="text-xs text-neutral-400">High-level estimation</p>
              </div>
              <button className="btn-primary flex items-center gap-1.5 lg:gap-2 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base">
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden xl:inline">Talk about my results</span>
                <span className="xl:hidden">Results</span>
                <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t border-neutral-200 shadow-elevated z-40">
        <button className="btn-primary w-full flex items-center justify-center gap-2 text-sm sm:text-base py-2.5 sm:py-3">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          Talk about my results
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="h-24 lg:h-28" />

      <Footer />
    </div>
  )
}

export default App