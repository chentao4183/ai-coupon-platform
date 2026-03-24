import { kv } from '@vercel/kv';
import { Platform } from './types';
import { log } from './logger';

const PLATFORMS_KEY = 'platforms';
const CLICK_STATS_KEY = 'click_stats';

export async function getPlatforms(): Promise<Platform[]> {
  try {
    const platforms = await kv.get<Platform[]>(PLATFORMS_KEY);
    if (!platforms) {
      // Return seed data if no platforms exist
      const seedPlatforms = getSeedPlatforms();
      await savePlatforms(seedPlatforms);
      return seedPlatforms;
    }
    return platforms.filter(p => p.active).sort((a, b) => a.order - b.order);
  } catch (error) {
    log('error', 'get_platforms_failed', { error: String(error) });
    return [];
  }
}

export async function getPlatform(id: string): Promise<Platform | null> {
  try {
    const platforms = await kv.get<Platform[]>(PLATFORMS_KEY);
    if (!platforms) {
      return null;
    }
    return platforms.find(p => p.id === id && p.active) || null;
  } catch (error) {
    log('error', 'get_platform_failed', { id, error: String(error) });
    return null;
  }
}

export async function incrementClicks(platformId: string): Promise<number> {
  try {
    const newCount = await kv.hincrby(CLICK_STATS_KEY, platformId, 1);
    log('info', 'click_incremented', { platformId, newCount });
    return newCount;
  } catch (error) {
    log('error', 'increment_clicks_failed', { platformId, error: String(error) });
    return 0;
  }
}

export async function savePlatforms(platforms: Platform[]): Promise<void> {
  try {
    await kv.set(PLATFORMS_KEY, platforms);
    log('info', 'platforms_saved', { count: platforms.length });
  } catch (error) {
    log('error', 'save_platforms_failed', { error: String(error) });
    throw error;
  }
}

export async function getClickStats(platformId: string): Promise<number> {
  try {
    const clicks = await kv.hget<number>(CLICK_STATS_KEY, platformId);
    return clicks || 0;
  } catch (error) {
    log('error', 'get_click_stats_failed', { platformId, error: String(error) });
    return 0;
  }
}

export async function getAllPlatformsWithStats(): Promise<(Platform & { totalClicks: number })[]> {
  try {
    const platforms = await kv.get<Platform[]>(PLATFORMS_KEY);
    if (!platforms) {
      return [];
    }

    const platformsWithStats = await Promise.all(
      platforms.map(async (p) => {
        const totalClicks = await getClickStats(p.id);
        return { ...p, totalClicks };
      })
    );

    return platformsWithStats.sort((a, b) => a.order - b.order);
  } catch (error) {
    log('error', 'get_all_platforms_with_stats_failed', { error: String(error) });
    return [];
  }
}

export async function savePlatform(platform: Platform): Promise<void> {
  try {
    const platforms = await kv.get<Platform[]>(PLATFORMS_KEY) || [];
    const existingIndex = platforms.findIndex(p => p.id === platform.id);

    if (existingIndex >= 0) {
      platforms[existingIndex] = { ...platform, updatedAt: new Date().toISOString() };
    } else {
      platforms.push({ ...platform, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    await kv.set(PLATFORMS_KEY, platforms);
    log('info', 'platform_saved', { platformId: platform.id });
  } catch (error) {
    log('error', 'save_platform_failed', { platformId: platform.id, error: String(error) });
    throw error;
  }
}

export async function deletePlatform(id: string): Promise<void> {
  try {
    const platforms = await kv.get<Platform[]>(PLATFORMS_KEY) || [];
    const filtered = platforms.filter(p => p.id !== id);
    await kv.set(PLATFORMS_KEY, filtered);
    log('info', 'platform_deleted', { platformId: id });
  } catch (error) {
    log('error', 'delete_platform_failed', { platformId: id, error: String(error) });
    throw error;
  }
}

function getSeedPlatforms(): Platform[] {
  const now = new Date().toISOString();
  return [
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
      createdAt: now,
      updatedAt: now,
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
      createdAt: now,
      updatedAt: now,
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
      createdAt: now,
      updatedAt: now,
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
      createdAt: now,
      updatedAt: now,
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
      createdAt: now,
      updatedAt: now,
    },
  ];
}
