import { useState, useEffect, useRef } from "react";

const C = {
  cyan: "#2EECD2", bg: "#171821", cardBg: "#1E1F2C",
  green: "#2EECD2", red: "#FF4D6A", orange: "#FF9F0A",
  gold: "#F0C959", purple: "#8B6CFF", pink: "#FF4DA6",
  t1: "#FFFFFF", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", t4: "rgba(255,255,255,0.18)",
  pill: "rgba(255,255,255,0.08)",
};
const mono = "'JetBrains Mono', monospace";

// ============================================================
// 24小时完整 Feed 数据 — 从最新到最旧
// ============================================================
const ALL_ITEMS = [

  // ────── 23:15 聪明钱 ──────
  { id: "sm-3", type: "smart_money", time: "2026-03-16T23:15:00",
    wallet: "0xd8dA...6045", walletLabel: "vitalik.eth", walletTag: "以太坊创始人",
    action: "大额转入", token: "ETH", amount: "3,000 ETH", tokenPrice: "$3,241",
    conclusion: "vitalik.eth 转入 3,000 ETH 至新合约，疑似新项目部署。",
    urgency: "突发", strength: "强",
  },

  // ────── 22:40 精选内容 ──────
  { id: "ed-5", type: "editorial", time: "2026-03-16T22:40:00",
    tag: "深度", typeName: "市场分析",
    title: "复盘 | 今日 BTC 冲高回落背后的三股力量",
    summary: "从链上数据、衍生品持仓、宏观事件三个维度拆解今日行情",
    coverEmoji: "🔍", gradStart: "#1a1a2e", gradEnd: "#16213e",
  },

  // ────── 22:10 合约信号 ──────
  { id: "ct-3", type: "contract", time: "2026-03-16T22:10:00",
    token: "BTC", price: "$87,432", direction: "做多", leverage: "5x",
    entry: "$86,800 - $87,200", target: "$89,500", stop: "$85,500",
    conclusion: "BTC 放量突破布林上轨，轻仓做多博反弹。",
    confidence: "中", riskLevel: "中",
    urgency: "常规", strength: "中",
  },

  // ────── 21:30 现货信号（多Token）──────
  { id: "sig-5", type: "signal", time: "2026-03-16T21:30:00", signalType: "spot",
    tokens: [
      { token: "RNDR", price: "$10.87", change: "+22.4%", up: true },
      { token: "ARKM", price: "$2.14", change: "+18.1%", up: true },
      { token: "TAO", price: "$412", change: "+15.6%", up: true },
    ],
    conclusion: "AI+渲染板块集体拉升，Vision Pro 新品发布利好驱动，板块均涨 +18%。",
    confidence: "中高",
    urgency: "突发", strength: "强",
  },

  // ────── 20:50 赚币中心 ──────
  { id: "prod-earn-3", type: "product", time: "2026-03-16T20:50:00",
    pushType: "赚币中心", title: "ETH 质押加速计划",
    subtitle: "总奖金 300,000 USDT · 质押 ETH 享额外加速奖励，质押越多奖励越大",
    cta: "立即质押", deadline: "2026-03-23T00:00:00",
    startTime: "03/16 20:00",
    icon: "⚡", highlight: "300K USDT", hlColor: C.cyan,
    gradStart: "#1E3A5F", gradEnd: "#0F2744",
  },

  // ────── 20:00 预测市场（多选项）──────
  { id: "pred-3", type: "prediction", time: "2026-03-16T20:00:00",
    question: "2026 NCAA 锦标赛冠军会是谁？",
    multiOption: true,
    options: [
      { label: "🏀 Duke", pct: 28, color: "#1E40AF" },
      { label: "🏀 UConn", pct: 22, color: "#1D4ED8" },
      { label: "🏀 Houston", pct: 19, color: "#DC2626" },
      { label: "🏀 Auburn", pct: 15, color: "#EA580C" },
      { label: "🏀 其他", pct: 16, color: "rgba(255,255,255,0.25)" },
    ],
    volume: "$890K", deadline: "2026-04-07T00:00:00", participants: "8.7K",
  },

  // ────── 19:20 精选内容（置顶）──────
  { id: "ed-4", type: "editorial", time: "2026-03-16T19:20:00",
    tag: "专题", typeName: "行业动态",
    title: "专题 | 美以伊朗冲突，热点追踪",
    summary: "了解实时热点与市场追踪事件与黄金、原油、BTC 行情",
    coverEmoji: "🔥", gradStart: "#FF4500", gradEnd: "#FF8C00",
    pinned: true,
  },

  // ────── 18:30 现货信号 ──────
  { id: "sig-4", type: "signal", time: "2026-03-16T18:30:00", signalType: "spot",
    token: "ONDO", price: "$1.24", change: "+18.7%", up: true,
    conclusion: "ONDO 突破 $1.15 阻力位，大户净买入 $8.2M，看涨 $1.45。",
    confidence: "高",
    urgency: "常规", strength: "强",
  },

  // ────── 17:45 聪明钱（多Token）──────
  { id: "sm-2", type: "smart_money", time: "2026-03-16T17:45:00",
    wallet: "0x3b8c...a1e9", walletLabel: "Wintermute", walletTag: "做市商",
    action: "大额买入",
    tokens: [
      { token: "PENDLE", tokenPrice: "$6.87", amount: "$5.8M" },
      { token: "AAVE", tokenPrice: "$142.5", amount: "$3.2M" },
    ],
    conclusion: "Wintermute 1小时内连续买入 PENDLE + AAVE 共 $9M，DeFi 蓝筹集中建仓。",
    urgency: "常规", strength: "中强",
  },

  // ────── 17:00 合约信号 ──────
  { id: "ct-2", type: "contract", time: "2026-03-16T17:00:00",
    token: "SOL", price: "$187.42", direction: "做空", leverage: "5x",
    entry: "$188 - $192", target: "$172", stop: "$198",
    conclusion: "SOL 遇 $190 强阻力，RSI 超买，轻仓做空。",
    confidence: "中", riskLevel: "高",
    urgency: "常规", strength: "中",
  },

  // ────── 16:20 开斋节绿包 ──────
  { id: "prod-eid", type: "product", time: "2026-03-16T16:20:00",
    pushType: "节日活动", title: "🌙 开斋节绿包 · Eid Mubarak",
    subtitle: "发绿包赢奖励 · 总奖池 200,000 USDT · 邀请好友拆包额外加成",
    cta: "发绿包", deadline: "2026-04-02T00:00:00",
    startTime: "03/29 00:00",
    icon: "🧧", highlight: "200K USDT", hlColor: "#22C55E",
    gradStart: "#064E3B", gradEnd: "#059669",
  },

  // ────── 15:40 预测市场（二元）──────
  { id: "pred-1", type: "prediction", time: "2026-03-16T15:40:00",
    question: "BTC 本周能否突破 $90,000？",
    longPct: 67, shortPct: 33, volume: "$2.4M",
    deadline: "2026-03-21T00:00:00", participants: "12.4K",
  },

  // ────── 15:00 行情联动理财（震荡）──────
  { id: "fin-1", type: "finance_reco", time: "2026-03-16T15:00:00",
    marketCondition: "震荡",
    hook: "BTC 连续3天在 $86K-$88K 区间横盘，波动率降至30日最低",
    recommendation: "横盘行情下，稳定币理财是更聪明的选择。让闲置资产持续产生收益，等待下一波行情。",
    products: [
      { name: "USDT Plus", apy: "5.2%", type: "灵活", minAmount: "无门槛", tag: "热门" },
      { name: "USDC Plus", apy: "4.8%", type: "灵活", minAmount: "无门槛", tag: null },
      { name: "USDT 30天锁仓", apy: "8.5%", type: "定期", minAmount: "$100", tag: "高收益" },
    ],
    gradStart: "#1E3A5F", gradEnd: "#0F2744",
  },

  // ────── 14:20 FOMO星期四 ──────
  { id: "prod-fomo", type: "product", time: "2026-03-16T14:20:00",
    pushType: "赚币中心", title: "🔥 FOMO 星期四",
    subtitle: "总奖金 500,000 USDT · 每周四限定锁仓专场，先到先得",
    cta: "立即参与", deadline: "2026-03-20T20:00:00",
    startTime: "03/20 10:00",
    icon: "🔥", highlight: "500K USDT", hlColor: C.orange,
    gradStart: "#B91C1C", gradEnd: "#F97316",
  },

  // ────── 13:50 IDOS 赚币 ──────
  { id: "prod-idos", type: "product", time: "2026-03-16T13:50:00",
    pushType: "赚币中心", title: "IDOS 奖池瓜分",
    subtitle: "总奖金 1,000,000 IDOS · 质押即可参与瓜分",
    cta: "去质押", deadline: "2026-03-25T00:00:00",
    startTime: "03/16 14:00",
    icon: "💎", highlight: "1M IDOS", hlColor: C.purple,
    gradStart: "#4C1D95", gradEnd: "#7C3AED",
  },

  // ────── 13:05 现货信号 ──────
  { id: "sig-3", type: "signal", time: "2026-03-16T13:05:00", signalType: "spot",
    token: "FET", price: "$2.31", change: "+14.2%", up: true,
    conclusion: "FET 交易量放大3.2倍，MACD金叉，关注 $2.15 入场。",
    confidence: "中高",
    urgency: "常规", strength: "中强",
  },

  // ────── 12:30 银行卡 ──────
  { id: "prod-card", type: "product", time: "2026-03-16T12:30:00",
    pushType: "银行卡", title: "开通 Bitget Card · 全球消费",
    subtitle: "支持 USDT/USDC 直接消费，0手续费充值，全球万事达网络覆盖",
    cta: "立即开卡", deadline: null,
    icon: "💳", highlight: "0 手续费", hlColor: C.cyan,
    gradStart: "#0F766E", gradEnd: "#14B8A6",
  },

  // ────── 11:45 聪明钱 ──────
  { id: "sm-1", type: "smart_money", time: "2026-03-16T11:45:00",
    wallet: "0x7a25...f3d2", walletLabel: "Smart Money #42", walletTag: "胜率 78%",
    action: "买入", token: "ARB", amount: "$2.4M", tokenPrice: "$1.82",
    conclusion: "胜率78%地址在支撑位买入 ARB $2.4M，历史类似操作 +23%。",
    urgency: "常规", strength: "中强",
  },

  // ────── 10:20 合约信号 ──────
  { id: "ct-1", type: "contract", time: "2026-03-16T10:20:00",
    token: "ETH", price: "$3,241", direction: "做多", leverage: "10x",
    entry: "$3,180 - $3,240", target: "$3,480", stop: "$3,050",
    conclusion: "ETH 突破布林中轨，多空比 1.8:1 偏多，目标 $3,480。",
    confidence: "中高", riskLevel: "中",
    urgency: "常规", strength: "中强",
  },

  // ────── 09:30 行情联动理财（上涨）──────
  { id: "fin-2", type: "finance_reco", time: "2026-03-16T09:30:00",
    marketCondition: "上涨",
    hook: "SOL 24h 涨幅 +18.7%，链上质押量创历史新高",
    recommendation: "持有不如质押，边拿收益边享增值。当前 SOL 质押需求旺盛，APY 处于高位。",
    products: [
      { name: "SOL 灵活质押", apy: "7.8%", type: "灵活", minAmount: "0.1 SOL", tag: "热门" },
      { name: "SOL 30天锁仓", apy: "12.5%", type: "定期", minAmount: "1 SOL", tag: "高收益" },
      { name: "ETH 质押", apy: "4.2%", type: "灵活", minAmount: "0.01 ETH", tag: null },
    ],
    gradStart: "#064E3B", gradEnd: "#022C22",
  },

  // ────── 09:00 现货信号 ──────
  { id: "sig-2", type: "signal", time: "2026-03-16T09:00:00", signalType: "spot",
    token: "TIA", price: "$11.42", change: "+9.8%", up: true,
    conclusion: "Celestia 本周4个新 Rollup 上线，TIA 质押率62%，供需健康。",
    confidence: "中",
    urgency: "常规", strength: "中",
  },

  // ────── 08:00 AI 24h 复盘（每日固定）──────
  { id: "ai-daily", type: "daily_summary", time: "2026-03-16T08:00:00",
    aiSummary: "过去24h，AI信号共推荐7个Token，其中5个录得正收益。RNDR 表现最佳（+22.4%），AI+渲染赛道持续强势。合约信号2胜1负。聪明钱跟踪3笔大额操作，平均收益 +15.6%。整体胜率 71%，综合收益率 +12.8%。",
    tokens: [
      { name: "RNDR", price: "$10.87", change: "+22.4%", up: true },
      { name: "ONDO", price: "$1.24", change: "+18.7%", up: true },
      { name: "FET", price: "$2.31", change: "+14.2%", up: true },
      { name: "TIA", price: "$11.42", change: "+9.8%", up: true },
      { name: "SOL", price: "$187.42", change: "-2.1%", up: false },
    ],
  },

  // ────── 06:30 精选内容（晨报）──────
  { id: "ed-2", type: "editorial", time: "2026-03-16T06:30:00",
    tag: "晨报", typeName: "每日必读",
    title: "Bitget 晨报 | 3月16日你需要知道的5件事",
    summary: "SEC新动向、Solana DEX创纪录、BTC期权到期、Restaking TVL突破...",
    coverEmoji: "☀️", gradStart: "#78350F", gradEnd: "#D97706",
  },

  // ────── 03:20 现货信号（夜间）──────
  { id: "sig-1", type: "signal", time: "2026-03-16T03:20:00", signalType: "spot",
    token: "AAVE", price: "$142.50", change: "+8.3%", up: true,
    conclusion: "Aave V4 测试网上线，TVL 重回 $12B，DeFi 资金流入。",
    confidence: "中",
    urgency: "突发", strength: "中强",
  },

  // ────── 00:30 合约信号（夜间）──────
  { id: "ct-0", type: "contract", time: "2026-03-16T00:30:00",
    token: "ETH", price: "$2,980", direction: "做多", leverage: "20x",
    entry: "$2,960 - $2,990", target: "$3,250", stop: "$2,880",
    conclusion: "ETH 期权大量 $3,200 Call 买入，ETF 消息前做多胜率高。",
    confidence: "高", riskLevel: "高",
    urgency: "突发", strength: "强",
  },
];

