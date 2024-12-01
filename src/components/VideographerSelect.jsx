import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Mail, ChevronDown, Search, Star } from 'lucide-react';
import { getVideographers } from '../services/firebase';

function VideographerSelect({ onSelect, selectedId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [videographers, setVideographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function loadVideographers() {
      try {
        setLoading(true);
        setError(null);
        const data = await getVideographers();
        setVideographers(data);
      } catch (err) {
        console.error('Error loading videographers:', err);
        setError('Failed to load videographers');
      } finally {
        setLoading(false);
      }
    }

    loadVideographers();
  }, []);

  const filteredVideographers = videographers.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedVideographer = videographers.find(v => v.id === selectedId);

  if (loading) {
    return (
      <div className="w-full bg-[#333]/80 text-white rounded-xl p-4 text-lg border border-gray-700/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-500 mr-3"></div>
        Loading videographers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-red-500/20 border border-red-500/50 text-red-300 rounded-xl p-4 text-lg flex items-center justify-between">
        <span>{error}</span>
        <button 
          onClick={() => window.location.reload()}
          className="text-red-400 hover:text-red-300 underline text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#333]/80 text-white rounded-xl p-4 text-lg border border-gray-700/50 flex justify-between items-center hover:bg-[#333]/100 transition-colors"
      >
        {selectedVideographer ? (
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-start">
              <span className="font-medium">{selectedVideographer.name}</span>
              <span className="text-sm text-gray-400">{selectedVideographer.email}</span>
            </div>
          </div>
        ) : (
          <span className="text-gray-300">Select a videographer...</span>
        )}
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-[#333] border border-gray-700 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#444] text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {filteredVideographers.length > 0 ? (
              filteredVideographers.map((videographer) => (
                <button
                  key={videographer.id}
                  type="button"
                  onClick={() => {
                    onSelect(videographer.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-4 text-left hover:bg-[#444] transition-colors border-b border-gray-700 last:border-0 ${
                    selectedId === videographer.id ? 'bg-[#444]' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{videographer.name}</h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <Mail className="w-4 h-4 mr-1" />
                        {videographer.email}
                      </div>
                      {videographer.specialties && videographer.specialties.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {videographer.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {videographer.rating && (
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm">{videographer.rating}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                {searchTerm ? 'No videographers found' : 'No registered videographers yet'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

VideographerSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedId: PropTypes.string
};

export default VideographerSelect;