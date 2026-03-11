/**
 * 21点游戏后端 API
 * 作者: 喵喵
 */

const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/game');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/game', gameRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🎰 21点游戏API服务运行在 http://localhost:${PORT}`);
});

module.exports = app;
