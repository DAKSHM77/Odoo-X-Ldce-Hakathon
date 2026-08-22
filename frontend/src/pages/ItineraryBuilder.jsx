import { Link } from 'react-router-dom';
import ItineraryBuilder from '../components/itinerary/ItineraryBuilder';
import { useItinerary } from '../context/ItineraryContext';
import { BookOpen, ChevronRight, Eye } from 'lucide-react';

/**
 * ItineraryBuilderPage  (Screen 5 Page Wrapper)
 * Renders page breadcrumbs, header with "View Itinerary" action,
 * and the main ItineraryBuilder content area.
 */
export default function ItineraryBuilderPage() {
  const { setActiveScreen } = useItinerary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-cyan-50/20 text-slate-800">
      {/* ── Page Content ── */}
      <main id="itinerary-builder-main" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-gray-500 mb-6"
        >
          <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
            Dashboard
          </Link>
          <ChevronRight size={12} />
          <span className="text-indigo-600 font-medium">Itinerary Builder</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div
                className="
                w-10 h-10 rounded-2xl
                bg-gradient-to-br from-indigo-500 to-cyan-500
                flex items-center justify-center shadow-md
              "
              >
                <BookOpen size={20} className="text-white" />
              </div>
              <h1
                className="
                text-2xl sm:text-3xl font-bold text-gray-900
                tracking-tight leading-tight
              "
              >
                Itinerary Builder
              </h1>
            </div>
            <p className="text-gray-500 text-sm ml-[52px]">
              Organise your trip into sections with dates, budgets, and activities.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="header-view-itinerary-btn"
              type="button"
              onClick={() => setActiveScreen('view')}
              className="
                inline-flex items-center gap-2
                px-5 py-2.5 rounded-xl
                bg-gradient-to-r from-indigo-500 to-cyan-500
                text-white text-sm font-semibold shadow
                hover:shadow-md hover:opacity-90
                transition-all duration-200
              "
            >
              <Eye size={16} />
              View Itinerary
            </button>
          </div>
        </div>

        {/* ── Builder ── */}
        <ItineraryBuilder />

        {/* Footer spacing */}
        <div className="h-16" />
      </main>
    </div>
  );
}
