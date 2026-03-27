import { Platform } from './types';

// 本地开发用的种子数据
const SEED_PLATFORMS: Platform[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    logo: '/logos/chatgpt.svg',
    discount: 'Plus会员8折',
    affiliateUrl: 'https://chat.openai.com/referral',
    description: 'OpenAI开发的智能对话助手，支持代码生成、文案写作、问答等多种任务',
    clicks: 0,
    active: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'claude',
    name: 'Claude',
    logo: '/logos/claude.svg',
    discount: 'Pro会员免费试用',
    affiliateUrl: 'https://claude.ai/referral',
    description: 'Anthropic开发的AI助手，擅长长文本理解和安全对话',
    clicks: 0,
    active: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wenxin',
    name: '文心一言',
    logo: '/logos/wenxin.svg',
    discount: '企业版7折',
    affiliateUrl: 'https://yiyan.baidu.com/referral',
    description: '百度推出的大语言模型，中文理解能力强，适合国内用户',
    clicks: 0,
    active: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'gemini',
    name: 'Gemini',
    logo: '/logos/gemini.svg',
    discount: 'Advanced版首月免费',
    affiliateUrl: 'https://gemini.google.com/referral',
    description: 'Google最新多模态AI模型，支持图像、视频理解',
    clicks: 0,
    active: true,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    logo: '/logos/copilot.svg',
    discount: '个人版9折',
    affiliateUrl: 'https://github.com/features/copilot/referral',
    description: 'GitHub AI编程助手，支持多种编程语言智能补全',
    clicks: 0,
    active: true,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 本地开发：直接返回种子数据
export async function getPlatforms(): Promise<Platform[]> {
  return SEED_PLATFORMS.filter(p => p.active).sort((a, b) => a.order - b.order);
}

export async function getPlatform(id: string): Promise<Platform | null> {
  return SEED_PLATFORMS.find(p => p.id === id && p.active) || null;
}

export async function incrementClicks(platformId: string): Promise<number> {
  // 本地开发：模拟点击计数
  const platform = SEED_PLATFORMS.find(p => p.id === platformId);
  if (platform) {
    platform.clicks += 1;
  }
  return platform?.clicks || 0;
}

export async function savePlatforms(platforms: Platform[]): Promise<void> {
  // 本地开发：不保存
  console.log('本地开发模式：跳过保存平台数据');
}

export async function getClickStats(platformId: string): Promise<number> {
  // 本地开发：返回模拟数据
  const platform = SEED_PLATFORMS.find(p => p.id === platformId);
  return platform?.clicks || 0;
}

export async function getAllPlatformsWithStats(): Promise<(Platform & { totalClicks: number })[]> {
  // 本地开发：返回种子数据 + 点击数
  return SEED_PLATFORMS.map(p => ({
    ...p,
    totalClicks: Math.floor(Math.random() * 1000), // 模拟点击数
  })).sort((a, b) => a.order - b.order);
}

export async function savePlatform(platform: Platform): Promise<void> {
  // 本地开发：不保存
  console.log('本地开发模式：跳过保存平台', platform.id);
}

export async function deletePlatform(id: string): Promise<void> {
  // 本地开发：不删除
  console.log('本地开发模式：跳过删除平台', id);
}
