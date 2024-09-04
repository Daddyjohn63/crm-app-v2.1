'use client';

import { useState, useEffect } from 'react';
import { CopyIcon } from 'lucide-react';

interface CopyToClipboardButtonProps {
  text: string;
  className?: string;
}

export function CopyToClipboardButton({
  text,
  className = ''
}: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!isClient) {
    return null; // or return a placeholder if you prefer
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      <button
        onClick={copyToClipboard}
        className="ml-2 p-1 hover:bg-gray-500 rounded-full transition-colors"
        title="Copy to clipboard"
      >
        <CopyIcon size={16} />
      </button>
      {copied && <span className="ml-2 text-green-500 text-sm">Copied!</span>}
    </div>
  );
}
