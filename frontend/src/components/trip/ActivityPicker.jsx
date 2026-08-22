import { Check, Sparkles, MapPin, Camera, Utensils, Mountain, Landmark, Compass } from 'lucide-react';

const MOCK_SUGGESTIONS = [
  {
    id: 'sug-1',
    title: 'Watchful Mantis',
    category: 'Landmark',
    description: 'Iconic panoramic viewpoint featuring stunning sculpture architecture and serene surroundings.',
    iconName: 'Landmark',
    imageBg: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
  },
  {
    id: 'sug-2',
    title: 'Eiffel Tower Summit',
    category: 'Sightseeing',
    description: 'Breathtaking 360-degree views of the city skyline from the historic summit observation deck.',
    iconName: 'Camera',
    imageBg: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
  },
  {
    id: 'sug-3',
    title: 'Louvre Art Discovery',
    category: 'Culture',
    description: 'World-famous museum tour featuring ancient artifacts, Renaissance art, and historic treasures.',
    iconName: 'Sparkles',
    imageBg: 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)'
  },
  {
    id: 'sug-4',
    title: 'River Sunset Cruise',
    category: 'Experience',
    description: 'Relaxing evening boat cruise passing beneath historic stone bridges and illuminated landmarks.',
    iconName: 'Compass',
    imageBg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
  },
  {
    id: 'sug-5',
    title: 'Historic District Food Walk',
    category: 'Culinary',
    description: 'Sample authentic regional delicacies, artisanal pastries, and local market specialties.',
    iconName: 'Utensils',
    imageBg: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
  },
  {
    id: 'sug-6',
    title: 'Alpine Hillside Trekking',
    category: 'Outdoor',
    description: 'Scenic hiking trail through pine forests, rocky ridges, and pristine mountain fresh air.',
    iconName: 'Mountain',
    imageBg: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)'
  }
];

export default function ActivityPicker({ selectedSuggestions, onToggleSuggestion }) {
  const getIcon = (name) => {
    switch (name) {
      case 'Landmark': return <Landmark size={22} />;
      case 'Camera': return <Camera size={22} />;
      case 'Sparkles': return <Sparkles size={22} />;
      case 'Compass': return <Compass size={22} />;
      case 'Utensils': return <Utensils size={22} />;
      case 'Mountain': return <Mountain size={22} />;
      default: return <MapPin size={22} />;
    }
  };

  return (
    <section className="suggestions-section" aria-labelledby="suggestions-heading">
      <div className="section-header">
        <h2 id="suggestions-heading" className="section-title">
          Suggestions for Places to visit/Activities to perform
        </h2>
        <span className="selected-count-badge">
          {selectedSuggestions.length} Selected
        </span>
      </div>

      <div className="suggestions-grid">
        {MOCK_SUGGESTIONS.map((item) => {
          const isSelected = selectedSuggestions.some((s) => s.id === item.id);
          return (
            <article
              key={item.id}
              className={`suggestion-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onToggleSuggestion(item)}
              tabIndex={0}
              role="checkbox"
              aria-checked={isSelected}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleSuggestion(item);
                }
              }}
            >
              <div
                className="card-image-placeholder"
                style={{ background: item.imageBg }}
              >
                <div className="card-icon-badge">
                  {getIcon(item.iconName)}
                </div>
                <div className={`selection-indicator ${isSelected ? 'active' : ''}`}>
                  {isSelected ? <Check size={14} /> : <span className="plus-icon">+</span>}
                </div>
                <span className="card-category-tag">{item.category}</span>
              </div>

              <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
                <div className="card-footer">
                  <span className={`select-action-btn ${isSelected ? 'selected' : ''}`}>
                    {isSelected ? 'Selected' : 'Add to Trip'}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
