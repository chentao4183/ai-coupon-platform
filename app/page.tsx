import { getPlatforms } from '@/lib/kv';
import PlatformCard from '@/components/PlatformCard';

export const revalidate = 60;

export default async function Home() {
  const platforms = await getPlatforms();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Animated Hero Section */}
      <header className="relative overflow-hidden bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Title with gradient text */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-gradient">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-300% animate-gradient-x">
                AI 优惠平台
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-medium">
              一站式 AI 大模型优惠链接
            </p>

            <p className="text-base text-gray-500 mb-8 max-w-2xl mx-auto">
              发现最优质的 AI 产品专属折扣，让您的 AI 之旅更超值
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索你想要的 AI 平台..."
                  className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-lg shadow-lg"
                />
                <svg
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                500+ 用户
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 font-medium text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% 官方授权
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 font-medium text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                每日更新
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {['全部', '国产', '国外', '免费', '付费'].filter((filter) => filter === '全部').map((filter) => (
              <button
                key={filter}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === '全部'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex justify-end">
            <select className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300">
              <option>最热门</option>
              <option>最新</option>
              <option>优惠最大</option>
            </select>
          </div>
        </div>

        {/* Platform Grid */}
        {platforms.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
              <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">暂无优惠信息</h3>
            <p className="text-gray-500">请稍后再来查看，我们正在为您准备更多优惠</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                isHot={index < 3}
                isNew={index === 0}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {['官方授权链接', '真实有效优惠', '免费使用', '持续更新'].map((text) => (
                <div key={text} className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>

            <p className="text-gray-600 mb-4">致力于为您提供最新、最全的 AI 产品优惠信息</p>

            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span>&copy; {new Date().getFullYear()} AI 优惠平台</span>
              <span>|</span>
              <span>仅供学习交流使用</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
