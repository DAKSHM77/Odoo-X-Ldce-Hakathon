import { Routes, Route, Navigate } from 'react-router-dom';
import CreateTrip from '../pages/CreateTrip';
import ItineraryBuilder from '../pages/ItineraryBuilder';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create-trip" replace />} />
      <Route path="/create-trip" element={<CreateTrip />} />
      <Route path="/itinerary-builder" element={<ItineraryBuilder />} />
      <Route path="*" element={<Navigate to="/create-trip" replace />} />
    </Routes>
  );
}
