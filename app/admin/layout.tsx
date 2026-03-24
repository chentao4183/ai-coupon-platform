import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '管理员后台 - AI 优惠平台',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
