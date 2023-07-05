import { NextResponse } from 'next/server';

export function GET(): NextResponse<{ posts: string }> {
  return NextResponse.json({ posts: '/api/posts' });
}
