用 Cloudflare Worker 代码满足以下需求：

1. 实现一个网站，名为 “GoBing”， 预期用 cloudflare worker 部署。 用于满足根据网络可访问情况，切换不同的搜索引擎的需求。

2. 所有其他url，都 302 跳转到项目说明文档： https://github.com/icedfish/GoBing

3. 页面模仿 google 极简风格，用尽量少的 CSS 代码，不依赖任何外部 js 和 css 等资源。
页面展示就 4 个元素 ：
  醒目的网站名称，(GoBing六个字母，模仿 ./google-logo.png 上六个字母的配色)
  页面正中间也是一个搜索框，
  下方两个按钮，分别写 Google 和 Bing，用于手动选择搜索引擎。
  底部添加 help 链接，跳转到项目说明文档

  两个搜索引擎都传参方式如下，%s 就是用户搜索都关键词。
   * Google https://www.google.com/search?q=%s
   * Bing https://www.bing.com/search?q=%s

4. 检查 URL 的哈希部分（#）是否传入参数 #xxxx 作为搜索关键词，如果有，填入搜索框输入框，且动态根据网络可访问情况实现自动跳转，如果没有传入，不自动执行检查和跳转。

  自动跳转逻辑：
    * 请求 Google 的连通性检测地址 ： https://www.google.com/generate_204
    * 不要用插入 image load 的方式，用原声的 fetch 方法 检测连通性
    * 请求超时时间半秒, 超时使用 AbortSignal API。
    * 如果加载成功 (onload 事件触发)，则跳转到Google，
    * 如果加载失败 (onerror 事件触发)，则跳转到Bing。
    * 使用时间戳 (new Date().getTime()) 确保每次请求图片都是新请求，避免缓存影响。

5. 页面设置 1 个月的过期时间，确保浏览器再次打开时速度最快，提供一个文档，说明如何在 cloudflare worker 中设置。

6. 适配 手机 和 PC 浏览器的布局展示。

