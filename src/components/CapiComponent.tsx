'use client';

import { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { Capi } from '../lib/capi';

interface CapiData {
  doc: { 
    title: string; 
    body: string;
    sensationalism: number;
    integrity: number;
    idea: any;
  };
  count: number;
}

interface CapiComponentProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  initial: number;
}

export default function CapiComponent({ label, unit, min, max, initial }: CapiComponentProps) {
  const [capiData, setCapiData] = useState<CapiData | null>(null);
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const subscription = combineLatest([
      Capi.stream,
      Capi.count,
    ]).subscribe(([doc, count]) => {
      setCapiData({
        doc,
        count
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    Capi.level$.next(value);
  }, [value]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  if (!capiData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="capi">
      <h1>CAPI</h1>
      <h2>Last Capi Document: {capiData.doc.title}</h2>
      <h2>Capi Written Count: {capiData.count}</h2>
      <div className="content-metrics">
        <span className="metric sensationalism">🔥 {Math.round(capiData.doc.sensationalism * 100)}% sensational</span>
        <span className="metric integrity">⭐ {Math.round(capiData.doc.integrity * 100)}% integrity</span>
      </div>
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
