'use client';

import { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { Journalists } from '../lib/journalists';

interface JournalistsData {
  idea: { appeal: number; integrity: number };
  integrity: number;
}

interface JournalistsComponentProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  initial: number;
}

export default function JournalistsComponent({ label, unit, min, max, initial }: JournalistsComponentProps) {
  const [journalistsData, setJournalistsData] = useState<JournalistsData | null>(null);
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const subscription = combineLatest([
      Journalists.ideaStream,
      Journalists.integrity,
    ]).subscribe(([idea, integrity]) => {
      setJournalistsData({
        idea,
        integrity
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    Journalists.level$.next(value);
  }, [value]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  if (!journalistsData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="journalists">
      <h1>Journalists</h1>
      <h2>Integrity: {Math.floor(journalistsData.integrity)}</h2>
      <span className="label">{label} {value}{unit}</span>
      <input
        className="slider"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleSliderChange}
      />
    </div>
  );
}
