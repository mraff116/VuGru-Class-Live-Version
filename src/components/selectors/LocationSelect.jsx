import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MapPin, Search, X } from 'lucide-react';

const POPULAR_LOCATIONS = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA'
];

function LocationSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = POPULAR_LOCATIONS.filter(location =>
        location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(POPULAR_LOCATIONS);
    }
  }, [searchTerm]);

  const handleSelect = (location) => {
    onChange(location);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    if (!isOpen) setIsOpen(true);
  };

  const handleClear = () => {
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Enter any location..."
          className="w-full bg-[#333]/80 text-white rounded-xl p-4 pl-12 text-lg focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder-gray-500 border border-gray-700/50"
        />
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-2 bg-[#333] border border-gray-700 rounded-xl shadow-xl overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto">
            {suggestions.map((location) => (
              <button
                key={location}
                type="button"
                onClick={() => handleSelect(location)}
                className="w-full px-4 py-3 text-left hover:bg-[#444] transition-colors flex items-center space-x-3 text-white"
              >
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{location}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

LocationSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default LocationSelect;