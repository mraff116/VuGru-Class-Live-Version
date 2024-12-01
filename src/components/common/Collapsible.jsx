import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'lucide-react';

function Collapsible({ 
  title, 
  preview, 
  children, 
  defaultOpen = false,
  className = '',
  headerClassName = '',
  onChange
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (isOpen && onChange) {
      onChange(true);
    }
  }, [isOpen, onChange]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <div className={className}>
      <div 
        onClick={handleToggle}
        className={`cursor-pointer ${headerClassName}`}
      >
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm text-gray-400">{title}</p>
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
        {preview && <div className="text-white line-clamp-2">{preview}</div>}
      </div>

      {isOpen && (
        <div className="mt-4 space-y-3 border-t border-gray-700 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

Collapsible.propTypes = {
  title: PropTypes.string.isRequired,
  preview: PropTypes.node,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  onChange: PropTypes.func
};

export default Collapsible;