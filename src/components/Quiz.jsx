import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Info, Users, Globe, FileText, Zap, HelpCircle } from 'lucide-react'

const Quiz = ({ onAnswersChange, answers }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showInfo, setShowInfo] = useState(null)

  const questions = [
    {
      id: 'visaType',
      question: '¿En qué tipo de visa estás interesado?',
      icon: FileText,
      info: 'Elige la categoría de visa que mejor se ajuste a tus objetivos migratorios.',
      options: [
        { value: 'eb1a', label: 'EB-1A', description: 'Habilidad Extraordinaria', time: { optimistic: 8, intermediate: 14, pessimistic: 24 }, cost: 12500 },
        { value: 'eb2niw', label: 'EB-2 NIW', description: 'Exención por Interés Nacional', time: { optimistic: 10, intermediate: 18, pessimistic: 30 }, cost: 11000 },
        { value: 'o1a', label: 'O-1A', description: 'Habilidad Extraordinaria', time: { optimistic: 3, intermediate: 5, pessimistic: 8 }, cost: 8500 },
        { value: 'o1b', label: 'O-1B', description: 'Artes y Entretenimiento', time: { optimistic: 3, intermediate: 5, pessimistic: 8 }, cost: 8500 },
        { value: 'h1b', label: 'H-1B', description: 'Ocupación Especializada', time: { optimistic: 6, intermediate: 9, pessimistic: 15 }, cost: 7500 },
        { value: 'l1', label: 'L-1', description: 'Transferencia Intraempresarial', time: { optimistic: 4, intermediate: 7, pessimistic: 12 }, cost: 9000 },
      ]
    },
    {
      id: 'country',
      question: '¿De qué país eres?',
      icon: Globe,
      info: 'Tu país de origen afecta los tiempos de procesamiento debido a las prioridades del boletín de visas.',
      options: [
        { value: 'india', label: 'India', timeMultiplier: 1.3 },
        { value: 'china', label: 'China', timeMultiplier: 1.25 },
        { value: 'mexico', label: 'México', timeMultiplier: 1.1 },
        { value: 'philippines', label: 'Filipinas', timeMultiplier: 1.15 },
        { value: 'other', label: 'Otro País', timeMultiplier: 1 },
      ]
    },
    {
      id: 'currentStatus',
      question: '¿Cuál es tu estatus migratorio actual?',
      icon: FileText,
      info: 'Tu estatus actual puede afectar las vías disponibles y los plazos.',
      options: [
        { value: 'h1b', label: 'Titular de H-1B', costAdjustment: 0 },
        { value: 'f1', label: 'Estudiante F-1', costAdjustment: 500 },
        { value: 'l1', label: 'Titular de L-1', costAdjustment: 0 },
        { value: 'o1', label: 'Titular de O-1', costAdjustment: 0 },
        { value: 'outside', label: 'Fuera de EE.UU.', costAdjustment: 1500 },
        { value: 'other', label: 'Otro Estatus', costAdjustment: 750 },
      ]
    },
    {
      id: 'dependents',
      question: '¿Cuántos dependientes se incluirán?',
      icon: Users,
      info: 'Los dependientes incluyen cónyuge e hijos solteros menores de 21 años.',
      options: [
        { value: '0', label: 'Sin dependientes', costPerDependent: 0, count: 0 },
        { value: '1', label: '1 dependiente', costPerDependent: 1500, count: 1 },
        { value: '2', label: '2 dependientes', costPerDependent: 1500, count: 2 },
        { value: '3', label: '3 dependientes', costPerDependent: 1500, count: 3 },
        { value: '4+', label: '4+ dependientes', costPerDependent: 1500, count: 4 },
      ]
    },
    {
      id: 'premium',
      question: '¿Quieres procesamiento premium?',
      icon: Zap,
      info: 'El procesamiento premium garantiza una respuesta dentro de 15 días hábiles para categorías de visa elegibles.',
      options: [
        { value: 'yes', label: 'Sí, premium', description: 'Más rápido (15 días)', cost: 2805, timeReduction: 0.5 },
        { value: 'no', label: 'No, estándar', description: 'Tiempo regular', cost: 0, timeReduction: 1 },
      ]
    },
  ]

  const handleAnswer = (questionId, option) => {
    const newAnswers = { ...answers, [questionId]: option }
    onAnswersChange(newAnswers)
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    }
  }

  const currentQ = questions[currentQuestion]
  const Icon = currentQ.icon
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-2 sm:mb-3 md:mb-4">
        <div className="flex justify-between items-center mb-1 sm:mb-1.5">
          <span className="text-[10px] sm:text-xs font-medium text-neutral-500">
            Pregunta {currentQuestion + 1} de {questions.length}
          </span>
          <span className="text-[10px] sm:text-xs font-medium text-[#3d5de2]">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1 sm:h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#3d5de2] to-[#6366f1] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="card p-2.5 sm:p-3 md:p-4"
        >
          {/* Question Header */}
          <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-md sm:rounded-lg bg-[#eef2ff] flex items-center justify-center flex-shrink-0">
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3d5de2]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-primary-900 mb-0.5 leading-tight">
                {currentQ.question}
              </h3>
              <button
                onClick={() => setShowInfo(showInfo === currentQ.id ? null : currentQ.id)}
                className="flex items-center gap-1 text-[10px] sm:text-xs text-neutral-500 hover:text-[#3d5de2] transition-colors touch-manipulation"
              >
                <Info className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                <span>Más información</span>
              </button>
            </div>
          </div>

          {/* Info Panel */}
          <AnimatePresence>
            {showInfo === currentQ.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-2 sm:mb-3 md:mb-4 p-2 sm:p-2.5 md:p-3 bg-[#eef2ff] rounded-md sm:rounded-lg border border-[#c7d2fe]"
              >
                <div className="flex gap-1.5 sm:gap-2">
                  <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-[#3d5de2] flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] sm:text-xs text-[#3d5de2]">{currentQ.info}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Options */}
          <div className="grid gap-1.5 sm:gap-2">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQ.id]?.value === option.value
              return (
                <motion.button
                  key={option.value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleAnswer(currentQ.id, option)}
                  className={`w-full p-2 sm:p-2.5 md:p-3 rounded-md sm:rounded-lg border-2 text-left transition-all duration-300 touch-manipulation
                    ${isSelected
                      ? 'border-[#3d5de2] bg-[#eef2ff] shadow-soft'
                      : 'border-neutral-200 hover:border-[#a5b4fc] hover:bg-neutral-50 active:bg-neutral-100'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-[#3d5de2]' : 'text-neutral-800'}`}>
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="text-[10px] sm:text-xs text-neutral-500 truncate">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ml-2
                      ${isSelected 
                        ? 'border-[#3d5de2] bg-[#3d5de2]' 
                        : 'border-neutral-300'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 md:pt-4 border-t border-neutral-100">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 rounded-md sm:rounded-lg transition-all text-[10px] sm:text-xs md:text-sm touch-manipulation
                ${currentQuestion === 0
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-600 hover:text-[#3d5de2] hover:bg-neutral-50 active:bg-neutral-100'
                }`}
            >
              <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <span>Anterior</span>
            </button>

            <div className="flex gap-1 sm:gap-1.5">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 touch-manipulation
                    ${index === currentQuestion
                      ? 'bg-[#3d5de2] w-3 sm:w-4'
                      : index < currentQuestion && answers[questions[index].id]
                        ? 'bg-[#a5b4fc]'
                        : 'bg-neutral-200 hover:bg-neutral-300'
                    }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === questions.length - 1 || !answers[currentQ.id]}
              className={`flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-1.5 rounded-md sm:rounded-lg transition-all text-[10px] sm:text-xs md:text-sm touch-manipulation
                ${currentQuestion === questions.length - 1 || !answers[currentQ.id]
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-600 hover:text-[#3d5de2] hover:bg-neutral-50 active:bg-neutral-100'
                }`}
            >
              <span>Siguiente</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Quick Navigation Pills */}
      <div className="mt-2 sm:mt-3 md:mt-4 flex flex-wrap gap-1 sm:gap-1.5 justify-center">
        {questions.map((q, index) => {
          const QIcon = q.icon
          const hasAnswer = answers[q.id]
          return (
            <motion.button
              key={q.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setCurrentQuestion(index)}
              className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs transition-all touch-manipulation
                ${index === currentQuestion
                  ? 'bg-[#3d5de2] text-white'
                  : hasAnswer
                    ? 'bg-[#eef2ff] text-[#3d5de2] border border-[#c7d2fe]'
                    : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
            >
              <QIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {hasAnswer && index !== currentQuestion && (
                <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default Quiz