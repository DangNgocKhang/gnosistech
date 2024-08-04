interface ISubNavigate {
  path: string;
  title: string;
}
export const listSubSignal: ISubNavigate[] = [
  { path: "signals", title: "Signals" },
  { path: "signals/stock-market", title: "Stock Market" },
  { path: "signals/trading-bot", title: "Trading Bot" },
  { path: "signals/bot-portfolios", title: "Bot Portfolios" },
];
export const listSubTraderHub: ISubNavigate[] = [
  { path: "traderhub", title: "Trader's Hub" },
  { path: "traderhub/gnosis-academy", title: "Gnosis Academy" },
  { path: "traderhub/forum", title: "Forums" },
];
export const listSubBlog: ISubNavigate[] = [
  { path: "blog", title: "Blog" },
  { path: "blog/news", title: "Gnosis Academy" },
  { path: "blog/knowledge-hub", title: "Forums" },
];
