/**
 * 21点游戏 - 前端逻辑
 */

const API_URL = 'http://localhost:3000/api/game';

// 游戏状态
let currentGameId = null;
let isLocalMode = false;

// DOM元素
const dealerCardsEl = document.getElementById('dealer-cards');
const playerCardsEl = document.getElementById('player-cards');
const dealerScoreEl = document.getElementById('dealer-score');
const playerScoreEl = document.getElementById('player-score');
const resultEl = document.getElementById('result');
const btnHit = document.getElementById('btn-hit');
const btnStand = document.getElementById('btn-stand');
const btnNew = document.getElementById('btn-new');
const totalScoreEl = document.getElementById('total-score');
const winsEl = document.getElementById('wins');
const lossesEl = document.getElementById('losses');
const drawsEl = document.getElementById('draws');

// 初始化
document.getElementById('btn-new').addEventListener('click', startNewGame);
document.getElementById('btn-hit').addEventListener('click', hit);
document.getElementById('btn-stand').addEventListener('click', stand);

// 开始新游戏
async function startNewGame() {
  resultEl.textContent = '';
  dealerCardsEl.innerHTML = '';
  playerCardsEl.innerHTML = '';
  dealerScoreEl.textContent = '-';
  playerScoreEl.textContent = '-';
  
  try {
    const response = await fetch(`${API_URL}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: 'player1' })
    });
    const data = await response.json();
    
    if (data.success) {
      currentGameId = data.data.gameId;
      renderCards(data.data.playerCards, playerCardsEl);
      renderCards(data.data.dealerCards, dealerCardsEl);
      playerScoreEl.textContent = data.data.playerScore;
      
      if (data.data.status === 'blackjack') {
        showResult('🎉 Blackjack!');
      }
      
      updateButtons(true);
    }
  } catch (e) {
    // 后端未启动，使用本地模式
    console.log('后端未启动，使用本地模式');
    startLocalGame();
  }
}

// 玩家要牌
async function hit() {
  if (!currentGameId) return;
  
  try {
    const response = await fetch(`${API_URL}/hit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: currentGameId })
    });
    const data = await response.json();
    
    if (data.success) {
      renderCards(data.data.playerCards, playerCardsEl);
      playerScoreEl.textContent = data.data.playerScore;
      
      if (data.data.status === 'busted') {
        showResult('💥 爆牌了!');
        updateButtons(false);
      }
    }
  } catch (e) {
    localHit();
  }
}

// 玩家停牌
async function stand() {
  if (!currentGameId) return;
  
  try {
    const response = await fetch(`${API_URL}/stand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: currentGameId })
    });
    const data = await response.json();
    
    if (data.success) {
      renderCards(data.data.dealerCards, dealerCardsEl);
      dealerScoreEl.textContent = data.data.dealerScore;
      showResultByStatus(data.data.status, data.data.scoreChange);
      updateButtons(false);
      updateStats(data.data.scoreChange);
    }
  } catch (e) {
    localStand();
  }
}

// 渲染扑克牌
function renderCards(cards, container) {
  cards.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${['♥', '♦'].includes(card.suit) ? 'red' : 'black'}`;
    cardEl.textContent = `${card.suit}${card.rank}`;
    cardEl.style.animationDelay = `${index * 0.1}s`;
    container.appendChild(cardEl);
  });
}

// 根据状态显示结果
function showResultByStatus(status, scoreChange) {
  const messages = {
    'won': '🎉 你赢了!',
    'lost': '😢 庄家赢了',
    'dealer_busted': '🎉 庄家爆牌，你赢了!',
    'busted': '💥 你爆牌了!',
    'push': '🤝 平局!'
  };
  
  const message = messages[status] || status;
  resultEl.textContent = `${message} (${scoreChange > 0 ? '+' : ''}${scoreChange}分)`;
}

function showResult(message) {
  resultEl.textContent = message;
  updateButtons(false);
}

function updateButtons(playing) {
  btnHit.disabled = !playing;
  btnStand.disabled = !playing;
}

function updateStats(change) {
  const current = parseInt(totalScoreEl.textContent) || 0;
  totalScoreEl.textContent = current + change;
}

// ===== 本地模式 (后端未启动时使用) =====
let localDeck = [];
let localPlayerCards = [];
let localDealerCards = [];
let localPlayerScore = 0;
let localDealerScore = 0;

const SUITS = ['♠', '♥', '♣', '♦'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createLocalDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  // 洗牌
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function calcLocalScore(cards) {
  let score = 0, aces = 0;
  for (const c of cards) {
    if (c.rank === 'A') { aces++; score += 11; }
    else if (['K','Q','J'].includes(c.rank)) score += 10;
    else score += parseInt(c.rank);
  }
  while (score > 21 && aces > 0) { score -= 10; aces--; }
  return score;
}

function startLocalGame() {
  localDeck = createLocalDeck();
  localPlayerCards = [localDeck.pop(), localDeck.pop()];
  localDealerCards = [localDeck.pop()];
  localPlayerScore = calcLocalScore(localPlayerCards);
  localDealerScore = calcLocalScore(localDealerCards);
  
  renderCards(localPlayerCards, playerCardsEl);
  renderCards([{suit:'?', rank:'?'}], dealerCardsEl);
  playerScoreEl.textContent = localPlayerScore;
  dealerScoreEl.textContent = '?';
  
  if (localPlayerScore === 21) {
    showResult('🎉 Blackjack!');
    updateButtons(false);
  } else {
    updateButtons(true);
  }
}

function localHit() {
  localPlayerCards.push(localDeck.pop());
  localPlayerScore = calcLocalScore(localPlayerCards);
  renderCards(localPlayerCards, playerCardsEl);
  playerScoreEl.textContent = localPlayerScore;
  
  if (localPlayerScore > 21) {
    showResult('💥 爆牌了!');
    updateButtons(false);
    updateStats(-5);
  }
}

function localStand() {
  while (localDealerScore < 17) {
    localDealerCards.push(localDeck.pop());
    localDealerScore = calcLocalScore(localDealerCards);
  }
  renderCards(localDealerCards, dealerCardsEl);
  dealerScoreEl.textContent = localDealerScore;
  
  let status, change;
  if (localDealerScore > 21) {
    status = 'dealer_busted';
    change = 10;
  } else if (localDealerScore > localPlayerScore) {
    status = 'lost';
    change = -5;
  } else if (localDealerScore < localPlayerScore) {
    status = 'won';
    change = 10;
  } else {
    status = 'push';
    change = 0;
  }
  
  showResultByStatus(status, change);
  updateStats(change);
  updateButtons(false);
}

// 页面加载时检查后端
fetch(API_URL.replace('/api/game', '/health'))
  .then(() => { console.log('后端已连接'); isLocalMode = false; })
  .catch(() => { console.log('使用本地模式'); isLocalMode = true; });
