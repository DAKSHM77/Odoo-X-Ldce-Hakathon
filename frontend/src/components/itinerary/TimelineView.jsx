import DayBlock from './DayBlock'

/**
 * TimelineView
 * Renders the full day-by-day trip timeline using DayBlock cards.
 * Each section gets a distinct accent colour carried across its days.
 *
 * Props:
 *   days – array of day objects (see DayBlock propTypes)
 */

const SECTION_ACCENTS = [
  'bg-indigo-500',
  'bg-cyan-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
]

export default function TimelineView({ days = [] }) {
  if (days.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">No days to display yet.</p>
    )
  }

  // Assign a stable accent per unique sectionTitle
  const sectionAccents = {}
  let accentIdx = 0
  days.forEach((d) => {
    if (!(d.sectionTitle in sectionAccents)) {
      sectionAccents[d.sectionTitle] = SECTION_ACCENTS[accentIdx % SECTION_ACCENTS.length]
      accentIdx++
    }
  })

  return (
    <div id="timeline-view" className="pt-2">
      {days.map((day) => (
        <DayBlock
          key={`day-${day.dayNumber}`}
          day={{ ...day, accentClass: sectionAccents[day.sectionTitle] }}
        />
      ))}
    </div>
  )
}
