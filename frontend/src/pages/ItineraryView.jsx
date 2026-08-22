import { useState } from 'react'
import {
  Search, SlidersHorizontal, ChevronDown,
  MapPin, CalendarDays, ChevronRight, ArrowUpDown,
  Layers, IndianRupee, Edit3, PlusCircle, AlertCircle,
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import DaySection from '../components/itinerary/DaySection'
import { useItinerary } from '../context/ItineraryContext'

// ─────────────────────────────────────────────────────────────────────────────
// Page component: Screen 9 (Itinerary View with Expense/Budget Information)
// Dynamically reads itinerary data created in Screen 5 from ItineraryContext.
// ─────────────────────────────────────────────────────────────────────────────
export default function ItineraryViewPage() {
  const { sections = [], setActiveScreen } = useItinerary()

  // Control bar UI state (UI only — search/filter logic deliberately deferred)
  const [searchQuery, setSearchQuery]         = useState('')
  const [groupByOpen, setGroupByOpen]         = useState(false)
  const [sortByOpen, setSortByOpen]           = useState(false)
  const [filterOpen, setFilterOpen]           = useState(false)
  const [selectedGroupBy, setSelectedGroupBy] = useState('Day')
  const [selectedSortBy, setSelectedSortBy]   = useState('Default')

  const GROUP_BY_OPTIONS = ['Day', 'Section', 'Category']
  const SORT_BY_OPTIONS  = ['Default', 'Expense: Low to High', 'Expense: High to Low', 'Time']

  // Dynamic place heading (uses section titles created in Screen 5)
  const mainPlace = sections.length > 0 && sections[0].title ? sections[0].title : 'Goa'

  // Map sections into dynamic day objects for DaySection & ActivityRow
  const dynamicDays = (sections || []).map((sec, idx) => ({
    dayNumber: idx + 1,
    date: sec.startDate || null,
    sectionTitle: sec.title || `Section ${idx + 1}`,
    activities: (sec.activities || []).map((act, aIdx) => ({
      id: act.id || `act-${idx}-${aIdx}`,
      name: act.name || 'Unnamed Activity',
      time: act.time || '',
      location: act.location || '',
      notes: act.notes || '',
      expense: Number(act.expense) || 0,
    })),
  }))

  // Calculate totals dynamically from Screen 5 data
  const totalActivities = dynamicDays.reduce((sum, d) => sum + d.activities.length, 0)
  const totalExpense = dynamicDays.reduce((sum, d) => {
    const daySum = d.activities.reduce((aSum, act) => aSum + act.expense, 0)
    return sum + daySum
  }, 0)

  const fmtRupee = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

  const fmtDateRange = (s, e) => {
    if (!s) return 'Dates not set'
    try {
      const d1 = new Date(s)
      if (isNaN(d1.getTime())) return 'Dates not set'
      const opts = { month: 'short', day: 'numeric' }
      const startStr = d1.toLocaleDateString('en-US', opts)
      if (!e) return startStr
      const d2 = new Date(e)
      if (isNaN(d2.getTime())) return startStr
      const endStr = d2.toLocaleDateString('en-US', { ...opts, year: 'numeric' })
      return `${startStr} – ${endStr}`
    } catch {
      return 'Dates not set'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-cyan-50/20">
      {/* ── Navbar ── */}
      <Navbar />

      <main id="itinerary-view-main" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* ── Breadcrumb ── */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-gray-500 pt-6 mb-5"
        >
          <button
            type="button"
            onClick={() => setActiveScreen('builder')}
            className="hover:text-indigo-600 transition-colors"
          >
            Dashboard
          </button>
          <ChevronRight size={12} />
          <button
            type="button"
            onClick={() => setActiveScreen('builder')}
            className="hover:text-indigo-600 transition-colors"
          >
            Itinerary Builder
          </button>
          <ChevronRight size={12} />
          <span className="text-indigo-600 font-medium">Itinerary View</span>
        </nav>

        {/* ── Place Heading & Header Meta ── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="
              w-10 h-10 rounded-2xl flex-shrink-0
              bg-gradient-to-br from-indigo-500 to-cyan-500
              flex items-center justify-center shadow-md
            ">
              <MapPin size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                Itinerary for {mainPlace}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {fmtDateRange(sections[0]?.startDate, sections[0]?.endDate)}
                </span>
                <span className="hidden sm:block text-gray-300">|</span>
                <span>{dynamicDays.length} Days · {totalActivities} Activities</span>
                <span className="hidden sm:block text-gray-300">|</span>
                <span className="flex items-center gap-1 font-semibold text-indigo-600">
                  <IndianRupee size={13} />
                  {fmtRupee(totalExpense)} total
                </span>
              </div>
            </div>
          </div>

          {/* Action button to jump back to Screen 5 Builder */}
          <button
            id="edit-itinerary-btn"
            type="button"
            onClick={() => setActiveScreen('builder')}
            className="
              inline-flex items-center gap-2 px-4 py-2 rounded-xl
              bg-indigo-50 hover:bg-indigo-100 text-indigo-700
              text-sm font-semibold border border-indigo-200
              transition-all duration-200 self-start sm:self-auto
            "
          >
            <Edit3 size={15} />
            Edit in Builder
          </button>
        </div>

        {/* ── Summary Stat Pills ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Days',    value: dynamicDays.length },
            { label: 'Activities',    value: totalActivities },
            { label: 'Total Expense', value: fmtRupee(totalExpense) },
            {
              label: 'Avg. per Day',
              value: dynamicDays.length > 0 ? fmtRupee(Math.round(totalExpense / dynamicDays.length)) : '₹0',
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm px-4 py-3 text-center"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-base font-bold text-gray-800 mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Control Bar ── */}
        <div className="
          sticky top-[65px] z-30
          bg-white/80 backdrop-blur-md
          border border-gray-200/70
          rounded-2xl shadow-sm
          px-4 py-3 mb-6
          flex flex-wrap items-center gap-3
        ">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              id="itinerary-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activities…"
              className="
                w-full pl-9 pr-4 py-2 rounded-xl
                bg-gray-50 border border-gray-200
                text-sm text-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white
                transition-all duration-200
              "
            />
          </div>

          {/* Group By */}
          <div className="relative">
            <button
              id="group-by-btn"
              type="button"
              onClick={() => { setGroupByOpen((o) => !o); setSortByOpen(false); setFilterOpen(false) }}
              className="
                flex items-center gap-2 px-4 py-2 rounded-xl
                bg-gray-50 border border-gray-200
                text-sm font-medium text-gray-700
                hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700
                transition-all duration-200
              "
              aria-haspopup="listbox"
              aria-expanded={groupByOpen}
            >
              <Layers size={14} />
              <span className="hidden sm:inline">Group By:</span>
              <span className="text-indigo-600 font-semibold">{selectedGroupBy}</span>
              <ChevronDown size={14} className={`transition-transform ${groupByOpen ? 'rotate-180' : ''}`} />
            </button>
            {groupByOpen && (
              <div className="
                absolute right-0 mt-1.5 w-44 z-50
                bg-white rounded-xl border border-gray-100 shadow-lg py-1
              ">
                {GROUP_BY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    id={`group-by-${opt.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => { setSelectedGroupBy(opt); setGroupByOpen(false) }}
                    className={`
                      w-full text-left px-4 py-2 text-sm transition-colors
                      ${selectedGroupBy === opt
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter */}
          <div className="relative">
            <button
              id="filter-btn"
              type="button"
              onClick={() => { setFilterOpen((o) => !o); setGroupByOpen(false); setSortByOpen(false) }}
              className="
                flex items-center gap-2 px-4 py-2 rounded-xl
                bg-gray-50 border border-gray-200
                text-sm font-medium text-gray-700
                hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700
                transition-all duration-200
              "
              aria-haspopup="dialog"
              aria-expanded={filterOpen}
            >
              <SlidersHorizontal size={14} />
              <span>Filter</span>
            </button>
            {filterOpen && (
              <div className="
                absolute right-0 mt-1.5 w-56 z-50
                bg-white rounded-xl border border-gray-100 shadow-lg p-4
              ">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Filter Options
                </p>
                {['Free activities only', 'Activities with time', 'High expense (₹1000+)'].map((opt) => (
                  <label key={opt} className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-indigo-700 transition-colors">
                      {opt}
                    </span>
                  </label>
                ))}
                <p className="text-xs text-gray-400 mt-3 italic">Full filter logic coming soon</p>
              </div>
            )}
          </div>

          {/* Sort By */}
          <div className="relative">
            <button
              id="sort-by-btn"
              type="button"
              onClick={() => { setSortByOpen((o) => !o); setGroupByOpen(false); setFilterOpen(false) }}
              className="
                flex items-center gap-2 px-4 py-2 rounded-xl
                bg-gray-50 border border-gray-200
                text-sm font-medium text-gray-700
                hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700
                transition-all duration-200
              "
              aria-haspopup="listbox"
              aria-expanded={sortByOpen}
            >
              <ArrowUpDown size={14} />
              <span className="hidden sm:inline">Sort By:</span>
              <span className="text-indigo-600 font-semibold truncate max-w-[80px]">{selectedSortBy}</span>
              <ChevronDown size={14} className={`transition-transform ${sortByOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortByOpen && (
              <div className="
                absolute right-0 mt-1.5 w-52 z-50
                bg-white rounded-xl border border-gray-100 shadow-lg py-1
              ">
                {SORT_BY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    id={`sort-by-${opt.toLowerCase().replace(/[\s:+]/g, '-')}`}
                    onClick={() => { setSelectedSortBy(opt); setSortByOpen(false) }}
                    className={`
                      w-full text-left px-4 py-2 text-sm transition-colors
                      ${selectedSortBy === opt
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Click-outside listener overlay for dropdowns */}
        {(groupByOpen || sortByOpen || filterOpen) && (
          <div
            className="fixed inset-0 z-20"
            onClick={() => { setGroupByOpen(false); setSortByOpen(false); setFilterOpen(false) }}
            aria-hidden="true"
          />
        )}

        {/* ── Day Sections / Graceful Empty State ── */}
        {dynamicDays.length === 0 || totalActivities === 0 ? (
          <div className="
            bg-white/80 backdrop-blur-sm rounded-3xl
            border border-gray-200/80 p-8 sm:p-12 text-center
            shadow-sm max-w-xl mx-auto my-8
          ">
            <div className="
              w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600
              flex items-center justify-center mx-auto mb-4
            ">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              No Activities in Itinerary
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
              Your itinerary currently has no activities or expenses added. Return to the Itinerary Builder to add sections and activities for your trip.
            </p>
            <button
              id="empty-state-builder-btn"
              type="button"
              onClick={() => setActiveScreen('builder')}
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-xl
                bg-gradient-to-r from-indigo-600 to-cyan-500
                text-white font-bold text-sm shadow-md
                hover:opacity-90 hover:scale-105 transition-all duration-200
              "
            >
              <PlusCircle size={18} />
              Open Itinerary Builder
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {dynamicDays.map((day) => (
              <DaySection key={day.dayNumber} day={day} />
            ))}
          </div>
        )}

        {/* ── Grand Total Footer ── */}
        {totalActivities > 0 && (
          <div className="
            mt-8 rounded-2xl
            bg-gradient-to-r from-indigo-600 to-cyan-500
            text-white px-6 py-5
            flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
            shadow-md
          ">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-70 font-medium">Trip Grand Total</p>
              <p className="text-3xl font-bold mt-0.5">{fmtRupee(totalExpense)}</p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="opacity-70 text-xs uppercase tracking-wider">Days</p>
                <p className="font-bold text-lg">{dynamicDays.length}</p>
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="text-center">
                <p className="opacity-70 text-xs uppercase tracking-wider">Activities</p>
                <p className="font-bold text-lg">{totalActivities}</p>
              </div>
              <div className="h-8 w-px bg-white/30" />
              <div className="text-center">
                <p className="opacity-70 text-xs uppercase tracking-wider">Avg/Day</p>
                <p className="font-bold text-lg">{fmtRupee(Math.round(totalExpense / dynamicDays.length))}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
