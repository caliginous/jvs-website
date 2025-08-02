'use client';

import { useState, useEffect } from 'react';

interface DynamicInventoryDisplayProps {
  eventId: string;
  initialStockQuantity?: number;
  initialStockStatus?: string;
  initialPurchasable?: boolean;
}

export default function DynamicInventoryDisplay({ 
  eventId, 
  initialStockQuantity, 
  initialStockStatus, 
  initialPurchasable 
}: DynamicInventoryDisplayProps) {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Set the date only on the client side to prevent hydration mismatch
  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  const getInventoryText = () => {
    if (initialStockQuantity !== null && initialStockQuantity !== undefined) {
      if (initialStockQuantity > 0) {
        return `${initialStockQuantity} tickets left`;
      } else {
        return 'Sold out';
      }
    }
    return 'Check availability';
  };

  return (
    <div className="flex items-start">
      <svg className="w-5 h-5 text-primary-400 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
      <div className="flex-1">
        <h3 className="font-semibold text-neutral-900 mb-1">Tickets Left</h3>
        <p className="text-neutral-600">
          {getInventoryText()}
        </p>
        {lastUpdated && (
          <div className="flex items-center mt-2 space-x-2">
            <span className="text-xs text-neutral-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 