'use client';

import DashComponent from '../components/DashComponent';
import DailyNewspaperComponent from '../components/DailyNewspaperComponent';

export default function Home() {
  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div className="main-layout">
        <div className="newspaper-column">
          <DailyNewspaperComponent />
        </div>
        <div className="controls-column">
          <DashComponent />
        </div>
      </div>
    </main>
  );
}
