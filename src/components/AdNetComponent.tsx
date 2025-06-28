'use client';

import { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { AdNet } from '../lib/adnet';

interface AdNetData {
  ads: { count: number; value: number; title: string };
  value: number;
}

interface AdNetComponentProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  initial: number;
}

export default function AdNetComponent({ label, unit, min, max, initial }: AdNetComponentProps) {
  const [adNetData, setAdNetData] = useState<AdNetData | null>(null);
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const subscription = combineLatest([
      AdNet.stream,
      AdNet.value,
    ]).subscribe(([ads, totalValue]) => {
      setAdNetData({
        ads,
        value: totalValue
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  if (!adNetData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="adnet">
      <h1>AdNet</h1>
      <h2>Num ads placed last: {adNetData.ads.count}</h2>
      <h2>You made: £{adNetData.value}</h2>
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
