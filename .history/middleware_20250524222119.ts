// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  authorizedParties: [
    'https://ai-chat-mocha-nine.vercel.app/'// 你的 Vercel 预览/生产域名
    // 你的自定义域名（如有）
  ],
});

// 可选：指定哪些路由需要中间件保护
export const config = {
  matcher: [
    /*
     * 保护所有页面和 API 路由
     * 你也可以只保护部分路由，比如 "/api/(.*)" 或 "/dashboard/(.*)"
     */
    '/((?!_next|static|favicon.ico).*)',
  ],
};