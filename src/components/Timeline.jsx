import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, AlertCircle, CheckCircle2, ChevronDown, Calendar, TrendingUp } from 'lucide-react'

const Timeline = ({ answers, scenario, onScenarioChange }) => {
  const [expandedPhase, setExpandedPhase] = useState(null)

  const scenarios = [
    { id: 'optimistic', label: 'Optimista', shortLabel: 'Rápido', description: 'Tiempo más rápido sin contratiempos', color: 'emerald', icon: TrendingUp },
    { id: 'intermediate', label: 'Intermedio', shortLabel: 'Normal', description: 'Tiempo moderado con retrasos menores', color: 'blue', icon: Clock },
    { id: 'pessimistic', label: 'Pesimista', shortLabel: 'Lento', description: 'Tiempo más largo debido a retrasos', color: 'amber', icon: AlertCircle },
  ]

  const getPhases = useMemo(() => {
    if (!answers.visaType) return []

    const visaData = answers.visaType
    const countryMultiplier = answers.country?.timeMultiplier || 1
    const premiumReduction = answers.premium?.timeReduction || 1

    const baseTime = visaData.time?.[scenario] || 12
    const adjustedTime = Math.round(baseTime * countryMultiplier * premiumReduction)

    const phases = [
      { id: 'preparation', name: 'Preparación del Caso', description: 'Recopilación de documentos y evaluación inicial',
        duration: Math.max(1, Math.round(adjustedTime * 0.2)),
        details: ['Consulta inicial', 'Recopilación de documentos', 'Compilación de evidencia', 'Cartas de expertos'], status: 'upcoming' },
      { id: 'filing', name: 'Presentación y Envío', description: 'Preparación de petición y envío a USCIS',
        duration: Math.max(1, Math.round(adjustedTime * 0.15)),
        details: ['Redacción de petición', 'Preparación de formularios', 'Documentos de apoyo', 'Envío a USCIS'], status: 'upcoming' },
      { id: 'processing', name: 'Procesamiento de USCIS', description: 'Revisión y adjudicación de USCIS',
        duration: Math.max(2, Math.round(adjustedTime * 0.45)),
        details: ['Aviso de recibo', 'Biometría', 'Verificaciones de antecedentes', 'Adjudicación del caso'], status: 'upcoming' },
      { id: 'decision', name: 'Decisión y Próximos Pasos', description: 'Decisión final y pasos posteriores a la aprobación',
        duration: Math.max(1, Math.round(adjustedTime * 0.2)),
        details: ['Aviso de aprobación', 'Procesamiento consular', 'Activación de estatus', 'EAD/AP'], status: 'upcoming' },
    ]

    return phases
  }, [answers, scenario])

  const totalTime = useMemo(() => getPhases.reduce((sum, phase) => sum + phase.duration, 0), [getPhases])

  const getScenarioColor = (scenarioId) => {
    const colors = {
      optimistic: { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-700', fill: 'bg-emerald-500', gradient: 'from-emerald-500 to-emerald-600' },
      intermediate: { bg: 'bg-[#eef2ff]', border: 'border-[#3d5de2]', text: 'text-[#3d5de2]', fill: 'bg-[#3d5de2]', gradient: 'from-[#3d5de2] to-[#2d3a8c]' },
      pessimistic: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', fill: 'bg-amber-500', gradient: 'from-amber-500 to-amber-600' }
    }
    return colors[scenarioId] || colors.intermediate
  }

  const currentColors = getScenarioColor(scenario)

  if (!answers.visaType) {
    return (
      <div className="card p-6 sm:p-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
          <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-400" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-neutral-800 mb-1 sm:mb-2">Selecciona un Tipo de Visa</h3>
        <p className="text-sm text-neutral-500">Responde las preguntas para ver tu línea de tiempo personalizada</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
     
      <div className="card p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-3 md:mb-4">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#3d5de2]" />
          <span className="font-medium text-xs sm:text-sm md:text-base text-primary-900">Selecciona Escenario</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3">
          {scenarios.map((s) => {
            const isActive = scenario === s.id
            const colors = getScenarioColor(s.id)
            const Icon = s.icon
            return (
              <motion.button key={s.id} onClick={() => onScenarioChange(s.id)} whileTap={{ scale: 0.98 }}
                className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all duration-300 touch-manipulation
                  ${isActive ? `${colors.border} ${colors.bg}` : 'border-neutral-200 hover:border-neutral-300 bg-white'}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 md:gap-3 mb-0.5 sm:mb-1 md:mb-2">
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg flex items-center justify-center ${isActive ? colors.fill : 'bg-neutral-100'}`}>
                    <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  </div>
                  <span className={`font-semibold text-xs sm:text-sm md:text-base ${isActive ? colors.text : 'text-neutral-800'}`}>
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{s.shortLabel}</span>
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 hidden sm:block">{s.description}</p>
              </motion.button>
            )
          })}
        </div>
      </div>

     
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl">
        <div className="flex gap-2 sm:gap-3">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-xs sm:text-sm md:text-base text-amber-800 mb-0.5 sm:mb-1">Posibilidad de RFE</h4>
            <p className="text-[10px] sm:text-xs md:text-sm text-amber-700">
              USCIS puede solicitar información adicional antes de decidir sobre tu petición.
            </p>
          </div>
        </div>
      </motion.div>

     
      <motion.div key={scenario} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={`card p-3 sm:p-4 md:p-6 border-l-4 ${currentColors.border}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 mb-0.5 sm:mb-1">Tiempo Total Estimado</p>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-900">{totalTime}</span>
              <span className="text-sm sm:text-base md:text-lg text-neutral-600">meses</span>
            </div>
          </div>
          <div className={`px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full ${currentColors.bg} ${currentColors.text} font-medium text-xs sm:text-sm md:text-base`}>
            {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
          </div>
        </div>
      </motion.div>

      
      <div className="card p-3 sm:p-4 md:p-6">
        <h4 className="font-semibold text-xs sm:text-sm md:text-base text-primary-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />Línea de Tiempo del Proceso
        </h4>
        
      
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="h-2 sm:h-3 bg-neutral-100 rounded-full overflow-hidden flex">
            {getPhases.map((phase, index) => {
              const width = (phase.duration / totalTime) * 100
              return (
                <motion.div key={phase.id} initial={{ width: 0 }} animate={{ width: `${width}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`h-full bg-gradient-to-r ${currentColors.gradient} ${index > 0 ? 'border-l-2 border-white' : ''}`}
                  style={{ opacity: 0.6 + (index * 0.1) }} />
              )
            })}
          </div>
          <div className="flex justify-between mt-1.5 sm:mt-2">
            <span className="text-[10px] sm:text-xs md:text-sm text-neutral-500">Inicio</span>
            <span className="text-[10px] sm:text-xs md:text-sm text-neutral-500">{totalTime} meses</span>
          </div>
        </div>

        
        <div className="space-y-2 sm:space-y-3">
          {getPhases.map((phase, index) => {
            const isExpanded = expandedPhase === phase.id
            const cumulativeTime = getPhases.slice(0, index + 1).reduce((sum, p) => sum + p.duration, 0)
            
            return (
              <motion.div key={phase.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300
                  ${isExpanded ? `${currentColors.border} ${currentColors.bg}` : 'border-neutral-200'}`}>
                <button onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className="w-full p-2.5 sm:p-3 md:p-4 flex items-center justify-between text-left touch-manipulation">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center
                      ${isExpanded ? currentColors.fill : 'bg-neutral-100'}`}>
                      <span className={`font-semibold text-xs sm:text-sm ${isExpanded ? 'text-white' : 'text-neutral-600'}`}>{index + 1}</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-xs sm:text-sm md:text-base text-primary-900">{phase.name}</h5>
                      <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 hidden xs:block">{phase.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-xs sm:text-sm md:text-base text-primary-900">{phase.duration} {phase.duration === 1 ? 'mes' : 'meses'}</p>
                      <p className="text-[10px] sm:text-xs text-neutral-500 hidden xs:block">Mes {cumulativeTime}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-1 sm:pt-2 border-t border-neutral-100">
                        <ul className="space-y-1.5 sm:space-y-2">
                          {phase.details.map((detail, i) => (
                            <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }} className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm">
                              <CheckCircle2 className={`w-3 h-3 sm:w-4 sm:h-4 ${currentColors.text} flex-shrink-0`} />
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