/* ============================================================
 * 课程元数据：10 个模块 / 33 个精选章节
 * 每章 t=标题 s=副标题 f=主图表key(可选在图表字典中定义)
 * ============================================================ */
window.COURSE = {
  title: "经济学思维与现实世界",
  subtitle: "零基础系统自学 · 像经济学家一样思考",
  books: [
    { name: "薛兆丰经济学讲义", author: "薛兆丰", role: "主教材 · 稀缺、成本、产权与价格的中国现实视角" },
    { name: "The Economic Way of Thinking", author: "Heyne · Boettke · Prychitko", role: "思维骨架 · 边际、激励、交换与市场协调的严谨框架" },
    { name: "牛奶可乐经济学", author: "Robert H. Frank", role: "案例库 · 日常生活与商业现象背后的经济逻辑" }
  ],
  modules: [
    {
      n: 1, title: "认识经济学", subtitle: "从稀缺与选择出发，建立经济学的第一性原理",
      chapters: [
        { id: "m1c1", t: "什么是经济学？", s: "稀缺、选择与“看不见的”逻辑", f: "ppf" },
        { id: "m1c2", t: "机会成本", s: "一个选择的真实代价", f: "opp-cost" },
        { id: "m1c3", t: "经济学与日常生活", s: "像经济学家一样思考", f: null }
      ]
    },
    {
      n: 2, title: "经济学思维方式", subtitle: "掌握经济学家工具箱里的核心思维工具",
      chapters: [
        { id: "m2c1", t: "理性人与激励", s: "人们为什么会对激励做出反应", f: "incentive" },
        { id: "m2c2", t: "边际思维", s: "决策发生在边际上", f: "marginal" },
        { id: "m2c3", t: "沉没成本与交易成本", s: "决策中什么该忽略，什么该计入", f: "sunk" }
      ]
    },
    {
      n: 3, title: "市场、需求与供给", subtitle: "理解价格如何由千万人的计划共同决定",
      chapters: [
        { id: "m3c1", t: "需求", s: "替代品、边际价值与需求定律", f: "demand" },
        { id: "m3c2", t: "供给", s: "成本、边际机会成本与供给曲线", f: "supply" },
        { id: "m3c3", t: "供需均衡与价格形成", s: "市场如何协调千万人的计划", f: "equilibrium" },
        { id: "m3c4", t: "弹性与价格管制", s: "为什么限价会带来短缺与过剩", f: "price-control" }
      ]
    },
    {
      n: 4, title: "价格、竞争与市场机制", subtitle: "价格的信号功能、市场结构与失灵边界",
      chapters: [
        { id: "m4c1", t: "价格信号与资源配置", s: "价格如何传递分散的知识", f: "price-signal" },
        { id: "m4c2", t: "市场结构", s: "从完全竞争到垄断", f: "market-structure" },
        { id: "m4c3", t: "市场失灵", s: "外部性与公共物品", f: "externality" }
      ]
    },
    {
      n: 5, title: "产权、交易与合作", subtitle: "理解产权、交易成本与分工如何创造财富",
      chapters: [
        { id: "m5c1", t: "产权", s: "权利的三要素与产权保护", f: "property" },
        { id: "m5c2", t: "科斯定理与交易成本", s: "谁用得好就归谁", f: "coase" },
        { id: "m5c3", t: "比较优势与贸易", s: "分工为什么创造价值", f: "comparative" }
      ]
    },
    {
      n: 6, title: "企业、利润与商业世界", subtitle: "揭开企业、成本与定价的商业逻辑",
      chapters: [
        { id: "m6c1", t: "企业为何存在", s: "交易成本与企业的边界", f: "firm-boundary" },
        { id: "m6c2", t: "成本、利润与边际决策", s: "固定成本、可变成本与盈亏", f: "cost-curves" },
        { id: "m6c3", t: "定价策略与规模经济", s: "企业如何制定价格", f: "pricing" }
      ]
    },
    {
      n: 7, title: "收入、财富与社会分配", subtitle: "解释收入从何而来、差距为何形成",
      chapters: [
        { id: "m7c1", t: "工资与劳动力市场", s: "人力资本与收入的来源", f: "labor" },
        { id: "m7c2", t: "收入差距的形成", s: "边际生产力、风险与制度", f: "income-gap" },
        { id: "m7c3", t: "税收与再分配", s: "公平与效率的权衡", f: "tax" }
      ]
    },
    {
      n: 8, title: "政府与经济制度", subtitle: "厘清市场的边界与政府干预的功过",
      chapters: [
        { id: "m8c1", t: "为什么需要政府", s: "市场失灵与政府的角色", f: "gov-role" },
        { id: "m8c2", t: "政府干预的代价", s: "干预的边界与局限", f: "gov-failure" },
        { id: "m8c3", t: "经济制度与市场秩序", s: "市场经济与计划经济", f: "systems" }
      ]
    },
    {
      n: 9, title: "宏观经济学入门", subtitle: "建立对国民经济运行的基础认识（不涉复杂模型）",
      chapters: [
        { id: "m9c1", t: "GDP与经济增长", s: "如何衡量一个国家的产出", f: "gdp" },
        { id: "m9c2", t: "通货膨胀与货币", s: "钱为什么会变毛", f: "inflation" },
        { id: "m9c3", t: "失业与经济周期", s: "繁荣与萧条为何交替", f: "cycle" },
        { id: "m9c4", t: "财政与货币政策", s: "政府如何调控经济", f: "policy" }
      ]
    },
    {
      n: 10, title: "经济学观察现实世界", subtitle: "综合运用理论，独立分析真实问题",
      chapters: [
        { id: "m10c1", t: "为什么房价会不断变化？", s: "供需、预期、土地与政策的合力", f: "equilibrium" },
        { id: "m10c2", t: "为什么电影院的爆米花这么贵？", s: "捆绑、垄断与价格歧视", f: "pricing" },
        { id: "m10c3", t: "为什么“免费”服务往往并不免费？", s: "平台、注意力与信息不对称", f: "platform" },
        { id: "m10c4", t: "为什么经济增长不一定让所有人更富裕？", s: "分配、结构与增长的错觉", f: "income-gap" }
      ]
    }
  ]
};

/* 便于按 id 检索 */
window.COURSE_MAP = {};
(function () {
  COURSE.modules.forEach(function (m) {
    m.chapters.forEach(function (c) {
      c.module = m.n;
      c.moduleTitle = m.title;
      COURSE_MAP[c.id] = c;
    });
  });
})();

/* 全部章节的线性顺序 */
window.CHAPTER_ORDER = [];
(function () {
  COURSE.modules.forEach(function (m) {
    m.chapters.forEach(function (c) { CHAPTER_ORDER.push(c.id); });
  });
})();
