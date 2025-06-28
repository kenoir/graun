'use client';

import { useEffect, useState } from 'react';
import { Journalists } from '../lib/journalists';
import { Capi } from '../lib/capi';
import { Frontend } from '../lib/frontend';
import { AdNet } from '../lib/adnet';

interface InvestmentLevels {
  journalists: number;
  capi: number;
  frontend: number;
  adnet: number;
}

interface InvestmentRowProps {
  department: keyof InvestmentLevels;
  label: string;
  value: number;
  onUpdate: (department: keyof InvestmentLevels, change: number) => void;
  lastClicked: string | null;
}

const InvestmentRow = ({ 
  department, 
  label, 
  value,
  onUpdate,
  lastClicked
}: InvestmentRowProps) => (
  <tr className="investment-row">
    <td className="row-number">-</td>
    <td className="cell-data metric-name">{label}</td>
    <td className="cell-data investment-controls">
      <button 
        className={`investment-btn minus ${lastClicked === `${department}-minus` ? 'clicked' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onUpdate(department, -5);
        }}
        disabled={value <= 0}
        type="button"
      >
        −
      </button>
      <span className="investment-value">{value}</span>
      <button 
        className={`investment-btn plus ${lastClicked === `${department}-plus` ? 'clicked' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onUpdate(department, 5);
        }}
        disabled={value >= 100}
        type="button"
      >
        +
      </button>
    </td>
    <td className="cell-data">£{(value * 0.5).toFixed(2)}/day</td>
    <td className="cell-data status">
      {value > 50 ? '🔥 High' : value > 20 ? '📊 Medium' : value > 0 ? '⚡ Low' : '❌ None'}
    </td>
  </tr>
);

export default function InvestmentControlsComponent() {
  const [levels, setLevels] = useState<InvestmentLevels>({
    journalists: 10,
    capi: 8,
    frontend: 12,
    adnet: 15
  });

  const [lastClicked, setLastClicked] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the investment levels only
    Journalists.level$.next(levels.journalists);
    Capi.level$.next(levels.capi);
    Frontend.level$.next(levels.frontend);
    AdNet.level$.next(levels.adnet);
  }, []); // Only run on mount

  const updateLevel = (department: keyof InvestmentLevels, change: number) => {
    const currentLevel = levels[department];
    const newLevel = Math.max(0, Math.min(100, currentLevel + change));
    
    // Only update if the value actually changes
    if (newLevel !== currentLevel) {
      // Update React state
      setLevels(prev => ({ ...prev, [department]: newLevel }));
      
      // Immediately update the RxJS stream for instant business logic response
      switch (department) {
        case 'journalists':
          Journalists.level$.next(newLevel);
          break;
        case 'capi':
          Capi.level$.next(newLevel);
          break;
        case 'frontend':
          Frontend.level$.next(newLevel);
          break;
        case 'adnet':
          AdNet.level$.next(newLevel);
          break;
      }
      
      // Add visual feedback
      setLastClicked(`${department}-${change > 0 ? 'plus' : 'minus'}`);
      setTimeout(() => setLastClicked(null), 150);
    }
  };

  return (
    <>
      <tr className="section-header">
        <td className="row-number">8</td>
        <td className="cell-data section-title" colSpan={4}>Investment Controls</td>
      </tr>
      <InvestmentRow 
        department="journalists" 
        label="Journalists" 
        value={levels.journalists}
        onUpdate={updateLevel}
        lastClicked={lastClicked}
      />
      <InvestmentRow 
        department="capi" 
        label="Content API" 
        value={levels.capi}
        onUpdate={updateLevel}
        lastClicked={lastClicked}
      />
      <InvestmentRow 
        department="frontend" 
        label="Frontend" 
        value={levels.frontend}
        onUpdate={updateLevel}
        lastClicked={lastClicked}
      />
      <InvestmentRow 
        department="adnet" 
        label="Ad Network" 
        value={levels.adnet}
        onUpdate={updateLevel}
        lastClicked={lastClicked}
      />
    </>
  );
}
