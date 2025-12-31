import { useMemo, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Group } from '@visx/group'
import { scaleTime, scaleBand } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridColumns } from '@visx/grid'
import { ParentSize } from '@visx/responsive'
import { Clock, Calendar, TrendingUp, AlertCircle, ChevronRight, Info } from 'lucide-react'

const scenarioConfigs = {
  optimistic: {
    id: 'optimistic', label: 'Optimista', shortLabel: 'Rápido',
    description: 'Tiempo más rápido sin contratiempos',
    color: '#10b981', bgColor: '#ecfdf5', borderColor: '#10b981',
    barGradient: ['#10b981', '#059669'], icon: TrendingUp,
  },
  intermediate: {
    id: 'intermediate', label: 'Intermedio', shortLabel: 'Normal',
    description: 'Tiempo moderado con retrasos menores',
    color: '#3d5de2', bgColor: '#eef2ff', borderColor: '#3d5de2',
    barGradient: ['#3d5de2', '#2d3a8c'], icon: Clock,
  },
  pessimistic: {
    id: 'pessimistic', label: 'Pesimista', shortLabel: 'Lento',
    description: 'Tiempo más largo debido a retrasos',
    color: '#f59e0b', bgColor: '#fffbeb', borderColor: '#f59e0b',
    barGradient: ['#fbbf24', '#d97706'], icon: AlertCircle,
  },
}

const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
const formatMonthAxis = (date) => date.toLocaleDateString('en-US', { month: 'short' })
const addMonths = (date, months) => { const r = new Date(date); r.setMonth(r.getMonth() + months); return r }

const GanttBar = ({ x, y, width, height, data, scenario, onMouseMove, onMouseLeave, isHovered, isMobile }) => {
  const barHeight = Math.min(height * 0.6, isMobile ? 24 : 32)
  const yOffset = (height - barHeight) / 2
  const radius = isMobile ? 4 : 6
  const config = scenarioConfigs[scenario]

  return (
    <motion.g
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1, y: isHovered ? -2 : 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: data.index * 0.1 }}
      style={{ originX: 0 }}
    >
      <rect x={x + 2} y={y + yOffset + 3} width={Math.max(width - 4, 0)} height={barHeight} rx={radius} fill="rgba(0,0,0,0.08)" />
      <defs>
        <linearGradient id={`bar-gradient-${data.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={config.barGradient[0]} />
          <stop offset="100%" stopColor={config.barGradient[1]} />
        </linearGradient>
      </defs>
      <rect
        x={x} y={y + yOffset} width={Math.max(width, 0)} height={barHeight} rx={radius}
        fill={`url(#bar-gradient-${data.id})`}
        onMouseMove={(e) => onMouseMove(e, data)}
        onMouseLeave={onMouseLeave}
        style={{ cursor: 'pointer', filter: isHovered ? 'brightness(1.1)' : 'none', transition: 'filter 0.2s ease' }}
      />
      {!isMobile && <circle cx={x + 8} cy={y + yOffset + barHeight / 2} r={3} fill="rgba(255,255,255,0.5)" style={{ pointerEvents: 'none' }} />}
      {width > 50 && !isMobile && <circle cx={x + width - 8} cy={y + yOffset + barHeight / 2} r={3} fill="rgba(255,255,255,0.8)" style={{ pointerEvents: 'none' }} />}
      {width > (isMobile ? 35 : 80) && (
        <text x={x + width / 2} y={y + yOffset + barHeight / 2 + 1} textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize={isMobile ? 9 : 11} fontWeight={600} fontFamily="Inter, system-ui, sans-serif" style={{ pointerEvents: 'none' }}>
          {data.duration}mo
        </text>
      )}
    </motion.g>
  )
}

