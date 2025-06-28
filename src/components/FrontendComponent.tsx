'use client';

import { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { Frontend } from '../lib/frontend';

interface FrontendData {
  content: { title: string; views: number };
  count: number;
  views: number;
}

interface FrontendComponentProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  initial: number;
}

export default function FrontendComponent({ label, unit, min, max, initial }: FrontendComponentProps) {
  const [frontendData, setFrontendData] = useState<FrontendData | null>(null);
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const subscription = combineLatest([
      Frontend.stream,
      Frontend.count,
      Frontend.views,
    ]).subscribe(([content, count, views]) => {
      setFrontendData({
        content,
        count,
        views
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  if (!frontendData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="frontend">
      <h1>graun.com</h1>
      <h2>Last Published Content: {frontendData.content.title}</h2>
      <h2>Published Content Count: {frontendData.count}</h2>
      <h2>Pageviews: {frontendData.views}</h2>
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
