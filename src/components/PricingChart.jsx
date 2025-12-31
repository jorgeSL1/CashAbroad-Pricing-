import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { DollarSign, ChevronDown, FileText, Users, Zap, Building2, Info } from 'lucide-react'

const PricingChart = ({ answers }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)

  const calculateCosts = useMemo(() => {
    if (!answers.visaType) {
      return {
        total: 0,
        breakdown: [],
        categories: []
      }
    }

    const baseCost = answers.visaType.cost || 0
    const statusAdjustment = answers.currentStatus?.costAdjustment || 0
    const dependentCount = answers.dependents?.count || 0
    const dependentCost = dependentCount * (answers.dependents?.costPerDependent || 0)
    const premiumCost = answers.premium?.cost || 0

    // USCIS Fees based on visa type
    const uscisBaseFees = {
      'eb1a': 700,
      'eb2niw': 700,
      'o1a': 460,
      'o1b': 460,
      'h1b': 460,
      'l1': 460,
    }

    const uscisBase = uscisBaseFees[answers.visaType.value] || 500
    const uscisDependentFee = dependentCount * 350
    const totalUscis = uscisBase + uscisDependentFee + (premiumCost > 0 ? premiumCost : 0)

    const legalFees = baseCost - uscisBase
    const total = baseCost + statusAdjustment + dependentCost + premiumCost

    const breakdown = [
      { 
        name: 'Legal Fees', 
        value: legalFees,
        description: 'Attorney and paralegal services',
        icon: FileText,
        color: '#1a1f4e'
      },
      { 
        name: 'USCIS Fees', 
        value: totalUscis,
        description: 'Government filing fees',
        icon: Building2,
        color: '#3b82f6'
      },
    ]

    if (dependentCost > 0) {
      breakdown.push({ 
        name: 'Dependent Fees', 
        value: dependentCost,
        description: `Additional fees for ${dependentCount} dependent(s)`,
        icon: Users,
        color: '#14b8a6'
      })
    }

    if (statusAdjustment > 0) {
      breakdown.push({ 
        name: 'Status Adjustment', 
        value: statusAdjustment,
        description: 'Additional processing based on current status',
        icon: FileText,
        color: '#8b5cf6'
      })
    }

    if (premiumCost > 0) {
      breakdown.push({ 
        name: 'Premium Processing', 
        value: premiumCost,
        description: '15 business day processing',
        icon: Zap,
        color: '#f59e0b'
      })
    }

    // Data for bar chart - comparison by scenario
    const scenarioData = [
      { name: 'Your Estimate', amount: total },
      { name: 'Industry Avg', amount: Math.round(total * 1.2) },
      { name: 'High-End', amount: Math.round(total * 1.5) },
    ]

    return {
      total,
      breakdown,
      scenarioData,
      legalFees,
      uscis: totalUscis,
    }
  }, [answers])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-elevated border border-neutral-100">
          <p className="font-medium text-primary-900">{payload[0].payload.name}</p>
          <p className="text-lg font-semibold text-primary-800">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  const COLORS = ['#1a1f4e', '#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b']

  if (!answers.visaType) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
          <DollarSign className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">
          Select a Visa Type
        </h3>
        <p className="text-neutral-500">
          Answer the questions to see your personalized pricing
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Total Cost Card */}
      <motion.div
        key={calculateCosts.total}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-4 sm:p-6 border-l-4 border-primary-800"
      >
        <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
          <div>
            <p className="text-xs sm:text-sm text-neutral-500 mb-1">Total Estimated Cost</p>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-primary-900">
                ${calculateCosts.total.toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm text-neutral-500">USD</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Payment in installments • Includes all fees
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-50 rounded-full">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary-800" />
            <span className="font-medium text-sm sm:text-base text-primary-800">{answers.visaType.label}</span>
          </div>
        </div>
      </motion.div>

      {/* Cost Breakdown */}
      <div className="card p-4 sm:p-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between mb-3 sm:mb-4"
        >
          <h4 className="font-semibold text-sm sm:text-base text-primary-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
            Cost Breakdown
          </h4>
          <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 transition-transform duration-300
            ${showDetails ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {calculateCosts.breakdown.map((item, index) => {
                  const Icon = item.icon
                  const percentage = (item.value / calculateCosts.total) * 100
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 sm:p-4 bg-neutral-50 rounded-xl"
                      onMouseEnter={() => setActiveCategory(item.name)}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      <div className="flex items-start sm:items-center justify-between mb-2 flex-wrap sm:flex-nowrap gap-2">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${item.color}15` }}
                          >
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: item.color }} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm sm:text-base text-primary-900">{item.name}</p>
                            <p className="text-xs sm:text-sm text-neutral-500 line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-sm sm:text-base text-primary-900">
                            ${item.value.toLocaleString()}
                          </p>
                          <p className="text-xs sm:text-sm text-neutral-500">{percentage.toFixed(0)}%</p>
                        </div>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pie Chart */}
        <div className="h-56 sm:h-64 mt-3 sm:mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={calculateCosts.breakdown}
                cx="50%"
                cy="50%"
                innerRadius={window.innerWidth < 640 ? 50 : 60}
                outerRadius={window.innerWidth < 640 ? 75 : 90}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {calculateCosts.breakdown.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    opacity={activeCategory && activeCategory !== entry.name ? 0.4 : 1}
                    style={{ transition: 'opacity 0.3s' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value, entry) => (
                  <span className="text-sm text-neutral-700">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="card p-4 sm:p-6">
        <h4 className="font-semibold text-sm sm:text-base text-primary-900 mb-4 sm:mb-6 flex items-center gap-2">
          <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          Market Comparison
        </h4>

        <div className="h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calculateCosts.scenarioData} barGap={window.innerWidth < 640 ? 4 : 8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#71717a', fontSize: window.innerWidth < 640 ? 10 : 12 }}
                axisLine={{ stroke: '#e4e4e7' }}
              />
              <YAxis
                tick={{ fill: '#71717a', fontSize: window.innerWidth < 640 ? 10 : 12 }}
                axisLine={{ stroke: '#e4e4e7' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                radius={[8, 8, 0, 0]}
                animationBegin={0}
                animationDuration={800}
              >
                {calculateCosts.scenarioData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? '#1a1f4e' : index === 1 ? '#3b82f6' : '#94a3b8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-3 sm:mt-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary-800" />
            <span className="text-xs sm:text-sm text-neutral-600">Your Estimate</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-accent-blue" />
            <span className="text-xs sm:text-sm text-neutral-600">Industry Avg</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-neutral-400" />
            <span className="text-xs sm:text-sm text-neutral-600">High-End</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-3 sm:p-4 bg-neutral-50 rounded-xl border border-neutral-200"
      >
        <div className="flex gap-2 sm:gap-3">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium text-sm sm:text-base text-neutral-800 mb-1">Disclaimer</h5>
            <p className="text-xs sm:text-sm text-neutral-600">
              These are estimated costs based on typical cases. Actual fees may vary depending on
              case complexity and specific circumstances. Government fees are subject to change.
              Contact us for a personalized quote.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PricingChart
