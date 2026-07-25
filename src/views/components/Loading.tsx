import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = 'Loading...' }: LoadingProps) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <Loader2 className="loading-spinner" aria-hidden="true" />
      <span className="loading-text">{text}</span>
    </div>
  );
}
