import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Filter } from 'lucide-react';

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
}

const TagFilter: React.FC<TagFilterProps> = ({ selectedTags, onTagsChange, availableTags }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTags.includes(tag)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Small delay to ensure the dropdown is rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  const handleTagSelect = (tag: string) => {
    onTagsChange([...selectedTags, tag]);
    setSearchTerm('');
    // Keep dropdown open for multiple selections
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleTagRemove = (tagToRemove: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const clearAllTags = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTagsChange([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredTags.length > 0) {
      e.preventDefault();
      handleTagSelect(filteredTags[0]);
    }
  };

  return (
    <div className="relative" ref={containerRef} style={{ zIndex: 9999 }}>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Filter size={16} />
            Filter by Tags
          </label>
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={clearAllTags}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div
          className="w-full min-h-[48px] px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent relative"
          onClick={handleToggleDropdown}
          style={{ zIndex: 9998 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2 flex-1">
              {selectedTags.length === 0 ? (
                <span className="text-gray-400">Select tags to filter...</span>
              ) : (
                selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 text-sm rounded border border-blue-500/30"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={(e) => handleTagRemove(tag, e)}
                      className="hover:text-blue-200 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))
              )}
            </div>
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          {/* Full screen backdrop to ensure dropdown appears above everything */}
          <div 
            className="fixed inset-0 bg-transparent"
            style={{ zIndex: 9997 }}
          />
          
          <div 
            ref={dropdownRef}
            className="absolute w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-80 overflow-hidden"
            style={{
              zIndex: 10000,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.5)'
            }}
            onMouseDown={(e) => e.preventDefault()} // Prevent blur on dropdown interaction
          >
            <div className="p-3 border-b border-gray-700 bg-gray-800">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto bg-gray-800">
              {filteredTags.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  {searchTerm ? 'No tags found' : 'All tags selected'}
                </div>
              ) : (
                <div className="p-2">
                  {filteredTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagSelect(tag)}
                      onMouseDown={(e) => e.preventDefault()} // Prevent blur
                      className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-700 rounded transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TagFilter;