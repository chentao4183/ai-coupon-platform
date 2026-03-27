'use client';

import { useState } from 'react';
import { Platform } from '@/lib/types';

interface PlatformCardProps {
  platform: Platform;
  isHot?: boolean;
  isNew?: boolean;
}

export default function PlatformCard({ platform, isHot = false, isNew = false }: PlatformCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformId: platform.id }),
      });
      window.open(platform.affiliateUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to track click:', error);
      window.open(platform.affiliateUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-blue-400/50 hover:-translate-y-2">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Hot/New Badge */}
      {(isHot || isNew) && (
        <div className={`absolute -top-0 -right-0 px-4 py-1 text-xs font-bold text-white ${isHot ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gradient-to-r from-green-400 to-teal-500'} shadow-lg z-10`}>
          {isHot ? '🔥 HOT' : '✨ NEW'}
        </div>
      )}

      <div className="relative p-6">
        {/* Header with logo */}
        <div className="flex items-center gap-4 mb-4">
          {/* Logo with glowing ring */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse" />
            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/50">
              {platform.logo ? (
                <img
                  src={platform.logo}
                  alt={platform.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                platform.name.charAt(0)
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
              {platform.name}
            </h3>

            {/* Discount badge with pulsing animation */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md animate-pulse">
              {platform.discount}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
          {platform.description}
        </p>

        {/* Features placeholder */}
        <ul className="space-y-2 mb-4">
          <li className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            官方授权链接
          </li>
          <li className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            真实有效优惠
          </li>
        </ul>

        {/* Click count with fire icon */}
        <div className="flex items-center text-xs text-gray-400 mb-4">
          <span className="mr-1">🔥</span>
          <span className="font-semibold text-orange-500">{platform.clicks.toLocaleString()}</span>
          <span className="ml-1">次领取</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/50 active:scale-95 flex items-center justify-center gap-2 group/btn"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>处理中...</span>
              </>
            ) : (
              <>
                <span>立即领取</span>
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>

          <button className="p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group/share">
            <svg className="w-5 h-5 text-gray-400 group-hover/share:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
