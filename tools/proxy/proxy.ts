// proxy.ts - Next.js 16 proxy file (formerly middleware.ts)
// Import the proxy handler from lib
import { proxy as proxyHandler } from '@/lib/proxy';

// Export as 'proxy' (Next.js 16 convention, renamed from 'middleware')
export const proxy = proxyHandler;
