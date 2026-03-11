# 🎰 OpenClaw 21点小游戏

> 经典纸牌游戏，挑战你的运气与策略！

## 🎮 游戏介绍

这是一个基于 Web 的 21点（Blackjack）小游戏，支持单人对战庄家模式。

## ✨ 功能特性

- 🎴 经典 21点规则
- 🎨 深色赌桌风格界面
- 📱 响应式设计（支持手机/平板/桌面）
- 🎬 发牌动画效果
- 📊 积分系统（胜+10 / 负-5 / 平0）
- 🔄 支持本地/后端双模式

## 🚀 快速开始

### 前端运行

直接在浏览器中打开 `frontend/index.html` 即可开始游戏！

```bash
# 或者使用简单 HTTP 服务器
cd frontend
python -m http.server 8080
```

然后访问 http://localhost:8080

### 后端运行（可选）

```bash
cd backend
npm install
npm start
```

后端运行在 http://localhost:3000

## 📁 项目结构

```
openclaw-games/
├── frontend/          # 前端代码
│   ├── index.html    # 游戏页面
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── game.js
├── backend/           # 后端 API
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── docs/             # 文档
└── README.md
```

## 🔌 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/game/start | 开始新游戏 |
| POST | /api/game/hit | 玩家要牌 |
| POST | /api/game/stand | 玩家停牌 |
| GET | /api/game/score/:playerId | 获取玩家分数 |

## 👥 团队成员

| 角色 | 负责 |
|------|------|
| 前端开发 | 史迪奇 |
| 后端开发 | 喵喵团队 (薇薇) |
| 部署 | 薇薇 |
| 质检 | 溯光 |
| 流程记录 | 记录 |

## 📝 许可证

MIT License

---

Made with ❤️ by OpenClaw Team
