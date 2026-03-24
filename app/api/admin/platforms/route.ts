import { NextRequest, NextResponse } from 'next/server';
import { getAuthStatus } from '@/lib/auth';
import { getAllPlatformsWithStats, savePlatform, deletePlatform } from '@/lib/kv';
import { Platform } from '@/lib/types';

export async function GET() {
  try {
    const platforms = await getAllPlatformsWithStats();
    return NextResponse.json(platforms);
  } catch (error) {
    console.error('Get platforms error:', error);
    return NextResponse.json(
      { error: '获取平台列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await getAuthStatus();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const data = await request.json() as Partial<Platform>;

    if (!data.name || !data.logo || !data.discount || !data.affiliateUrl || !data.description) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    const platform: Platform = {
      id: data.id || `platform_${Date.now()}`,
      name: data.name,
      logo: data.logo,
      discount: data.discount,
      affiliateUrl: data.affiliateUrl,
      description: data.description,
      clicks: data.clicks || 0,
      active: data.active ?? true,
      order: data.order || 1,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await savePlatform(platform);

    return NextResponse.json(platform);
  } catch (error) {
    console.error('Create platform error:', error);
    return NextResponse.json(
      { error: '创建平台失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await getAuthStatus();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const data = await request.json() as Partial<Platform>;

    if (!data.id) {
      return NextResponse.json(
        { error: '缺少平台ID' },
        { status: 400 }
      );
    }

    if (!data.name || !data.logo || !data.discount || !data.affiliateUrl || !data.description) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    const platform: Platform = {
      id: data.id,
      name: data.name,
      logo: data.logo,
      discount: data.discount,
      affiliateUrl: data.affiliateUrl,
      description: data.description,
      clicks: data.clicks || 0,
      active: data.active ?? true,
      order: data.order || 1,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await savePlatform(platform);

    return NextResponse.json(platform);
  } catch (error) {
    console.error('Update platform error:', error);
    return NextResponse.json(
      { error: '更新平台失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await getAuthStatus();

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '缺少平台ID' },
        { status: 400 }
      );
    }

    await deletePlatform(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete platform error:', error);
    return NextResponse.json(
      { error: '删除平台失败' },
      { status: 500 }
    );
  }
}
