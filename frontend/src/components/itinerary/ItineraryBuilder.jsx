import { useState } from 'react'
import { PlusCircle, MapPin, Globe } from 'lucide-react'
import ItinerarySection from './ItinerarySection'

// ── Static seed data ──────────────────────────────────────────────────────────
const INITIAL_SECTIONS = [
  {
    id: 1,
    title: 'Arrival & City Exploration',
    description: 'Check in to the hotel, freshen up, and take a leisurely walk through the old town. Visit the central market and grab a local dinner.',
    startDate: '2024-09-10',
    endDate: '2024-09-12',
    budget: '350',
  },
  {
    id: 2,
    title: 'Adventure & Outdoor Activities',
    description: 'Day trip to the national park. Hiking, kayaking, and a guided nature tour in the afternoon. Bonfire dinner under the stars.',
    startDate: '2024-09-13',
    endDate: '2024-09-15',
    budget: '500',
  },
  {
    id: 3,
    title: 'Culture & Departure',
    description: 'Museum visits, souvenir shopping, and a farewell dinner at a rooftop restaurant. Transfer to the airport in the evening.',
    startDate: '2024-09-16',
    endDate: '2024-09-17',
    budget: '200',
  },
]

let nextId = INITIAL_SECTIONS.length + 1

// ── ItineraryBuilder component ────────────────────────────────────────────────
/**
 * ItineraryBuilder
 * Renders the full list of ItinerarySection cards plus an "Add another Section"
 * button and a trip summary strip.
 * No backend / API calls – purely static/local state.
 */
export default function ItineraryBuilder() {
  const [sections, setSections] = useState(INITIAL_SECTIONS)

  // Update a single field on a section
  const handleChange = (id, field, value) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  // Remove a section
  const handleRemove = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
  }

  // Append a new blank section
  const handleAdd = () => {
    const newSection = {
      id: nextId++,
      title: `Section ${sections.length + 1}`,
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
    }
    setSections((prev) => [...prev, newSection])
  }

  // Compute total budget
  const totalBudget = sections.reduce(
    (sum, s) => sum + (parseFloat(s.budget) || 0),
    0
  )

  return (
    <div className="space-y-6">
      {/* Trip Summary Strip */}
      <div className="flex flex-wrap gap-4 items-center bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl p-5 text-white shadow-md">
        <div className="flex items-center gap-2">
          <Globe size={20} className="opacity-80" />
          <div>
            <p className="text-xs opacity-70 uppercase tracking-wider font-medium">Trip</p>
            <p className="font-bold text-base leading-tight">Europe Summer 2024</p>
          </div>
        </div>
        <div className="h-8 w-px bg-white/30 hidden sm:block" />
        <div className="flex items-center gap-2">
          <MapPin size={20} className="opacity-80" />
          <div>
            <p className="text-xs opacity-70 uppercase tracking-wider font-medium">Sections</p>
            <p className="font-bold text-base leading-tight">{sections.length}</p>
          </div>
        </div>
        <div className="h-8 w-px bg-white/30 hidden sm:block" />
        <div className="ml-auto text-right">
          <p className="text-xs opacity-70 uppercase tracking-wider font-medium">Total Budget</p>
          <p className="font-bold text-xl leading-tight">
            ${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Section Cards */}
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <ItinerarySection
            key={section.id}
            section={section}
            index={idx}
            onChange={handleChange}
            onRemove={handleRemove}
            removable={sections.length > 1}
          />
        ))}
      </div>

      {/* Add Section Button */}
      <button
        id="add-itinerary-section-btn"
        type="button"
        onClick={handleAdd}
        className="
          w-full flex items-center justify-center gap-2
          rounded-2xl border-2 border-dashed border-indigo-300
          bg-indigo-50 hover:bg-indigo-100
          text-indigo-600 font-semibold text-sm
          py-4 px-6
          transition-all duration-200 hover:border-indigo-400
          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
        "
        aria-label="Add another itinerary section"
      >
        <PlusCircle size={20} />
        + Add another Section
      </button>
    </div>
  )
}
