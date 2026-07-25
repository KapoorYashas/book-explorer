import { AlertCircle } from 'lucide-react';

interface ErrorProps {
  message: string;
}

export default function Error({ message }: ErrorProps) {
  return (
    <div className="error-container" role="alert" aria-live="assertive">
      <AlertCircle className="error-icon" aria-hidden="true" />
      <p className="error-message">{message}</p>
    </div>
  );
}
