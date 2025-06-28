'use client';

import { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { Days } from '../lib/days';
import { Expenses } from '../lib/expenses';
import { Accountant } from '../lib/accountant';

interface DashData {
  day: { name: string; number: number };
  count: number;
  totalExpense: number;
  dailyExpense: number;
  profits: number;
}

export default function DashComponent() {
  const [dashData, setDashData] = useState<DashData | null>(null);

  useEffect(() => {
    const subscription = combineLatest([
      Days.stream,
      Days.count,
      Expenses.total$,
      Expenses.daily$,
      Accountant.profitStream,
    ]).subscribe(([day, count, totalExpense, dailyExpense, profits]) => {
      setDashData({
        day,
        count,
        totalExpense,
        dailyExpense,
        profits
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!dashData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dash">
      <h1>{dashData.day.name}</h1>
      <h2>Day: {dashData.count}</h2>
      <h2>You spent today: £{dashData.dailyExpense}</h2>
      <h2>You spent so far: £{dashData.totalExpense}</h2>
      <h2>You are worth (so far): £{dashData.profits}</h2>
    </div>
  );
}
