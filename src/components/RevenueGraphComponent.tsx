'use client';

import { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { AdNet } from '../lib/adnet';
import { Days } from '../lib/days';
import { Expenses } from '../lib/expenses';

interface FinancialDataPoint {
  day: number;
  revenue: number;
  expenses: number;
  profit: number;
}

export default function RevenueGraphComponent() {
  const [financialHistory, setFinancialHistory] = useState<FinancialDataPoint[]>([]);

  useEffect(() => {
    const subscription = combineLatest([
      AdNet.dailyRevenue,
      Days.count,
      Expenses.daily$
    ]).subscribe(([dailyRevenue, dayCount, dailyExpenses]) => {
      if (dayCount > 0) {
        setFinancialHistory(prev => {
          // Check if we already have data for this day
          const existingIndex = prev.findIndex(point => point.day === dayCount);
          
          const newDataPoint: FinancialDataPoint = {
            day: dayCount,
            revenue: dailyRevenue,
            expenses: dailyExpenses,
            profit: dailyRevenue - dailyExpenses
          };
          
          if (existingIndex >= 0) {
            // Update existing day's data
            const updated = [...prev];
            updated[existingIndex] = newDataPoint;
            return updated;
          } else {
            // Add new day's data
            const newHistory = [...prev, newDataPoint];
            // Keep only the last 30 days for performance
            return newHistory.slice(-30);
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const maxValue = Math.max(
    ...financialHistory.map(d => Math.max(d.revenue, d.expenses)), 
    100
  );
  const chartWidth = 300; // Base width for calculations
  const chartHeight = 80;

  const getRevenuePath = () => {
    if (financialHistory.length < 2) return '';

    return financialHistory.map((point, index) => {
      const x = (index / (financialHistory.length - 1)) * chartWidth;
      const y = chartHeight - (point.revenue / maxValue) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const getExpensesPath = () => {
    if (financialHistory.length < 2) return '';

    return financialHistory.map((point, index) => {
      const x = (index / (financialHistory.length - 1)) * chartWidth;
      const y = chartHeight - (point.expenses / maxValue) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const formatCurrency = (amount: number) => `£${amount.toFixed(0)}`;

  return (
    <div className="revenue-graph">
      <div className="graph-header">
        <span className="graph-title">Revenue & Costs</span>
        <span className="graph-period">{financialHistory.length} days</span>
      </div>
      
      <div className="graph-container">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="revenue-chart"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Revenue line */}
          {financialHistory.length > 1 && (
            <path
              d={getRevenuePath()}
              fill="none"
              stroke="#28a745"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          
          {/* Expenses line */}
          {financialHistory.length > 1 && (
            <path
              d={getExpensesPath()}
              fill="none"
              stroke="#dc3545"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          
          {/* Revenue data points */}
          {financialHistory.map((point, index) => {
            const x = (index / Math.max(financialHistory.length - 1, 1)) * chartWidth;
            const y = chartHeight - (point.revenue / maxValue) * chartHeight;
            return (
              <circle
                key={`revenue-${point.day}`}
                cx={x}
                cy={y}
                r="2"
                fill="#28a745"
                className="data-point"
              >
                <title>{`Day ${point.day} Revenue: ${formatCurrency(point.revenue)}`}</title>
              </circle>
            );
          })}
          
          {/* Expenses data points */}
          {financialHistory.map((point, index) => {
            const x = (index / Math.max(financialHistory.length - 1, 1)) * chartWidth;
            const y = chartHeight - (point.expenses / maxValue) * chartHeight;
            return (
              <circle
                key={`expenses-${point.day}`}
                cx={x}
                cy={y}
                r="2"
                fill="#dc3545"
                className="data-point"
              >
                <title>{`Day ${point.day} Costs: ${formatCurrency(point.expenses)}`}</title>
              </circle>
            );
          })}
        </svg>
        
        {/* Y-axis labels */}
        <div className="y-axis-labels">
          <span className="y-label top">{formatCurrency(maxValue)}</span>
          <span className="y-label middle">{formatCurrency(maxValue / 2)}</span>
          <span className="y-label bottom">£0</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="graph-legend">
        <span className="legend-item">
          <span className="legend-color" style={{backgroundColor: '#28a745'}}></span>
          Revenue
        </span>
        <span className="legend-item">
          <span className="legend-color" style={{backgroundColor: '#dc3545'}}></span>
          Costs
        </span>
      </div>
      
      {/* X-axis day labels */}
      {financialHistory.length > 1 && (
        <div className="x-axis-labels">
          <span className="x-label">Day {financialHistory[0]?.day}</span>
          <span className="x-label">Day {financialHistory[financialHistory.length - 1]?.day}</span>
        </div>
      )}
      
      {financialHistory.length > 0 && (
        <div className="graph-stats">
          <span className="stat">
            <span className="stat-label">Day {financialHistory[financialHistory.length - 1]?.day} Revenue:</span>
            <span className="stat-value positive">{formatCurrency(financialHistory[financialHistory.length - 1]?.revenue || 0)}</span>
          </span>
          <span className="stat">
            <span className="stat-label">Day {financialHistory[financialHistory.length - 1]?.day} Costs:</span>
            <span className="stat-value negative">{formatCurrency(financialHistory[financialHistory.length - 1]?.expenses || 0)}</span>
          </span>
          <span className="stat">
            <span className="stat-label">Profit:</span>
            <span className={`stat-value ${financialHistory[financialHistory.length - 1]?.profit >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(financialHistory[financialHistory.length - 1]?.profit || 0)}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
