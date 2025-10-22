# Nova Explorer Bot

This is a Next.js application for the Nova Explorer Bot project.

## 技术栈

### 核心框架

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**

### UI 与样式

- **Ant Design** - UI 组件库
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画库

### 状态管理与数据

- **Zustand** - 轻量化状态管理
- **SWR** - 数据获取和缓存

### TON 区块链集成

- **@ton/ton** - TON 核心库
- **@ton/crypto** - 加密功能库
- **@tonconnect/sdk** - TON Connect SDK
- **@tonconnect/ui-react** - TON Connect React UI
- **@ton-api/client** - TON API 客户端

### 开发工具

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Jest** - 测试框架
- **Testing Library** - React 组件测试

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 环境配置

复制环境变量文件并配置：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，填入必要的配置：

```env
# TON API 配置
NEXT_PUBLIC_TON_API_KEY=your_ton_api_key_here

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Nova Explorer Bot

# 网络配置
NEXT_PUBLIC_NETWORK=mainnet
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm run lint:fix` - 自动修复 ESLint 问题
- `npm run format` - 格式化代码
- `npm run format:check` - 检查代码格式
- `npm run test` - 运行测试
- `npm run test:watch` - 监视模式运行测试
- `npm run test:coverage` - 生成测试覆盖率报告

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── __tests__/         # 组件测试
│   └── WalletConnect.tsx  # 钱包连接组件
├── lib/                   # 工具库
│   ├── ton-config.ts      # TON 配置
│   └── ton-client.ts      # TON 客户端
└── stores/                # 状态管理
    └── useWalletStore.ts  # 钱包状态
```

## 功能特性

- 🔗 **钱包连接** - 支持 TON Connect 协议连接各种 TON 钱包
- 💰 **余额查询** - 实时查看钱包余额
- 🌐 **多网络支持** - 支持主网和测试网
- 📱 **响应式设计** - 适配各种设备尺寸
- 🎨 **现代化 UI** - 基于 Ant Design 的美观界面
- ⚡ **高性能** - 使用 Next.js 和 SWR 优化性能
- 🧪 **完整测试** - 包含单元测试和集成测试

## 开发指南

### 添加新组件

1. 在 `src/components/` 目录下创建组件文件
2. 创建对应的测试文件在 `__tests__` 目录下
3. 使用 TypeScript 和 Ant Design 组件

### 状态管理

使用 Zustand 进行状态管理，状态文件位于 `src/stores/` 目录。

### 样式规范

- 优先使用 Tailwind CSS 类名
- 复杂样式使用 CSS 模块或 styled-components
- 保持 Ant Design 组件主题一致性

### 测试规范

- 每个组件都应该有对应的测试文件
- 使用 Testing Library 进行组件测试
- 保持测试覆盖率在 80% 以上

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 其他平台

项目支持部署到任何支持 Next.js 的平台，如 Netlify、Railway 等。

## 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
