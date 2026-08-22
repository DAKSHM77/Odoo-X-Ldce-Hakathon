import { Clock, MapPin } from 'lucide-react'

/**
 * ActivityRow
 * Renders a single activity item within a DaySection.
 * Shows the activity name, optional time & location, and expense.
 * Renders a visual downward-arrow connector below itself unless it is the last item.
 *
 * Props:
 *   activity – { id, name, time?, location?, notes?, expense }
 *   isLast   – boolean – suppresses the connector on the final row
 */

const fmtRupee = (n) =>
  n === 0
    ? <span className="text-emerald-600 font-semibold">Free</span>
    : <span>₹{Number(n).toLocaleString('en-IN')}</span>

export default function ActivityRow({ activity, isLast }) {
  return (
    <div id={`activity-row-${activity.id}`}>
      {/* ── Activity card ── */}
      <div className="
        flex items-start justify-between gap-4
        px-4 py-3.5 rounded-xl
        hover:bg-indigo-50/60 transition-colors duration-150
        group
      ">
        {/* Left: indicator dot + details */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Bullet */}
          <span className="
            mt-1 flex-shrink-0
            w-3 h-3 rounded-full border-2 border-indigo-400
            bg-white group-hover:bg-indigo-400
            transition-colors duration-200
          " />

          {/* Text */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 leading-snug">
              {activity.name}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 mt-0.5">
              {activity.time && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={10} />
                  {activity.time}
                </span>
              )}
              {activity.location && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={10} />
                  {activity.location}
                </span>
              )}
            </div>
            {activity.notes && (
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{activity.notes}</p>
            )}
          </div>
        </div>

        {/* Right: expense */}
        <div className="text-sm font-semibold text-gray-700 flex-shrink-0 text-right pt-0.5">
          {fmtRupee(activity.expense)}
        </div>
      </div>

      {/* ── Connector arrow (hidden on last item) ── */}
      {!isLast && (
        <div className="flex justify-start pl-[26px] py-0.5" aria-hidden="true">
          <div className="flex flex-col items-center">
            <div className="w-px h-4 bg-indigo-200" />
            {/* Arrowhead made from borders */}
            <div className="
              w-0 h-0
              border-l-[5px] border-l-transparent
              border-r-[5px] border-r-transparent
              border-t-[6px] border-t-indigo-300
            " />
          </div>
        </div>
      )}
    </div>
  )
}
