import { MapPin, Calendar, DollarSign, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { useState } from 'react'

/**
 * ItinerarySection
 * A reusable card that represents one section of a trip itinerary.
 *
 * Props:
 *   section      – { id, title, description, startDate, endDate, budget }
 *   index        – zero-based position in the list (used for colour accent)
 *   onChange     – (id, field, value) => void
 *   onRemove     – (id) => void
 *   removable    – bool  (hide the remove button when only 1 section remains)
 */

const ACCENT_COLOURS = [
  { bg: 'bg-indigo-50',   border: 'border-indigo-300', badge: 'bg-indigo-500',  icon: 'text-indigo-500'  },
  { bg: 'bg-cyan-50',     border: 'border-cyan-300',   badge: 'bg-cyan-500',    icon: 'text-cyan-500'    },
  { bg: 'bg-violet-50',   border: 'border-violet-300', badge: 'bg-violet-500',  icon: 'text-violet-500'  },
  { bg: 'bg-emerald-50',  border: 'border-emerald-300',badge: 'bg-emerald-500', icon: 'text-emerald-500' },
  { bg: 'bg-amber-50',    border: 'border-amber-300',  badge: 'bg-amber-500',   icon: 'text-amber-500'   },
  { bg: 'bg-rose-50',     border: 'border-rose-300',   badge: 'bg-rose-500',    icon: 'text-rose-500'    },
]

export default function ItinerarySection({ section, index, onChange, onRemove, removable }) {
  const [collapsed, setCollapsed] = useState(false)
  const accent = ACCENT_COLOURS[index % ACCENT_COLOURS.length]

  const handleField = (field) => (e) => onChange(section.id, field, e.target.value)

  return (
    <div
      id={`itinerary-section-${section.id}`}
      className={`
        rounded-2xl border-2 shadow-sm transition-all duration-300
        hover:shadow-md
        ${accent.bg} ${accent.border}
      `}
    >
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          {/* Numbered badge */}
          <span
            className={`
              flex-shrink-0 w-8 h-8 rounded-full text-white text-sm font-bold
              flex items-center justify-center ${accent.badge}
            `}
          >
            {index + 1}
          </span>

          {/* Inline-editable section title */}
          <input
            id={`section-title-${section.id}`}
            type="text"
            value={section.title}
            onChange={handleField('title')}
            className="
              bg-transparent text-gray-800 font-semibold text-lg
              border-b border-transparent focus:border-gray-400
              focus:outline-none transition-colors duration-200
              w-full max-w-xs
            "
            placeholder="Section title..."
            aria-label={`Section ${index + 1} title`}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Collapse / Expand */}
          <button
            type="button"
            id={`toggle-section-${section.id}`}
            onClick={() => setCollapsed((c) => !c)}
            className="
              p-1.5 rounded-lg text-gray-400 hover:text-gray-700
              hover:bg-white/60 transition-colors duration-200
            "
            aria-label={collapsed ? 'Expand section' : 'Collapse section'}
          >
            {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>

          {/* Remove section */}
          {removable && (
            <button
              type="button"
              id={`remove-section-${section.id}`}
              onClick={() => onRemove(section.id)}
              className="
                p-1.5 rounded-lg text-red-400 hover:text-red-600
                hover:bg-red-50 transition-colors duration-200
              "
              aria-label={`Remove section ${index + 1}`}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ── Collapsible Body ── */}
      {!collapsed && (
        <div className="px-5 pb-5 space-y-4">
          {/* Divider */}
          <div className="h-px w-full border-t border-current opacity-20" />

          {/* Description */}
          <div>
            <label
              htmlFor={`section-desc-${section.id}`}
              className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
            >
              Description
            </label>
            <textarea
              id={`section-desc-${section.id}`}
              rows={3}
              value={section.description}
              onChange={handleField('description')}
              placeholder="Describe what you'll do in this section..."
              className="
                w-full rounded-xl border border-gray-200 bg-white/70
                px-4 py-3 text-sm text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-300
                resize-none transition-all duration-200
              "
            />
          </div>

          {/* Date Range + Budget row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className={accent.icon} />
                  Date Range
                </span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id={`section-start-${section.id}`}
                  type="date"
                  value={section.startDate}
                  onChange={handleField('startDate')}
                  className="
                    flex-1 rounded-xl border border-gray-200 bg-white/70
                    px-3 py-2.5 text-sm text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-300
                    transition-all duration-200
                  "
                  aria-label="Start date"
                />
                <span className="text-gray-400 text-xs font-medium">to</span>
                <input
                  id={`section-end-${section.id}`}
                  type="date"
                  value={section.endDate}
                  onChange={handleField('endDate')}
                  className="
                    flex-1 rounded-xl border border-gray-200 bg-white/70
                    px-3 py-2.5 text-sm text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-300
                    transition-all duration-200
                  "
                  aria-label="End date"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor={`section-budget-${section.id}`}
                className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
              >
                <span className="flex items-center gap-1.5">
                  <DollarSign size={13} className={accent.icon} />
                  Budget (USD)
                </span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">$</span>
                <input
                  id={`section-budget-${section.id}`}
                  type="number"
                  min="0"
                  step="1"
                  value={section.budget}
                  onChange={handleField('budget')}
                  placeholder="0"
                  className="
                    w-full rounded-xl border border-gray-200 bg-white/70
                    pl-7 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-300
                    transition-all duration-200
                  "
                />
              </div>
            </div>
          </div>

          {/* Location hint */}
          <div className={`flex items-center gap-2 text-xs ${accent.icon} opacity-70`}>
            <MapPin size={12} />
            <span>Tip: Specify locations when editing activities inside this section.</span>
          </div>
        </div>
      )}
    </div>
  )
}
