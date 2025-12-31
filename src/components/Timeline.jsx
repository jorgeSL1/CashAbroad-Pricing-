import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, AlertCircle, CheckCircle2, ChevronDown, Calendar, TrendingUp } from 'lucide-react'

const Timeline = ({ answers, scenario, onScenarioChange }) => {
  const [expandedPhase, setExpandedPhase] = useState(null)

  const scenarios = [
    { 
      id: 'optimistic', 
      label: 'Optimistic', 
      description: 'Fastest time with no step backs',
      color: 'emerald',
      icon: TrendingUp
    },
    { 
      id: 'intermediate', 
      label: 'Intermediate', 
      description: 'Moderate time with minor delays',
      color: 'blue',
      icon: Clock
    },
    { 
      id: 'pessimistic', 
      label: 'Pessimistic', 
      description: 'Longest time due to delays',
      color: 'amber',
      icon: AlertCircle
    },
  ]

  const getPhases = useMemo(() => {
    if (!answers.visaType) return []

    const visaData = answers.visaType
    const countryMultiplier = answers.country?.timeMultiplier || 1
    const premiumReduction = answers.premium?.timeReduction || 1

    const baseTime = visaData.time?.[scenario] || 12
    const adjustedTime = Math.round(baseTime * countryMultiplier * premiumReduction)

    const phases = [
      {
        id: 'preparation',
        name: 'Case Preparation',
        description: 'Document gathering and initial assessment',
        duration: Math.max(1, Math.round(adjustedTime * 0.2)),
        details: [
          'Initial consultation and case assessment',
          'Document collection checklist',
          'Evidence compilation',
          'Expert letter requests',
        ],
        status: 'upcoming'
      },
      {
        id: 'filing',
        name: 'Filing & Submission',
        description: 'Petition preparation and USCIS submission',
        duration: Math.max(1, Math.round(adjustedTime * 0.15)),
        details: [
          'Petition drafting',
          'Form preparation (I-140, I-129, etc.)',
          'Supporting documentation',
          'USCIS submission',
        ],
        status: 'upcoming'
      },
      {
        id: 'processing',
        name: 'USCIS Processing',
        description: 'USCIS review and adjudication',
        duration: Math.max(2, Math.round(adjustedTime * 0.45)),
        details: [
          'Receipt notice',
          'Biometrics appointment (if required)',
          'Background checks',
          'Case adjudication',
        ],
        status: 'upcoming'
      },
      {
        id: 'decision',
        name: 'Decision & Next Steps',
        description: 'Final decision and post-approval steps',
        duration: Math.max(1, Math.round(adjustedTime * 0.2)),
        details: [
          'Approval notice',
          'Consular processing (if applicable)',
          'Status activation',
          'EAD/AP (if applicable)',
        ],
        status: 'upcoming'
      },
    ]

    return phases
  }, [answers, scenario])

  const totalTime = useMemo(() => {
    return getPhases.reduce((sum, phase) => sum + phase.duration, 0)
  }, [getPhases])

  const getScenarioColor = (scenarioId) => {
    const colors = {
      optimistic: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-500',
        text: 'text-emerald-700',
        fill: 'bg-emerald-500',
        gradient: 'from-emerald-500 to-emerald-600'
      },
      intermediate: {
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-700',
        fill: 'bg-blue-500',
        gradient: 'from-blue-500 to-blue-600'
      },
      pessimistic: {
        bg: 'bg-amber-50',
        border: 'border-amber-500',
        text: 'text-amber-700',
        fill: 'bg-amber-500',
        gradient: 'from-amber-500 to-amber-600'
      }
    }
    return colors[scenarioId] || colors.intermediate
  }

  const currentColors = getScenarioColor(scenario)

  if (!answers.visaType) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
          <Clock className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">
          Select a Visa Type
        </h3>
        <p className="text-neutral-500">
          Answer the questions to see your personalized timeline
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary-800" />
          <span className="font-medium text-primary-900">Select Scenario</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scenarios.map((s) => {
            const isActive = scenario === s.id
            const colors = getScenarioColor(s.id)
            const Icon = s.icon
            return (
              <motion.button
                key={s.id}
                onClick={() => onScenarioChange(s.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-300
                  ${isActive 
                    ? `${colors.border} ${colors.bg}` 
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                    ${isActive ? colors.fill : 'bg-neutral-100'}`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  </div>
                  <span className={`font-semibold ${isActive ? colors.text : 'text-neutral-800'}`}>
                    {s.label}
                  </span>
                </div>
                <p className="text-sm text-neutral-500">{s.description}</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* RFE Warning */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-amber-50 border border-amber-200 rounded-xl"
      >
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800 mb-1">RFE Possibility</h4>
            <p className="text-sm text-amber-700">
              USCIS may request additional information before deciding on your petition 
              (this might happen even if your case is strong).
            </p>
          </div>
        </div>
      </motion.div>

      {/* Total Time Summary */}
      <motion.div
        key={scenario}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`card p-6 border-l-4 ${currentColors.border}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Estimated Total Time</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary-900">{totalTime}</span>
              <span className="text-lg text-neutral-600">months</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full ${currentColors.bg} ${currentColors.text} font-medium`}>
            {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
          </div>
        </div>
      </motion.div>

      {/* Timeline Visualization */}
      <div className="card p-6">
        <h4 className="font-semibold text-primary-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Process Timeline
        </h4>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-3 bg-neutral-100 rounded-full overflow-hidden flex">
            {getPhases.map((phase, index) => {
              const width = (phase.duration / totalTime) * 100
              return (
                <motion.div
                  key={phase.id}
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${currentColors.gradient} ${index > 0 ? 'border-l-2 border-white' : ''}`}
                  style={{ opacity: 0.6 + (index * 0.1) }}
                />
              )
            })}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-neutral-500">Start</span>
            <span className="text-sm text-neutral-500">{totalTime} months</span>
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-3">
          {getPhases.map((phase, index) => {
            const isExpanded = expandedPhase === phase.id
            const cumulativeTime = getPhases.slice(0, index + 1).reduce((sum, p) => sum + p.duration, 0)
            
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-xl overflow-hidden transition-all duration-300
                  ${isExpanded ? `${currentColors.border} ${currentColors.bg}` : 'border-neutral-200'}`}
              >
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${isExpanded ? `${currentColors.fill}` : 'bg-neutral-100'}`}
                    >
                      <span className={`font-semibold ${isExpanded ? 'text-white' : 'text-neutral-600'}`}>
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-medium text-primary-900">{phase.name}</h5>
                      <p className="text-sm text-neutral-500">{phase.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-primary-900">{phase.duration} mo</p>
                      <p className="text-xs text-neutral-500">Month {cumulativeTime}</p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-300
                      ${isExpanded ? 'rotate-180' : ''}`} 
                    />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-neutral-100">
                        <ul className="space-y-2">
                          {phase.details.map((detail, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-center gap-3 text-sm"
                            >
                              <CheckCircle2 className={`w-4 h-4 ${currentColors.text} flex-shrink-0`} />
                              <span className="text-neutral-700">{detail}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Timeline
