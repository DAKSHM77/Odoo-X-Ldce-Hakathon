/* eslint-disable react/only-export-components */
import { createContext, useState } from 'react';

export const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [activeTrip, setActiveTrip] = useState(null);

  const createTrip = (tripData) => {
    const tripId = tripData._id || tripData.id || `temp_trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newTrip = {
      id: tripId,
      _id: tripData._id || tripId,
      tripName: tripData.tripName,
      selectedCity: tripData.selectedCity,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      selectedSuggestions: tripData.selectedSuggestions || []
    };

    setActiveTrip(newTrip);
    return newTrip;
  };

  const clearTrip = () => {
    setActiveTrip(null);
  };

  return (
    <TripContext.Provider value={{ activeTrip, createTrip, clearTrip, setActiveTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export default TripProvider;
