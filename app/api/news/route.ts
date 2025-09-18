import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { addNews } from '@/lib/news';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user?.isAdmin || session.user?.isLeader)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { title, content, sendToDiscord = false } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: 'Missing title or content' }, { status: 400 });
  }
  try {
    const news = await addNews(title, content, sendToDiscord);
    return NextResponse.json({ success: true, news });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}
