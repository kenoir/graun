'use client';

import DashComponent from '../components/DashComponent';
import DailyNewspaperComponent from '../components/DailyNewspaperComponent';
import JournalistsComponent from '../components/JournalistsComponent';
import CapiComponent from '../components/CapiComponent';
import FrontendComponent from '../components/FrontendComponent';
import AdNetComponent from '../components/AdNetComponent';

export default function Home() {
  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div className="main-layout">
        <div className="newspaper-column">
          <DailyNewspaperComponent />
        </div>
        <div className="controls-column">
          <DashComponent />
          <div className="investment-controls">
            <JournalistsComponent
              label="Investment"
              unit="Units"
              min={0}
              initial={10}
              max={100}
            />
            <CapiComponent
              label="Investment"
              unit="Units"
              min={0}
              initial={8}
              max={100}
            />
            <FrontendComponent
              label="Investment"
              unit="Units"
              min={0}
              initial={12}
              max={100}
            />
            <AdNetComponent
              label="Investment"
              unit="Units"
              min={0}
              initial={15}
              max={100}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
