import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Check } from 'lucide-react';

const MOCK_CITIES = [
  { id: 'paris', name: 'Paris', country: 'France', tagline: 'City of Light' },
  { id: 'london', name: 'London', country: 'United Kingdom', tagline: 'Historical & Cultural Capital' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', tagline: 'Modernity meets Tradition' },
  { id: 'ahmedabad', name: 'Ahmedabad', country: 'India', tagline: 'First UNESCO Heritage City' },
  { id: 'new-york', name: 'New York', country: 'United States', tagline: 'The City That Never Sleeps' }
];

export default function CitySearchBar({ selectedCity, onSelectCity, error }) {
  const [query, setQuery] = useState(() => (selectedCity ? selectedCity.name : ''));
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = MOCK_CITIES.filter((city) =>
    `${city.name} ${city.country}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (city) => {
    onSelectCity(city);
    setQuery(city.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelectCity(null);
    setQuery('');
    setIsOpen(true);
  };

  return (
    <div className="city-search-container" ref={containerRef}>
      <label htmlFor="citySearch" className="form-label">
        Select a Place <span className="required-star">*</span>
      </label>
      <div className={`city-search-input-wrapper ${error ? 'has-error' : ''}`}>
        <MapPin className="search-icon" size={18} />
        <input
          id="citySearch"
          type="text"
          className="city-search-input"
          placeholder="Search destination (e.g. Paris, Tokyo...)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (!e.target.value && selectedCity) {
              onSelectCity(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          autoComplete="off"
        />
        {query ? (
          <button
            type="button"
            className="clear-search-btn"
            onClick={handleClear}
            aria-label="Clear city selection"
          >
            <X size={16} />
          </button>
        ) : (
          <Search className="dropdown-hint-icon" size={16} />
        )}
      </div>

      {isOpen && (
        <ul className="city-dropdown-list" role="listbox">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => {
              const isSelected = selectedCity && selectedCity.id === city.id;
              return (
                <li
                  key={city.id}
                  className={`city-dropdown-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(city)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="city-info">
                    <span className="city-name">{city.name}</span>
                    <span className="city-country">{city.country}</span>
                  </div>
                  <span className="city-tagline">{city.tagline}</span>
                  {isSelected && <Check className="check-icon" size={16} />}
                </li>
              );
            })
          ) : (
            <li className="city-dropdown-empty">No cities found matching "{query}"</li>
          )}
        </ul>
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