// ============================================================
// UTILS
// ============================================================
const MOCK_NOW = new Date("2026-03-16T23:28:00").getTime();
function relativeTime(iso) {
  const itemTime = new Date(iso).getTime();
  // For new live items (timestamps near real now), use real diff
  const realNow = Date.now();
  const useMock = Math.abs(itemTime - realNow) > 864e5; // if item is >1 day from real now, use mock
  const diff = useMock ? (MOCK_NOW - itemTime) : (realNow - itemTime);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "刚刚";
  if (m < 60) return `${m}分钟前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}小时前`;
  return `${Math.floor(h / 24)}天前`;
}
function clockTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
function useCountdown(d) {
  const [t, setT] = useState("");
  useEffect(() => {
    if (!d) return;
    const tick = () => {
      const diff = new Date(d) - new Date();
      if (diff <= 0) { setT("已截止"); return; }
      const dd = Math.floor(diff / 864e5), h = Math.floor((diff % 864e5) / 36e5),
        m = Math.floor((diff % 36e5) / 6e4), s = Math.floor((diff % 6e4) / 1e3);
      setT(dd > 0 ? `${dd}天${h}时${m}分` : `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [d]);
  return t;
}
const Dot = ({ color = C.red, s = 6 }) => (
  <span style={{ position: "relative", display: "inline-block", width: s, height: s }}>
    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, animation: "pulse 1.5s ease-in-out infinite" }} />
  </span>
);

// ============================================================
// CARD COMPONENTS
// ============================================================

const TimeStamp = ({ iso, isNew }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 20px", marginBottom: 6 }}>
    <div style={{
      width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
      background: isNew ? C.cyan : "rgba(255,255,255,0.12)",
      boxShadow: isNew ? `0 0 8px ${C.cyan}60` : "none",
    }} />
    <span style={{ fontSize: 11, fontFamily: mono, fontWeight: 600, color: isNew ? C.cyan : C.t4 }}>
      {isNew ? "刚刚" : `${clockTime(iso)} · ${relativeTime(iso)}`}
    </span>
    {isNew && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: `${C.cyan}20`, color: C.cyan }}>NEW</span>}
  </div>
);

// 信号标签组件: 突发/常规 + 信号强弱
const STRENGTH_CONFIG = {
  "强":   { label: "信号强", color: C.green, bars: 3 },
  "中强": { label: "信号中强", color: C.orange, bars: 2 },
  "中":   { label: "信号中", color: C.t3, bars: 2 },
  "弱":   { label: "信号弱", color: C.red, bars: 1 },
};

const SignalTags = ({ urgency, strength }) => {
  if (!urgency && !strength) return null;
  const str = STRENGTH_CONFIG[strength] || STRENGTH_CONFIG["中"];
  return (
    <>
      {urgency === "突发" && (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 6,
          background: `${C.red}20`, color: C.red,
          animation: "urgencyFlash 2s ease-in-out infinite",
        }}>
          <Dot color={C.red} s={5} /> 突发
        </span>
      )}
      {strength && (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
          background: `${str.color}12`, color: str.color,
        }}>
          {/* 信号强度条 */}
          <span style={{ display: "inline-flex", alignItems: "flex-end", gap: 1, height: 10 }}>
            {[1, 2, 3].map(i => (
              <span key={i} style={{
                width: 3, borderRadius: 1,
                height: i === 1 ? 4 : i === 2 ? 7 : 10,
                background: i <= str.bars ? str.color : "rgba(255,255,255,0.1)",
              }} />
            ))}
          </span>
          {str.label}
        </span>
      )}
    </>
  );
};

// ① AI 24h复盘
// ════════════════════════════════════════
// 样式A: AI 24h复盘 — 彩虹顶条 + 数据表格
// ════════════════════════════════════════
const DailySummaryCard = ({ item }) => (
  <div style={{ margin: "0 16px 4px", borderRadius: 20, overflow: "hidden", background: C.cardBg, position: "relative", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.cyan}, ${C.purple}, ${C.cyan})` }} />
    <div style={{ padding: "16px 16px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#000", background: C.cyan, padding: "3px 10px", borderRadius: 8 }}>🤖 AI信号 · 24h复盘</span>
        <span style={{ fontSize: 10, color: C.t4 }}>每日 08:00</span>
      </div>
      <div style={{ padding: "10px 12px", borderRadius: 12, marginBottom: 12, background: `${C.cyan}08`, borderLeft: `3px solid ${C.cyan}45`, fontSize: 13, color: C.t2, lineHeight: 1.7 }}>
        <span style={{ color: C.cyan, fontWeight: 700 }}>AI: </span>{item.aiSummary}
      </div>
      {item.tokens.map((tk, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: 10, marginBottom: 2, background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: 7, fontFamily: mono, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", background: tk.up ? `${C.green}15` : `${C.red}15`, color: tk.up ? C.green : C.red }}>{i + 1}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: C.t1 }}>{tk.name}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, color: C.t3, fontFamily: mono }}>{tk.price}</span>
            <span style={{ fontSize: 13, fontWeight: 800, fontFamily: mono, color: tk.up ? C.green : C.red, padding: "3px 10px", borderRadius: 8, background: tk.up ? `${C.green}10` : `${C.red}10`, minWidth: 60, textAlign: "right" }}>{tk.change}</span>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
        <div style={{ padding: "9px 22px", borderRadius: 12, background: C.cyan, color: "#000", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>去交易 →</div>
      </div>
    </div>
  </div>
);

// ════════════════════════════════════════
// 样式B: AI交易信号 — 紧凑数据卡 + 左色条 + 网格纹理背景
// 适用: 现货 / 合约 / 聪明钱
// 视觉特征: 深色背景带微弱网格线, monospace数据, 左侧粗色条
// ════════════════════════════════════════
const tradingCardBg = C.cardBg;

const SignalCard = ({ item }) => {
  const tokens = item.tokens || [{ token: item.token, price: item.price, change: item.change, up: item.up }];
  const isMulti = tokens.length > 1;
  return (
    <div style={{ margin: "0 16px 4px", borderRadius: 16, overflow: "hidden", background: tradingCardBg, boxShadow: "0 2px 16px rgba(0,0,0,0.25)" }}>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#000", background: C.cyan, padding: "2px 8px", borderRadius: 4 }}>🤖 现货</span>
          <SignalTags urgency={item.urgency} strength={item.strength} />
          {isMulti && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${C.purple}15`, color: C.purple }}>{tokens.length} 个标的</span>}
        </div>
        {/* Token列表 */}
        {tokens.map((tk, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMulti ? "7px 10px" : "0 0 8px", marginBottom: isMulti ? 2 : 0, borderRadius: 8, background: isMulti ? (i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent") : "transparent" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: isMulti ? 15 : 18, fontWeight: 900, color: C.t1, fontFamily: mono }}>{tk.token}</span>
              <span style={{ fontSize: 13, color: C.t3, fontFamily: mono }}>{tk.price}</span>
            </div>
            <span style={{ fontSize: isMulti ? 13 : 15, fontWeight: 900, fontFamily: mono, color: tk.up ? C.green : C.red, padding: "4px 12px", borderRadius: 8, background: tk.up ? `${C.green}12` : `${C.red}12` }}>{tk.change}</span>
          </div>
        ))}
        <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.5, marginBottom: 10, marginTop: 8, padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,0.02)", borderLeft: `2px solid ${C.cyan}30` }}>
          {item.conclusion}
        </div>
        <div style={{ padding: "9px 0", borderRadius: 10, textAlign: "center", background: (item.up !== undefined ? item.up : tokens[0].up) ? C.green : C.red, color: "#000", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>立即交易 →</div>
      </div>
    </div>
  );
};

const ContractCard = ({ item }) => {
  const isLong = item.direction === "做多"; const dc = isLong ? C.green : C.red;
  return (
    <div style={{ margin: "0 16px 4px", borderRadius: 16, overflow: "hidden", background: tradingCardBg, boxShadow: "0 2px 16px rgba(0,0,0,0.25)" }}>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#000", background: C.cyan, padding: "2px 8px", borderRadius: 4 }}>🤖 合约</span>
          <SignalTags urgency={item.urgency} strength={item.strength} />
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${dc}18`, color: dc }}>{item.direction} {item.leverage}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: C.t1, fontFamily: mono }}>{item.token}</span>
          <span style={{ fontSize: 13, color: C.t3, fontFamily: mono }}>{item.price}</span>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
          {[{ l: "入场", v: item.entry, c: C.t2 }, { l: "止盈", v: item.target, c: C.green }, { l: "止损", v: item.stop, c: C.red }].map((p, i) => (
            <div key={i} style={{ flex: 1, padding: "6px 4px", borderRadius: 8, background: "rgba(255,255,255,0.025)", textAlign: "center" }}>
              <div style={{ fontSize: 9, color: C.t4, marginBottom: 2 }}>{p.l}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: p.c, fontFamily: mono }}>{p.v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.5, marginBottom: 10, padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,0.02)", borderLeft: `2px solid ${C.cyan}30` }}>
          {item.conclusion}
        </div>
        <div style={{ padding: "9px 0", borderRadius: 10, textAlign: "center", background: dc, color: "#000", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>{item.direction} {item.token} →</div>
      </div>
    </div>
  );
};

const SmartMoneyCard = ({ item }) => {
  const isBuy = item.action.includes("买") || item.action.includes("转入"); const ac = isBuy ? C.green : C.red;
  const tokens = item.tokens || [{ token: item.token, tokenPrice: item.tokenPrice, amount: item.amount }];
  const isMulti = tokens.length > 1;
  return (
    <div style={{ margin: "0 16px 4px", borderRadius: 16, overflow: "hidden", background: tradingCardBg, boxShadow: "0 2px 16px rgba(0,0,0,0.25)" }}>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#000", background: C.cyan, padding: "2px 8px", borderRadius: 4 }}>🤖 聪明钱</span>
          <SignalTags urgency={item.urgency} strength={item.strength} />
          {isMulti && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${C.purple}15`, color: C.purple }}>{tokens.length} 个标的</span>}
        </div>
        {/* 钱包信息行 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 10, background: "rgba(255,255,255,0.025)", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🐋</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.t1 }}>{item.walletLabel}</div>
              <div style={{ fontSize: 9, color: C.t4, fontFamily: mono }}>{item.wallet}</div>
            </div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${C.gold}15`, color: C.gold }}>{item.walletTag}</span>
        </div>
        {/* Token列表 */}
        {tokens.map((tk, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: isMulti ? "6px 10px" : "0 0 8px", marginBottom: isMulti ? 2 : 0, borderRadius: 8, background: isMulti ? (i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent") : "transparent", fontFamily: mono }}>
            <span style={{ fontSize: isMulti ? 14 : 15, fontWeight: 900, color: C.t1 }}>{tk.token}</span>
            <span style={{ fontSize: 12, color: C.t3 }}>{tk.tokenPrice}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: C.gold, marginLeft: "auto" }}>{tk.amount}</span>
          </div>
        ))}
        <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.5, marginBottom: 10, marginTop: 8, padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,0.02)", borderLeft: `2px solid ${C.cyan}30` }}>
          {item.conclusion}
        </div>
        <div style={{ padding: "9px 0", borderRadius: 10, textAlign: "center", background: C.gold, color: "#000", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>跟单交易 →</div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════
// 样式C: AI预测 — 紫色主题圆角卡 + 投票条
// 视觉特征: 紫色顶部渐变, 大字问题, 彩色投票条
// ════════════════════════════════════════
const PredictionCard = ({ item }) => {
  const cd = useCountdown(item.deadline); const isMulti = item.multiOption;
  return (
    <div style={{ margin: "0 16px 4px", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
      {/* 紫色渐变头部 */}
      <div style={{ padding: "14px 16px 12px", background: `linear-gradient(135deg, ${C.purple}18, ${C.purple}08)`, borderBottom: `1px solid ${C.purple}15` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: C.purple, color: "#fff" }}>🔮 AI预测</span>
          {cd && <span style={{ fontSize: 10, color: C.orange, fontFamily: mono }}>⏳ {cd}</span>}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.t1, lineHeight: 1.45 }}>{item.question}</div>
      </div>
      {/* 投票区 */}
      <div style={{ padding: "12px 16px 14px", background: C.cardBg }}>
        {isMulti ? (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", height: 10, borderRadius: 99, overflow: "hidden", gap: 2, marginBottom: 12 }}>
              {item.options.map((o, i) => (<div key={i} style={{ width: `${o.pct}%`, background: o.color, borderRadius: 99 }} />))}
            </div>
            {item.options.map((o, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: 10, marginBottom: 4, background: i === 0 ? "rgba(255,255,255,0.03)" : "transparent", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 4, height: 24, borderRadius: 2, background: o.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: i === 0 ? 800 : 600, color: i === 0 ? C.t1 : C.t2 }}>{o.label}</span>
                  {i === 0 && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: `${C.green}15`, color: C.green }}>热门</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 60, height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}><div style={{ height: "100%", width: `${o.pct}%`, background: o.color, borderRadius: 99 }} /></div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.t1, fontFamily: mono, minWidth: 32, textAlign: "right" }}>{o.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", height: 38, borderRadius: 12, overflow: "hidden", gap: 3, marginBottom: 12 }}>
            <div style={{ width: `${item.longPct}%`, background: `linear-gradient(135deg, ${C.green}cc, ${C.green})`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12 }}><span style={{ fontSize: 13, fontWeight: 800, color: "#000" }}>看多 {item.longPct}%</span></div>
            <div style={{ flex: 1, background: `linear-gradient(135deg, ${C.red}, ${C.red}cc)`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12 }}><span style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>看空 {item.shortPct}%</span></div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.t3 }}>交易量 {item.volume}</span>
          <div style={{ padding: "8px 18px", borderRadius: 12, background: C.purple, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>参与预测 →</div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════
// 样式D: 理财推荐 — 上下分割卡（渐变头部 + 产品列表）
// 视觉特征: 顶部行情渐变背景 + 底部白底产品表格
// ════════════════════════════════════════
const FinanceRecoCard = ({ item }) => {
  const cc = item.marketCondition === "震荡" ? C.orange : item.marketCondition === "上涨" ? C.green : C.red;
  const ce = item.marketCondition === "震荡" ? "〰️" : item.marketCondition === "上涨" ? "📈" : "📉";
  return (
    <div style={{ margin: "0 16px 4px", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
      <div style={{ position: "relative", padding: "16px 16px 14px", background: `linear-gradient(150deg, ${item.gradStart}, ${item.gradEnd})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#000", background: C.cyan, padding: "2px 8px", borderRadius: 6 }}>💰 理财推荐</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: `${cc}25`, color: cc }}>{ce} 行情: {item.marketCondition}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.t1, lineHeight: 1.4, marginBottom: 6 }}>{item.hook}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>{item.recommendation}</div>
      </div>
      <div style={{ background: C.cardBg, padding: "10px 12px 12px" }}>
        {item.products.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 10px", borderRadius: 12, marginBottom: 4, background: i === 0 ? "rgba(255,255,255,0.03)" : "transparent", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: i === 0 ? `${C.green}12` : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? C.green : C.t3, fontFamily: mono }}>{p.name.slice(0, 2)}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{p.name}</span>{p.tag && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: p.tag === "高收益" ? `${C.orange}15` : `${C.green}15`, color: p.tag === "高收益" ? C.orange : C.green }}>{p.tag}</span>}</div>
                <div style={{ fontSize: 10, color: C.t4, marginTop: 2 }}>{p.type} · 最低 {p.minAmount}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 17, fontWeight: 900, color: C.green, fontFamily: mono }}>{p.apy}</div><div style={{ fontSize: 9, color: C.t4 }}>APY</div></div>
          </div>
        ))}
        <div style={{ marginTop: 6, padding: "9px 0", borderRadius: 12, textAlign: "center", background: C.cyan, color: "#000", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>查看全部理财产品 →</div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════
// 样式E: 精选内容 — 全高沉浸式封面（杂志风）
// 视觉特征: 240px大图封面, 标题叠加, 白色CTA按钮
// ════════════════════════════════════════
const EditorialCard = ({ item }) => (
  <div style={{ margin: "0 16px 4px", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
    <div style={{ height: 240, position: "relative", background: `linear-gradient(150deg, ${item.gradStart}, ${item.gradEnd})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 72, opacity: 0.12, filter: "blur(2px)" }}>{item.coverEmoji}</span>
      <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 6 }}>
        {item._pinTag && <span style={{ fontSize: 11, fontWeight: 800, color: C.cyan, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: 8 }}>📌 置顶</span>}
        <span style={{ fontSize: 12, fontWeight: 800, color: "#fff", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", padding: "4px 12px", borderRadius: 8 }}>{item.tag} | {item.typeName}</span>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: `linear-gradient(to top, ${C.cardBg}ff 0%, ${C.cardBg}cc 40%, transparent 100%)` }} />
      <div style={{ position: "absolute", bottom: 52, left: 18, right: 18, fontSize: 19, fontWeight: 900, color: "#fff", lineHeight: 1.35 }}>{item.title}</div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, flex: 1 }}>{item.summary}</div>
        <div style={{ padding: "8px 16px", borderRadius: 10, flexShrink: 0, background: "#fff", color: "#000", fontSize: 13, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>立即查看</div>
      </div>
    </div>
  </div>
);

// ════════════════════════════════════════
// 样式F: 产品推送 — 横向Banner（左图标区 + 右内容）
// 视觉特征: 140px矮卡, 左侧彩色图标面板, 右侧内容, 区别于精选内容的全高封面
// ════════════════════════════════════════
const ProductCard = ({ item }) => (
  <div style={{ margin: "0 16px 4px", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
    {/* 上：配置图片区域（占位） */}
    <div style={{
      height: 160, position: "relative",
      background: `linear-gradient(150deg, ${item.gradStart}, ${item.gradEnd})`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {item._pinTag && <div style={{ position: "absolute", top: 12, left: 12, zIndex: 1 }}><span style={{ fontSize: 11, fontWeight: 800, color: C.cyan, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: 8 }}>📌 置顶</span></div>}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.25 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <span style={{ fontSize: 11, color: "#fff" }}>运营配图</span>
      </div>
    </div>
    {/* 下：文案区域 */}
    <div style={{ background: C.cardBg, padding: "14px 16px" }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.t1, lineHeight: 1.4, marginBottom: 6 }}>{item.title}</div>
      <div style={{ fontSize: 13, color: C.t3, lineHeight: 1.55, marginBottom: 12 }}>{item.subtitle}</div>
      <div style={{ padding: "10px 0", borderRadius: 12, textAlign: "center", background: item.hlColor, color: "#000", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>{item.cta} →</div>
    </div>
  </div>
);

// ============================================================
// FEED RENDERER
// ============================================================
const FeedCard = ({ item }) => {
  switch (item.type) {
    case "daily_summary": return <DailySummaryCard item={item} />;
    case "signal": return <SignalCard item={item} />;
    case "contract": return <ContractCard item={item} />;
    case "smart_money": return <SmartMoneyCard item={item} />;
    case "prediction": return <PredictionCard item={item} />;
    case "finance_reco": return <FinanceRecoCard item={item} />;
    case "editorial": return <EditorialCard item={item} />;
    case "product": return <ProductCard item={item} />;
    default: return null;
  }
};

// ============================================================
// MAIN
// ============================================================
export default function BitgetWallet24hFeed() {
  const [tab, setTab] = useState("home");
  const [filter, setFilter] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDist, setPullDist] = useState(0);
  // feedItems = base items; newCards inserted at front on flush
  const [feedItems, setFeedItems] = useState(() => {
    const now = new Date("2026-03-16T23:28:00");
    const h24 = new Date(now.getTime() - 864e5);
    return ALL_ITEMS.filter(i => new Date(i.time) > h24);
  });
  const [pendingQueue, setPendingQueue] = useState([]);
  const [pinEnabled, setPinEnabled] = useState(true);
  const [dropOpen, setDropOpen] = useState(false);
  const [userType, setUserType] = useState("asset"); // "asset" = 有资产, "noAsset" = 无资产
  const [pinScene, setPinScene] = useState("deposit"); // "deposit" = 入金, "card" = 开卡, "fomo" = FOMO活动
  const scrollRef = useRef(null);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);
  const nextIdx = useRef(0);

  const filters = ["全部", "AI信号", "精选内容", "活动"];
  const typeMap = { 1: ["daily_summary","signal","contract","smart_money","prediction"], 2: ["editorial"], 3: ["product","finance_reco"] };

  // 新推送内容池 — 使用 2026-03-16T23:29+ 的时间戳确保排在最前
  const NEW_POOL = [
    { id: "live-1", type: "signal", time: "2026-03-16T23:29:00", signalType: "spot",
      token: "WIF", price: "$2.87", change: "+67.8%", up: true,
      conclusion: "WIF 交易量1小时激增8倍，Meme FOMO 爆发，注意追高。",
      confidence: "中", urgency: "突发", strength: "中强", isNew: true },
    { id: "live-2", type: "smart_money", time: "2026-03-16T23:31:00",
      wallet: "0xae2F...b721", walletLabel: "Jump Trading", walletTag: "顶级做市商",
      action: "大额买入", token: "SUI", amount: "$12.5M", tokenPrice: "$1.67",
      conclusion: "Jump Trading 买入 $12.5M SUI，历史类似建仓后30日涨 +45%。",
      urgency: "突发", strength: "强", isNew: true },
    { id: "live-3", type: "editorial", time: "2026-03-16T23:33:00",
      tag: "突发", typeName: "行业动态",
      title: "特朗普签署行政令：将比特币列为国家战略储备资产",
      summary: "美国总统特朗普刚刚签署行政令，BTC 瞬间拉升 $3,000，市场剧烈波动中",
      coverEmoji: "🇺🇸", gradStart: "#7F1D1D", gradEnd: "#991B1B", isNew: true },
    { id: "live-4", type: "contract", time: "2026-03-16T23:35:00",
      token: "BTC", price: "$90,432", direction: "做多", leverage: "10x",
      entry: "$89,800 - $90,200", target: "$95,000", stop: "$87,500",
      conclusion: "BTC 战略储备行政令落地，突破 $90K，多头动能极强。",
      confidence: "高", riskLevel: "高", urgency: "突发", strength: "强", isNew: true },
    { id: "live-5", type: "prediction", time: "2026-03-16T23:37:00",
      question: "BTC 在战略储备消息后能否站稳 $95,000？",
      longPct: 78, shortPct: 22, volume: "$5.6M",
      deadline: "2026-03-18T00:00:00", participants: "24.1K", isNew: true },
    { id: "live-6", type: "finance_reco", time: "2026-03-16T23:39:00",
      marketCondition: "暴涨",
      hook: "BTC 1小时暴涨 +5.2%，市场进入极度贪婪状态",
      recommendation: "暴涨行情中，部分获利可转入稳定币理财锁定收益。",
      products: [
        { name: "USDT Plus", apy: "5.2%", type: "灵活", minAmount: "无门槛", tag: "热门" },
        { name: "BTC 活期", apy: "2.1%", type: "灵活", minAmount: "0.001 BTC", tag: null },
      ],
      gradStart: "#3B0764", gradEnd: "#7E22CE", isNew: true },
  ];

  // 每8秒从池子取一条进 pending
  useEffect(() => {
    const t = setInterval(() => {
      if (nextIdx.current < NEW_POOL.length) {
        const item = NEW_POOL[nextIdx.current];
        nextIdx.current++;
        setPendingQueue(prev => [...prev, item]);
      }
    }, 8000);
    return () => clearInterval(t);
  }, []);

  // 把 pending 插入 feed
  const flushPending = () => {
    setPendingQueue(curr => {
      if (curr.length === 0) return curr;
      setFeedItems(prev => [...curr, ...prev]);
      setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
      // 5秒后清除 isNew 标记，"刚刚" → 具体时间
      setTimeout(() => {
        setFeedItems(prev => prev.map(item => item.isNew ? { ...item, isNew: false } : item));
      }, 5000);
      return [];
    });
  };

  // 下拉 handlers (mouse + touch)
  const dStart = (y) => { dragStartY.current = y; isDragging.current = (scrollRef.current?.scrollTop || 0) <= 0; };
  const dMove = (y) => { if (!isDragging.current || refreshing) return; const d = y - dragStartY.current; if (d > 0) setPullDist(Math.min(d * 0.4, 80)); };
  const dEnd = () => {
    if (pullDist > 50 && !refreshing) {
      setRefreshing(true); setPullDist(60);
      setTimeout(() => { flushPending(); setRefreshing(false); setPullDist(0); }, 800);
    } else { setPullDist(0); }
    isDragging.current = false;
  };

  // 去重排列
  // 大类映射：同一大类的卡片不连续出现
  // 交易信号子类型不同可连续（现货→合约 OK，现货→现货 NG）
  // 活动类每张独立，允许连续
  function getCategory(type, id) {
    if (type === "signal") return "signal";       // 现货→现货 不连续
    if (type === "contract") return "contract";    // 合约→合约 不连续
    if (type === "smart_money") return "smart_money"; // 聪明钱→聪明钱 不连续
    if (["prediction", "daily_summary"].includes(type)) return "AI预测";
    if (type === "editorial") return "精选内容";
    if (type === "product") return "product_" + id;
    if (type === "finance_reco") return "理财";
    return type;
  }

  function dedup(items) {
    const res = []; const rem = [...items];
    while (rem.length > 0) {
      const lastCat = res.length > 0 ? getCategory(res[res.length - 1].type, res[res.length - 1].id) : null;
      const idx = rem.findIndex(i => getCategory(i.type, i.id) !== lastCat);
      res.push(idx >= 0 ? rem.splice(idx, 1)[0] : rem.shift());
    }
    return res;
  }

  const sorted = [...feedItems].sort((a, b) => new Date(b.time) - new Date(a.time));

  // 置顶：提取 pinned 内容（仅限精选内容和产品推送，受开关控制）
  const pinnedItem = pinEnabled ? sorted.find(i => i.pinned && ["editorial", "product"].includes(i.type)) : null;
  const unpinned = sorted.filter(i => i !== pinnedItem);

  const deduped = dedup(unpinned);
  const filtered = filter === 0 ? deduped : dedup(unpinned.filter(i => typeMap[filter]?.includes(i.type)));

  const [hoveredCard, setHoveredCard] = useState(null);

  const ANNOTATIONS = {
    daily_summary: { title: "🤖 AI信号 · 24h复盘", color: C.cyan, frequency: "1条/天", lifecycle: "过期: 次日08:00",
      notes: ["每日 08:00 固定推送", "总结过去24h AI信号整体表现", "包含：推荐Token数、胜率、综合收益率", "次日08:00新复盘推送时旧复盘过期"] },
    signal: { title: "🤖 AI信号 · 现货", color: C.green, frequency: "≤4条/天", lifecycle: "过期: 发布后6小时",
      notes: ["标签: 🔴突发（闪烁）/ 常规", "标签: 信号强度条（强/中强/中/弱）", "字段: Token·价格·24h涨跌幅·AI结论", "过滤: 同Token 24h内只推1条", "熔断: 运营手动触发，全部下线"] },
    contract: { title: "🤖 AI信号 · 合约", color: C.orange, frequency: "≤2条/天", lifecycle: "过期: 4小时 或 触达TP/SL",
      notes: ["标签: 🔴突发 + 信号强度条", "展示: 做多/做空 + 杠杆倍数", "三格: 入场区间 / 止盈 / 止损", "触达止盈/止损价自动消失", "地区合规: 不支持地区不展示"] },
    smart_money: { title: "🤖 AI信号 · 聪明钱", color: C.gold, frequency: "≤2条/天", lifecycle: "过期: 发布后12小时",
      notes: ["标签: 🔴突发 + 信号强度条", "追踪链上大户/做市商/知名地址", "展示: 钱包标签·胜率·操作·金额", "AI结论分析历史胜率", "同钱包24h不重复推送"] },
    prediction: { title: "🤖 AI信号 · 预测", color: C.purple, frequency: "2-3条/天", lifecycle: "过期: 随预测截止时间",
      notes: ["支持二元（多空）+ 多选项模式", "截止时间到达后自动消失", "展示参与人数和交易量"] },
    editorial: { title: "📰 精选内容", color: "#6366F1", frequency: "共3条/天", lifecycle: "过期: 24-48小时",
      notes: ["人工编辑每日产出", "类型: 市场分析/教程/晨报/快报", "大图封面+标题叠加沉浸式样式", "按用户行为标签匹配分发"] },
    product: { title: "🎁 活动/产品推送", color: C.orange, frequency: "≤4条/天", lifecycle: "过期: 活动结束时间",
      notes: ["类型: 赚币中心/节日活动/银行卡", "上图下文案，图片由运营配置上传", "每个活动每用户只推1次"] },
    finance_reco: { title: "💰 理财推荐", color: "#0EA5E9", frequency: "≤2条/天", lifecycle: "过期: 行情变化时 或 12小时",
      notes: ["根据当前行情自动匹配理财产品", "震荡→稳定币 / 上涨→质押", "展示多产品: 名称·APY·类型·门槛", "行情条件变化时自动过期"] },
  };

  const currentAnnotation = hoveredCard ? ANNOTATIONS[hoveredCard] : null;

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", background: "#0E0F18", fontFamily: "'DM Sans', -apple-system, sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800;9..40,900&family=JetBrains+Mono:wght@600;700;800&display=swap');
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.8)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes bubbleIn{from{opacity:0;transform:translateY(10px) scale(0.8)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes bubblePulse{0%,100%{box-shadow:0 4px 20px rgba(46,236,210,0.3)}50%{box-shadow:0 4px 28px rgba(46,236,210,0.5)}}
        @keyframes newCardIn{from{opacity:0;transform:translateY(-20px) scale(0.97);max-height:0}to{opacity:1;transform:translateY(0) scale(1);max-height:500px}}
        @keyframes urgencyFlash{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes noteIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}
        *{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{display:none}
      `}</style>

      {/* ===== LEFT: 手机原型 ===== */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 480, flexShrink: 0, padding: "20px 24px 20px 32px" }}>
        <div style={{ width: 430, height: "calc(100vh - 40px)", background: C.bg, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", borderRadius: 28, border: "3px solid rgba(255,255,255,0.08)", boxShadow: "0 0 60px rgba(0,0,0,0.5), 0 0 120px rgba(46,236,210,0.03)" }}>

      {/* STATUS BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px 0", zIndex: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.t1, fontFamily: mono }}>23:28</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="white"><rect x="0" y="4" width="3" height="8" rx=".5"/><rect x="4.5" y="2" width="3" height="10" rx=".5"/><rect x="9" y="0" width="3" height="12" rx=".5"/><rect x="13" y="0" width="3" height="12" rx=".5"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><path d="M8 2.5A7.5 7.5 0 0 0 .5 7.5l1.4 1.4A5.5 5.5 0 0 1 8 5 5.5 5.5 0 0 1 14.1 8.9l1.4-1.4A7.5 7.5 0 0 0 8 2.5z" opacity=".5"/><circle cx="8" cy="11" r="1.5"/></svg>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.15)", borderRadius: 4, padding: "1px 5px" }}>23</span>
        </div>
      </div>

      {/* APP HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px 6px" }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #FFD93D, #FF6B6B)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #7CEEF0", position: "relative" }}><span style={{ fontSize: 20 }}>🤡</span><div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: C.cyan, border: `2px solid ${C.bg}` }} /></div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 20, height: 20, borderRadius: 5, background: `linear-gradient(135deg, ${C.cyan}, #00B4D8)`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 9, fontWeight: 900, color: "#000" }}>▶</span></div><span style={{ fontSize: 15, fontWeight: 800, color: C.cyan }}>Bitget Wallet</span></div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.t2} strokeWidth="1.8" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
      </div>

      {/* SEARCH */}
      <div style={{ padding: "4px 16px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 14, background: "rgba(255,255,255,0.06)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.t3} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span style={{ fontSize: 14, color: C.t3 }}>全局搜索</span>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: 85, position: "relative" }}
        onTouchStart={(e) => dStart(e.touches[0].clientY)}
        onTouchMove={(e) => dMove(e.touches[0].clientY)}
        onTouchEnd={dEnd}
        onMouseDown={(e) => { dStart(e.clientY); e.preventDefault(); }}
        onMouseMove={(e) => dMove(e.clientY)}
        onMouseUp={dEnd}
        onMouseLeave={() => { if (isDragging.current) dEnd(); }}>

        {/* 下拉刷新指示器 */}
        <div style={{
          height: pullDist, overflow: "hidden", transition: refreshing ? "none" : "height 0.25s ease",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {refreshing ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 18, height: 18, border: `2px solid ${C.cyan}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: 12, color: C.cyan, fontWeight: 600 }}>加载 {pendingQueue.length > 0 ? `${pendingQueue.length} 条新内容` : ""}...</span>
            </div>
          ) : pullDist > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={pullDist > 50 ? C.cyan : C.t3} strokeWidth="2.5" strokeLinecap="round"
                style={{ transform: `rotate(${pullDist > 50 ? 180 : 0}deg)`, transition: "transform 0.2s" }}>
                <path d="M12 5v14M5 12l7-7 7 7"/>
              </svg>
              <span style={{ fontSize: 12, color: pullDist > 50 ? C.cyan : C.t3, fontWeight: 600 }}>
                {pullDist > 50 ? "松手刷新" : "下拉刷新"}
              </span>
            </div>
          )}
        </div>

        {/* ══════ 有资产用户 vs 无资产用户 ══════ */}
        {userType === "asset" ? (<>
        {/* ASSET */}
        <div style={{ padding: "2px 20px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline" }}><span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>¥</span><span style={{ fontSize: 34, fontWeight: 900, color: C.t1, fontFamily: mono, letterSpacing: "-0.03em" }}>4,569</span><span style={{ fontSize: 16, fontWeight: 700, color: C.t1, fontFamily: mono }}>.00</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 1 }}><span style={{ fontSize: 13, color: C.green, fontWeight: 700, fontFamily: mono }}>+¥9.98</span><span style={{ fontSize: 13, color: C.green, fontWeight: 700, fontFamily: mono }}>+0.21%</span><span style={{ fontSize: 12, color: C.t3, textDecoration: "underline", textDecorationStyle: "dashed", textUnderlineOffset: 3 }}>当日盈亏</span></div>
            </div>
            <div style={{ padding: "10px 20px", borderRadius: 14, background: C.cyan, color: "#000", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>去充值</div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ display: "flex", gap: 10, padding: "4px 16px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
          {[{ icon: "🐷", label: "理财" }, { icon: "🪙", label: "赚币", dot: true }, { icon: "💎", label: "DApp" }, { icon: "⊞", label: "全部" }].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 14, background: C.pill, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, position: "relative" }}>
              <span style={{ fontSize: 17 }}>{a.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: C.t2 }}>{a.label}</span>
              {a.dot && <div style={{ position: "absolute", top: 7, right: 11, width: 7, height: 7, borderRadius: "50%", background: C.pink }} />}
            </div>
          ))}
        </div>

        {/* 📌 置顶位 — 仅当有 pinned 内容时展示 */}
        {pinnedItem && (
          <div style={{ position: "relative", marginBottom: 10 }}
            onMouseEnter={() => setHoveredCard(pinnedItem.type)}
            onMouseLeave={() => setHoveredCard(null)}>
            <FeedCard item={{ ...pinnedItem, _pinTag: true }} />
          </div>
        )}

        {/* TITLE + FILTER 下拉 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 16px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: C.cyan }} />
            <span style={{ fontSize: 15, fontWeight: 800, color: C.t1 }}>此刻发生</span>
          </div>
          <div style={{ position: "relative" }}>
            <div onClick={() => setDropOpen(!dropOpen)} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 99,
              background: C.pill, cursor: "pointer", userSelect: "none",
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: filter === 0 ? C.t2 : C.cyan }}>{filters[filter]}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.t3} strokeWidth="3" strokeLinecap="round" style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
            {dropOpen && (
              <div style={{
                position: "absolute", top: "110%", right: 0, zIndex: 200,
                background: C.cardBg, borderRadius: 14, padding: "6px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                minWidth: 120,
              }}>
                {filters.map((f, i) => (
                  <div key={i} onClick={() => { setFilter(i); setDropOpen(false); }} style={{
                    padding: "8px 14px", borderRadius: 10, cursor: "pointer",
                    fontSize: 13, fontWeight: 600,
                    color: filter === i ? C.cyan : C.t2,
                    background: filter === i ? `${C.cyan}10` : "transparent",
                  }}>{f}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TIMELINE */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.04)", zIndex: 0 }} />
          {filtered.map((item, i) => (
              <div key={item.id}
                onMouseEnter={() => setHoveredCard(item.type)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                position: "relative", zIndex: 1, marginBottom: 14,
                animation: item.isNew
                  ? "newCardIn 0.5s ease-out both"
                  : `slideUp 0.3s ease-out ${Math.min(i * 30, 300)}ms both`,
                outline: hoveredCard === item.type ? `2px solid ${ANNOTATIONS[item.type]?.color || C.cyan}30` : "none",
                outlineOffset: 4, borderRadius: 24, transition: "outline 0.2s",
              }}>
                {/* 新卡片左侧高亮条 */}
                {item.isNew && <div style={{
                  position: "absolute", left: 16, top: 26, bottom: 4, width: 3, borderRadius: 2,
                  background: `linear-gradient(to bottom, ${C.cyan}, transparent)`, zIndex: 2,
                }} />}
                <TimeStamp iso={item.time} isNew={item.isNew} />
                <FeedCard item={item} />
              </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "48px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>📭</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.t2, marginBottom: 6 }}>暂无{filters[filter]}推送</div>
              <div style={{ fontSize: 12, color: C.t4 }}>新内容到达后会自动出现在这里</div>
            </div>
          )}
        </div>

        {filtered.length > 0 && <div style={{ padding: "24px 20px 10px", textAlign: "center", fontSize: 12, color: C.t4 }}>— 仅展示最近 24 小时内推送 —</div>}

        </>) : (<>
        {/* ══════ 无资产用户视图 ══════ */}

        {/* 入金引导区 — 参考实际产品 */}
        <div style={{ padding: "4px 16px 12px" }}>
          {/* 卡片视觉区 */}
          <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(150deg, #B2EFE6, #D4F5F0)", padding: "20px 20px 16px", marginBottom: 16, position: "relative" }}>
            {/* 0 Fees 文字 */}
            <div style={{ fontSize: 42, fontWeight: 900, color: "rgba(0,0,0,0.08)", letterSpacing: "-0.02em", lineHeight: 1 }}>0 Fees</div>
            {/* BTC 图标 */}
            <div style={{ position: "absolute", top: 40, left: 12, width: 44, height: 44, borderRadius: "50%", background: "#F7931A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>₿</span>
            </div>
            {/* ETH 图标 */}
            <div style={{ position: "absolute", top: 18, right: 40, width: 36, height: 36, borderRadius: "50%", background: "#627EEA", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16, color: "#fff" }}>◆</span>
            </div>
            {/* 银行卡 */}
            <div style={{ marginTop: 8, width: "80%", height: 100, borderRadius: 14, background: "linear-gradient(135deg, #1a1a2e, #2d2d44)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
              <div style={{ position: "absolute", left: 16, bottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 12, borderRadius: 2, background: "#C0C0C0" }} />
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>〈〈</span>
              </div>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2.5" strokeLinecap="round"><path d="M13 5l7 7-7 7"/><path d="M6 5l7 7-7 7" opacity="0.4"/></svg>
              <div style={{ position: "absolute", left: 14, bottom: 38, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 8, fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>▷ Bitget Wallet</span>
              </div>
            </div>
            {/* Swap 按钮 */}
            <div style={{ position: "absolute", right: 16, bottom: 24, width: 36, height: 36, borderRadius: "50%", background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"><path d="M7 16l-4-4 4-4"/><path d="M17 8l4 4-4 4"/></svg>
            </div>
          </div>

          {/* 充值或接收加密货币 */}
          <div style={{ fontSize: 20, fontWeight: 900, color: C.t1, textAlign: "center", marginBottom: 16 }}>充值或接收加密货币</div>

          {/* Apple Pay 按钮 */}
          <div style={{ padding: "14px 0", borderRadius: 14, textAlign: "center", background: C.cyan, color: "#000", fontSize: 16, fontWeight: 800, cursor: "pointer", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            <span>Pay</span>
          </div>

          {/* 链上收款 按钮 */}
          <div style={{ padding: "14px 0", borderRadius: 14, textAlign: "center", background: C.pill, color: C.t1, fontSize: 16, fontWeight: 800, cursor: "pointer", marginBottom: 12 }}>链上收款</div>

          {/* 底部链接 */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: C.t3, cursor: "pointer" }}>我需要帮助</span>
            <span style={{ fontSize: 13, color: C.t4 }}>|</span>
            <span style={{ fontSize: 13, color: C.t3, cursor: "pointer" }}>其他入金方式</span>
          </div>
        </div>

        {/* 快捷入口 */}
        <div style={{ display: "flex", gap: 10, padding: "0 16px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
          {[{ icon: "🐷", label: "理财" }, { icon: "🪙", label: "赚币", dot: true }, { icon: "💎", label: "DApp" }, { icon: "⊞", label: "全部" }].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 14, background: C.pill, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, position: "relative" }}>
              <span style={{ fontSize: 17 }}>{a.icon}</span><span style={{ fontSize: 13, fontWeight: 700, color: C.t2 }}>{a.label}</span>
              {a.dot && <div style={{ position: "absolute", top: 7, right: 11, width: 7, height: 7, borderRadius: "50%", background: C.pink }} />}
            </div>
          ))}
        </div>

        {/* 📌 置顶区 */}
        <div style={{ padding: "0 16px 12px", display: "flex", flexDirection: "column", gap: 10 }}>

          {/* 置顶1: 根据邀请来源动态切换 */}
          {pinScene === "deposit" && (
            <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, #0D4F3C, #1A8B6E)" }}>
              <div style={{ padding: "24px 18px", textAlign: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 12, left: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: C.cyan, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)", padding: "3px 8px", borderRadius: 6 }}>📌 置顶</span>
                </div>
                <div style={{ fontSize: 44, marginBottom: 10 }}>🇯🇵</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 6 }}>1 USDT 就能开始</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 18 }}>支持 JPY 银行转账、便利店付款<br/>最快 5 分钟到账，轻松入金</div>
                <div style={{ padding: "12px 0", borderRadius: 12, background: "#fff", color: "#000", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  <span>Apple Pay 充值</span>
                </div>
              </div>
            </div>
          )}

          {pinScene === "card" && (
            <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, #0F766E, #14B8A6)" }}>
              <div style={{ padding: "24px 18px", textAlign: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 12, left: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: C.cyan, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)", padding: "3px 8px", borderRadius: 6 }}>📌 好友邀请</span>
                </div>
                <div style={{ fontSize: 44, marginBottom: 10 }}>💳</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 6 }}>开通 Bitget Card</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 18 }}>你的朋友邀请你开卡<br/>全球消费 0 手续费 · 支持 USDT 直接消费</div>
                <div style={{ padding: "12px 0", borderRadius: 12, background: "#fff", color: "#000", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>立即开卡 →</div>
              </div>
            </div>
          )}

          {pinScene === "fomo" && (
            <div style={{ borderRadius: 20, overflow: "hidden", background: "linear-gradient(135deg, #B91C1C, #F97316)" }}>
              <div style={{ padding: "24px 18px", textAlign: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 12, left: 14 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)", padding: "3px 8px", borderRadius: 6 }}>📌 好友邀请</span>
                </div>
                <div style={{ fontSize: 44, marginBottom: 10 }}>🔥</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 6 }}>FOMO 星期四</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 18 }}>你的朋友邀请你参与<br/>总奖池 500,000 USDT · 先到先得</div>
                <div style={{ padding: "12px 0", borderRadius: 12, background: "#fff", color: "#000", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>立即参与 →</div>
              </div>
            </div>
          )}

          {/* 置顶2: 加密一点通 */}
          <div style={{ borderRadius: 20, overflow: "hidden", background: "#D4F5F0" }}>
            {/* 上：插画区 */}
            <div style={{ height: 140, position: "relative", background: "linear-gradient(180deg, #B2EFE6 0%, #D4F5F0 100%)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {/* 占位插画 */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 48, transform: "rotate(-10deg)" }}>🐱</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", background: "#ECFDF5", padding: "3px 10px", borderRadius: 99 }}>10% APY</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", background: "#F3E8FF", padding: "3px 10px", borderRadius: 99 }}>100 X</span>
                </div>
                <div style={{ fontSize: 36 }}>💎</div>
              </div>
              {/* 置顶标签 */}
              <div style={{ position: "absolute", top: 10, left: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#0D9488", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)", padding: "3px 8px", borderRadius: 6 }}>📌 置顶</span>
              </div>
            </div>
            {/* 下：文案区 */}
            <div style={{ padding: "16px 18px 18px" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#1a1a2e", lineHeight: 1.3, marginBottom: 10 }}>从 0 到 1 搞懂加密货币</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>理财：稳健赚 10% 年化</div>
                <div style={{ padding: "10px 20px", borderRadius: 99, background: "#fff", color: "#1a1a2e", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>立即开始</div>
              </div>
            </div>
          </div>
        </div>

        {/* 此刻发生 */}
        <div style={{ display: "flex", alignItems: "center", padding: "6px 16px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: C.cyan }} />
            <span style={{ fontSize: 15, fontWeight: 800, color: C.t1 }}>此刻发生</span>
          </div>
        </div>

        {/* 信息流 — 复用有资产用户的产品推送+精选内容 */}
        {(() => {
          const noAssetTypes = ["editorial", "product", "finance_reco"];
          const noAssetItems = sorted.filter(i => noAssetTypes.includes(i.type));
          return (
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.04)", zIndex: 0 }} />
              {noAssetItems.map((item, i) => (
                <div key={item.id} style={{
                  position: "relative", zIndex: 1, marginBottom: 14,
                  animation: `slideUp 0.3s ease-out ${Math.min(i * 60, 300)}ms both`,
                }}>
                  <TimeStamp iso={item.time} />
                  <FeedCard item={item} />
                </div>
              ))}
              {noAssetItems.length === 0 && (
                <div style={{ padding: "48px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>📭</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.t2, marginBottom: 6 }}>暂无推送</div>
                  <div style={{ fontSize: 12, color: C.t4 }}>新内容到达后会自动出现在这里</div>
                </div>
              )}
            </div>
          );
        })()}

        <div style={{ padding: "24px 20px 10px", textAlign: "center", fontSize: 12, color: C.t4 }}>— 充值后解锁更多个性化推送 —</div>

        </>)}
        
      </div>

      {/* 新内容提示气泡 — 仅有资产用户 */}
      {userType === "asset" && pendingQueue.length > 0 && (
        <div onClick={flushPending} style={{
          position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
          zIndex: 99, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 18px", borderRadius: 99,
          background: C.cardBg, border: `1px solid ${C.cyan}30`,
          boxShadow: `0 4px 24px rgba(0,0,0,0.4)`,
          animation: "bubbleIn 0.3s ease-out, bubblePulse 2s ease-in-out infinite",
          backdropFilter: "blur(12px)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.cyan }}>{pendingQueue.length} 条新推送</span>
        </div>
      )}

      {/* TAB BAR */}
      <div style={{ position: "sticky", bottom: 0, background: `linear-gradient(to top, ${C.bg} 75%, ${C.bg}ee 90%, transparent)`, paddingTop: 8, paddingBottom: 8, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          {[{ id: "home", icon: "💬", label: "首页" }, { id: "market", icon: "📈", label: "行情" }, { id: "swap", sp: true, label: "Swap" }, { id: "pay", icon: "💲", label: "Pay" }, { id: "wallet", icon: "👝", label: "钱包" }].map(t => (
            <div key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", ...(t.sp ? { marginTop: -20 } : {}) }}>
              {t.sp ? <div style={{ width: 50, height: 50, borderRadius: "50%", background: C.cyan, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 20px ${C.cyan}40` }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"><path d="M7 16l-4-4m0 0l4-4m-4 4h18"/><path d="M17 8l4 4m0 0l-4 4"/></svg></div> : <span style={{ fontSize: 19, opacity: tab === t.id ? 1 : 0.3 }}>{t.icon}</span>}
              <span style={{ fontSize: 10, fontWeight: 600, color: t.sp ? C.cyan : tab === t.id ? C.t1 : C.t4 }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

        {/* end phone container */}
        </div>
      </div>

      {/* ===== RIGHT: 说明面板 ===== */}
      <div style={{ flex: 1, padding: "24px 32px", overflowY: "auto", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>

        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.t1, marginBottom: 4 }}>Bitget Wallet 首页信息流</div>
          <div style={{ fontSize: 13, color: C.t3 }}>产品原型 · 悬停卡片查看详细说明</div>
        </div>

        {/* 原型控制 */}
        <div style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.purple, marginBottom: 10 }}>🎛️ 原型控制</div>

          {/* 用户类型切换 */}
          <div style={{ display: "flex", gap: 0, marginBottom: 10, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            {[
              { key: "asset", label: "💰 有资产用户", desc: "已持仓 / 活跃交易" },
              { key: "noAsset", label: "👋 无资产用户", desc: "新用户 / 空钱包" },
            ].map((u) => (
              <div key={u.key} onClick={() => setUserType(u.key)} style={{
                flex: 1, padding: "10px 12px", cursor: "pointer", textAlign: "center",
                background: userType === u.key ? `${C.cyan}15` : "transparent",
                borderRight: u.key === "asset" ? "1px solid rgba(255,255,255,0.06)" : "none",
                transition: "background 0.2s",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: userType === u.key ? C.cyan : C.t3 }}>{u.label}</div>
                <div style={{ fontSize: 9, color: C.t4, marginTop: 2 }}>{u.desc}</div>
              </div>
            ))}
          </div>

          {/* 置顶开关 */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.02)",
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.t1 }}>📌 置顶位</div>
              <div style={{ fontSize: 10, color: C.t4, marginTop: 2 }}>可置顶任意精选内容或活动</div>
            </div>
            <div onClick={() => setPinEnabled(!pinEnabled)} style={{
              width: 44, height: 24, borderRadius: 12, cursor: "pointer",
              background: pinEnabled ? C.cyan : "rgba(255,255,255,0.1)",
              position: "relative", transition: "background 0.2s",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 10,
                background: "#fff", position: "absolute", top: 2,
                left: pinEnabled ? 22 : 2,
                transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }} />
            </div>
          </div>

          {/* 无资产用户置顶场景（仅在无资产模式下显示） */}
          {userType === "noAsset" && (
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 8 }}>📌 置顶1 · 邀请来源</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[
                  { key: "deposit", label: "💵 入金", desc: "默认" },
                  { key: "card", label: "💳 开卡", desc: "KOL邀请" },
                  { key: "fomo", label: "🔥 FOMO", desc: "KOL邀请" },
                ].map(s => (
                  <div key={s.key} onClick={() => setPinScene(s.key)} style={{
                    flex: 1, padding: "8px 4px", borderRadius: 8, cursor: "pointer", textAlign: "center",
                    background: pinScene === s.key ? `${C.cyan}15` : "transparent",
                    border: pinScene === s.key ? `1px solid ${C.cyan}25` : "1px solid transparent",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: pinScene === s.key ? C.cyan : C.t3 }}>{s.label}</div>
                    <div style={{ fontSize: 9, color: C.t4, marginTop: 2 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.cyan, marginBottom: 10 }}>💡 交互说明</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { icon: "⬇️", text: "鼠标下拉刷新：在列表顶部按住向下拖拽" },
              { icon: "🔔", text: "新推送气泡：每8秒自动到达1条新推送" },
              { icon: "👆", text: "点击气泡：新卡片插入顶部，5秒后 NEW 标记消失" },
              { icon: "🔀", text: "Filter 标签：切换全部/AI信号/精选内容/活动" },
              { icon: "🖱", text: "悬停卡片：右侧显示该卡片类型的详细说明" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: 12, color: C.t2, lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 📅 典型一天的推送节奏 */}
        <div style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 4 }}>📅 典型一天的推送节奏 · {userType === "asset" ? "有资产用户" : "无资产用户"}</div>
          <div style={{ fontSize: 10, color: C.t4, marginBottom: 14 }}>{userType === "asset" ? "日常约 13 条 · 极限 21 条 · 上限 20 条" : "日常约 8 条 · 精选内容 + 产品推送 + 理财"}</div>

          {/* 时间轴 */}
          <div style={{ position: "relative", paddingLeft: 40 }}>
            {/* 竖线 */}
            <div style={{ position: "absolute", left: 18, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.06)" }} />

            {(userType === "asset" ? [
              { time: "00:30", label: "合约信号", sub: "ETH 做多（SEC ETF 消息）", color: C.orange, tag: "突发" },
              { time: "03:20", label: "现货信号", sub: "AAVE V4 测试网上线", color: C.green, tag: "突发" },
              { time: "06:30", label: "精选内容", sub: "Bitget 晨报 · 5件事", color: "#6366F1", tag: "晨报" },
              { time: "08:00", label: "AI 24h复盘", sub: "7推荐 · 胜率71% · +12.8%", color: C.cyan, tag: "固定" },
              { time: "09:00", label: "现货信号", sub: "TIA 生态扩张", color: C.green },
              { time: "09:30", label: "理财推荐", sub: "上涨行情 · ETH质押", color: "#0EA5E9" },
              { time: "10:20", label: "合约信号", sub: "ETH 做多 布林突破", color: C.orange },
              { time: "11:45", label: "聪明钱", sub: "Smart Money #42 买入 ARB", color: C.gold },
              { time: "12:30", label: "银行卡", sub: "开卡引导 · 0手续费", color: C.orange },
              { time: "13:05", label: "现货信号", sub: "FET AI板块联动", color: C.green },
              { time: "13:50", label: "赚币活动", sub: "IDOS 奖池瓜分", color: C.orange },
              { time: "14:20", label: "赚币活动", sub: "FOMO 星期四", color: C.orange },
              { time: "15:00", label: "理财推荐", sub: "震荡行情 · USDT Plus", color: "#0EA5E9" },
              { time: "15:40", label: "AI 预测", sub: "BTC 本周能否破 $90K？", color: C.purple },
              { time: "16:20", label: "节日活动", sub: "开斋节绿包", color: "#22C55E" },
              { time: "17:00", label: "合约信号", sub: "SOL 做空 RSI超买", color: C.orange },
              { time: "17:45", label: "聪明钱", sub: "Wintermute 买入 PENDLE+AAVE", color: C.gold },
              { time: "18:30", label: "现货信号", sub: "ONDO RWA赛道突破", color: C.green },
              { time: "19:20", label: "精选内容", sub: "美以伊朗冲突热点追踪", color: "#6366F1", tag: "专题" },
              { time: "20:00", label: "AI 预测", sub: "NCAA 锦标赛冠军", color: C.purple },
              { time: "20:50", label: "赚币活动", sub: "ETH 质押加速计划", color: C.orange },
              { time: "21:30", label: "现货信号", sub: "AI板块 RNDR+ARKM+TAO", color: C.green, tag: "突发" },
              { time: "22:10", label: "合约信号", sub: "BTC 做多 美股收盘", color: C.orange },
              { time: "22:40", label: "精选内容", sub: "BTC 冲高回落复盘", color: "#6366F1", tag: "深度" },
              { time: "23:15", label: "聪明钱", sub: "vitalik.eth 转入 3K ETH", color: C.gold, tag: "突发" },
            ] : [
              { time: "06:30", label: "精选内容", sub: "Bitget 晨报 · 5件事", color: "#6366F1", tag: "晨报" },
              { time: "09:30", label: "理财推荐", sub: "上涨行情 · ETH质押", color: "#0EA5E9" },
              { time: "12:30", label: "银行卡", sub: "开卡引导 · 0手续费", color: C.orange },
              { time: "13:50", label: "赚币活动", sub: "IDOS 奖池瓜分", color: C.orange },
              { time: "14:20", label: "赚币活动", sub: "FOMO 星期四", color: C.orange },
              { time: "15:00", label: "理财推荐", sub: "震荡行情 · USDT Plus", color: "#0EA5E9" },
              { time: "16:20", label: "节日活动", sub: "开斋节绿包", color: "#22C55E" },
              { time: "19:20", label: "精选内容", sub: "美以伊朗冲突热点追踪", color: "#6366F1", tag: "专题" },
              { time: "20:50", label: "赚币活动", sub: "ETH 质押加速计划", color: C.orange },
              { time: "22:40", label: "精选内容", sub: "BTC 冲高回落复盘", color: "#6366F1", tag: "深度" },
            ]).map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6, position: "relative" }}>
                {/* 时间轴圆点 */}
                <div style={{ position: "absolute", left: -26, top: 5, width: 7, height: 7, borderRadius: "50%", background: item.color, boxShadow: item.tag === "突发" ? `0 0 6px ${item.color}80` : "none" }} />
                {/* 时间 */}
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: mono, color: C.t4, width: 36, flexShrink: 0 }}>{item.time}</span>
                {/* 内容 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.label}</span>
                    {item.tag && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: item.tag === "突发" ? `${C.red}20` : `${item.color}15`, color: item.tag === "突发" ? C.red : item.color }}>{item.tag}</span>}
                  </div>
                  <div style={{ fontSize: 10, color: C.t4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 统计 */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            {(userType === "asset" ? [
              { label: "交易信号", count: 12, color: C.green },
              { label: "精选内容", count: 3, color: "#6366F1" },
              { label: "活动/产品", count: 5, color: C.orange },
              { label: "AI预测", count: 2, color: C.purple },
              { label: "理财", count: 2, color: "#0EA5E9" },
              { label: "复盘", count: 1, color: C.cyan },
            ] : [
              { label: "精选内容", count: 3, color: "#6366F1" },
              { label: "活动/产品", count: 5, color: C.orange },
              { label: "理财", count: 2, color: "#0EA5E9" },
            ]).map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
                <span style={{ fontSize: 9, color: C.t3 }}>{s.label}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: s.color, fontFamily: mono }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 当前悬停卡片说明 or 内容分类总览 */}
        {currentAnnotation ? (
          <div key={hoveredCard} style={{ animation: "noteIn 0.25s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 4, height: 28, borderRadius: 2, background: currentAnnotation.color }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.t1 }}>{currentAnnotation.title}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: `${currentAnnotation.color}18`, color: currentAnnotation.color, fontWeight: 600 }}>{currentAnnotation.frequency}</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, background: "rgba(255,255,255,0.06)", color: C.orange, fontWeight: 600 }}>{currentAnnotation.lifecycle}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: `1px solid ${currentAnnotation.color}15` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.t2, marginBottom: 10 }}>卡片规则</div>
              {currentAnnotation.notes.map((note, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: currentAnnotation.color, marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{note}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.t2, marginBottom: 14 }}>内容分类总览</div>

            {/* ── 统一样式定义 ── */}
            {(() => {
              // 统一组件
              const Section = ({ icon, title, color, children }) => (
                <div style={{ marginBottom: 18, padding: "14px 14px 10px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: `1px solid ${color}10` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 7, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{icon}</div>
                    <span style={{ fontSize: 14, fontWeight: 800, color }}>{title}</span>
                  </div>
                  {children}
                </div>
              );
              const Group = ({ label, color, children }) => (
                <div style={{ marginLeft: 6, borderLeft: `2px solid ${color}25`, paddingLeft: 12, marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, marginBottom: 6, letterSpacing: "0.03em" }}>{label}</div>
                  {children}
                </div>
              );
              const Item = ({ label, freq, color }) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8, marginBottom: 2, background: "rgba(255,255,255,0.02)" }}>
                  <div style={{ width: 3, height: 14, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.t1, flex: 1 }}>{label}</span>
                  <span style={{ fontSize: 10, color: C.t4, fontFamily: mono }}>{freq}</span>
                </div>
              );
              const SubItem = ({ label, desc, color }) => (
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 8px 3px 20px", marginBottom: 1 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: color, flexShrink: 0, opacity: 0.4 }} />
                  <span style={{ fontSize: 11, color: C.t2 }}>{label}</span>
                  <span style={{ fontSize: 10, color: C.t4 }}>· {desc}</span>
                </div>
              );
              const ItemWithSubs = ({ label, freq, color, subs }) => (
                <div style={{ marginBottom: 4 }}>
                  <Item label={label} freq={freq} color={color} />
                  {subs.map((s, i) => <SubItem key={i} label={s.label} desc={s.desc} color={color} />)}
                </div>
              );

              return (
                <>
                  {/* ── AI信号 ── */}
                  <Section icon="🤖" title="AI 信号" color={C.cyan}>
                    <Group label="交易" color={C.cyan}>
                      <Item label="24h 复盘" freq="1条/天" color={C.cyan} />
                      <Item label="现货信号" freq="≤4条/天" color={C.green} />
                      <Item label="合约信号" freq="≤2条/天" color={C.orange} />
                      <Item label="聪明钱" freq="≤2条/天" color={C.gold} />
                    </Group>
                    <Group label="预测市场" color={C.purple}>
                      <Item label="AI 预测" freq="2-3条/天" color={C.purple} />
                    </Group>
                  </Section>

                  {/* ── 运营精品内容 ── */}
                  <Section icon="📰" title="运营精品内容" color="#6366F1">
                    <Group label="内容类型（共3条/天）" color="#6366F1">
                      <Item label="市场分析 / 观点" freq="" color="#6366F1" />
                      <Item label="教程 / Web3科普" freq="" color="#6366F1" />
                      <Item label="晨报 / 突发快报" freq="" color="#6366F1" />
                    </Group>
                  </Section>

                  {/* ── 产品推送 ── */}
                  <Section icon="🎁" title="产品推送" color={C.orange}>
                    <Group label="活动 & 服务" color={C.orange}>
                      <ItemWithSubs label="赚币中心活动" freq="≤2条/天" color={C.orange} subs={[
                        { label: "FOMO", desc: "每周四限定锁仓专场" },
                        { label: "项目方活动", desc: "如 IDOS 奖池瓜分" },
                      ]} />
                      <ItemWithSubs label="节日活动" freq="≤1条/天" color="#22C55E" subs={[
                        { label: "春节", desc: "红包活动" },
                        { label: "开斋节", desc: "绿包活动" },
                        { label: "圣诞节", desc: "节日限定" },
                      ]} />
                      <ItemWithSubs label="银行卡" freq="≤1条/天" color={C.cyan} subs={[
                        { label: "开卡", desc: "新用户开卡引导" },
                        { label: "换卡面", desc: "限定卡面推荐" },
                      ]} />
                      <ItemWithSubs label="理财推荐" freq="≤2条/天" color="#0EA5E9" subs={[
                        { label: "理财Plus", desc: "稳定币增强收益" },
                        { label: "Solana", desc: "SOL质押/流动性挖矿" },
                        { label: "USDT", desc: "USDT活期/定期理财" },
                      ]} />
                    </Group>
                  </Section>
                </>
              );
            })()}

            {/* 全局规则 */}
            <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.orange, marginBottom: 10 }}>⚙️ 全局规则</div>
              {[
                "置顶位：可将任意精选内容/产品推送置顶，无置顶则不展示",
                "同子类型不连续（现货→合约 OK，现货→现货 NG）",
                "活动卡片（赚币/节日/开卡）允许连续展示",
                "24小时滚动窗口，超过24h自动消失",
                "熔断机制：运营手动触发，交易信号全部下线",
                "每日推送总量上限: 20条",
                "新卡片插入5秒后 NEW 标记自动消失",
              ].map((rule, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: C.orange, flexShrink: 0, marginTop: 1 }}>•</span>
                  <span style={{ fontSize: 12, color: C.t2, lineHeight: 1.5 }}>{rule}</span>
                </div>
              ))}
            </div>

            {/* 最小推送间隔 */}
            <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.cyan, marginBottom: 12 }}>⏱ 最小推送间隔（冷却时间）</div>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 0, fontSize: 11 }}>
                {["内容类型", "常规", "突发", "上限"].map((h, i) => (
                  <div key={i} style={{ padding: "6px 8px", fontWeight: 700, color: C.t3, borderBottom: "1px solid rgba(255,255,255,0.08)", textAlign: i > 0 ? "center" : "left" }}>{h}</div>
                ))}
              </div>
              {/* Rows with expandable detail */}
              {[
                { label: "🤖 现货信号", normal: "2h", urgent: "30min", limit: "4条/天", color: C.green,
                  rule: "上一条现货信号推送后2h内不推第二条，队列中信号排队等待",
                  breach: "标记「突发」+ 信号强度=强，可缩短至30min，24h内突破最多2次" },
                { label: "🤖 合约信号", normal: "3h", urgent: "1h", limit: "2条/天", color: C.orange,
                  rule: "合约风险高，间隔更长给用户消化时间，避免短时间多次开仓引导",
                  breach: "BTC/ETH 级别突发行情（ETF通过、重大政策）可缩短至1h" },
                { label: "🤖 聪明钱", normal: "2h", urgent: "30min", limit: "2条/天", color: C.gold,
                  rule: "同钱包24h不重复推送，不同钱包的信号独立计算冷却",
                  breach: "vitalik.eth / 顶级做市商级别钱包操作可突破冷却" },
                { label: "🤖 AI预测", normal: "4h", urgent: "2h", limit: "3条/天", color: C.purple,
                  rule: "预测类内容决策周期长，不需要高频推送",
                  breach: "重大事件相关预测（大选结果、ETF投票）可缩短至2h" },
                { label: "🤖 24h复盘", normal: "24h", urgent: "—", limit: "1条/天", color: C.cyan,
                  rule: "每日08:00固定推送，新复盘替换旧复盘",
                  breach: "不可突破" },
                { label: "📰 精选内容", normal: "4h", urgent: "1h", limit: "3条/天", color: "#6366F1",
                  rule: "人工编辑产出，自然频率不会太高，突发快报除外",
                  breach: "突发新闻（SEC决定、重大黑天鹅）可缩短至1h" },
                { label: "🎁 活动", normal: "6h", urgent: "—", limit: "4条/天", color: C.orange,
                  rule: "同一活动只推1次，不同活动之间间隔6h，避免广告感",
                  breach: "不可突破，活动类不存在「突发」场景" },
                { label: "💰 理财推荐", normal: "6h", urgent: "2h", limit: "2条/天", color: "#0EA5E9",
                  rule: "跟随行情条件触发，同一行情条件只推1次",
                  breach: "行情剧变（±5%以上）可缩短至2h推新推荐" },
              ].map((row, i) => (
                <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {/* Main row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 0, fontSize: 11 }}>
                    <div style={{ padding: "7px 8px", color: row.color, fontWeight: 600 }}>{row.label}</div>
                    <div style={{ padding: "7px 8px", color: C.t1, fontWeight: 700, textAlign: "center", fontFamily: mono }}>{row.normal}</div>
                    <div style={{ padding: "7px 8px", color: row.urgent === "—" ? C.t4 : C.red, fontWeight: 700, textAlign: "center", fontFamily: mono }}>{row.urgent}</div>
                    <div style={{ padding: "7px 8px", color: C.t3, textAlign: "center", fontFamily: mono }}>{row.limit}</div>
                  </div>
                  {/* Detail rows */}
                  <div style={{ padding: "0 8px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <span style={{ fontSize: 9, color: C.t4, flexShrink: 0, marginTop: 2, fontWeight: 700 }}>冷却</span>
                      <span style={{ fontSize: 10, color: C.t3, lineHeight: 1.4 }}>{row.rule}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <span style={{ fontSize: 9, color: row.urgent === "—" ? C.t4 : C.red, flexShrink: 0, marginTop: 2, fontWeight: 700 }}>突破</span>
                      <span style={{ fontSize: 10, color: row.urgent === "—" ? C.t4 : C.t3, lineHeight: 1.4 }}>{row.breach}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 刷新机制 */}
            <div style={{ marginTop: 16, padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#6366F1", marginBottom: 12 }}>🔄 刷新机制</div>
              {[
                { scene: "浏览中新内容到达", rule: "静默推入顶部，不打断当前浏览。底部出现气泡提示「N 条新推送 ↑」，用户点击气泡或滚回顶部时展示新卡片。", color: C.cyan },
                { scene: "下拉刷新 / 气泡点击", rule: "效果一致，都是加载已到达的新内容到 Feed 顶部。新卡片带入场动画 + 「刚刚 NEW」标记，5秒后自动变为具体时间。", color: C.green },
                { scene: "后台切回前台", rule: "离开 < 5分钟：自动静默刷新，新内容直接出现在顶部。离开 > 5分钟：显示气泡提示，用户点击后加载。", color: C.orange },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: item.color }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.scene}</span>
                  </div>
                  <div style={{ fontSize: 10, color: C.t3, lineHeight: 1.5, paddingLeft: 10 }}>{item.rule}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
