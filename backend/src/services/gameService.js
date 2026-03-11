/**
 * 游戏服务
 * 作者: 喵喵
 */

const { v4: uuidv4 } = require('uuid');
const { createDeck, calculateScore, dealCard } = require('../utils/deck');

// 游戏状态存储
const games = new Map();
const players = new Map();

/**
 * 开始新游戏
 */
function startGame(playerId) {
  const deck = createDeck();
  const gameId = uuidv4();
  
  // 发牌：玩家2张，庄家1张
  const playerCards = [dealCard(deck), dealCard(deck)];
  const dealerCards = [dealCard(deck)];
  
  const playerScore = calculateScore(playerCards);
  
  const game = {
    id: gameId,
    playerId,
    deck,
    playerCards,
    dealerCards,
    playerScore,
    dealerScore: calculateScore(dealerCards),
    status: playerScore === 21 ? 'blackjack' : 'playing',
    createdAt: Date.now()
  };
  
  games.set(gameId, game);
  
  // 初始化玩家（如果不存在）
  if (!players.has(playerId)) {
    players.set(playerId, {
      id: playerId,
      totalScore: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      gamesPlayed: 0
    });
  }
  
  return {
    gameId,
    playerCards,
    dealerCards: dealerCards.map(c => ({ suit: c.suit, rank: '?' })), // 隐藏庄家第二张牌
    playerScore,
    status: game.status
  };
}

/**
 * 玩家要牌
 */
function hit(gameId) {
  const game = games.get(gameId);
  if (!game) {
    throw new Error('游戏不存在');
  }
  
  if (game.status !== 'playing') {
    throw new Error('游戏已结束');
  }
  
  // 玩家要一张牌
  const card = dealCard(game.deck);
  game.playerCards.push(card);
  game.playerScore = calculateScore(game.playerCards);
  
  // 检查是否爆牌
  if (game.playerScore > 21) {
    game.status = 'busted';
    return finalizeGame(gameId);
  }
  
  return {
    playerCards: game.playerCards,
    playerScore: game.playerScore,
    status: game.status
  };
}

/**
 * 玩家停牌
 */
function stand(gameId) {
  const game = games.get(gameId);
  if (!game) {
    throw new Error('游戏不存在');
  }
  
  if (game.status !== 'playing') {
    throw new Error('游戏已结束');
  }
  
  // 庄家开始要牌
  while (game.dealerScore < 17) {
    const card = dealCard(game.deck);
    game.dealerCards.push(card);
    game.dealerScore = calculateScore(game.dealerCards);
  }
  
  // 判断胜负
  if (game.dealerScore > 21) {
    game.status = 'dealer_busted';
  } else if (game.dealerScore > game.playerScore) {
    game.status = 'lost';
  } else if (game.dealerScore < game.playerScore) {
    game.status = 'won';
  } else {
    game.status = 'push';
  }
  
  return finalizeGame(gameId);
}

/**
 * 完成游戏并更新分数
 */
function finalizeGame(gameId) {
  const game = games.get(gameId);
  const player = players.get(game.playerId);
  
  let scoreChange = 0;
  
  switch (game.status) {
    case 'blackjack':
    case 'won':
      player.wins++;
      scoreChange = 10;
      break;
    case 'lost':
    case 'busted':
      player.losses++;
      scoreChange = -5;
      break;
    case 'dealer_busted':
      player.wins++;
      scoreChange = 10;
      break;
    case 'push':
      player.draws++;
      scoreChange = 0;
      break;
  }
  
  player.totalScore += scoreChange;
  player.gamesPlayed++;
  
  return {
    playerCards: game.playerCards,
    dealerCards: game.dealerCards,
    playerScore: game.playerScore,
    dealerScore: game.dealerScore,
    status: game.status,
    scoreChange
  };
}

/**
 * 获取玩家分数
 */
function getPlayerScore(playerId) {
  if (!players.has(playerId)) {
    return {
      playerId,
      totalScore: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      gamesPlayed: 0
    };
  }
  return players.get(playerId);
}

module.exports = {
  startGame,
  hit,
  stand,
  getPlayerScore
};