const CustomTooltip = ({ data, x, y, config, isMobile }) => {
  if (!data) return null
  return (
    <div style={{
      position: 'fixed', left: x, top: y, transform: 'translate(-50%, -100%)', marginTop: '-15px',
      backgroundColor: 'white', borderRadius: isMobile ? '12px' : '16px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', padding: '0', pointerEvents: 'none', zIndex: 9999,
      minWidth: isMobile ? '160px' : '220px', maxWidth: isMobile ? '85vw' : '280px', overflow: 'hidden',
    }}>
      <div style={{ padding: isMobile ? '8px 10px' : '12px 16px', background: `linear-gradient(135deg, ${config.barGradient[0]}15, ${config.barGradient[1]}15)`, borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: `linear-gradient(135deg, ${config.barGradient[0]}, ${config.barGradient[1]})` }} />
          <span style={{ fontWeight: 700, color: '#111827', fontSize: isMobile ? '11px' : '14px' }}>{data.name}</span>
        </div>
      </div>
      <div style={{ padding: isMobile ? '8px 10px' : '12px 16px' }}>
        <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6b7280', marginBottom: '8px' }}>{data.description}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase' }}>Inicio</span>
            <span style={{ fontSize: isMobile ? '10px' : '12px', fontWeight: 600, color: '#1f2937' }}>{formatDate(data.startDate)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase' }}>Fin</span>
            <span style={{ fontSize: isMobile ? '10px' : '12px', fontWeight: 600, color: '#1f2937' }}>{formatDate(data.endDate)}</span>
          </div>
        </div>
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#6b7280' }}>Duración</span>
          <span style={{ fontWeight: 700, fontSize: '11px', padding: '4px 8px', borderRadius: '9999px', backgroundColor: config.bgColor, color: config.color }}>{data.duration} {data.duration === 1 ? 'mes' : 'meses'}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid white' }} />
    </div>
  )
}

