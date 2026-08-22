import { Calendar, DollarSign, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

/**
 * SectionViewCard
 * Read-only view of a single itinerary section.
 * Distinct from ItinerarySection.jsx which is the edit-mode version.
 *
 * Props:
 *   section – {
 *     id, title, description,
 *     startDate, endDate, budget,
 *     spent,        // actual amount spent in this section
 *     activities    // [{ id, title, location }]
 *   }
 *   index   – zero-based (used for accent colour)
 */

const ACCENT_COLOURS = [
  { bg: 'bg-indigo-50',  border: 'border-indigo-200', badge: 'bg-indigo-500',  bar: 'bg-indigo-500',  text: 'text-indigo-600'  },
  { bg: 'bg-cyan-50',    border: 'border-cyan-200',   badge: 'bg-cyan-500',    bar: 'bg-cyan-500',    text: 'text-cyan-600'    },
  { bg: 'bg-violet-50',  border: 'border-violet-200', badge: 'bg-violet-500',  bar: 'bg-violet-500',  text: 'text-violet-600'  },
  { bg: 'bg-emerald-50', border: 'border-emerald-200',badge: 'bg-emerald-500', bar: 'bg-emerald-500', text: 'text-emerald-600' },
  { bg: 'bg-amber-50',   border: 'border-amber-200',  badge: 'bg-amber-500',   bar: 'bg-amber-500',   text: 'text-amber-600'   },
  { bg: 'bg-rose-50',    border: 'border-rose-200',   badge: 'bg-rose-500',    bar: 'bg-rose-500',    text: 'text-rose-600'    },
]

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

const fmtMoney = (n) =>
  `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`

export default function SectionViewCard({ section, index }) {
  const [expanded, setExpanded] = useState(true)
  const accent = ACCENT_COLOURS[index % ACCENT_COLOURS.length]

  const budget  = parseFloat(section.budget)  || 0
  const spent   = parseFloat(section.spent)   || 0
  const pct     = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const over    = spent > budget
  const remaining = budget - spent

  return (
    <div
      id={`section-view-${section.id}`}
      className={`rounded-2xl border-2 shadow-sm transition-all duration-300 hover:shadow-md ${accent.bg} ${accent.border}`}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`flex-shrink-0 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center ${accent.badge}`}>
            {index + 1}
          </span>
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-800 text-base truncate">{section.title}</h2>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {fmtDate(section.startDate)}
                {section.endDate && <> &rarr; {fmtDate(section.endDate)}</>}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          id={`toggle-section-view-${section.id}`}
          onClick={() => setExpanded((e) => !e)}
          className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white/60 transition-colors"
          aria-label={expanded ? 'Collapse section' : 'Expand section'}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* ── Collapsible Body ── */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          <div className="h-px border-t border-current opacity-10" />

          {/* Description */}
          {section.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{section.description}</p>
          )}

          {/* Budget progress */}
          <div className="bg-white/70 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <DollarSign size={12} className={accent.text} />
                Budget Tracker
              </span>
              <span className={over ? 'text-red-600' : accent.text}>
                {over ? 'Over budget!' : `${fmtMoney(remaining)} left`}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${over ? 'bg-red-500' : accent.bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Figures row */}
            <div className="grid grid-cols-3 text-center text-xs">
              <div>
                <p className="text-gray-400">Budget</p>
                <p className="font-bold text-gray-800">{fmtMoney(budget)}</p>
              </div>
              <div>
                <p className="text-gray-400">Spent</p>
                <p className={`font-bold ${over ? 'text-red-600' : 'text-gray-800'}`}>{fmtMoney(spent)}</p>
              </div>
              <div>
                <p className="text-gray-400">Remaining</p>
                <p className={`font-bold ${over ? 'text-red-600' : accent.text}`}>{fmtMoney(remaining)}</p>
              </div>
            </div>
          </div>

          {/* Activity highlights */}
          {section.activities && section.activities.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Activities ({section.activities.length})
              </p>
              <ul className="space-y-1.5">
                {section.activities.map((act) => (
                  <li
                    key={act.id}
                    className="flex items-center gap-2 text-sm text-gray-700 bg-white/60 rounded-lg px-3 py-2"
                  >
                    <MapPin size={12} className={`flex-shrink-0 ${accent.text}`} />
                    <span className="truncate">{act.title}</span>
                    {act.location && (
                      <span className="text-xs text-gray-400 ml-auto flex-shrink-0 hidden sm:block">
                        {act.location}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
