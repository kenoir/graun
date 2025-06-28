'use client';

import { useState } from 'react';

export default function TestButtons() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', border: '1px solid red' }}>
      <h3>Test Buttons (Count: {count})</h3>
      <button onClick={() => {
        console.log('Test button clicked');
        setCount(c => c + 1);
      }}>
        Test +1
      </button>
      <button onClick={() => {
        console.log('Test button minus clicked');
        setCount(c => c - 1);
      }}>
        Test -1
      </button>
    </div>
  );
}
