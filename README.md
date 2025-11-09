# Chat Box UI

一个美观的聊天界面前端项目，使用 React + TypeScript + Webpack 构建，支持 GraphQL API 集成。

## 功能特性

- 💬 现代化的聊天界面设计
- 🎨 美观的渐变背景和动画效果
- ⚡ 实时消息发送和接收
- 🔄 GraphQL API 集成
- 📱 响应式设计
- ⏳ 加载状态和打字指示器
- 🎯 自动滚动到底部

## 技术栈

- React 18
- TypeScript
- Webpack 5
- CSS3 (渐变、动画)

## 安装

```bash
npm install
```

## 开发

```bash
npm start
```

项目将在 `http://localhost:3000` 启动。

## 构建

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

## 配置

在 `src/ChatBox.tsx` 中配置 API 地址：

```typescript
// 本地测试
const API_URL = 'http://localhost:8787/graphql';

// 生产环境
// const API_URL = 'https://api.jipengcode-learn.work/graphql';
```

## 部署

本项目支持部署到 Cloudflare Pages。

### Cloudflare Pages 部署步骤

1. 在 Cloudflare Dashboard 中创建新的 Pages 项目
2. 连接到 GitHub 仓库 `zuojipeng/chat-box-ui`
3. 构建配置：
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`
   - Node.js 版本：18 或更高

## 许可证

ISC

