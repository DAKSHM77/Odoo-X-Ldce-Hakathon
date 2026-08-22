import { PlusCircle, MapPin, Globe, Eye, ArrowRight } from 'lucide-react'
import { useItinerary } from '../../context/ItineraryContext'
import ItinerarySection from './ItinerarySection'

/**
 * ItineraryBuilder (Screen 5 component)
 * Renders editable section cards with activity management, total budget calculation,
 * and a "View Itinerary" navigation action to Screen 9.
 */
export default function ItineraryBuilder() {
  const {
    sections,
    updateSection,
    addSection,
    removeSection,
    addActivity,
    updateActivity,
    removeActivity,
    setActiveScreen,
  } = useItinerary()

  // Compute total budget across all sections
  const totalBudget = sections.reduce(
    (sum, s) => sum + (parseFloat(s.budget) || 0),
    0
  )

  // Compute total activity expenses across all sections
  const totalExpenses = sections.reduce((sum, s) => {
    const actSum = (s.activities || []).reduce(
      (aSum, act) => aSum + (parseFloat(act.expense) || 0),
      0
    )
    return sum + actSum
  }, 0)

  return (
    <div className="space-y-6">
      {/* ── Summary & View Itinerary CTA Strip ── */}
      <div className="
        flex flex-wrap gap-4 items-center justify-between
        bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500
        rounded-2xl p-5 text-white shadow-md
      ">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Globe size={20} className="opacity-80" />
            <div>
              <p className="text-xs opacity-70 uppercase tracking-wider font-medium">Trip</p>
              <p className="font-bold text-base leading-tight">
                {sections[0]?.title ? sections[0].title : 'My Trip'}
              </p>
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
          <div>
            <p className="text-xs opacity-70 uppercase tracking-wider font-medium">Total Budget</p>
            <p className="font-bold text-lg leading-tight">
              ₹{totalBudget.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* View Itinerary Button */}
        <button
          id="strip-view-itinerary-btn"
          type="button"
          onClick={() => setActiveScreen('view')}
          className="
            inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-white text-indigo-700 font-bold text-sm shadow
            hover:bg-indigo-50 hover:scale-105 transition-all duration-200
          "
        >
          <Eye size={18} />
          View Itinerary
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ── Section Cards ── */}
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <ItinerarySection
            key={section.id}
            section={section}
            index={idx}
            onChange={updateSection}
            onRemove={removeSection}
            removable={sections.length > 1}
            onAddActivity={addActivity}
            onUpdateActivity={updateActivity}
            onRemoveActivity={removeActivity}
          />
        ))}
      </div>

      {/* ── Actions: Add Section & View Itinerary ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          id="add-itinerary-section-btn"
          type="button"
          onClick={addSection}
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

        <button
          id="bottom-view-itinerary-btn"
          type="button"
          onClick={() => setActiveScreen('view')}
          className="
            w-full flex items-center justify-center gap-2
            rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500
            hover:from-indigo-700 hover:to-cyan-600
            text-white font-bold text-sm
            py-4 px-6 shadow-md hover:shadow-lg
            transition-all duration-200
          "
          aria-label="View Itinerary"
        >
          <Eye size={20} />
          View Itinerary (Screen 9) →
        </button>
      </div>
    </div>
  )
}
