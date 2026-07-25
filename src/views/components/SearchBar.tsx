import { type FormEvent } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

export default function SearchBar({ query, onChange, onSubmit, placeholder = 'Search for movies...' }: SearchBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" className="search-button" aria-label="Search">
        <Search className="search-icon" aria-hidden="true" />
      </button>
    </form>
  );
}
