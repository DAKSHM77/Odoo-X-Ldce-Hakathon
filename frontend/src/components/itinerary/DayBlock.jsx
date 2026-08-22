import { Clock, MapPin } from 'lucide-react'

/**
 * DayBlock
 * Represents a single day in the trip timeline.
 *
 * Props:
 *   day – {
 *     date        – ISO string e.g. "2024-09-10"
 *     dayNumber   – number (1, 2, 3…)
 *     label       – string e.g. "Arrival Day"
 *     sectionTitle – string  (which section this day belongs to)
 *     accentClass  – Tailwind bg class for the left timeline stripe
 *     activities  – [{ id, time, title, location, notes }]
 *   }
 */

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })

export default function DayBlock({ day }) {
  const { date, dayNumber, label, sectionTitle, accentClass = 'bg-indigo-500', activities = [] } = day

  return (
    <div id={`day-block-${dayNumber}`} className="flex gap-4 group">

      {/* Left: day badge + vertical stripe */}
      <div className="flex flex-col items-center">
        <div className={`
          w-10 h-10 rounded-full text-white text-sm font-bold
          flex items-center justify-center flex-shrink-0 shadow-sm
          ${accentClass}
        `}>
          {dayNumber}
        </div>
        {/* vertical line */}
        <div className="flex-1 w-0.5 bg-gray-200 mt-2 group-last:hidden" />
      </div>

      {/* Right: content card */}
      <div className="pb-8 flex-1 min-w-0">
        {/* Day header */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-800 text-base">
              Day {dayNumber}
              {label && <span className="font-normal text-gray-500"> — {label}</span>}
            </h3>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-gray-400">{fmtDate(date)}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className={`
              text-xs font-medium px-2 py-0.5 rounded-full
              ${accentClass.replace('bg-', 'bg-').replace('-500', '-100')}
              text-gray-600
            `}>
              {sectionTitle}
            </span>
          </div>
        </div>

        {/* Activity list */}
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No activities planned yet.</p>
        ) : (
          <div className="space-y-2">
            {activities.map((act) => (
              <div
                key={act.id}
                id={`activity-${act.id}`}
                className="
                  bg-white border border-gray-100 rounded-xl
                  px-4 py-3 shadow-sm
                  hover:shadow-md hover:border-gray-200
                  transition-all duration-200
                "
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{act.title}</p>
                    {act.location && (
                      <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <MapPin size={10} />
                        {act.location}
                      </p>
                    )}
                    {act.notes && (
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{act.notes}</p>
                    )}
                  </div>
                  {act.time && (
                    <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0 mt-0.5">
                      <Clock size={10} />
                      {act.time}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
