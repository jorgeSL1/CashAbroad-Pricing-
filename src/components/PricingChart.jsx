import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { DollarSign, ChevronDown, FileText, Users, Zap, Building2, Info } from 'lucide-react'

const PricingChart = ({ answers }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 640
  const isTablet = windowWidth >= 640 && windowWidth < 1024

  const calculateCosts = useMemo(() => {
    if (!answers.visaType) {
      return { total: 0, breakdown: [], categories: [] }
    }

    const baseCost = answers.visaType.cost || 0
    const statusAdjustment = answers.currentStatus?.costAdjustment || 0
    const dependentCount = answers.dependents?.count || 0
    const dependentCost = dependentCount * (answers.dependents?.costPerDependent || 0)
    const premiumCost = answers.premium?.cost || 0

    const uscisBaseFees = {
      'eb1a': 700, 'eb2niw': 700, 'o1a': 460, 'o1b': 460, 'h1b': 460, 'l1': 460,
    }

    const uscisBase = uscisBaseFees[answers.visaType.value] || 500
    const uscisDependentFee = dependentCount * 350
    const totalUscis = uscisBase + uscisDependentFee + (premiumCost > 0 ? premiumCost : 0)

    const legalFees = baseCost - uscisBase
    const total = baseCost + statusAdjustment + dependentCost + premiumCost

    const breakdown = [
      { name: 'Honorarios Legales', value: legalFees, description: 'Servicios de abogado y asistente legal', icon: FileText, color: '#2d3a8c' },
      { name: 'Tarifas de USCIS', value: totalUscis, description: 'Tarifas gubernamentales de presentación', icon: Building2, color: '#3d5de2' },
    ]

    if (dependentCost > 0) {
      breakdown.push({ name: 'Tarifas de Dependientes', value: dependentCost, description: `Tarifas adicionales para ${dependentCount} dependiente(s)`, icon: Users, color: '#14b8a6' })
    }
    if (statusAdjustment > 0) {
      breakdown.push({ name: 'Ajuste de Estatus', value: statusAdjustment, description: 'Procesamiento adicional basado en el estatus actual', icon: FileText, color: '#8b5cf6' })
    }
    if (premiumCost > 0) {
      breakdown.push({ name: 'Procesamiento Premium', value: premiumCost, description: 'Procesamiento de 15 días hábiles', icon: Zap, color: '#f59e0b' })
    }

    const scenarioData = [
      { name: 'Tu Estimación', amount: total },
      { name: 'Promedio Industria', amount: Math.round(total * 1.2) },
      { name: 'Alta Gama', amount: Math.round(total * 1.5) },
    ]

    return { total, breakdown, scenarioData, legalFees, uscis: totalUscis }
  }, [answers])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 rounded-lg shadow-elevated border border-neutral-100">
          <p className="font-medium text-xs sm:text-sm text-primary-900">{payload[0].payload.name}</p>
          <p className="text-sm sm:text-lg font-semibold text-[#3d5de2]">${payload[0].value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  if (!answers.visaType) {
    return (
      <div className="card p-6 sm:p-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
          <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-400" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-neutral-800 mb-1 sm:mb-2">Selecciona un Tipo de Visa</h3>
        <p className="text-sm text-neutral-500">Responde las preguntas para ver tu precio personalizado</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
    
      <motion.div key={calculateCosts.total} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="card p-3 sm:p-4 md:p-6 border-l-4 border-[#3d5de2]">
        <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3 md:gap-4">
          <div>
            <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 mb-0.5 sm:mb-1">Costo Total Estimado</p>
            <div className="flex items-baseline gap-1 sm:gap-1.5 md:gap-2">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-900">${calculateCosts.total.toLocaleString()}</span>
              <span className="text-[10px] sm:text-xs md:text-sm text-neutral-500">USD</span>
            </div>
            <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 mt-0.5 sm:mt-1">Pago en cuotas • Incluye todas las tarifas</p>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-[#eef2ff] rounded-full">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#3d5de2]" />
            <span className="font-medium text-xs sm:text-sm md:text-base text-[#3d5de2]">{answers.visaType.label}</span>
          </div>
        </div>
      </motion.div>

      <div className="card p-3 sm:p-4 md:p-6">
        <button onClick={() => setShowDetails(!showDetails)} className="w-full flex items-center justify-between mb-2 sm:mb-3 md:mb-4 touch-manipulation">
          <h4 className="font-semibold text-xs sm:text-sm md:text-base text-primary-900 flex items-center gap-1.5 sm:gap-2">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />Desglose de Costos
          </h4>
          <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 md:mb-6">
                {calculateCosts.breakdown.map((item, index) => {
                  const Icon = item.icon
                  const percentage = (item.value / calculateCosts.total) * 100
                  return (
                    <motion.div key={item.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                      className="p-2 sm:p-3 md:p-4 bg-neutral-50 rounded-lg sm:rounded-xl"
                      onMouseEnter={() => setActiveCategory(item.name)} onMouseLeave={() => setActiveCategory(null)}>
                      <div className="flex items-start sm:items-center justify-between mb-1.5 sm:mb-2 flex-wrap sm:flex-nowrap gap-1.5 sm:gap-2">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${item.color}15` }}>
                            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" style={{ color: item.color }} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-xs sm:text-sm md:text-base text-primary-900">{item.name}</p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-xs sm:text-sm md:text-base text-primary-900">${item.value.toLocaleString()}</p>
                          <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500">{percentage.toFixed(0)}%</p>
                        </div>
                      </div>
                      <div className="h-1 sm:h-1.5 md:h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full rounded-full" style={{ backgroundColor: item.color }} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

       
        <div className="h-48 sm:h-56 md:h-64 mt-2 sm:mt-3 md:mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={calculateCosts.breakdown} cx="50%" cy="50%"
                innerRadius={isMobile ? 40 : isTablet ? 50 : 60} outerRadius={isMobile ? 65 : isTablet ? 75 : 90}
                paddingAngle={2} dataKey="value" animationBegin={0} animationDuration={800}>
                {calculateCosts.breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color}
                    opacity={activeCategory && activeCategory !== entry.name ? 0.4 : 1}
                    style={{ transition: 'opacity 0.3s' }} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span className="text-[10px] sm:text-xs md:text-sm text-neutral-700">{value}</span>}
                wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="card p-3 sm:p-4 md:p-6">
        <h4 className="font-semibold text-xs sm:text-sm md:text-base text-primary-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-1.5 sm:gap-2">
          <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />Comparación de Mercado
        </h4>

        <div className="h-48 sm:h-56 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calculateCosts.scenarioData} barGap={isMobile ? 2 : 8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: isMobile ? 9 : 12 }} axisLine={{ stroke: '#e4e4e7' }}
                tickFormatter={(value) => isMobile ? value.split(' ')[0] : value} />
              <YAxis tick={{ fill: '#71717a', fontSize: isMobile ? 9 : 12 }} axisLine={{ stroke: '#e4e4e7' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} width={isMobile ? 35 : 50} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} animationBegin={0} animationDuration={800}>
                {calculateCosts.scenarioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#2d3a8c' : index === 1 ? '#3d5de2' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 mt-2 sm:mt-3 md:mt-4">
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-[#2d3a8c]" />
            <span className="text-[10px] sm:text-xs md:text-sm text-neutral-600">Tu Estimación</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-[#3d5de2]" />
            <span className="text-[10px] sm:text-xs md:text-sm text-neutral-600">Promedio Industria</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-neutral-400" />
            <span className="text-[10px] sm:text-xs md:text-sm text-neutral-600">Alta Gama</span>
          </div>
        </div>
      </div>

     
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="p-2.5 sm:p-3 md:p-4 bg-neutral-50 rounded-lg sm:rounded-xl border border-neutral-200">
        <div className="flex gap-2 sm:gap-3">
          <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-xs sm:text-sm md:text-base text-neutral-800 mb-0.5 sm:mb-1">Descargo de Responsabilidad</h5>
            <p className="text-[10px] sm:text-xs md:text-sm text-neutral-600">
              Estos son costos estimados basados en casos típicos. Las tarifas reales pueden variar dependiendo de la complejidad del caso y circunstancias específicas.
              Las tarifas gubernamentales están sujetas a cambios. Contáctanos para una cotización personalizada.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PricingChart