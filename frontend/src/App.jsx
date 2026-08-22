import { ItineraryProvider, useItinerary } from './context/ItineraryContext'
import ItineraryBuilderPage from './pages/ItineraryBuilder'
import ItineraryViewPage from './pages/ItineraryView'

/**
 * AppContent
 * Renders either Screen 5 (Itinerary Builder) or Screen 9 (Itinerary View)
 * based on the activeScreen state in ItineraryContext.
 */
function AppContent() {
  const { activeScreen } = useItinerary()

  return activeScreen === 'view' ? <ItineraryViewPage /> : <ItineraryBuilderPage />
}

/**
 * App Root
 * Wraps the application with ItineraryProvider for state management across
 * Screen 5 and Screen 9 without modifying any teammates' files.
 */
export default function App() {
  return (
    <ItineraryProvider>
      <AppContent />
    </ItineraryProvider>
  )
}
