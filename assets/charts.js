/* ============================================================
 * 教学图表库 —— 纯 SVG，手机端自适应
 * 每个 FIGURES[key] = { title, caption, svg }
 * 配色与全站一致：深墨绿 #1f3a34 / 橙 #c1743f / 浅绿 #2d5149
 * ============================================================ */
(function () {
  var G = "#1f3a34", G2 = "#2d5149", O = "#c1743f", O2 = "#d99868",
      GRID = "#e3dfd3", TXT = "#4a514c", MUTED = "#8a908a", PAPER = "#fffdf8";
  var W = 400, H = 250;

  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

  // 坐标轴（原点在左下）
  function axes(x0, y0, xw, yh, xlabel, ylabel) {
    var s = '';
    // 网格
    for (var i=1;i<=4;i++){
      var gy = y0 - yh*i/5;
      s += '<line x1="'+x0+'" y1="'+gy+'" x2="'+(x0+xw)+'" y2="'+gy+'" stroke="'+GRID+'" stroke-width="1" stroke-dasharray="3 4"/>';
    }
    s += '<line x1="'+x0+'" y1="'+y0+'" x2="'+(x0+xw)+'" y2="'+y0+'" stroke="'+G+'" stroke-width="1.6"/>';
    s += '<line x1="'+x0+'" y1="'+y0+'" x2="'+x0+'" y2="'+(y0-yh)+'" stroke="'+G+'" stroke-width="1.6"/>';
    s += '<path d="M'+(x0+xw)+' '+(y0-4)+'l6 4-6 4" fill="'+G+'"/>';
    s += '<path d="M'+(x0-4)+' '+(y0-yh)+'l4-6 4 6" fill="'+G+'"/>';
    s += '<text x="'+(x0+xw+2)+'" y="'+(y0+18)+'" font-size="11" fill="'+TXT+'" text-anchor="end">'+esc(xlabel)+'</text>';
    s += '<text x="'+(x0-6)+'" y="'+(y0-yh-8)+'" font-size="11" fill="'+TXT+'">'+esc(ylabel)+'</text>';
    return s;
  }
  function line(x1,y1,x2,y2,color,w,dash){
    return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" stroke-width="'+(w||2.2)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' stroke-linecap="round"/>';
  }
  function poly(pts,color,w,dash){
    var d = pts.map(function(p,i){return (i?'L':'M')+p[0]+' '+p[1];}).join(' ');
    return '<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="'+(w||2.4)+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function dot(x,y,color,r){
    return '<circle cx="'+x+'" cy="'+y+'" r="'+(r||4)+'" fill="'+color+'" stroke="'+PAPER+'" stroke-width="1.5"/>';
  }
  function txt(x,y,s,opt){
    opt=opt||{};
    return '<text x="'+x+'" y="'+y+'" font-size="'+(opt.size||11)+'" fill="'+(opt.color||TXT)+'" text-anchor="'+(opt.anchor||'start')+'"'+(opt.weight?' font-weight="'+opt.weight+'"':'')+'>'+esc(s)+'</text>';
  }
  function wrap(title, body, caption){
    return { title:title, caption:caption, svg:'<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="'+esc(title)+'">'+body+'</svg>' };
  }

  var F = {};

  /* ---------- 生产可能性边界 PPF ---------- */
  F.ppf = function(){
    var x0=55,y0=205,xw=300,yh=160;
    var s = axes(x0,y0,xw,yh,"牛奶数量","大炮数量");
    var curve=[]; for(var i=0;i<=20;i++){var t=i/20;var x=x0+xw*t;var y=y0-yh*Math.sqrt(1-t*t);curve.push([x,y]);}
    s += poly(curve,G,2.6);
    s += dot(x0+xw*0.62, y0-yh*Math.sqrt(1-0.62*0.62), O,5);
    s += txt(x0+xw*0.62+8, y0-yh*Math.sqrt(1-0.62*0.62)-8,"在边界上：有效率",{color:O,weight:700});
    s += dot(x0+xw*0.32, y0-yh*0.45, MUTED,4);
    s += txt(x0+xw*0.32-6, y0-yh*0.45+18,"边界内：无效率",{color:MUTED});
    s += dot(x0+xw*0.78+14, y0-yh*0.55-10, MUTED,4);
    s += txt(x0+xw*0.78+2, y0-yh*0.55-16,"边界外：不可及",{color:MUTED});
    return wrap("生产可能性边界（PPF）", s,
      "<b>教学要点：</b>曲线上的点代表资源被充分、有效利用的组合；向外凸起的形状体现了<b>机会成本递增</b>——想多生产一单位大炮，需要放弃越来越多的牛奶。这条边界把“稀缺”变得可见：资源有限，选择有代价。");
  };

  /* ---------- 机会成本 ---------- */
  F['opp-cost'] = function(){
    var s='';
    s += txt(20,30,"你面对的选择：今晚的 3 小时",{size:12,weight:700,color:G});
    // 两条分支
    s += line(60,60,60,110,G2,2);
    s += line(60,110,150,110,G2,2); s += line(60,110,300,110,O,2);
    s += '<rect x="60" y="48" width="120" height="26" rx="7" fill="'+G+'" opacity="0.08"/>';
    s += txt(70,65,"选项 A：复习备考",{size:11,color:G,weight:700});
    s += '<rect x="150" y="96" width="120" height="28" rx="7" fill="'+G2+'" opacity="0.1"/>';
    s += txt(160,114,"收益：可能更高分",{size:10.5,color:G2});
    s += '<rect x="240" y="96" width="140" height="28" rx="7" fill="'+O+'" opacity="0.12"/>';
    s += txt(250,114,"放弃：兼职收入 300 元",{size:10.5,color:O});
    s += txt(20,160,"机会成本 = 被放弃的最佳替代选项的价值",{size:12,weight:700,color:O});
    s += txt(20,186,"若你选择了复习，这 300 元兼职收入就是复习的“真实代价”。",{size:11,color:TXT});
    s += txt(20,208,"注意：不是所有被放弃的选项之和，而只是“价值最高的那一个”。",{size:11,color:MUTED});
    return wrap("机会成本：选择的真实代价", s,
      "<b>教学要点：</b>成本不是你付出的钱，而是你为得到某物所放弃的<b>最高价值的其他选择</b>。理解这一点，才能明白为什么“免费”的东西往往并不免费，以及为什么经济学说“你的成本由别人决定”。");
  };

  /* ---------- 激励 ---------- */
  F.incentive = function(){
    var s='';
    var boxes=[
      {x:20,y:40,w:110,h:46,title:"激励改变",sub:"成本或收益",c:G},
      {x:150,y:40,w:110,h:46,title:"相对价格变",sub:"动机随之变",c:G2},
      {x:280,y:40,w:100,h:46,title:"行为改变",sub:"可预测",c:O}
    ];
    boxes.forEach(function(b){
      s+='<rect x="'+b.x+'" y="'+b.y+'" width="'+b.w+'" height="'+b.h+'" rx="9" fill="'+b.c+'" opacity="0.1" stroke="'+b.c+'" stroke-width="1.2"/>';
      s+=txt(b.x+b.w/2,b.y+20,b.title,{size:11,weight:700,color:b.c,anchor:"middle"});
      s+=txt(b.x+b.w/2,b.y+36,b.sub,{size:9.5,color:TXT,anchor:"middle"});
    });
    s+=line(132,63,148,63,O,2); s+='<path d="M148 63l-6-4v8z" fill="'+O+'"/>';
    s+=line(262,63,278,63,O,2); s+='<path d="M278 63l-6-4v8z" fill="'+O+'"/>';
    s+=txt(20,130,"同一条规律：人们会对激励做出反应",{size:12,weight:700,color:G});
    s+=txt(20,156,"• 提高违法惩罚 → 改变犯罪的预期成本",{size:11,color:TXT});
    s+=txt(20,178,"• 给老师按升学率付奖金 → 改变教学重点",{size:11,color:TXT});
    s+=txt(20,200,"• 汽油涨价 → 人们更倾向公共交通",{size:11,color:TXT});
    s+=txt(20,226,"政策设计的核心：预判人们会如何“回应”规则。",{size:11,color:O,weight:600});
    return wrap("激励机制：人们会对激励做出反应", s,
      "<b>教学要点：</b>激励是行为的“方向盘”。经济学不是说人只追求金钱，而是说当成本或收益变化时，人们通常会朝对自己有利的方向调整行为。许多政策失败的根源，正是忽略了人们的<b>反应</b>。");
  };

  /* ---------- 边际分析 ---------- */
  F.marginal = function(){
    var x0=55,y0=205,xw=300,yh=150;
    var s=axes(x0,y0,xw,yh,"产量 Q","成本 / 收益");
    // MC 上升曲线
    var mc=[]; for(var i=0;i<=10;i++){var x=x0+xw*i/10;var y=y0-yh*(0.15+0.7*Math.pow(i/10,1.7));mc.push([x,y]);}
    s+=poly(mc,O,2.6); s+=txt(x0+xw*0.72,y0-yh*0.62-10,"MC 边际成本",{size:10.5,color:O,weight:700});
    // MR 水平线
    var ymr=y0-yh*0.5;
    s+=line(x0,ymr,x0+xw,ymr,G2,2.4,"6 4"); s+=txt(x0+xw-70,ymr-8,"MR = 价格（常数）",{size:10.5,color:G2,weight:700});
    // 交点
    var xi=0; for(var j=0;j<mc.length-1;j++){if(mc[j][1]>=ymr&&mc[j+1][1]<=ymr){xi=mc[j][0];break;}}
    s+=dot(xi,ymr,O,5);
    s+=line(xi,ymr,xi,y0,MUTED,1,"3 3");
    s+=txt(xi+6,y0-8,"最优产量 Q*",{size:10.5,color:G,weight:700});
    return wrap("边际分析：决策发生在边际上", s,
      "<b>教学要点：</b>理性决策不是问“做不做”，而是问“<b>再做一单位</b>值不值”。当边际收益（MR）等于边际成本（MC）时达到最优：再多生产一单位就亏了，少生产一单位则错过盈利机会。这一工具贯穿消费、生产与定价。");
  };

  /* ---------- 沉没成本 ---------- */
  F.sunk = function(){
    var s='';
    s+=txt(20,30,"决策时，请忽略无法收回的支出",{size:12,weight:700,color:G});
    s+='<rect x="20" y="46" width="170" height="60" rx="10" fill="'+MUTED+'" opacity="0.12"/>';
    s+=txt(32,66,"已花掉的 100 元电影票",{size:11,weight:700,color:MUTED});
    s+=txt(32,86,"（无论去不去都收不回）",{size:10,color:MUTED});
    s+=txt(32,100,"= 沉没成本，与决策无关",{size:10,color:MUTED});
    s+=line(196,76,224,76,O,2); s+='<path d="M224 76l-6-4v8z" fill="'+O+'"/>';
    s+='<rect x="230" y="46" width="150" height="60" rx="10" fill="'+G+'" opacity="0.1" stroke="'+G+'" stroke-width="1.2"/>';
    s+=txt(242,66,"现在真正要问的是：",{size:10.5,color:G,weight:700});
    s+=txt(242,86,"接下来 2 小时，",{size:10.5,color:TXT});
    s+=txt(242,100,"我更想做什么？",{size:10.5,color:TXT});
    s+=txt(20,140,"正确思路：",{size:12,weight:700,color:G});
    s+=txt(20,164,"只比较“从现在往后”各选项的收益与成本。",{size:11,color:TXT});
    s+=txt(20,188,"误区：“来都来了”“票都买了” → 让沉没成本绑架了判断。",{size:11,color:O});
    s+=txt(20,214,"沉没成本越小的人，越容易做出理性选择。",{size:11,color:G2,weight:600});
    return wrap("沉没成本：别为打翻的牛奶哭泣", s,
      "<b>教学要点：</b>沉没成本是已经发生、无法收回的支出。理性的决策只应考虑<b>未来的</b>成本与收益。纠结于“已经投入了多少”，是普通人最常见的决策陷阱之一。");
  };

  /* ---------- 需求曲线 ---------- */
  F.demand = function(){
    var x0=55,y0=205,xw=300,yh=160;
    var s=axes(x0,y0,xw,yh,"需求量 Q","价格 P");
    s+=line(x0+40,y0-yh*0.86,x0+xw-30,y0-yh*0.14,G,2.6);
    s+=txt(x0+xw-120,y0-yh*0.28-10,"需求曲线 D",{size:11,color:G,weight:700});
    s+=dot(x0+130,y0-yh*0.6,O,4); s+=txt(x0+130+8,y0-yh*0.6-6,"涨价 → 需求量减少",{size:10,color:O});
    s+=txt(20,232,"价格 ↑ ⇒ 需求量 ↓ （沿曲线移动：需求量的变化）",{size:11,color:TXT,weight:600});
    return wrap("需求曲线与需求定律", s,
      "<b>教学要点：</b>其他条件不变时，价格越高，人们愿意且能够购买的数量越少——这就是需求定律。要注意区分：<b>价格变化</b>导致沿曲线的“需求量变化”；而收入、偏好等变化会导致整条曲线的“需求变化”。");
  };

  /* ---------- 供给曲线 ---------- */
  F.supply = function(){
    var x0=55,y0=205,xw=300,yh=160;
    var s=axes(x0,y0,xw,yh,"供给量 Q","价格 P");
    s+=line(x0+40,y0-yh*0.14,x0+xw-30,y0-yh*0.88,G,2.6);
    s+=txt(x0+xw-120,y0-yh*0.72-12,"供给曲线 S",{size:11,color:G,weight:700});
    s+=txt(20,232,"价格 ↑ ⇒ 供给量 ↑ （边际成本递增使曲线向右上倾斜）",{size:10.5,color:TXT,weight:600});
    return wrap("供给曲线与供给定律", s,
      "<b>教学要点：</b>价格越高，生产者愿意供给的数量越多。背后的原因是<b>边际成本递增</b>：要诱使生产者多供给，价格必须补偿不断上升的额外成本。供给曲线本质上是边际成本曲线的一部分。");
  };

  /* ---------- 供需均衡 ---------- */
  F.equilibrium = function(){
    var x0=55,y0=205,xw=300,yh=160;
    var s=axes(x0,y0,xw,yh,"数量 Q","价格 P");
    s+=line(x0+40,y0-yh*0.85,x0+xw-30,y0-yh*0.15,G,2.4); s+=txt(x0+xw-95,y0-yh*0.2-8,"D",{size:12,color:G,weight:700});
    s+=line(x0+40,y0-yh*0.15,x0+xw-30,y0-yh*0.85,O,2.4); s+=txt(x0+xw-95,y0-yh*0.8-8,"S",{size:12,color:O,weight:700});
    var ex=x0+xw*0.5, ey=y0-yh*0.5;
    s+=dot(ex,ey,G2,5);
    s+=line(ex,ey,ex,y0,MUTED,1,"3 3"); s+=line(x0,ey,ex,y0-yh,G2,1,"3 3");
    s+=txt(ex+6,ey-8,"均衡点 E",{size:11,color:G2,weight:700});
    s+=txt(x0+xw-2,y0+16,"均衡数量",{size:9.5,color:MUTED,anchor:"end"});
    return wrap("供需均衡：市场如何决定价格", s,
      "<b>教学要点：</b>价格会自发趋向供给量与需求量相等的那个点——均衡。价格高于均衡时出现<b>过剩</b>，卖者竞争压低价格；低于均衡时出现<b>短缺</b>，买者竞争抬高价格。无数人的分散决策通过价格被协调起来。");
  };

  /* ---------- 价格管制 ---------- */
  F['price-control'] = function(){
    var x0=55,y0=205,xw=300,yh=160;
    var s=axes(x0,y0,xw,yh,"数量 Q","价格 P");
    s+=line(x0+40,y0-yh*0.85,x0+xw-30,y0-yh*0.15,G,2.4);
    s+=line(x0+40,y0-yh*0.15,x0+xw-30,y0-yh*0.85,O,2.4);
    var ex=x0+xw*0.5, ey=y0-yh*0.5;
    s+=dot(ex,ey,MUTED,4); s+=txt(ex+5,ey-4,"均衡",{size:10,color:MUTED});
    // 限价（价格上限，低于均衡）
    var pc=y0-yh*0.7;
    s+=line(x0,pc,x0+xw,pc,O2,2,"5 3"); s+=txt(x0+4,pc-6,"政府限价 Pmax",{size:10.5,color:O,weight:700});
    // 求交
    var qd=x0+40+(pc-(y0-yh*0.85))/((y0-yh*0.15)-(y0-yh*0.85))*(xw-70);
    var qs=x0+40+(pc-(y0-yh*0.15))/((y0-yh*0.85)-(y0-yh*0.15))*(xw-70);
    s+=line(qd,pc,qd,y0,MUTED,1,"2 3"); s+=line(qs,pc,qs,y0,MUTED,1,"2 3");
    s+='<line x1="'+qs+'" y1="'+pc+'" x2="'+qd+'" y2="'+pc+'" stroke="'+O+'" stroke-width="6" opacity="0.35"/>';
    s+=txt((qs+qd)/2-30,pc+16,"短缺",{size:11,color:O,weight:700});
    return wrap("价格上限：为什么限价会造成短缺", s,
      "<b>教学要点：</b>当政府把价格压到均衡之下（如房租管制），需求量上升、供给量下降，缺口就是<b>短缺</b>。价格无法出清市场，排队、配给、黑市等非价格机制就会填补空缺——这是“看得见的”与“看不见的”后果。");
  };

  /* ---------- 价格信号 ---------- */
  F['price-signal'] = function(){
    var s='';
    var rows=[
      {y:34, t:"某地缺货", d:"价格上升的信号", c:O},
      {y:84, t:"价格上涨", d:"传递“这里稀缺”的信息", c:G2},
      {y:134, t:"逐利者响应", d:"把资源投入该领域", c:G},
      {y:184, t:"供给增加", d:"稀缺缓解，价格回落", c:G2}
    ];
    rows.forEach(function(r,i){
      s+='<rect x="20" y="'+r.y+'" width="360" height="40" rx="9" fill="'+r.c+'" opacity="0.10"/>';
      s+=txt(34,r.y+25,r.t,{size:12,weight:700,color:r.c});
      s+=txt(170,r.y+25,r.d,{size:10.5,color:TXT});
      if(i<rows.length-1){ s+=line(200,r.y+41,200,r.y+43+6,O,2); s+='<path d="M200 '+(r.y+51)+'l-5-6h10z" fill="'+O+'"/>'; }
    });
    return wrap("价格信号：资源如何被引导", s,
      "<b>教学要点：</b>价格不只是数字，更是<b>信号</b>。它把“哪里稀缺、哪里急需”的信息传递给千千万万互不相识的人，引导资源流向最有价值的地方。这个协调过程不需要任何中央计划者——这正是亚当·斯密“看不见的手”的含义。");
  };

  /* ---------- 市场结构 ---------- */
  F['market-structure'] = function(){
    var s='';
    var data=[
      {n:"完全竞争", f:"企业众多、产品同质", e:"低", w:340, c:G2},
      {n:"垄断竞争", f:"企业较多、产品有差异", e:"中低", w:285, c:G},
      {n:"寡头", f:"少数几家主导", e:"中高", w:210, c:O},
      {n:"垄断", f:"唯一卖者、无近似替代品", e:"高", w:120, c:O2}
    ];
    data.forEach(function(r,i){
      var y=32+i*48;
      s+=txt(20,y+16,r.n,{size:11,weight:700,color:r.c});
      s+='<rect x="120" y="'+ (y+2) +'" width="'+r.w+'" height="20" rx="5" fill="'+r.c+'" opacity="0.75"/>';
      s+=txt(126,y+16,r.f,{size:9.5,color:"#fff"});
      s+=txt(372,y+16,"定价权:"+r.e,{size:9.5,color:MUTED,anchor:"end"});
    });
    s+=txt(20,236,"横条长度示意：企业数量（左多右少），定价权由弱到强。",{size:10,color:TXT});
    return wrap("四种市场结构", s,
      "<b>教学要点：</b>市场结构由“<b>企业数量</b>”和“<b>产品差异</b>”决定，并直接影响定价权。从完全竞争到垄断，单个企业控制价格的能力逐步增强。理解这个光谱，才能分析不同行业的定价行为与竞争策略。");
  };

  /* ---------- 外部性 ---------- */
  F.externality = function(){
    var x0=55,y0=205,xw=300,yh=160;
    var s=axes(x0,y0,xw,yh,"产量 Q","成本 / 收益");
    // MPC 与 MSC
    s+=line(x0+40,y0-yh*0.78,x0+xw-30,y0-yh*0.18,G2,2.2); s+=txt(x0+xw-105,y0-yh*0.2+2,"MPC 私人成本",{size:9.5,color:G2});
    s+=line(x0+40,y0-yh*0.62,x0+xw-30,y0-yh*0.02,O,2.2); s+=txt(x0+xw-105,y0-yh*0.06-8,"MSC 社会成本",{size:9.5,color:O});
    var ymr=y0-yh*0.5;
    s+=line(x0,ymr,x0+xw,ymr,G,1.8,"5 4"); s+=txt(x0+4,ymr-6,"价格=私人收益",{size:9.5,color:G});
    s+=txt(20,234,"市场产量由 MPC 决定，高于社会最优 → 过量生产（如污染）",{size:10,color:TXT,weight:600});
    return wrap("负外部性：市场为何会过量生产", s,
      "<b>教学要点：</b>当生产给第三方带来成本（污染），<b>社会成本高于私人成本</b>。企业只按自己的成本决策，导致产量超过社会最优水平。解决办法包括庇古税、排污权交易或明晰产权——这引出科斯定理与政府干预的讨论。");
  };

  /* ---------- 产权 ---------- */
  F.property = function(){
    var s='';
    s+=txt(20,28,"产权是一束权利（Bundle of Rights）",{size:12,weight:700,color:G});
    var rights=[
      {y:46,t:"使用权",d:"决定如何使用该资产",c:G},
      {y:92,t:"收益权",d:"享有资产带来的收益",c:G2},
      {y:138,t:"转让权",d:"出售或出租给他人",c:O}
    ];
    rights.forEach(function(r){
      s+='<rect x="20" y="'+r.y+'" width="360" height="38" rx="9" fill="'+r.c+'" opacity="0.1" stroke="'+r.c+'" stroke-width="1"/>';
      s+=txt(34,r.y+24,r.t,{size:12,weight:700,color:r.c});
      s+=txt(130,r.y+24,r.d,{size:10.5,color:TXT});
    });
    s+=txt(20,206,"三者越完整、越受保护，资源越容易被有效利用和交易。",{size:11,color:TXT});
    s+=txt(20,230,"科斯：清晰的产权是市场交易与资源配置的前提。",{size:11,color:O,weight:600});
    return wrap("产权：权利的三要素", s,
      "<b>教学要点：</b>产权不是单一的“所有权”，而是一束权利：使用、收益、转让。当这些权利界定清晰且受到保护时，人们才有动力投资、交易和改善资源——这是长期经济繁荣的制度基础。");
  };

  /* ---------- 科斯定理 ---------- */
  F.coase = function(){
    var s='';
    s+=txt(20,28,"科斯定理：只要交易成本足够低…",{size:12,weight:700,color:G});
    s+='<rect x="20" y="44" width="360" height="46" rx="10" fill="'+G+'" opacity="0.08"/>';
    s+=txt(34,63,"产权明确 + 交易成本低",{size:11.5,weight:700,color:G});
    s+=txt(34,81,"→ 私人之间通过谈判达成有效率的方案",{size:10.5,color:TXT});
    s+=line(200,92,200,110,O,2); s+='<path d="M200 110l-5-6h10z" fill="'+O+'"/>';
    s+='<rect x="20" y="116" width="360" height="46" rx="10" fill="'+O+'" opacity="0.1"/>';
    s+=txt(34,135,"结果：资源流向“用得最好”的一方",{size:11.5,weight:700,color:O});
    s+=txt(34,153,"无论初始产权归谁，最终配置趋于一致",{size:10.5,color:TXT});
    s+=txt(20,196,"关键条件：",{size:11,weight:700,color:G});
    s+=txt(20,218,"人少、权利清、谈判易 → 科斯解可行；人数众多 → 交易成本高，需制度/政府介入。",{size:10,color:TXT});
    return wrap("科斯定理及其应用条件", s,
      "<b>教学要点：</b>科斯的核心洞见是：只要产权清晰且交易成本足够低，私人谈判就能达成资源的有效配置，且结果与初始产权归属无关。但现实中交易成本往往很高（人多、谈判难），这正是企业和政府存在的理由。");
  };

  /* ---------- 比较优势 ---------- */
  F.comparative = function(){
    var s='';
    s+=txt(20,26,"比较优势看“机会成本”，而非绝对能力",{size:11.5,weight:700,color:G});
    s+=txt(20,52,"（生产 1 单位产品所需放弃的另一种产品）",{size:10,color:MUTED});
    // 表格
    var cols=[20,150,275], rows=[76,108,140];
    s+='<rect x="20" y="76" width="360" height="32" rx="6" fill="'+G+'" opacity="0.12"/>';
    s+=txt(30,96,"",{size:10});
    s+=txt(150,96,"电脑的机会成本",{size:10,weight:700,color:G,anchor:"middle"});
    s+=txt(295,96,"小麦的机会成本",{size:10,weight:700,color:G,anchor:"middle"});
    s+=txt(30,126,"A 国",{size:11,weight:700,color:G2});
    s+=txt(150,126,"1 单位小麦",{size:10.5,color:TXT,anchor:"middle"});
    s+=txt(295,126,"1 台电脑",{size:10.5,color:TXT,anchor:"middle"});
    s+=txt(30,158,"B 国",{size:11,weight:700,color:O});
    s+=txt(150,158,"2 单位小麦",{size:10.5,color:TXT,anchor:"middle"});
    s+=txt(295,158,"0.5 台电脑",{size:10.5,color:TXT,anchor:"middle"});
    s+=txt(20,192,"A 国生产电脑机会成本更低 → 专长电脑",{size:10.5,color:G2,weight:600});
    s+=txt(20,214,"B 国生产小麦机会成本更低 → 专长小麦 → 贸易使双方受益",{size:10.5,color:O,weight:600});
    return wrap("比较优势：贸易为什么创造财富", s,
      "<b>教学要点：</b>即使 A 国在两种产品上都更强（绝对优势），双方仍能通过贸易受益——因为关键是<b>机会成本的相对差异</b>。各国专注自己机会成本更低的产业，总产出增加，再通过交换共享成果。这是分工与国际贸易的基石。");
  };

  /* ---------- 企业边界 ---------- */
  F['firm-boundary'] = function(){
    var s='';
    s+=txt(20,30,"同一笔交易：市场 vs 企业内部",{size:11.5,weight:700,color:G});
    s+='<rect x="20" y="46" width="160" height="70" rx="10" fill="'+G2+'" opacity="0.1" stroke="'+G2+'" stroke-width="1"/>';
    s+=txt(100,64,"通过市场",{size:11,weight:700,color:G2,anchor:"middle"});
    s+=txt(34,86,"• 找供应商、议价",{size:9.5,color:TXT});
    s+=txt(34,104,"• 签合同、监督",{size:9.5,color:TXT});
    s+=txt(20,140,"交易成本高",{size:10,color:O,anchor:"middle"});
    s+='<rect x="220" y="46" width="160" height="70" rx="10" fill="'+O+'" opacity="0.1" stroke="'+O+'" stroke-width="1"/>';
    s+=txt(300,64,"纳入企业内部",{size:11,weight:700,color:O,anchor:"middle"});
    s+=txt(234,86,"• 管理、指挥",{size:9.5,color:TXT});
    s+=txt(234,104,"• 组织成本上升",{size:9.5,color:TXT});
    s+=txt(300,140,"管理成本高",{size:10,color:O,anchor:"middle"});
    s+=txt(20,178,"企业的边界 = 市场交易成本 = 内部管理成本 的那一点",{size:11,weight:700,color:G});
    s+=txt(20,206,"交易成本↓ → 更依赖市场；管理成本↓（如信息技术）→ 企业可更大。",{size:10,color:TXT});
    return wrap("企业为何存在：交易成本与边界", s,
      "<b>教学要点：</b>科斯追问：既然市场如此有效，为什么还有企业？答案是<b>交易成本</b>。当通过市场组织一笔交易的成本高于在企业内部指挥的成本时，企业就出现了。企业的边界由两种成本的权衡决定。");
  };

  /* ---------- 成本曲线 ---------- */
  F['cost-curves'] = function(){
    var x0=55,y0=205,xw=300,yh=155;
    var s=axes(x0,y0,xw,yh,"产量 Q","成本");
    // ATC U形
    var atc=[]; for(var i=0;i<=20;i++){var t=i/20;var x=x0+xw*t;var y=y0-yh*(0.35+0.42*Math.pow(2*t-1,2));atc.push([x,y]);}
    s+=poly(atc,G2,2.4); s+=txt(x0+xw-95,y0-yh*0.35-14,"ATC 平均总成本",{size:10,color:G2,weight:700});
    // MC 上升，穿过 ATC 最低点
    var mc=[]; for(var i=0;i<=20;i++){var t=i/20;var x=x0+xw*t;var y=y0-yh*(0.12+0.62*Math.pow(t,1.6));mc.push([x,y]);}
    s+=poly(mc,O,2.4); s+=txt(x0+xw-70,y0-yh*0.6-8,"MC",{size:10,color:O,weight:700});
    return wrap("企业的成本曲线", s,
      "<b>教学要点：</b>平均总成本（ATC）通常呈 U 形：初期因<b>规模经济</b>而下降，后期因管理协调困难而上升。<b>边际成本（MC）穿过 ATC 的最低点</b>——这是重要的数学与直觉关系，也是企业确定最优产量的关键。");
  };

  /* ---------- 定价 ---------- */
  F.pricing = function(){
    var s='';
    s+=txt(20,28,"定价的三种常见逻辑",{size:11.5,weight:700,color:G});
    var items=[
      {y:44,t:"成本加成定价",d:"价格 = 成本 + 目标利润（简单，但忽略需求）",c:G2},
      {y:100,t:"需求导向 / 价格歧视",d:"按顾客愿付价格分层（学生票、峰值定价）",c:O},
      {y:156,t:"竞争与价值定价",d:"参照对手并考虑顾客感知价值",c:G}
    ];
    items.forEach(function(it){
      s+='<rect x="20" y="'+it.y+'" width="360" height="48" rx="10" fill="'+it.c+'" opacity="0.09"/>';
      s+=txt(34,it.y+21,it.t,{size:11.5,weight:700,color:it.c});
      s+=txt(34,it.y+38,it.d,{size:9.8,color:TXT});
    });
    s+=txt(20,228,"规模经济下，销量越大单位成本越低，企业有能力以更低价格竞争。",{size:10,color:TXT});
    return wrap("企业如何制定价格", s,
      "<b>教学要点：</b>合理的定价要同时考虑<b>成本、需求与竞争</b>。价格歧视（对相同产品收取不同价格）并不总是坏事——它能把消费者剩余转化为生产者剩余，有时还能让原本买不起的人获得服务（如学生折扣）。");
  };

  /* ---------- 劳动力市场 ---------- */
  F.labor = function(){
    var x0=55,y0=205,xw=300,yh=155;
    var s=axes(x0,y0,xw,yh,"就业量 L","工资 W");
    s+=line(x0+40,y0-yh*0.82,x0+xw-30,y0-yh*0.12,G,2.4); s+=txt(x0+xw-70,y0-yh*0.18-8,"劳动需求 D",{size:10,color:G,weight:700});
    s+=line(x0+40,y0-yh*0.15,x0+xw-30,y0-yh*0.85,O,2.4); s+=txt(x0+xw-70,y0-yh*0.8-8,"劳动供给 S",{size:10,color:O,weight:700});
    var ex=x0+xw*0.5,ey=y0-yh*0.5; s+=dot(ex,ey,G2,5); s+=txt(ex+6,ey-8,"均衡工资",{size:10.5,color:G2,weight:700});
    return wrap("劳动力市场与工资的决定", s,
      "<b>教学要点：</b>工资由劳动的<b>供求</b>决定，其深层基础是劳动者的<b>边际生产率</b>：雇主愿意支付的工资不会长期超过工人创造的额外价值。教育、技能（人力资本）通过提高生产率推高工资。");
  };

  /* ---------- 收入差距 ---------- */
  F['income-gap'] = function(){
    var s='';
    s+=txt(20,26,"收入差距的几类主要来源",{size:11.5,weight:700,color:G});
    var items=[
      {y:42,t:"人力资本差异",d:"教育、技能、经验不同 → 生产率不同",c:G2},
      {y:94,t:"风险与回报",d:"承担风险、不确定性获得溢价",c:O},
      {y:146,t:"制度与市场力量",d:"垄断、产权、税收与再分配政策",c:G}
    ];
    items.forEach(function(it){
      s+='<rect x="20" y="'+it.y+'" width="360" height="44" rx="9" fill="'+it.c+'" opacity="0.09"/>';
      s+=txt(34,it.y+19,it.t,{size:11,weight:700,color:it.c});
      s+=txt(34,it.y+35,it.d,{size:9.8,color:TXT});
    });
    s+=txt(20,216,"差距本身不是问题，关键在于机会是否公平、分配是否被制度扭曲。",{size:10,color:TXT,weight:600});
    return wrap("收入差距是如何形成的", s,
      "<b>教学要点：</b>收入差距源于生产率差异、人力资本、风险承担以及制度安排。经济学不预设“差距必然坏”——它更关心差距的<b>来源</b>：是源于创造价值，还是源于垄断与寻租？这决定了应对方式。");
  };

  /* ---------- 税收 ---------- */
  F.tax = function(){
    var x0=55,y0=205,xw=300,yh=155;
    var s=axes(x0,y0,xw,yh,"数量 Q","价格 P");
    s+=line(x0+40,y0-yh*0.85,x0+xw-30,y0-yh*0.15,G,2.2);
    s+=line(x0+40,y0-yh*0.15,x0+xw-30,y0-yh*0.85,O,2.2);
    var py=y0-yh*0.45, pB=y0-yh*0.62, pS=y0-yh*0.28;
    s+=line(x0,py,x0+xw,py,MUTED,1.4,"4 3");
    s+=line(x0,pB,x0+xw,pB,G2,1.6,"5 3"); s+=line(x0,pS,x0+xw,pS,O,1.6,"5 3");
    s+='<rect x="'+(x0+xw-8)+'" y="'+pS+'" width="8" height="'+(pB-pS)+'" fill="'+O+'" opacity="0.3"/>';
    s+=txt(x0+4,py-6,"无税价格",{size:9.5,color:MUTED});
    s+=txt(x0+4,pB-6,"买者付",{size:9.5,color:G2});
    s+=txt(x0+4,pS-6,"卖者得",{size:9.5,color:O});
    s+=txt(x0+xw-14,(pB+pS)/2+4,"税楔",{size:9.5,color:O,anchor:"end",weight:700});
    return wrap("税收的负担：税收楔子", s,
      "<b>教学要点：</b>法定由谁缴税不重要，真正重要的是<b>税负归宿</b>。税收像一枚楔子插在买卖价格之间；弹性较小的一方承担更多税负。税收还会抑制交易量，造成“超额负担”——这是公平与效率权衡的核心。");
  };

  /* ---------- 政府角色 ---------- */
  F['gov-role'] = function(){
    var s='';
    s+=txt(20,26,"市场经济中政府的主要职能",{size:11.5,weight:700,color:G});
    var items=[
      {y:42,t:"守护者",d:"保护产权、维护合约与竞争秩序",c:G},
      {y:90,t:"矫正者",d:"治理外部性、提供公共物品",c:G2},
      {y:138,t:"再分配者",d:"税收与转移支付，调节收入差距",c:O},
      {y:186,t:"稳定者",d:"熨平经济周期、管理通胀与就业",c:O2}
    ];
    items.forEach(function(it){
      s+='<rect x="20" y="'+it.y+'" width="360" height="40" rx="9" fill="'+it.c+'" opacity="0.09"/>';
      s+=txt(34,it.y+25,it.t,{size:11.5,weight:700,color:it.c});
      s+=txt(118,it.y+25,it.d,{size:10,color:TXT});
    });
    return wrap("政府在市场经济中的角色", s,
      "<b>教学要点：</b>政府的首要职责是<b>界定和保护产权、维护竞争规则</b>，其次才是矫正市场失灵与再分配。区分“守夜人”职能与“干预者”职能，是判断政府该不该介入的第一步。");
  };

  /* ---------- 政府失灵 ---------- */
  F['gov-failure'] = function(){
    var s='';
    s+=txt(20,26,"“市场会失灵，政府也会”",{size:11.5,weight:700,color:G});
    var items=[
      {y:42,t:"信息问题",d:"政府不掌握分散的局部知识，决策易失真",c:O},
      {y:94,t:"激励扭曲",d:"官僚缺乏利润信号，寻租与浪费可能出现",c:O2},
      {y:146,t:"意外后果",d:"好意的政策常引发人们的行为反应",c:G2}
    ];
    items.forEach(function(it){
      s+='<rect x="20" y="'+it.y+'" width="360" height="44" rx="9" fill="'+it.c+'" opacity="0.09"/>';
      s+=txt(34,it.y+19,it.t,{size:11,weight:700,color:it.c});
      s+=txt(34,it.y+35,it.d,{size:9.8,color:TXT});
    });
    s+=txt(20,216,"关键不是“要不要干预”，而是“哪一种失灵的成本更低”。",{size:10,color:TXT,weight:600});
    return wrap("政府干预的局限：政府失灵", s,
      "<b>教学要点：</b>公共选择学派提醒我们：政府并非全知全能的仁慈之手。信息缺失、激励扭曲和寻租会使干预产生副作用。因此判断干预与否，应<b>比较两种方案的成本</b>，而非在市场失败时自动求助于政府。");
  };

  /* ---------- 经济制度 ---------- */
  F.systems = function(){
    var s='';
    s+=txt(20,26,"两种极端制度与现实的混合",{size:11.5,weight:700,color:G});
    s+='<line x1="40" y1="70" x2="360" y2="70" stroke="'+GRID+'" stroke-width="3"/>';
    s+=txt(40,54,"市场主导",{size:11,weight:700,color:O,anchor:"start"});
    s+=txt(360,54,"计划主导",{size:11,weight:700,color:G2,anchor:"end"});
    s+=dot(110,70,O,6); s+=txt(110,90,"自由市场",{size:9.5,color:O,anchor:"middle"});
    s+=dot(230,70,G2,6); s+=txt(230,90,"混合经济",{size:9.5,color:G2,anchor:"middle"});
    s+=dot(340,70,G,6); s+=txt(340,90,"计划经济",{size:9.5,color:G,anchor:"middle"});
    s+=txt(20,130,"核心差异：",{size:11,weight:700,color:G});
    s+=txt(20,154,"• 决策权分散还是集中",{size:10.5,color:TXT});
    s+=txt(20,176,"• 靠价格信号还是行政指令配置资源",{size:10.5,color:TXT});
    s+=txt(20,198,"• 产权私有还是公有",{size:10.5,color:TXT});
    s+=txt(20,226,"现实中不存在纯粹的一端，所有国家都落在光谱某处。",{size:10,color:O,weight:600});
    return wrap("市场经济与计划经济", s,
      "<b>教学要点：</b>市场经济靠价格信号分散决策，计划经济靠行政指令集中决策。两者的核心分歧是<b>知识问题</b>：分散在千万人手中的局部知识，能否被一个中央计划者掌握？现实中的国家都处于两者之间的混合状态。");
  };

  /* ---------- GDP ---------- */
  F.gdp = function(){
    var s='';
    s+=txt(20,26,"GDP：一个国家一年内的最终产出",{size:11.5,weight:700,color:G});
    s+=txt(20,52,"三种观察角度（理论上相等）",{size:10,color:MUTED});
    var items=[
      {y:70,t:"生产法",d:"总产出 − 中间投入 = 增加值之和",c:G2},
      {y:122,t:"收入法",d:"工资 + 利息 + 租金 + 利润",c:O},
      {y:174,t:"支出法",d:"消费 + 投资 + 政府购买 + 净出口",c:G}
    ];
    items.forEach(function(it){
      s+='<rect x="20" y="'+it.y+'" width="360" height="44" rx="9" fill="'+it.c+'" opacity="0.09"/>';
      s+=txt(34,it.y+27,it.t,{size:11.5,weight:700,color:it.c});
      s+=txt(118,it.y+27,it.d,{size:10,color:TXT});
    });
    s+=txt(20,238,"Y = C + I + G + (X − M)",{size:12,color:O,weight:700,anchor:"middle"});
    return wrap("GDP 及其核算", s,
      "<b>教学要点：</b>GDP 衡量一个国家在一定时期内生产的最终产品与服务的市场价值。从支出法看，它由消费、投资、政府购买和净出口构成。GDP 是重要的产出指标，但<b>不等于幸福</b>——它不衡量收入分配、闲暇与环境质量。");
  };

  /* ---------- 通货膨胀 ---------- */
  F.inflation = function(){
    var x0=55,y0=205,xw=300,yh=155;
    var s=axes(x0,y0,xw,yh,"时间","物价水平 P");
    var pts=[]; for(var i=0;i<=12;i++){var x=x0+xw*i/12;var y=y0-yh*(0.1+0.7*Math.pow(i/12,1.5));pts.push([x,y]);}
    s+=poly(pts,O,2.6);
    s+=txt(x0+xw-100,y0-yh*0.55-12,"物价水平持续上涨",{size:10.5,color:O,weight:700});
    s+=txt(20,234,"通胀率 = 物价水平的增长率；钱的购买力随之下降",{size:10,color:TXT,weight:600});
    return wrap("通货膨胀：钱为什么会变毛", s,
      "<b>教学要点：</b>通货膨胀指物价总水平的持续上涨，本质是<b>货币购买力的下降</b>。温和通胀常与货币供给增长有关（“过多货币追逐过少商品”）。通胀会扭曲价格信号，并对不同群体产生不同影响——固定收入者和债权人往往受损。");
  };

  /* ---------- 经济周期 ---------- */
  F.cycle = function(){
    var x0=40,y0=150,xw=330,yh=110;
    var s='<line x1="'+x0+'" y1="'+y0+'" x2="'+(x0+xw)+'" y2="'+y0+'" stroke="'+G+'" stroke-width="1.4"/>';
    s+=txt(x0+xw,y0+16,"时间 →",{size:10,color:MUTED,anchor:"end"});
    var pts=[]; for(var i=0;i<=60;i++){var t=i/60;var x=x0+xw*t;var y=y0-24*Math.sin(t*3*Math.PI)-10*Math.sin(t*7*Math.PI);pts.push([x,y]);}
    s+=poly(pts,O,2.2);
    s+=line(x0,y0-2,x0+xw,y0-2,G2,1,"4 4");
    s+=txt(46,22,"产出围绕长期趋势波动",{size:11,weight:700,color:G});
    s+=txt(46,42,"波峰：繁荣 / 过热   波谷：衰退 / 萧条",{size:10,color:TXT});
    s+=txt(20,228,"失业率与经济周期高度相关：衰退时需求下降，企业减产裁员。",{size:10,color:TXT});
    return wrap("经济周期：繁荣与萧条的交替", s,
      "<b>教学要点：</b>经济不会沿直线增长，而是围绕趋势上下波动：繁荣、衰退、萧条、复苏循环出现。衰退时总需求不足、失业上升。理解周期有助于明白为何需要财政与货币政策的“逆周期”调节。");
  };

  /* ---------- 政策 ---------- */
  F.policy = function(){
    var s='';
    s+=txt(20,26,"两类宏观调控工具",{size:11.5,weight:700,color:G});
    s+='<rect x="20" y="42" width="170" height="120" rx="11" fill="'+G2+'" opacity="0.09" stroke="'+G2+'" stroke-width="1"/>';
    s+=txt(105,64,"财政政策",{size:12,weight:700,color:G2,anchor:"middle"});
    s+=txt(34,88,"政府税收与支出",{size:10,color:TXT});
    s+=txt(34,110,"• 减税 / 增支 → 刺激",{size:9.8,color:TXT});
    s+=txt(34,130,"• 加税 / 减支 → 降温",{size:9.8,color:TXT});
    s+=txt(34,150,"（由政府制定）",{size:9.5,color:MUTED});
    s+='<rect x="210" y="42" width="170" height="120" rx="11" fill="'+O+'" opacity="0.09" stroke="'+O+'" stroke-width="1"/>';
    s+=txt(295,64,"货币政策",{size:12,weight:700,color:O,anchor:"middle"});
    s+=txt(224,88,"央行调节货币与利率",{size:10,color:TXT});
    s+=txt(224,110,"• 降息 / 放水 → 刺激",{size:9.8,color:TXT});
    s+=txt(224,130,"• 加息 / 收紧 → 降温",{size:9.8,color:TXT});
    s+=txt(224,150,"（由中央银行执行）",{size:9.5,color:MUTED});
    s+=txt(20,196,"逆周期调节：衰退时扩张、过热时收紧，目标为稳增长与控通胀。",{size:10.5,color:TXT,weight:600});
    s+=txt(20,222,"但政策存在时滞，且可能带来副作用（如债务、资产泡沫）。",{size:10,color:O,weight:600});
    return wrap("财政政策与货币政策", s,
      "<b>教学要点：</b>政府用财政政策（税收与支出）和货币政策（货币供给与利率）来熨平经济周期。衰退时扩张需求，过热时收紧。两者的效果受<b>时滞</b>与预期影响，并非精确可控的旋钮。");
  };

  /* ---------- 平台经济 ---------- */
  F.platform = function(){
    var s='';
    s+=txt(20,26,"“免费”平台的真实交易结构",{size:11.5,weight:700,color:G});
    s+='<rect x="20" y="44" width="150" height="48" rx="9" fill="'+G2+'" opacity="0.1"/>';
    s+=txt(95,63,"用户",{size:11,weight:700,color:G2,anchor:"middle"});
    s+=txt(95,80,"付出：时间与注意力",{size:9.5,color:TXT,anchor:"middle"});
    s+='<rect x="230" y="44" width="150" height="48" rx="9" fill="'+O+'" opacity="0.1"/>';
    s+=txt(305,63,"平台",{size:11,weight:700,color:O,anchor:"middle"});
    s+=txt(305,80,"变现：广告 / 数据",{size:9.5,color:TXT,anchor:"middle"});
    s+=line(172,68,228,68,O,2); s+='<path d="M228 68l-6-4v8z" fill="'+O+'"/>';
    s+=txt(20,124,"双边市场：一端免费，往往是为了把这一端“补贴”到足够大，",{size:10.5,color:TXT});
    s+=txt(20,146,"再向另一端（广告主、商家）收费——这叫交叉补贴。",{size:10.5,color:TXT});
    s+=txt(20,180,"你不是顾客，而是产品：",{size:11,weight:700,color:O});
    s+=txt(20,202,"你的注意力被打包出售给广告主；你的数据成为平台资产。",{size:10,color:TXT});
    s+=txt(20,226,"警惕：信息不对称 + 网络效应，可能让“免费”最终变得昂贵。",{size:10,color:G,weight:600});
    return wrap("“免费”服务的经济学", s,
      "<b>教学要点：</b>在双边平台市场，向一端免费是一种策略：用免费服务吸引海量用户，再把用户注意力与数据变现。若你不付钱，你往往就是<b>被出售的“产品”</b>。网络效应还会让平台越做越大、切换成本越来越高。");
  };

  window.FIGURES = F;
})();
