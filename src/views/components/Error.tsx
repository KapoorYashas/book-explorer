import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorProps {
  message: string;
}

export default function Error({ message }: ErrorProps) {
  return (
    <div className="error-container">
      <AlertCircle className="error-icon" />
      <p className="error-message">{message}</p>
    </div>
  );
}
