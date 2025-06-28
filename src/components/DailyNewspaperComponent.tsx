'use client';

import { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { Days } from '../lib/days';
import { Frontend } from '../lib/frontend';
import { AdNet } from '../lib/adnet';

interface NewspaperData {
  day: { name: string; number: number };
  article: {
    title: string;
    body: string;
    views: number;
    sensationalism: number;
    integrity: number;
  } | null;
  hasArticle: boolean;
  isFallback: boolean;
  ads: Array<{
    company_name: string;
    title: string;
    ad_copy: string;
    rpc: number;
  }>;
}

export default function DailyNewspaperComponent() {
  const [newspaperData, setNewspaperData] = useState<NewspaperData | null>(null);

  // Fallback articles to ensure there's always something to show
  const fallbackArticles = [
    {
      title: "Local Council Meets to Discuss Meeting About Future Meetings",
      body: "In a stunning display of bureaucratic efficiency, the Greater Mundane Council convened today to establish a preliminary committee to consider the formation of a subcommittee that will eventually schedule a meeting to discuss when they might hold a proper meeting about things that need meeting about.",
      views: 150,
      sensationalism: 0.1,
      integrity: 0.8
    },
    {
      title: "Weather Continues to Exist, Scientists Confirm",
      body: "Researchers at the Institute for Obvious Conclusions have released a comprehensive 400-page report confirming that weather is indeed happening. 'We've observed meteorological phenomena occurring in the atmosphere,' stated lead researcher Dr. Bland Obvious. 'Further studies are needed to determine if this trend will continue tomorrow.'",
      views: 89,
      sensationalism: 0.2,
      integrity: 0.9
    },
    {
      title: "Breaking: Something Happens Somewhere",
      body: "Reports are coming in that an event of some description has occurred at a location. Early witnesses describe the happening as 'definitely a thing that happened' and 'probably noteworthy.' Authorities are looking into whether this development requires any sort of response or just a mild acknowledgment.",
      views: 234,
      sensationalism: 0.3,
      integrity: 0.7
    }
  ];

  const getRandomFallbackArticle = () => {
    const index = Math.floor(Math.random() * fallbackArticles.length);
    return fallbackArticles[index];
  };

  useEffect(() => {
    let currentArticle: any = null;
    let currentDay = 0;
    let hasReceivedArticle = false;
    let currentAds: any[] = [];

    // Track the latest published article
    const articleSubscription = Frontend.stream.subscribe((article) => {
      currentArticle = article;
      hasReceivedArticle = true;
      // Update newspaper data immediately when new article is published
      setNewspaperData(prev => prev ? {
        ...prev,
        article: currentArticle,
        hasArticle: true,
        isFallback: false
      } : null);
    });

    // Track ads
    const adsSubscription = AdNet.stream.subscribe((adData) => {
      currentAds = adData.ads;
      // Update ads in newspaper
      setNewspaperData(prev => prev ? {
        ...prev,
        ads: currentAds
      } : null);
    });

    // Track day changes
    const daySubscription = combineLatest([
      Days.stream,
      Days.count
    ]).subscribe(([day, count]) => {
      // Reset article when a new day starts
      if (count !== currentDay && count > 0) {
        currentArticle = null;
        hasReceivedArticle = false;
        currentDay = count;
      }
      
      // Use fallback article if no real article has been published yet
      const articleToShow = currentArticle || (count > 0 ? getRandomFallbackArticle() : null);
      const isUsingFallback = !currentArticle && count > 0;
      
      setNewspaperData({
        day,
        article: articleToShow,
        hasArticle: articleToShow !== null,
        isFallback: isUsingFallback,
        ads: currentAds
      });
    });

    return () => {
      articleSubscription.unsubscribe();
      adsSubscription.unsubscribe();
      daySubscription.unsubscribe();
    };
  }, []);

  if (!newspaperData) {
    return <div>Loading newspaper...</div>;
  }

  return (
    <div className="daily-newspaper">
      <div className="newspaper-header">
        <h2>The Graun</h2>
        <div className="newspaper-date">
          {newspaperData.day.name} Edition • Day {newspaperData.day.number}
        </div>
      </div>
      <div className="newspaper-content">
        {newspaperData.hasArticle && newspaperData.article ? (
          <div className="article">
            {newspaperData.isFallback && (
              <div className="fallback-notice">
                📰 Archive Content - Invest in journalists for fresh news!
              </div>
            )}
            <div className="headline">
              {newspaperData.article.title}
            </div>
            <div className="article-meta">
              <span className="views">👁 {newspaperData.article.views.toLocaleString()} views</span>
              <span className="sensationalism">🔥 {Math.round(newspaperData.article.sensationalism * 100)}% sensational</span>
              <span className="integrity">⭐ {Math.round(newspaperData.article.integrity * 100)}% integrity</span>
            </div>
            <div className="article-body">
              {newspaperData.article.body}
            </div>
            
            {/* Display ads after the article */}
            {newspaperData.ads && newspaperData.ads.length > 0 && (
              <div className="newspaper-ads">
                <div className="ads-header">Advertisements</div>
                <div className="ads-grid">
                  {newspaperData.ads.map((ad, index) => (
                    <div key={index} className="newspaper-ad">
                      <div className="ad-company">{ad.company_name}</div>
                      <div className="ad-title">{ad.title}</div>
                      <div className="ad-copy">{ad.ad_copy}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="no-news">
            No news today...
            <br />
            <small>Invest in journalists to generate stories!</small>
          </div>
        )}
      </div>
    </div>
  );
}
