// 引入 HTML 和 XML 模板文件（已在 wrangler.jsonc 配置为 Text 类型）
import htmlTemplate from './index.html';
import opensearchTemplate from './opensearch.xml';

/**
 * 核心思路：
 * 1. 彻底分离静态资源：HTML 和 XML 现在是独立的文件，享受完整语法高亮。
 * 2. 通过 Wrangler 的 Text rules 机制，将静态文件作为字符串引入。
 * 3. 运行时进行简单的字符串替换（如 {{CACHE_DATE}} 和 {{ICON_DATA_URI}}）。
 * 4. 图标 base64 统一管理，避免在多个文件中重复出现巨大字符串。
 */

// 统一管理图标的 Base64 编码，避免在 HTML/XML 中重复出现
const ICON_DATA_URI = 'data:image/png;base64,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';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 生成当前时间戳，用于前端显示缓存时间
    const cache_date = new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });

    // 1. 根路径：返回搜索页面
    if (url.pathname === '/') {
      // 填充模板中的动态变量（时间戳和图标）
      const html = htmlTemplate
        .replace('{{CACHE_DATE}}', cache_date)
        .replace(/\{\{ICON_DATA_URI\}\}/g, ICON_DATA_URI);
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'public, max-age=2592000, immutable',
          'Expires': new Date(Date.now() + 2592000000).toUTCString()
        }
      });
    }

    // 2. OpenSearch 配置
    if (url.pathname === '/opensearch.xml') {
      // 填充图标变量
      const xml = opensearchTemplate.replace('{{ICON_DATA_URI}}', ICON_DATA_URI);
      
      return new Response(xml, {
        headers: {
          'Content-Type': 'application/opensearchdescription+xml',
        }
      });
    }

    // 3. 其他路径：重定向回项目主页
    return Response.redirect('https://github.com/icedfish/GoBing', 302);
  }
};
