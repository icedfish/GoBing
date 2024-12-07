# GoBing
满足自己根据网络可访问情况，切换 Google 和 Bing 作为浏览器搜索引擎的需求。

## 试用地址
https://gobing.yubing.work/

## 原理简介
* 通过请求 https://www.google.com/generate_204 测试网络连通性，超时 1.0s。
* 如果 Google 可以访问，则使用 Google，不然降级到 Bing。
* 使用 hashtag 传搜索参数，确保 html 可以实现浏览器缓存完整页面，实现加速。

## 如何配置浏览器的默认搜索

通过 hashtag 传参，在需要配置url 的地方填入：
**https://gobing.yubing.work/#%s**


Chrome 桌面版：
打开：chrome://settings/searchEngines
说明：https://support.google.com/chrome/answer/95426?hl=zh-Hans&co=GENIE.Platform%3DDesktop&oco=1

Edge 桌面版：
打开： edge://settings/searchEngines

Safari 桌面版:
很遗憾，不支持添加自定义搜索引擎
如需使用，可以考虑把 https://gobing.yubing.work/ 设为默认 tab

## 初始 Corsur Compose
 见 ./prompts.md

## 意见建议
请提交 issue
