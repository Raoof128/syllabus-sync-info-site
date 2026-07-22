import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(_request: NextRequest): NextResponse {
  return NextResponse.next();
}
