'use client';

import { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { AdNet } from '../lib/adnet';

interface AdNetData {
  ads: { 
    count: number; 
    value: number; 
    ads: Array<{
      company_name: string;
      title: string;
      ad_copy: string;
      rpc: number;
    }>;
  };
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

  useEffect(() => {
    AdNet.level$.next(value);
  }, [value]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  if (!adNetData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="adnet">
      <h1>AdNet</h1>
      <h2>Ads placed: {adNetData.ads.count}</h2>
      <h2>Total revenue: £{adNetData.value.toFixed(2)}</h2>
      
      <div className="current-ads">
        <h3>Current Advertisers:</h3>
        {adNetData.ads.ads.length > 0 ? (
          <div className="ads-list">
            {adNetData.ads.ads.map((ad, index) => (
              <div key={index} className="ad-item">
                <div className="ad-company">{ad.company_name}</div>
                <div className="ad-title">{ad.title}</div>
                <div className="ad-rpc">RPC: £{ad.rpc.toFixed(2)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-ads">No ads currently placed</div>
        )}
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
