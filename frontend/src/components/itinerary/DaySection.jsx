import { Calendar } from 'lucide-react'
import ActivityRow from './ActivityRow'

/**
 * DaySection
 * Renders one day's worth of activities inside a styled card.
 * Includes a gradient day-header, column labels, and an ActivityRow list
 * with arrow connectors between rows.
 *
 * Props:
 *   day – {
 *     dayNumber   – number (1, 2, 3…)
 *     date        – 'YYYY-MM-DD' string (optional)
 *     sectionTitle – string (optional)
 *     activities  – [{ id, name, time?, location?, notes?, expense }]
 *   }
 */

const GRADIENTS = [
  'from-indigo-600 to-cyan-500',
  'from-violet-600 to-indigo-500',
  'from-cyan-600 to-teal-500',
  'from-emerald-600 to-cyan-500',
  'from-rose-600 to-orange-500',
  'from-amber-600 to-yellow-500',
]

const fmtDate = (d) => {
  if (!d) return ''
  try {
    const dt = new Date(d)
    if (isNaN(dt.getTime())) return ''
    return dt.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    })
  } catch {
    return ''
  }
}

const fmtRupeeTotal = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

export default function DaySection({ day }) {
  const gradient = GRADIENTS[(day.dayNumber - 1) % GRADIENTS.length]
  const activities = day.activities || []
  const totalExpense = activities.reduce((sum, a) => sum + (Number(a.expense) || 0), 0)
  const formattedDate = fmtDate(day.date)

  return (
    <section
      id={`day-section-${day.dayNumber}`}
      className="rounded-2xl overflow-hidden shadow-sm border border-gray-100"
      aria-label={`Day ${day.dayNumber} itinerary`}
    >
      {/* ── Day header ── */}
      <div className={`bg-gradient-to-r ${gradient} px-5 py-3.5 flex items-center justify-between flex-wrap gap-2`}>
        <div className="flex items-center gap-3">
          {/* Day badge */}
          <span className="
            bg-white/25 text-white text-xs font-bold
            px-3 py-1 rounded-full backdrop-blur-sm
            border border-white/30
          ">
            Day {day.dayNumber} {day.sectionTitle ? `— ${day.sectionTitle}` : ''}
          </span>

          {/* Date */}
          {formattedDate && (
            <span className="flex items-center gap-1 text-white/80 text-xs">
              <Calendar size={11} />
              {formattedDate}
            </span>
          )}
        </div>

        {/* Daily total */}
        <div className="text-xs text-white/70">
          Daily total:{' '}
          <span className="font-bold text-white text-sm">{fmtRupeeTotal(totalExpense)}</span>
        </div>
      </div>

      {/* ── Column labels ── */}
      <div className="
        flex items-center justify-between
        px-5 py-2 bg-gray-50
        border-b border-gray-100
      ">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Physical Activity
        </span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Expense
        </span>
      </div>

      {/* ── Activity list ── */}
      <div className="bg-white px-2 py-2">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-4">
            No activities planned for this day.
          </p>
        ) : (
          activities.map((activity, idx) => (
            <ActivityRow
              key={activity.id || idx}
              activity={activity}
              isLast={idx === activities.length - 1}
            />
          ))
        )}
      </div>
    </section>
  )
}
