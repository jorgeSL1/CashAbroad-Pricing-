import { useMemo, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Group } from '@visx/group'
import { scaleTime, scaleBand } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridColumns } from '@visx/grid'
import { localPoint } from '@visx/event'
import { ParentSize } from '@visx/responsive'
import { 
  Clock, 
  Calendar, 
  TrendingUp, 
  AlertCircle, 
  ChevronRight,
  Info
} from 'lucide-react'

// ============================================================================
// SCENARIO CONFIGURATIONS
// ============================================================================
const scenarioConfigs = {
  optimistic: {
    id: 'optimistic',
    label: 'Optimistic',
    description: 'Fastest time with no step backs',
    color: '#10b981',
    bgColor: '#ecfdf5',
    borderColor: '#10b981',
    barColor: '#059669',
    barGradient: ['#10b981', '#059669'],
    icon: TrendingUp,
  },
  intermediate: {
    id: 'intermediate',
    label: 'Intermediate',
    description: 'Moderate time with minor delays',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#3b82f6',
    barColor: '#1a1f4e',
    barGradient: ['#3b82f6', '#1a1f4e'],
    icon: Clock,
  },
  pessimistic: {
    id: 'pessimistic',
    label: 'Pessimistic',
    description: 'Longest time due to delays',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#f59e0b',
    barColor: '#d97706',
    barGradient: ['#fbbf24', '#d97706'],
    icon: AlertCircle,
  },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  })
}

const formatMonthAxis = (date) => {
  return date.toLocaleDateString('en-US', { month: 'short' })
}

const addMonths = (date, months) => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

// ============================================================================
// GANTT BAR COMPONENT
// ============================================================================
const GanttBar = ({ 
  x, 
  y, 
  width, 
  height, 
  data, 
  scenario,
  onMouseMove,
  onMouseLeave,
  isHovered 
}) => {
  const barHeight = Math.min(height * 0.6, 32)
  const yOffset = (height - barHeight) / 2
  const radius = 6
  const config = scenarioConfigs[scenario]

  return (
    <motion.g
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ 
        opacity: 1, 
        scaleX: 1,
        y: isHovered ? -2 : 0
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.4, 0, 0.2, 1],
        delay: data.index * 0.1 
      }}
      style={{ originX: 0 }}
    >
      {/* Shadow */}
      <rect
        x={x + 2}
        y={y + yOffset + 3}
        width={Math.max(width - 4, 0)}
        height={barHeight}
        rx={radius}
        ry={radius}
        fill="rgba(0,0,0,0.08)"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id={`bar-gradient-${data.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={config.barGradient[0]} />
          <stop offset="100%" stopColor={config.barGradient[1]} />
        </linearGradient>
      </defs>
      
      {/* Main bar */}
      <rect
        x={x}
        y={y + yOffset}
        width={Math.max(width, 0)}
        height={barHeight}
        rx={radius}
        ry={radius}
        fill={`url(#bar-gradient-${data.id})`}
        onMouseMove={(e) => onMouseMove(e, data)}
        onMouseLeave={onMouseLeave}
        style={{ 
          cursor: 'pointer',
          filter: isHovered ? 'brightness(1.1)' : 'none',
          transition: 'filter 0.2s ease'
        }}
      />

      {/* Start dot */}
      <circle
        cx={x + 8}
        cy={y + yOffset + barHeight / 2}
        r={3}
        fill="rgba(255,255,255,0.5)"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* End dot */}
      {width > 50 && (
        <circle
          cx={x + width - 8}
          cy={y + yOffset + barHeight / 2}
          r={3}
          fill="rgba(255,255,255,0.8)"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Duration label */}
      {width > 80 && (
        <text
          x={x + width / 2}
          y={y + yOffset + barHeight / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={11}
          fontWeight={600}
          fontFamily="Inter, system-ui, sans-serif"
          style={{ pointerEvents: 'none' }}
        >
          {data.duration} mo
        </text>
      )}
    </motion.g>
  )
}

// ============================================================================
// CUSTOM TOOLTIP COMPONENT
// ============================================================================
const CustomTooltip = ({ data, x, y, config }) => {
  if (!data) return null

  // Responsive tooltip sizing
  const isMobile = window.innerWidth < 640
  const tooltipWidth = isMobile ? '200px' : '240px'

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        marginTop: '-15px',
        backgroundColor: 'white',
        borderRadius: isMobile ? '12px' : '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        padding: '0',
        pointerEvents: 'none',
        zIndex: 9999,
        minWidth: tooltipWidth,
        maxWidth: isMobile ? '90vw' : '300px',
        overflow: 'hidden',
      }}
    >
      {/* Header with gradient */}
      <div
        style={{
          padding: isMobile ? '10px 12px' : '12px 16px',
          background: `linear-gradient(135deg, ${config.barGradient[0]}15, ${config.barGradient[1]}15)`,
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
          <div
            style={{
              width: isMobile ? '10px' : '12px',
              height: isMobile ? '10px' : '12px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${config.barGradient[0]}, ${config.barGradient[1]})`
            }}
          />
          <span style={{ fontWeight: 700, color: '#111827', fontSize: isMobile ? '12px' : '14px' }}>{data.name}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: isMobile ? '10px 12px' : '12px 16px' }}>
        <p style={{ fontSize: isMobile ? '11px' : '12px', color: '#6b7280', marginBottom: isMobile ? '8px' : '12px' }}>{data.description}</p>

        {/* Dates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '6px' : '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: isMobile ? '10px' : '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start</span>
            <span style={{ fontSize: isMobile ? '11px' : '13px', fontWeight: 600, color: '#1f2937' }}>{formatDate(data.startDate)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: isMobile ? '10px' : '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End</span>
            <span style={{ fontSize: isMobile ? '11px' : '13px', fontWeight: 600, color: '#1f2937' }}>{formatDate(data.endDate)}</span>
          </div>
        </div>

        {/* Duration badge */}
        <div style={{
          marginTop: isMobile ? '8px' : '12px',
          paddingTop: isMobile ? '8px' : '12px',
          borderTop: '1px solid #f3f4f6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: isMobile ? '11px' : '12px', color: '#6b7280' }}>Duration</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: isMobile ? '11px' : '13px',
              padding: isMobile ? '4px 8px' : '6px 12px',
              borderRadius: '9999px',
              backgroundColor: config.bgColor,
              color: config.color
            }}
          >
            {data.duration} {isMobile ? 'mo' : 'months'}
          </span>
        </div>
      </div>

      {/* Arrow pointer */}
      <div
        style={{
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '10px solid white',
        }}
      />
    </div>
  )
}

