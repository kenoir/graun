'use client';

import DashComponent from '../components/DashComponent';
import JournalistsComponent from '../components/JournalistsComponent';
import CapiComponent from '../components/CapiComponent';
import FrontendComponent from '../components/FrontendComponent';
import AdNetComponent from '../components/AdNetComponent';

export default function Home() {
  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <DashComponent />
      <hr />
      <JournalistsComponent
        label="Investment"
        unit="Units"
        min={0}
        initial={0}
        max={100}
      />
      <CapiComponent
        label="Investment"
        unit="Units"
        min={0}
        initial={0}
        max={100}
      />
      <FrontendComponent
        label="Investment"
        unit="Units"
        min={0}
        initial={0}
        max={100}
      />
      <AdNetComponent
        label="Investment"
        unit="Units"
        min={0}
        initial={0}
        max={100}
      />
    </main>
  );
}
