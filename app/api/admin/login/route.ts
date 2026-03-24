import { NextRequest, NextResponse } from 'next/server';
import { createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const password = formData.get('password') as string;

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || adminPassword.length < 16) {
      return NextResponse.json(
        { error: '服务器配置错误' },
        { status: 500 }
      );
    }

    if (!password || password.length < 16) {
      return NextResponse.json(
        { error: '密码格式不正确' },
        { status: 400 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }

    const token = await createSession();
    await setSessionCookie(token);

    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
}
