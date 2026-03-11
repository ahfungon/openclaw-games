/**
 * 游戏路由
 * 作者: 喵喵
 */

const express = require('express');
const router = express.Router();
const gameService = require('../services/gameService');

// 开始新游戏
router.post('/start', (req, res) => {
  try {
    const { playerId = 'player1' } = req.body;
    const result = gameService.startGame(playerId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.json({ success: false, error: { code: 'START_ERROR', message: error.message } });
  }
});

// 玩家要牌
router.post('/hit', (req, res) => {
  try {
    const { gameId } = req.body;
    const result = gameService.hit(gameId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.json({ success: false, error: { code: 'HIT_ERROR', message: error.message } });
  }
});

// 玩家停牌
router.post('/stand', (req, res) => {
  try {
    const { gameId } = req.body;
    const result = gameService.stand(gameId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.json({ success: false, error: { code: 'STAND_ERROR', message: error.message } });
  }
});

// 获取玩家分数
router.get('/score/:playerId', (req, res) => {
  try {
    const { playerId } = req.params;
    const result = gameService.getPlayerScore(playerId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.json({ success: false, error: { code: 'SCORE_ERROR', message: error.message } });
  }
});

module.exports = router;