const GanttChartInner = ({ width, height, data, scenario }) => {
  const [tooltip, setTooltip] = useState({ show: false, data: null, x: 0, y: 0 })
  const [hoveredBar, setHoveredBar] = useState(null)
  
  const isMobile = width < 500
  const isTablet = width >= 500 && width < 768

  const margin = {
    top: isMobile ? 25 : 40,
    right: isMobile ? 8 : isTablet ? 15 : 30,
    bottom: isMobile ? 35 : 50,
    left: isMobile ? 70 : isTablet ? 100 : 160
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

  const xScale = useMemo(() => scaleTime({ domain: timeExtent, range: [0, innerWidth], nice: true }), [timeExtent, innerWidth])
  const yScale = useMemo(() => scaleBand({ domain: data.map(d => d.id), range: [0, innerHeight], padding: 0.3 }), [data, innerHeight])

  const handleMouseMove = useCallback((event, barData) => {
    setHoveredBar(barData.id)
    setTooltip({ show: true, data: barData, x: event.clientX, y: event.clientY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredBar(null)
    setTooltip({ show: false, data: null, x: 0, y: 0 })
  }, [])

  const xTickValues = useMemo(() => {
    const ticks = []
    const [start, end] = timeExtent
    const current = new Date(start)
    const step = isMobile ? 2 : 1
    while (current <= end) {
      ticks.push(new Date(current))
      current.setMonth(current.getMonth() + step)
    }
    return ticks
  }, [timeExtent, isMobile])

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
        <rect x={0} y={0} width={width} height={height} fill="white" rx={12} />
        <rect x={margin.left} y={0} width={innerWidth} height={margin.top} fill="url(#headerGradient)" />
        <Group left={margin.left} top={margin.top}>
          <GridColumns scale={xScale} height={innerHeight} strokeDasharray="4,4" stroke="#e2e8f0" strokeOpacity={0.8} numTicks={xTickValues.length} />
          {data.map((d) => (
            <line key={`row-line-${d.id}`} x1={0} x2={innerWidth} y1={yScale(d.id) + yScale.bandwidth()} y2={yScale(d.id) + yScale.bandwidth()} stroke="#f1f5f9" strokeWidth={1} />
          ))}
          {(() => {
            const today = new Date()
            if (today >= timeExtent[0] && today <= timeExtent[1]) {
              const todayX = xScale(today)
              return (
                <g>
                  <line x1={todayX} x2={todayX} y1={-10} y2={innerHeight} stroke="#ef4444" strokeWidth={2} strokeDasharray="4,4" />
                  <text x={todayX} y={-15} textAnchor="middle" fill="#ef4444" fontSize={isMobile ? 8 : 10} fontWeight={600}>Hoy</text>
                </g>
              )
            }
            return null
          })()}
          <AnimatePresence mode="wait">
            {data.map((d, i) => {
              const barX = xScale(d.startDate)
              const barWidth = xScale(d.endDate) - xScale(d.startDate)
              return (
                <GanttBar key={`${scenario}-${d.id}`} x={barX} y={yScale(d.id)} width={barWidth} height={yScale.bandwidth()}
                  data={{ ...d, index: i }} scenario={scenario} isHovered={hoveredBar === d.id}
                  onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} isMobile={isMobile} />
              )
            })}
          </AnimatePresence>
          <AxisBottom top={innerHeight} scale={xScale} tickValues={xTickValues} tickFormat={formatMonthAxis} stroke="#cbd5e1" tickStroke="#cbd5e1"
            tickLabelProps={() => ({ fill: '#64748b', fontSize: isMobile ? 8 : 11, fontFamily: 'Inter, system-ui, sans-serif', textAnchor: 'middle', dy: '0.5em' })} />
          <AxisLeft scale={yScale} stroke="transparent" tickStroke="transparent"
            tickLabelProps={() => ({ fill: '#1e293b', fontSize: isMobile ? 8 : isTablet ? 10 : 12, fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 500, textAnchor: 'end', dx: '-0.5em', dy: '0.33em' })}
            tickFormat={(value) => {
              const item = data.find(d => d.id === value)
              const name = item?.name || value
              if (isMobile && name.length > 10) return name.substring(0, 8) + '...'
              if (isTablet && name.length > 15) return name.substring(0, 12) + '...'
              return name
            }} />
        </Group>
        {data.map((d, i) => (
          <g key={`phase-num-${d.id}`}>
            <circle cx={isMobile ? 16 : 24} cy={margin.top + yScale(d.id) + yScale.bandwidth() / 2} r={isMobile ? 10 : 12} fill={config.bgColor} stroke={config.borderColor} strokeWidth={2} />
            <text x={isMobile ? 16 : 24} y={margin.top + yScale(d.id) + yScale.bandwidth() / 2 + 1} textAnchor="middle" dominantBaseline="middle" fill={config.color} fontSize={isMobile ? 9 : 11} fontWeight={700} fontFamily="Inter, system-ui, sans-serif">{i + 1}</text>
          </g>
        ))}
      </svg>
      {tooltip.show && tooltip.data && <CustomTooltip data={tooltip.data} x={tooltip.x} y={tooltip.y} config={config} isMobile={isMobile} />}
    </>
  )
}

const GanttTimeline = ({ answers, scenario, onScenarioChange }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowWidth < 640

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
      { id: 'preparation', name: 'Preparación del Caso', description: 'Recopilación de documentos y evaluación inicial', proportion: 0.2 },
      { id: 'filing', name: 'Presentación y Envío', description: 'Preparación de petición y envío a USCIS', proportion: 0.15 },
      { id: 'processing', name: 'Procesamiento de USCIS', description: 'Revisión y adjudicación de USCIS', proportion: 0.45 },
      { id: 'decision', name: 'Decisión y Próximos Pasos', description: 'Decisión final y pasos posteriores a la aprobación', proportion: 0.2 },
    ]

    let currentDate = new Date(startDate)
    return phases.map((phase, index) => {
      const duration = Math.max(1, Math.round(adjustedTime * phase.proportion))
      const phaseStartDate = new Date(currentDate)
      const phaseEndDate = addMonths(currentDate, duration)
      currentDate = phaseEndDate
      return { ...phase, startDate: phaseStartDate, endDate: phaseEndDate, duration, index }
    })
  }, [answers, scenario])

  const totalTime = useMemo(() => timelineData.reduce((sum, phase) => sum + phase.duration, 0), [timelineData])

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

  const currentConfig = scenarioConfigs[scenario]

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Scenario Selector */}
      <div className="card p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-3 md:mb-4">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#3d5de2]" />
          <span className="font-medium text-xs sm:text-sm md:text-base text-primary-900">Selecciona Escenario</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3">
          {Object.values(scenarioConfigs).map((config) => {
            const isActive = scenario === config.id
            const Icon = config.icon
            return (
              <motion.button key={config.id} onClick={() => onScenarioChange(config.id)} whileTap={{ scale: 0.98 }}
                className="p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all duration-300 touch-manipulation"
                style={{ borderColor: isActive ? config.borderColor : '#e5e7eb', backgroundColor: isActive ? config.bgColor : 'white' }}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 md:gap-3 mb-0.5 sm:mb-1 md:mb-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: isActive ? config.color : '#f1f5f9' }}>
                    <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm md:text-base" style={{ color: isActive ? config.color : '#1e293b' }}>
                    {isMobile ? config.shortLabel : config.label}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 hidden sm:block">{config.description}</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* RFE Warning */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl">
        <div className="flex gap-2 sm:gap-3">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-xs sm:text-sm md:text-base text-amber-800 mb-0.5 sm:mb-1">Posibilidad de RFE</h4>
            <p className="text-[10px] sm:text-xs md:text-sm text-amber-700">USCIS puede solicitar información adicional antes de decidir sobre tu petición.</p>
          </div>
        </div>
      </motion.div>

      {/* Total Time */}
      <motion.div key={scenario} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="card p-3 sm:p-4 md:p-6 border-l-4" style={{ borderLeftColor: currentConfig.color }}>
        <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
          <div>
            <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 mb-0.5 sm:mb-1">Tiempo Total Estimado</p>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-900">{totalTime}</span>
              <span className="text-sm sm:text-base md:text-lg text-neutral-600">meses</span>
            </div>
          </div>
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full font-medium text-xs sm:text-sm md:text-base"
            style={{ backgroundColor: currentConfig.bgColor, color: currentConfig.color }}>{currentConfig.label}</div>
        </div>
      </motion.div>

      {/* Gantt Chart */}
      <motion.div key={`gantt-${scenario}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="card p-2 sm:p-3 md:p-4 lg:p-6 relative overflow-hidden">
        <h4 className="font-semibold text-xs sm:text-sm md:text-base text-primary-900 mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span className="hidden xs:inline">Línea de Tiempo del Proceso - Vista Gantt</span>
          <span className="xs:hidden">Línea de Tiempo</span>
        </h4>
        <div className="w-full" style={{ height: isMobile ? '220px' : windowWidth < 768 ? '260px' : '320px' }}>
          <ParentSize>{({ width, height }) => <GanttChartInner width={width} height={height} data={timelineData} scenario={scenario} />}</ParentSize>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 md:pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ background: `linear-gradient(90deg, ${currentConfig.barGradient[0]}, ${currentConfig.barGradient[1]})` }} />
            <span className="text-[10px] sm:text-xs md:text-sm text-neutral-600">Fase del Proceso</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-3 sm:w-4 h-0.5 bg-red-500" style={{ borderStyle: 'dashed' }} />
            <span className="text-[10px] sm:text-xs md:text-sm text-neutral-600">Hoy</span>
          </div>
        </div>
      </motion.div>

      {/* Phase Details */}
      <div className="card p-3 sm:p-4 md:p-6">
        <h4 className="font-semibold text-xs sm:text-sm md:text-base text-primary-900 mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2">
          <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />Detalles de las Fases
        </h4>
        <div className="space-y-2 sm:space-y-3">
          {timelineData.map((phase, index) => (
            <motion.div key={phase.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 bg-neutral-50 rounded-lg sm:rounded-xl">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: currentConfig.bgColor, border: `2px solid ${currentConfig.color}` }}>
                <span className="font-bold text-xs sm:text-sm" style={{ color: currentConfig.color }}>{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-1 sm:gap-2">
                  <h5 className="font-medium text-xs sm:text-sm md:text-base text-primary-900">{phase.name}</h5>
                  <span className="text-[10px] sm:text-xs md:text-sm font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                    style={{ backgroundColor: currentConfig.bgColor, color: currentConfig.color }}>{phase.duration} {phase.duration === 1 ? 'mes' : 'meses'}</span>
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 mt-0.5 sm:mt-1">{phase.description}</p>
                <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[9px] sm:text-xs text-neutral-400">
                  <span>{formatDate(phase.startDate)}</span>
                  <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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