import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = 'Loading...' }: LoadingProps) {
  return (
    <div className="loading-container">
      <Loader2 className="loading-spinner" />
      <span className="loading-text">{text}</span>
    </div>
  );
}
