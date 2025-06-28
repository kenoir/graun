'use client';

import { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { Days } from '../lib/days';
import { Expenses } from '../lib/expenses';
import { Accountant } from '../lib/accountant';
import { AdNet } from '../lib/adnet';
import { Frontend } from '../lib/frontend';
import { Journalists } from '../lib/journalists';
import InvestmentControlsComponent from './InvestmentControlsComponent';

interface DashData {
  dayProgress: number;
  totalExpense: number;
  dailyExpense: number;
  dailyRevenue: number;
  totalRevenue: number;
  profits: number;
  articleCount: number;
  totalViews: number;
  journalistIntegrity: number;
}

export default function DashComponent() {
  const [dashData, setDashData] = useState<DashData | null>(null);

  const formatCurrency = (amount: number) => {
    return `£${amount.toFixed(2)}`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  useEffect(() => {
    const subscription = combineLatest([
      Days.progress,
      Expenses.total$,
      Expenses.daily$,
      AdNet.dailyRevenue,
      AdNet.value,
      Accountant.profitStream,
      Frontend.count,
      Frontend.views,
      Journalists.integrity,
    ]).subscribe(([dayProgress, totalExpense, dailyExpense, dailyRevenue, totalRevenue, profits, articleCount, totalViews, journalistIntegrity]) => {
      setDashData({
        dayProgress,
        totalExpense,
        dailyExpense,
        dailyRevenue,
        totalRevenue,
        profits,
        articleCount,
        totalViews,
        journalistIntegrity
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!dashData) {
    return <div>Loading dashboard...</div>;
  }    return (
    <div className="groogle-sheets">
      <div className="groogle-header">
        <div className="groogle-title">
          <div className="groogle-logo">
            <div className="groogle-icon">📊</div>
            <span>Groogle Sheets</span>
          </div>
          <div className="sheet-name">The Graun Business Metrics</div>
        </div>
        <div className="bank-balance">
          <div className="balance-label">Bank Balance</div>
          <div className="balance-amount">{formatCurrency(dashData.profits)}</div>
          <div className="balance-status">
            {dashData.profits > 100 ? '💰 Profitable' : '📊 Building'}
          </div>
        </div>
      </div>
      
      <div className="groogle-toolbar">
        <div className="toolbar-section">
          <div className="day-progress-container">
            <span className="progress-label">Day Progress</span>
            <div className="day-progress-bar">
              <div 
                className="day-progress-fill" 
                style={{ width: `${dashData.dayProgress * 100}%` }}
              ></div>
            </div>
            <span className="day-progress-text">{Math.round(dashData.dayProgress * 100)}%</span>
          </div>
        </div>
      </div>
      
      <div className="groogle-spreadsheet">
        <div className="sheet-headers">
          <div className="row-header"></div>
          <div className="col-header">A</div>
          <div className="col-header">B</div>
          <div className="col-header">C</div>
          <div className="col-header">D</div>
        </div>
        
        <table className="groogle-table">
          <thead>
            <tr>
              <th className="row-number">1</th>
              <th className="cell-header">Metric</th>
              <th className="cell-header">Today</th>
              <th className="cell-header">Total</th>
              <th className="cell-header">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="revenue-row">
              <td className="row-number">2</td>
              <td className="cell-data metric-name">Revenue</td>
              <td className="cell-data positive">{formatCurrency(dashData.dailyRevenue)}</td>
              <td className="cell-data positive">{formatCurrency(dashData.totalRevenue)}</td>
              <td className="cell-data status">
                {dashData.dailyRevenue > 0 ? '✓ Earning' : '⚠ No revenue'}
              </td>
            </tr>
            <tr className="expense-row">
              <td className="row-number">3</td>
              <td className="cell-data metric-name">Expenses</td>
              <td className="cell-data negative">{formatCurrency(dashData.dailyExpense)}</td>
              <td className="cell-data negative">{formatCurrency(dashData.totalExpense)}</td>
              <td className="cell-data status">
                {dashData.dailyExpense > 0 ? '💰 Investing' : '⚠ No investment'}
              </td>
            </tr>
            <tr className="profit-row">
              <td className="row-number">4</td>
              <td className="cell-data metric-name">Net Worth</td>
              <td className={`cell-data ${dashData.dailyRevenue - dashData.dailyExpense >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(dashData.dailyRevenue - dashData.dailyExpense)}
              </td>
              <td className={`cell-data ${dashData.profits >= 100 ? 'positive' : 'negative'}`}>
                {formatCurrency(dashData.profits)}
              </td>
              <td className="cell-data status">
                {dashData.profits > 100 ? '📈 Profitable' : '📉 Break-even'}
              </td>
            </tr>
            <tr className="articles-row">
              <td className="row-number">5</td>
              <td className="cell-data metric-name">Articles Published</td>
              <td className="cell-data">{formatNumber(dashData.articleCount)}</td>
              <td className="cell-data">{formatNumber(dashData.articleCount)}</td>
              <td className="cell-data status">
                {dashData.articleCount > 0 ? '📰 Publishing' : '📝 No content'}
              </td>
            </tr>
            <tr className="views-row">
              <td className="row-number">6</td>
              <td className="cell-data metric-name">Page Views</td>
              <td className="cell-data">-</td>
              <td className="cell-data">{formatNumber(dashData.totalViews)}</td>
              <td className="cell-data status">
                {dashData.totalViews > 1000 ? '🔥 Viral' : dashData.totalViews > 100 ? '👁 Popular' : '👻 Quiet'}
              </td>
            </tr>
            <tr className="integrity-row">
              <td className="row-number">7</td>
              <td className="cell-data metric-name">Journalist Integrity</td>
              <td className="cell-data">{Math.floor(dashData.journalistIntegrity)}</td>
              <td className="cell-data">-</td>
              <td className="cell-data status">
                {dashData.journalistIntegrity > 50 ? '⭐ High quality' : '⚠ Questionable'}
              </td>
            </tr>
            <InvestmentControlsComponent />
          </tbody>
        </table>
      </div>
    </div>
  );
}
