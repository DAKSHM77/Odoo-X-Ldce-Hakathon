import { createContext, useContext, useState } from 'react'

const ItineraryContext = createContext()

// ── Default Seed Data for Itinerary Module ──────────────────────────────────
const INITIAL_SECTIONS = [
  {
    id: 'sec-goa',
    title: 'Goa',
    description: 'Beach vacation with water sports, sightseeing, and local food.',
    startDate: '2026-08-10',
    endDate: '2026-08-12',
    budget: '10000',
    activities: [
      {
        id: 'act-1',
        name: 'Baga Beach',
        time: '10:00 AM',
        date: '2026-08-10',
        location: 'North Goa',
        notes: 'Morning walk & beach relaxation',
        expense: 0,
      },
      {
        id: 'act-2',
        name: 'Water Sports',
        time: '2:00 PM',
        date: '2026-08-10',
        location: 'Calangute Beach',
        notes: 'Parasailing & Jet Skiing',
        expense: 2500,
      },
      {
        id: 'act-3',
        name: 'Dinner',
        time: '8:00 PM',
        date: '2026-08-10',
        location: "Tito's Lane",
        notes: 'Fresh seafood platter',
        expense: 800,
      },
    ],
  },
]

export function ItineraryProvider({ children }) {
  const [sections, setSections] = useState(INITIAL_SECTIONS)
  const [activeScreen, setActiveScreen] = useState('builder') // 'builder' | 'view'

  // Update a single property of a section
  const updateSection = (id, field, value) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  // Add a new empty section
  const addSection = () => {
    const newId = `sec-${Date.now()}`
    const newSection = {
      id: newId,
      title: `Section ${sections.length + 1}`,
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      activities: [],
    }
    setSections((prev) => [...prev, newSection])
  }

  // Remove a section by ID
  const removeSection = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
  }

  // Add an activity to a specific section
  const addActivity = (sectionId) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec
        const newAct = {
          id: `act-${Date.now()}`,
          name: '',
          time: '',
          expense: 0,
          location: '',
          notes: '',
        }
        return {
          ...sec,
          activities: [...(sec.activities || []), newAct],
        }
      })
    )
  }

  // Update an activity field in a specific section
  const updateActivity = (sectionId, activityId, field, value) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec
        const updatedActivities = (sec.activities || []).map((act) =>
          act.id === activityId ? { ...act, [field]: value } : act
        )
        return { ...sec, activities: updatedActivities }
      })
    )
  }

  // Remove an activity from a specific section
  const removeActivity = (sectionId, activityId) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== sectionId) return sec
        return {
          ...sec,
          activities: (sec.activities || []).filter((act) => act.id !== activityId),
        }
      })
    )
  }

  return (
    <ItineraryContext.Provider
      value={{
        sections,
        setSections,
        updateSection,
        addSection,
        removeSection,
        addActivity,
        updateActivity,
        removeActivity,
        activeScreen,
        setActiveScreen,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  )
}

export function useItinerary() {
  const context = useContext(ItineraryContext)
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider')
  }
  return context
}
