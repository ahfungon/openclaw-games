/**
 * 扑克牌工具类
 * 作者: 喵喵
 */

// 花色
const SUITS = ['♠', '♥', '♣', '♦'];
// 点数
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * 创建一副扑克牌
 */
function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return shuffle(deck);
}

/**
 * 洗牌 (Fisher-Yates算法)
 */
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * 计算手牌点数
 */
function calculateScore(cards) {
  let score = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.rank === 'A') {
      aces += 1;
      score += 11;
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      score += 10;
    } else {
      score += parseInt(card.rank);
    }
  }

  // 处理A的点数调整
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
}

/**
 * 发一张牌
 */
function dealCard(deck) {
  return deck.pop();
}

module.exports = {
  createDeck,
  shuffle,
  calculateScore,
  dealCard,
  SUITS,
  RANKS
};