// ============================================================================
// GANTT CHART INNER COMPONENT
// ============================================================================
const GanttChartInner = ({
  width,
  height,
  data,
  scenario,
  margin: customMargin
}) => {
  const [tooltip, setTooltip] = useState({ show: false, data: null, x: 0, y: 0 })
  const [hoveredBar, setHoveredBar] = useState(null)

  // Responsive margins
  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024

  const margin = customMargin || {
    top: isMobile ? 30 : 40,
    right: isMobile ? 10 : isTablet ? 20 : 30,
    bottom: isMobile ? 40 : 50,
    left: isMobile ? 80 : isTablet ? 120 : 160
  }

  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const config = scenarioConfigs[scenario]

  const timeExtent = useMemo(() => {
    if (!data.length) return [new Date(), addMonths(new Date(), 12)]
    
    const startDates = data.map(d => d.startDate)
    const endDates = data.map(d => d.endDate)
    
    const minDate = new Date(Math.min(...startDates))
    const maxDate = new Date(Math.max(...endDates))
    
    minDate.setDate(1)
    maxDate.setMonth(maxDate.getMonth() + 1)
    maxDate.setDate(1)
    
    return [minDate, maxDate]
  }, [data])

  const xScale = useMemo(() => 
    scaleTime({
      domain: timeExtent,
      range: [0, innerWidth],
      nice: true,
    }), [timeExtent, innerWidth]
  )

  const yScale = useMemo(() =>
    scaleBand({
      domain: data.map(d => d.id),
      range: [0, innerHeight],
      padding: 0.3,
    }), [data, innerHeight]
  )

  const handleMouseMove = useCallback((event, barData) => {
    // Get mouse position relative to the viewport
    const mouseX = event.clientX
    const mouseY = event.clientY
    
    setHoveredBar(barData.id)
    setTooltip({
      show: true,
      data: barData,
      x: mouseX,
      y: mouseY
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredBar(null)
    setTooltip({ show: false, data: null, x: 0, y: 0 })
  }, [])

  const xTickValues = useMemo(() => {
    const ticks = []
    const [start, end] = timeExtent
    const current = new Date(start)
    
    while (current <= end) {
      ticks.push(new Date(current))
      current.setMonth(current.getMonth() + 1)
    }
    
    return ticks
  }, [timeExtent])

  if (width < 100 || height < 100) return null

  return (
    <>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="headerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="white"
          rx={12}
        />

        {/* Header */}
        <rect
          x={margin.left}
          y={0}
          width={innerWidth}
          height={margin.top}
          fill="url(#headerGradient)"
        />

        <Group left={margin.left} top={margin.top}>
          {/* Grid */}
          <GridColumns
            scale={xScale}
            height={innerHeight}
            strokeDasharray="4,4"
            stroke="#e2e8f0"
            strokeOpacity={0.8}
            numTicks={xTickValues.length}
          />

          {/* Row lines */}
          {data.map((d) => (
            <line
              key={`row-line-${d.id}`}
              x1={0}
              x2={innerWidth}
              y1={yScale(d.id) + yScale.bandwidth()}
              y2={yScale(d.id) + yScale.bandwidth()}
              stroke="#f1f5f9"
              strokeWidth={1}
            />
          ))}

          {/* Today marker */}
          {(() => {
            const today = new Date()
            if (today >= timeExtent[0] && today <= timeExtent[1]) {
              const todayX = xScale(today)
              return (
                <g>
                  <line
                    x1={todayX}
                    x2={todayX}
                    y1={-10}
                    y2={innerHeight}
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="4,4"
                  />
                  <text
                    x={todayX}
                    y={-15}
                    textAnchor="middle"
                    fill="#ef4444"
                    fontSize={10}
                    fontWeight={600}
                  >
                    Today
                  </text>
                </g>
              )
            }
            return null
          })()}

          {/* Bars */}
          <AnimatePresence mode="wait">
            {data.map((d, i) => {
              const barX = xScale(d.startDate)
              const barWidth = xScale(d.endDate) - xScale(d.startDate)
              const barY = yScale(d.id)
              const barHeight = yScale.bandwidth()

              return (
                <GanttBar
                  key={`${scenario}-${d.id}`}
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  data={{ ...d, index: i }}
                  scenario={scenario}
                  isHovered={hoveredBar === d.id}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                />
              )
            })}
          </AnimatePresence>

          {/* X Axis */}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickValues={xTickValues}
            tickFormat={formatMonthAxis}
            stroke="#cbd5e1"
            tickStroke="#cbd5e1"
            tickLabelProps={() => ({
              fill: '#64748b',
              fontSize: isMobile ? 9 : 11,
              fontFamily: 'Inter, system-ui, sans-serif',
              textAnchor: 'middle',
              dy: '0.5em',
            })}
          />

          {/* Y Axis */}
          <AxisLeft
            scale={yScale}
            stroke="transparent"
            tickStroke="transparent"
            tickLabelProps={() => ({
              fill: '#1e293b',
              fontSize: isMobile ? 9 : isTablet ? 10 : 12,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 500,
              textAnchor: 'end',
              dx: '-0.5em',
              dy: '0.33em',
            })}
            tickFormat={(value) => {
              const item = data.find(d => d.id === value)
              const name = item?.name || value
              // Truncate long names on mobile
              if (isMobile && name.length > 15) {
                return name.substring(0, 12) + '...'
              }
              return name
            }}
          />
        </Group>

        {/* Phase numbers */}
        {data.map((d, i) => (
          <g key={`phase-num-${d.id}`}>
            <circle
              cx={24}
              cy={margin.top + yScale(d.id) + yScale.bandwidth() / 2}
              r={12}
              fill={config.bgColor}
              stroke={config.borderColor}
              strokeWidth={2}
            />
            <text
              x={24}
              y={margin.top + yScale(d.id) + yScale.bandwidth() / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={config.color}
              fontSize={11}
              fontWeight={700}
              fontFamily="Inter, system-ui, sans-serif"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>

      {/* Tooltip - Rendered outside SVG with fixed positioning */}
      {tooltip.show && tooltip.data && (
        <CustomTooltip 
          data={tooltip.data}
          x={tooltip.x}
          y={tooltip.y}
          config={config}
        />
      )}
    </>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const GanttTimeline = ({ answers, scenario, onScenarioChange }) => {
  
  const timelineData = useMemo(() => {
    if (!answers.visaType) return []

    const visaData = answers.visaType
    const countryMultiplier = answers.country?.timeMultiplier || 1
    const premiumReduction = answers.premium?.timeReduction || 1
    
    const baseTime = visaData.time?.[scenario] || 12
    const adjustedTime = Math.round(baseTime * countryMultiplier * premiumReduction)

    const startDate = new Date()
    startDate.setDate(1)

    const phases = [
      {
        id: 'preparation',
        name: 'Case Preparation',
        description: 'Document gathering and initial assessment',
        proportion: 0.2,
      },
      {
        id: 'filing',
        name: 'Filing & Submission',
        description: 'Petition preparation and USCIS submission',
        proportion: 0.15,
      },
      {
        id: 'processing',
        name: 'USCIS Processing',
        description: 'USCIS review and adjudication',
        proportion: 0.45,
      },
      {
        id: 'decision',
        name: 'Decision & Next Steps',
        description: 'Final decision and post-approval steps',
        proportion: 0.2,
      },
    ]

    let currentDate = new Date(startDate)
    
    return phases.map((phase, index) => {
      const duration = Math.max(1, Math.round(adjustedTime * phase.proportion))
      const phaseStartDate = new Date(currentDate)
      const phaseEndDate = addMonths(currentDate, duration)
      
      currentDate = phaseEndDate
      
      return {
        ...phase,
        startDate: phaseStartDate,
        endDate: phaseEndDate,
        duration,
        index,
      }
    })
  }, [answers, scenario])

  const totalTime = useMemo(() => {
    return timelineData.reduce((sum, phase) => sum + phase.duration, 0)
  }, [timelineData])

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

  const currentConfig = scenarioConfigs[scenario]

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <div className="card p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary-800" />
          <span className="font-medium text-sm sm:text-base text-primary-900">Select Scenario</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {Object.values(scenarioConfigs).map((config) => {
            const isActive = scenario === config.id
            const Icon = config.icon
            return (
              <motion.button
                key={config.id}
                onClick={() => onScenarioChange(config.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-300"
                style={{
                  borderColor: isActive ? config.borderColor : '#e5e7eb',
                  backgroundColor: isActive ? config.bgColor : 'white',
                }}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: isActive ? config.color : '#f1f5f9' }}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  </div>
                  <span
                    className="font-semibold text-sm sm:text-base"
                    style={{ color: isActive ? config.color : '#1e293b' }}
                  >
                    {config.label}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-500">{config.description}</p>
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
              USCIS may request additional information before deciding on your petition.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Total Time */}
      <motion.div
        key={scenario}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-4 sm:p-6 border-l-4"
        style={{ borderLeftColor: currentConfig.color }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs sm:text-sm text-neutral-500 mb-1">Estimated Total Time</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-primary-900">{totalTime}</span>
              <span className="text-base sm:text-lg text-neutral-600">months</span>
            </div>
          </div>
          <div
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium text-sm sm:text-base"
            style={{ backgroundColor: currentConfig.bgColor, color: currentConfig.color }}
          >
            {currentConfig.label}
          </div>
        </div>
      </motion.div>

      {/* Gantt Chart */}
      <motion.div
        key={`gantt-${scenario}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card p-3 sm:p-4 lg:p-6 relative"
      >
        <h4 className="font-semibold text-sm sm:text-base text-primary-900 mb-3 sm:mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          Process Timeline - Gantt View
        </h4>

        <div className="w-full" style={{ height: window.innerWidth < 640 ? '280px' : '320px' }}>
          <ParentSize>
            {({ width, height }) => (
              <GanttChartInner
                width={width}
                height={height}
                data={timelineData}
                scenario={scenario}
              />
            )}
          </ParentSize>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ background: `linear-gradient(90deg, ${currentConfig.barGradient[0]}, ${currentConfig.barGradient[1]})` }}
            />
            <span className="text-sm text-neutral-600">Process Phase</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500" style={{ borderStyle: 'dashed' }} />
            <span className="text-sm text-neutral-600">Today</span>
          </div>
        </div>
      </motion.div>

      {/* Phase Details */}
      <div className="card p-6">
        <h4 className="font-semibold text-primary-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Phase Details
        </h4>
        <div className="space-y-3">
          {timelineData.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ 
                  backgroundColor: currentConfig.bgColor,
                  border: `2px solid ${currentConfig.color}`
                }}
              >
                <span className="font-bold" style={{ color: currentConfig.color }}>
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h5 className="font-medium text-primary-900">{phase.name}</h5>
                  <span 
                    className="text-sm font-semibold px-2 py-1 rounded-full"
                    style={{ backgroundColor: currentConfig.bgColor, color: currentConfig.color }}
                  >
                    {phase.duration} months
                  </span>
                </div>
                <p className="text-sm text-neutral-500 mt-1">{phase.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400">
                  <span>{formatDate(phase.startDate)}</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{formatDate(phase.endDate)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GanttTimeline