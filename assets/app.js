/* ============================================================
 * 应用主逻辑：路由 / 渲染 / 搜索 / 进度 / 字号 / 交互
 * ============================================================ */
(function () {
  "use strict";
  var app = document.getElementById("app");
  var LS_READ = "eco_read_v1", LS_FONT = "eco_font_v1", LS_POS = "eco_pos_v1";

  /* ---------- 工具 ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function getJSON(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch(e){ return d; } }
  function setJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }

  var readSet = {};
  (function(){ (getJSON(LS_READ, []) || []).forEach(function(id){ readSet[id] = true; }); })();
  function markRead(id){ if(!readSet[id]){ readSet[id]=true; setJSON(LS_READ, Object.keys(readSet)); } }

  var fontStep = getJSON(LS_FONT, 0); // -2..3
  var FONT_BASE = 17;
  function applyFont(){
    document.documentElement.style.setProperty("--font-size", (FONT_BASE + fontStep) + "px");
    var pv = $("fontPreview"); if(pv) pv.innerHTML = "当前字号 <b>"+(FONT_BASE+fontStep)+"</b>px";
  }
  applyFont();

  /* ---------- 章节数据访问 ---------- */
  function getData(id){ return (window.CHAPTER_DATA && window.CHAPTER_DATA[id]) || null; }

  /* ---------- 渲染：首页 ---------- */
  function renderHome(){
    var modsHtml = "";
    COURSE.modules.forEach(function(m){
      var readCount = m.chapters.filter(function(c){ return readSet[c.id]; }).length;
      modsHtml += '<div class="path-node">'
        + '<div class="path-badge">'+m.n+'</div>'
        + '<div class="path-content">'
        + '<div class="path-title">'+esc(m.title)+'</div>'
        + '<div class="path-sub">'+esc(m.subtitle)+'</div>'
        + '<div class="path-chapters">'+m.chapters.map(function(c){
            return (readSet[c.id] ? "✓ " : "") + esc(c.t);
          }).join(" · ")+'</div>'
        + '</div></div>';
    });

    var booksHtml = COURSE.books.map(function(b){
      return '<div class="book-item"><div class="book-spine"></div><div class="book-body">'
        + '<div class="book-name">《'+esc(b.name)+'》</div>'
        + '<div class="book-author">'+esc(b.author)+'</div>'
        + '<div class="book-role">'+esc(b.role)+'</div>'
        + '</div></div>';
    }).join("");

    app.innerHTML =
      '<section class="hero">'
      + '<div class="hero-kicker">A SYSTEMATIC SELF-STUDY COURSE</div>'
      + '<h1>像经济学家一样<br><em>思考</em>这个现实世界</h1>'
      + '<div class="hero-sub">零基础系统自学 · 10 个模块 · 33 个精选章节</div>'
      + '<p class="hero-desc">这不是一套让你背诵定义的学习材料，而是一套思维训练。你将学会用<b style="color:var(--green)">机会成本、边际分析、激励、供需与价格</b>等工具，独立分析房价、定价、收入、平台经济等真实问题。内容融合三本经典著作，彼此互补，成一完整体系。</p>'
      + '</section>'

      + '<div class="goal-strip"><div class="gs-label">完成课程后，你将能够</div>'
      + '<p>理解经济学的核心概念与研究方法；掌握<strong>机会成本、边际分析、激励机制</strong>等思维工具；看透价格形成、市场竞争与政府干预的逻辑；并最终<strong>运用经济学原理独立分析日常与现实社会问题</strong>。</p></div>'

      + '<div class="section-head"><h2>三本参考书</h2><div class="sh-line"></div><span class="sh-note">互补的知识来源</span></div>'
      + '<div class="books">'+booksHtml+'</div>'

      + '<div class="section-head"><h2>学习路径</h2><div class="sh-line"></div><span class="sh-note">10 个模块</span></div>'
      + '<p class="path-intro">从第一性原理出发，逐步构建完整的经济学思维体系。每个模块既相互独立、可单独阅读，又层层递进、前后呼应。带 ✓ 的章节表示你已读过。</p>'
      + '<div class="path-grid">'+modsHtml+'</div>'

      + '<button class="start-btn" id="startBtn">开始学习 →</button>';
    $("startBtn").onclick = function(){
      var next = CHAPTER_ORDER.find(function(id){ return !readSet[id]; }) || CHAPTER_ORDER[0];
      location.hash = "#/ch/" + next;
    };
    $("topbarTitle").textContent = "经济学思维与现实世界";
    $("bottomNav").style.display = "none";
    updateProgress();
    window.scrollTo(0,0);
  }

  /* ---------- 渲染：章节 ---------- */
  function secHeading(num, cn, en){
    return '<div class="sec-heading"><div class="sec-num">'+num+'</div><div><h2 class="sec-title">'+cn+'</h2><div class="sec-title-en">'+en+'</div></div></div>';
  }
  function figureHtml(key){
    if(!key || !window.FIGURES || !FIGURES[key]) return "";
    var f = FIGURES[key]();
    return '<div class="figure-block"><div class="figure-head"><span class="fig-tag">图解</span><span class="figure-title">'+esc(f.title)+'</span></div>'
      + '<div class="figure-canvas">'+f.svg+'</div>'
      + '<div class="figure-caption">'+f.caption+'</div></div>';
  }
  function parasHtml(arr){
    if(!arr) return "";
    return arr.map(function(p){
      if(typeof p === "string") return '<p class="prose">'+p+'</p>';
      return "";
    }).join("");
  }
  function linkChip(id){
    var m = COURSE_MAP[id]; if(!m) return "";
    return '<a class="link-chip" href="#/ch/'+id+'">'+esc(m.t)
      + '<svg viewBox="0 0 24 24" width="13" height="13"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></a>';
  }

  function renderChapter(id){
    var d = getData(id);
    var meta = COURSE_MAP[id];
    if(!meta){ renderHome(); return; }
    if(!d){
      app.innerHTML = '<div class="chapter"><div class="crumb">第 '+meta.module+' 模块 · '+esc(meta.moduleTitle)+'</div>'
        + '<h1 class="chapter-h1">'+esc(meta.t)+'</h1><p class="chapter-sub">'+esc(meta.s)+'</p>'
        + '<div class="intro-block"><p class="intro-scene">本章内容正在编写中。</p></div></div>';
      $("topbarTitle").textContent = meta.t;
      return;
    }

    var html = '<article class="chapter">';
    html += '<div class="crumb">第 '+meta.module+' 模块 · <b>'+esc(meta.moduleTitle)+'</b></div>';
    html += '<h1 class="chapter-h1">'+esc(d.title || meta.t)+'</h1>';
    html += '<p class="chapter-sub">'+esc(d.subtitle || meta.s)+'</p>';
    html += '<div class="chapter-meta"><span class="meta-chip">约 '+(d.readTime||12)+' 分钟</span>'
      + '<span class="meta-chip">第 '+meta.module+' 模块</span>'
      + (readSet[id] ? '<span class="meta-chip read-chip">✓ 已读</span>' : '')
      + '</div>';
    html += '<div class="chapter-rule"></div>';

    // 章内目录
    var tocItems = [
      ["intro","问题引入"],["concepts","核心概念"],["theory","理论讲解"],["logic","逻辑推导"],
      ["cases","现实案例"],["deeper","深入分析"],["links","知识关联"],["summary","本章总结"]
    ];
    html += '<div class="toc-card"><div class="tc-label">本章导航</div><div class="toc-grid">'
      + tocItems.map(function(it,i){ return '<a href="#s-'+it[0]+'"><span class="tn">0'+(i+1)+'</span>'+it[1]+'</a>'; }).join("")
      + '</div></div>';

    // 1 问题引入
    if(d.intro){
      html += '<section class="sec" id="s-intro">'+secHeading("01","问题引入","The Question")
        + '<div class="intro-block"><p class="intro-question">'+d.intro.question+'</p>'
        + '<div class="intro-scene">'+parasHtml(d.intro.scene)+'</div></div></section>';
    }
    // 2 核心概念
    if(d.concepts && d.concepts.length){
      html += '<section class="sec" id="s-concepts">'+secHeading("02","核心概念","Key Concepts")
        + d.concepts.map(function(c){
            return '<div class="concept"><div class="concept-term">'+c.term+(c.badge?'<span class="ct-badge">'+c.badge+'</span>':'')+'</div>'
              + '<div class="concept-def">'+c.def+'</div>'
              + (c.note?'<div class="concept-note">'+c.note+'</div>':'')+'</div>';
          }).join("") + '</section>';
    }
    // 3 理论讲解
    if(d.theory && d.theory.length){
      html += '<section class="sec" id="s-theory">'+secHeading("03","理论讲解","The Theory");
      d.theory.forEach(function(t){
        html += (t.h?'<h3 class="subhead">'+t.h+'</h3>':'') + parasHtml(t.p);
        if(t.figure) html += figureHtml(t.figure);
      });
      html += '</section>';
    }
    // 4 逻辑推导
    if(d.logic && d.logic.length){
      html += '<section class="sec" id="s-logic">'+secHeading("04","逻辑推导","How It Works")
        + d.logic.map(function(st){
            return '<div class="step"><div class="step-num">'+st.step+'</div>'
              + '<div class="step-title">'+st.h+'</div><div class="step-body">'+st.p+'</div></div>';
          }).join("") + '</section>';
    }
    // 5 现实案例
    if(d.cases && d.cases.length){
      html += '<section class="sec" id="s-cases">'+secHeading("05","现实案例","Real-World Cases")
        + d.cases.map(function(c,idx){
            return '<div class="case"><div class="case-head"><div class="case-icon">'+(idx+1)+'</div><div class="case-title">'+c.name+'</div></div>'
              + '<div class="case-body">'
              + '<div class="case-row"><div class="case-label">现实背景</div><div class="case-text">'+c.background+'</div></div>'
              + '<div class="case-row"><div class="case-label">涉及的经济学问题</div><div class="case-text">'+c.issue+'</div></div>'
              + '<div class="case-row"><div class="case-label">相关概念</div><div class="case-concepts">'+(c.concepts||[]).map(function(x){return '<span>'+x+'</span>';}).join("")+'</div></div>'
              + '<div class="case-row"><div class="case-label">运行机制与因果分析</div><div class="case-text">'+c.mechanism+'</div></div>'
              + '<div class="case-row"><div class="case-label">经济学解释</div><div class="case-text">'+c.explanation+'</div></div>'
              + '<div class="case-row limit"><div class="case-label">理论的局限</div><div class="case-text">'+c.limitation+'</div></div>'
              + '</div></div>';
          }).join("") + '</section>';
    }
    // 6 深入分析
    if(d.deeper && d.deeper.length){
      html += '<section class="sec" id="s-deeper">'+secHeading("06","深入分析","Beyond the Basics");
      d.deeper.forEach(function(dp){
        if(dp.type === "debate"){
          html += '<div class="debate"><div class="db-label">'+dp.h+'</div><p>'+dp.p+'</p></div>';
        } else {
          html += '<div class="viewpoint"><div class="vp-school">'+(dp.school||'进一步理解')+'</div><div class="vp-text">'+dp.p+'</div></div>';
        }
      });
      html += '</section>';
    }
    // 7 知识关联
    if(d.links){
      html += '<section class="sec" id="s-links">'+secHeading("07","知识关联","Connections");
      if(d.links.back && d.links.back.length){
        html += '<div class="link-card"><div class="lk-dir">← 前置知识（建议先读）</div>'+d.links.back.map(linkChip).join("")+'</div>';
      }
      if(d.links.forward && d.links.forward.length){
        html += '<div class="link-card"><div class="lk-dir">→ 后续延伸</div>'+d.links.forward.map(linkChip).join("")+'</div>';
      }
      if(d.links.text) html += '<p class="link-note">'+d.links.text+'</p>';
      html += '</section>';
    }
    // 8 本章总结
    if(d.summary){
      html += '<section class="sec" id="s-summary">'+secHeading("08","本章总结","Takeaways")
        + '<div class="summary-card"><div class="sm-label">核心要点</div>'
        + '<ul class="summary-list">'+(d.summary.points||[]).map(function(p){return '<li>'+p+'</li>';}).join("")+'</ul>'
        + (d.summary.mindset?'<div class="summary-mindset"><div class="sm-label">带走的思维方式</div><p>'+d.summary.mindset+'</p></div>':'')
        + '</div></section>';
    }
    html += '</article>';
    app.innerHTML = html;

    $("topbarTitle").textContent = d.title || meta.t;
    $("bottomNav").style.display = "flex";
    updateChapterNav(id);
    markRead(id);
    updateProgress();
    buildDrawer();

    // 恢复滚动位置或置顶
    var saved = getJSON(LS_POS, {});
    if(saved[id] && saved[id].hash){ /* 保留锚点由浏览器处理 */ }
    window.scrollTo(0,0);
  }

  /* ---------- 路由 ---------- */
  function route(){
    var h = location.hash || "";
    if(h.indexOf("#/ch/") === 0){
      var id = h.slice(5);
      renderChapter(id);
    } else {
      renderHome();
    }
    closeDrawer(); closeSearch();
  }

  function updateChapterNav(id){
    var i = CHAPTER_ORDER.indexOf(id);
    var prev = $("prevChapter"), next = $("nextChapter");
    if(i > 0){ prev.disabled = false; prev.onclick = function(){ location.hash = "#/ch/"+CHAPTER_ORDER[i-1]; }; }
    else { prev.disabled = true; prev.onclick = null; }
    if(i < CHAPTER_ORDER.length-1){ next.disabled = false; next.onclick = function(){ location.hash = "#/ch/"+CHAPTER_ORDER[i+1]; }; }
    else { next.disabled = true; next.onclick = null; }
  }

  /* ---------- 抽屉目录 ---------- */
  function buildDrawer(){
    var nav = $("drawerNav");
    var html = COURSE.modules.map(function(m){
      var chapters = m.chapters.map(function(c,ci){
        var cls = "chap-link" + (readSet[c.id]?" read":"") + (location.hash === "#/ch/"+c.id?" active":"");
        return '<a class="'+cls+'" href="#/ch/'+c.id+'"><span class="cl-idx">'+(ci+1)+'</span><span class="cl-dot"></span><span>'+esc(c.t)+'</span></a>';
      }).join("");
      return '<div class="mod-block"><div class="mod-head"><div class="mod-num">'+m.n+'</div><div class="mod-label">'+esc(m.title)+'</div>'
        + '<svg class="mod-arrow" viewBox="0 0 24 24" width="16" height="16"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'
        + '<div class="mod-chapters">'+chapters+'</div></div>';
    }).join("");
    nav.innerHTML = html;
    nav.querySelectorAll(".mod-head").forEach(function(h){
      h.addEventListener("click", function(){ h.parentElement.classList.toggle("collapsed"); });
    });
    markActiveChapter();
  }
  function markActiveChapter(){
    document.querySelectorAll(".chap-link").forEach(function(a){
      a.classList.toggle("active", a.getAttribute("href") === location.hash);
    });
  }

  function updateProgress(){
    var total = CHAPTER_ORDER.length;
    var read = CHAPTER_ORDER.filter(function(id){ return readSet[id]; }).length;
    var pct = Math.round(read/total*100);
    $("progressPct").textContent = pct+"%";
    $("progressFill").style.width = pct+"%";
    $("progressCount").textContent = "已读 "+read+" / "+total+" 章";
  }

  /* ---------- 抽屉开关 ---------- */
  function openDrawer(){ $("drawer").classList.add("open"); $("drawerOverlay").classList.add("show"); }
  function closeDrawer(){ $("drawer").classList.remove("open"); $("drawerOverlay").classList.remove("show"); }
  function closeSearch(){ $("searchOverlay").classList.remove("show"); }

  /* ---------- 搜索 ---------- */
  function buildSearchIndex(){
    var idx = [];
    COURSE.modules.forEach(function(m){
      m.chapters.forEach(function(c){
        var d = getData(c.id) || {};
        var hay = [c.t, c.s, m.title];
        if(d.intro) hay.push(d.intro.question);
        if(d.concepts) d.concepts.forEach(function(x){ hay.push(x.term, strip(x.def)); });
        if(d.summary && d.summary.points) d.summary.points.forEach(function(x){ hay.push(strip(x)); });
        if(d.cases) d.cases.forEach(function(x){ hay.push(x.name); });
        idx.push({ id:c.id, mod:m.title, title:c.t, sub:c.s, hay:hay.join(" ").replace(/<[^>]+>/g,"") });
      });
    });
    return idx;
  }
  function strip(s){ return String(s||"").replace(/<[^>]+>/g,""); }
  var searchIdx = null;
  function doSearch(q){
    q = q.trim().toLowerCase();
    var res = $("searchResults");
    if(!q){ res.innerHTML = '<div class="sr-empty">输入关键词，搜索章节与概念</div>'; return; }
    if(!searchIdx) searchIdx = buildSearchIndex();
    var hits = searchIdx.filter(function(it){ return it.hay.toLowerCase().indexOf(q) >= 0; });
    if(!hits.length){ res.innerHTML = '<div class="sr-empty">没有找到与「'+esc(q)+'」相关的内容</div>'; return; }
    res.innerHTML = hits.slice(0,30).map(function(it){
      var p = it.hay.toLowerCase().indexOf(q);
      var snip = it.hay.slice(Math.max(0,p-20), p+50);
      return '<a class="sr-item" href="#/ch/'+it.id+'"><div class="sr-mod">第 '+COURSE_MAP[it.id].module+' 模块 · '+esc(it.mod)+'</div>'
        + '<div class="sr-title">'+esc(it.title)+'</div>'
        + '<div class="sr-snippet">…'+esc(snip)+'…</div></a>';
    }).join("");
  }

  /* ---------- 事件绑定 ---------- */
  $("menuBtn").onclick = openDrawer;
  $("catalogBtn").onclick = openDrawer;
  $("drawerClose").onclick = closeDrawer;
  $("drawerOverlay").onclick = closeDrawer;
  $("searchBtn").onclick = function(){ $("searchOverlay").classList.add("show"); $("searchInput").focus(); doSearch($("searchInput").value); };
  $("searchClose").onclick = closeSearch;
  $("searchOverlay").onclick = function(e){ if(e.target === $("searchOverlay")) closeSearch(); };
  $("searchInput").addEventListener("input", function(e){ doSearch(e.target.value); });

  $("fontBtn").onclick = function(){ applyFont(); $("fontOverlay").classList.add("show"); };
  $("fontOverlay").onclick = function(e){ if(e.target === $("fontOverlay")) $("fontOverlay").classList.remove("show"); };
  $("fontDone").onclick = function(){ $("fontOverlay").classList.remove("show"); };
  document.querySelectorAll(".font-step").forEach(function(b){
    b.onclick = function(){
      var s = parseInt(b.getAttribute("data-step"),10);
      fontStep = Math.max(-2, Math.min(3, fontStep + s));
      setJSON(LS_FONT, fontStep); applyFont();
    };
  });

  $("backTop").onclick = function(){ window.scrollTo({top:0, behavior:"smooth"}); };
  window.addEventListener("scroll", function(){
    var y = window.scrollY || document.documentElement.scrollTop;
    $("backTop").classList.toggle("show", y > 400);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var pct = h > 0 ? Math.min(100, Math.round(y/h*100)) : 0;
    var bar = document.querySelector("#progressBar span"); if(bar) bar.style.width = pct+"%";
  }, {passive:true});

  window.addEventListener("hashchange", route);

  // 保存阅读位置
  window.addEventListener("beforeunload", function(){
    var h = location.hash;
    if(h.indexOf("#/ch/")===0){ var pos = getJSON(LS_POS,{}); pos[h.slice(5)] = {y:window.scrollY}; setJSON(LS_POS,pos); }
  });

  buildDrawer();
  updateProgress();
  route();
})();
