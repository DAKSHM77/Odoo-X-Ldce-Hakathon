import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

/**
 * CalendarView
 * A simple month-grid calendar that highlights trip days.
 * No external calendar library needed.
 *
 * Props:
 *   days      – array of { date: 'YYYY-MM-DD', sectionTitle, accentClass? }
 *   tripStart – 'YYYY-MM-DD'
 *   tripEnd   – 'YYYY-MM-DD'
 */

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const SECTION_COLOURS = [
  'bg-indigo-500', 'bg-cyan-500', 'bg-violet-500',
  'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
]

export default function CalendarView({ days = [], tripStart }) {
  // Default to the month of tripStart, or current month
  const initialDate = tripStart ? new Date(tripStart) : new Date()
  const [viewYear, setViewYear]   = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())

  // Build a lookup: 'YYYY-MM-DD' -> sectionColour
  const sectionColours = {}
  let colIdx = 0
  const dayMap = {}
  days.forEach((d) => {
    if (!(d.sectionTitle in sectionColours)) {
      sectionColours[d.sectionTitle] = SECTION_COLOURS[colIdx % SECTION_COLOURS.length]
      colIdx++
    }
    dayMap[d.date] = {
      colour: sectionColours[d.sectionTitle],
      label: d.label || d.sectionTitle,
    }
  })

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11) }
    else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0) }
    else setViewMonth((m) => m + 1)
  }

  // Build grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const isoOf = (d) => {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${viewYear}-${mm}-${dd}`
  }

  return (
    <div id="calendar-view" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          id="calendar-prev-month"
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-indigo-500" />
          <span className="font-semibold text-gray-800 text-sm">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
        </div>
        <button
          type="button"
          id="calendar-next-month"
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day-name row */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((n) => (
          <div key={n} className="text-center text-xs font-medium text-gray-400 py-1">{n}</div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, idx) => {
          if (!d) return <div key={`empty-${idx}`} />
          const iso = isoOf(d)
          const trip = dayMap[iso]
          return (
            <div
              key={iso}
              id={`cal-day-${iso}`}
              className={`
                relative flex items-center justify-center aspect-square
                rounded-lg text-sm transition-colors duration-150
                ${trip
                  ? `${trip.colour} text-white font-semibold shadow-sm cursor-default`
                  : 'text-gray-700 hover:bg-gray-50 cursor-default'
                }
              `}
              title={trip ? trip.label : undefined}
            >
              {d}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      {Object.keys(sectionColours).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
          {Object.entries(sectionColours).map(([title, colour]) => (
            <div key={title} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${colour}`} />
              <span className="text-xs text-gray-500">{title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
