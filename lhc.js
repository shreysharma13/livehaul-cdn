(function () {
  'use strict';

  console.log('[LHC] ✅ Script loaded — this proves <script> tags are NOT being stripped');
  console.log('[LHC] readyState:', document.readyState);

  /* ═══════════════════════════════════════════════════════════════════════════
     CONFIG — Replace with your published Google Sheet CSV URL
     ═══════════════════════════════════════════════════════════════════════════ */
  var SHEET_URL = '';


  /* ═══════════════════════════════════════════════════════════════════════════
     METRIC DEFINITIONS
     ═══════════════════════════════════════════════════════════════════════════ */
  var SELLER_METRICS = [
    { key: 'credibility',  label: 'Credibility', icon: '🔒', max: 20 },
    { key: 'delivery',     label: 'Delivery',    icon: '🚚', max: 20 },
    { key: 'quality',      label: 'Quality',     icon: '👕', max: 20 },
    { key: 'pricing',      label: 'Pricing',     icon: '💰', max: 15 },
    { key: 'experience',   label: 'Experience',  icon: '💬', max: 15 },
    { key: 'uniqueness',   label: 'Uniqueness',  icon: '✨', max: 10 }
  ];

  var MFG_METRICS = [
    { key: 'legitimacy',           label: 'Legitimacy', icon: '🏭', max: 20 },
    { key: 'quality_consistency',  label: 'Quality',    icon: '✅', max: 20 },
    { key: 'moq_flexibility',     label: 'MOQ Flex',   icon: '📦', max: 15 },
    { key: 'lead_time',           label: 'Lead Time',  icon: '⏱️', max: 15 },
    { key: 'pricing_transparency', label: 'Pricing',   icon: '💎', max: 15 },
    { key: 'communication',       label: 'Comms',      icon: '🤝', max: 15 }
  ];


  /* ═══════════════════════════════════════════════════════════════════════════
     DEMO DATA — Used when SHEET_URL is empty
     ═══════════════════════════════════════════════════════════════════════════ */
  var DEMO_DATA = [
    {
      store_name: 'Koskii', type: 'seller', overall_score: '78',
      verdict: 'Great designs, slow delivery',
      company_about: 'Premium ethnic wear destination crafting designer lehengas, sarees and Indo-western pieces for the modern Indian woman.',
      credibility: '16', delivery: '14', quality: '17',
      pricing: '11', experience: '12', uniqueness: '8',
      pro_1: 'Unique designs', pro_2: 'Good fabric quality', pro_3: '',
      con_1: 'Delays during sales', con_2: '',
      badges: 'Trusted Seller,Design-First Brand',
      warnings: 'Delivery Issues Reported',
      tags: 'ethnic wear,sarees,lehengas,wedding,women',
      visit_link: 'https://koskii.com', review_link: '/reviews/koskii',
      status: 'live'
    },
    {
      store_name: 'Bewakoof', type: 'seller', overall_score: '85',
      verdict: 'Consistent quality, fast shipping, great value',
      company_about: 'India\'s favourite casual wear brand delivering trendy t-shirts, joggers and everyday essentials at honest prices.',
      credibility: '18', delivery: '18', quality: '17',
      pricing: '13', experience: '13', uniqueness: '6',
      pro_1: 'Fast delivery', pro_2: 'Good return policy', pro_3: 'Affordable prices',
      con_1: 'Generic designs', con_2: '',
      badges: 'Trusted Seller,Fast Fulfillment,Value for Money',
      warnings: '',
      tags: 't-shirts,casual wear,men,women,streetwear',
      visit_link: 'https://bewakoof.com', review_link: '/reviews/bewakoof',
      status: 'live'
    },
    {
      store_name: 'The Souled Store', type: 'seller', overall_score: '82',
      verdict: 'Reliable and fun, slightly premium pricing',
      company_about: 'India\'s go-to licensed merchandise and pop culture brand for fans who wear their fandoms proudly.',
      credibility: '17', delivery: '17', quality: '18',
      pricing: '10', experience: '13', uniqueness: '7',
      pro_1: 'Licensed designs', pro_2: 'Consistent quality', pro_3: 'Good packaging',
      con_1: 'Premium pricing', con_2: '',
      badges: 'Verified Brand,Design-First,Smooth Returns',
      warnings: '',
      tags: 't-shirts,pop culture,men,women,merchandise,fandom',
      visit_link: 'https://thesouledstore.com', review_link: '/reviews/the-souled-store',
      status: 'live'
    },
    {
      store_name: 'Snitch', type: 'seller', overall_score: '71',
      verdict: 'Trendy fits, inconsistent sizing across batches',
      company_about: 'Fast-fashion menswear brand riding trends with bold fits, statement shirts and streetwear energy.',
      credibility: '14', delivery: '15', quality: '14',
      pricing: '11', experience: '10', uniqueness: '7',
      pro_1: 'Trendy designs', pro_2: 'Strong social presence', pro_3: '',
      con_1: 'Inconsistent sizing', con_2: 'Slow support response',
      badges: 'Trending,Niche Specialist',
      warnings: 'Inconsistent Quality,Slow Support',
      tags: 'men,streetwear,shirts,trendy,fast fashion',
      visit_link: 'https://snitch.co.in', review_link: '/reviews/snitch',
      status: 'live'
    },
    {
      store_name: 'Urban Monkey', type: 'seller', overall_score: '63',
      verdict: 'Niche streetwear, limited range and slow restocks',
      company_about: 'Streetwear label defining urban culture through signature caps, accessories and attitude-driven apparel.',
      credibility: '13', delivery: '11', quality: '14',
      pricing: '9', experience: '9', uniqueness: '7',
      pro_1: 'Strong brand identity', pro_2: 'Unique caps and accessories', pro_3: '',
      con_1: 'Frequent out-of-stock', con_2: 'Slow delivery',
      badges: 'Niche Specialist',
      warnings: 'Delivery Issues Reported,Slow Support',
      tags: 'streetwear,caps,accessories,men,urban',
      visit_link: 'https://urbanmonkey.com', review_link: '/reviews/urban-monkey',
      status: 'live'
    },
    {
      store_name: 'Tirupur Textiles Co.', type: 'manufacturer', overall_score: '74',
      verdict: 'Solid for basics, limited on complex designs',
      company_about: 'Tirupur-based cotton t-shirt manufacturer supplying quality basics to brands and startups with low MOQs.',
      legitimacy: '17', quality_consistency: '15', moq_flexibility: '12',
      lead_time: '11', pricing_transparency: '12', communication: '7',
      pro_1: 'Direct factory', pro_2: 'Low MOQ', pro_3: 'Good for basics',
      con_1: 'Slow on custom orders', con_2: 'Communication gaps',
      badges: 'Verified Factory,Low MOQ Friendly,Startup Friendly',
      warnings: 'Inconsistent Lead Times',
      tags: 't-shirts,basics,cotton,bulk,tirupur',
      visit_link: '#', review_link: '/reviews/tirupur-textiles',
      status: 'live'
    },
    {
      store_name: 'Surat Silk Hub', type: 'manufacturer', overall_score: '68',
      verdict: 'Good silk quality but unreliable timelines',
      company_about: 'Surat-based silk and fabric manufacturer specializing in premium ethnic textiles for the wholesale market.',
      legitimacy: '15', quality_consistency: '16', moq_flexibility: '10',
      lead_time: '8', pricing_transparency: '11', communication: '8',
      pro_1: 'Premium silk quality', pro_2: 'Wide range of fabrics', pro_3: '',
      con_1: 'Missed deadlines', con_2: 'High MOQ for premium',
      badges: 'Direct Manufacturer,Sampling Available',
      warnings: 'Inconsistent Lead Times,Broker-Led Communication',
      tags: 'silk,fabric,sarees,ethnic,surat,wholesale',
      visit_link: '#', review_link: '/reviews/surat-silk-hub',
      status: 'live'
    }
  ];


  /* ═══════════════════════════════════════════════════════════════════════════
     STATE
     ═══════════════════════════════════════════════════════════════════════════ */
  var allStores    = [];
  var activeFilter = 'all';
  var activeView   = 'identity';
  var searchQuery  = '';

  /* DOM refs — filled in init() after DOM is ready */
  var grid, emptyEl, loadingEl, countEl, searchInput, tabsEl, viewToggleEl, lhcWrap;


  /* ═══════════════════════════════════════════════════════════════════════════
     CSV PARSER — handles quoted fields with commas
     ═══════════════════════════════════════════════════════════════════════════ */
  function parseCSVLine(line) {
    var result = [];
    var current = '';
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
        else if (ch === '"') { inQuotes = false; }
        else { current += ch; }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ',') { result.push(current); current = ''; }
        else { current += ch; }
      }
    }
    result.push(current);
    return result;
  }

  function parseCSV(text) {
    var lines = text.split(/\r?\n/);
    if (lines.length < 2) return [];
    var headers = parseCSVLine(lines[0]).map(function (h) {
      return h.trim().toLowerCase().replace(/\s+/g, '_');
    });
    var data = [];
    for (var i = 1; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;
      var values = parseCSVLine(line);
      var obj = {};
      headers.forEach(function (h, idx) {
        obj[h] = (values[idx] || '').trim();
      });
      data.push(obj);
    }
    return data;
  }


  /* ═══════════════════════════════════════════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════════════════════════════════════════ */
  function getTier(score) {
    var s = parseInt(score, 10) || 0;
    if (s >= 85) return 'excellent';
    if (s >= 70) return 'good';
    if (s >= 55) return 'caution';
    return 'risk';
  }

  function getTierLabel(score) {
    var s = parseInt(score, 10) || 0;
    if (s >= 85) return 'Excellent';
    if (s >= 70) return 'Good';
    if (s >= 55) return 'Caution';
    return 'High Risk';
  }

  function esc(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function splitField(str) {
    if (!str || !str.trim()) return [];
    return str.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  }


  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER SINGLE CARD — outputs both Identity + Stats views
     ═══════════════════════════════════════════════════════════════════════════ */
  function renderCard(store, index) {
    var score   = parseInt(store.overall_score, 10) || 0;
    var tier    = getTier(score);
    var tierLbl = getTierLabel(score);
    var type    = (store.type || 'seller').toLowerCase();
    var metrics = type === 'manufacturer' ? MFG_METRICS : SELLER_METRICS;
    var typeLabel = type === 'manufacturer' ? 'Manufacturer' : 'Seller';
    var visitLink  = store.visit_link  || '#';
    var reviewLink = store.review_link || '#';
    var badges   = splitField(store.badges);
    var warnings = splitField(store.warnings);
    var tags     = splitField(store.tags);


    /* ╔═══════════════════════════════════════════════════════════════════════╗
       ║  IDENTITY VIEW (front) — brand-forward, spacious, discovery         ║
       ╚═══════════════════════════════════════════════════════════════════════╝ */

    /* Tags as pills */
    var tagsHTML = '';
    if (tags.length) {
      tagsHTML =
        '<div class="lhc-idTags">' +
          tags.map(function (t) {
            return '<span class="lhc-pill">' + esc(t) + '</span>';
          }).join('') +
        '</div>';
    }

    /* Top 3 badges */
    var topBadges = badges.slice(0, 3);
    var idBadgesHTML = '';
    if (topBadges.length) {
      idBadgesHTML =
        '<div class="lhc-idBadges">' +
          '<div class="lhc-idBadgesLabel">Earned</div>' +
          '<div class="lhc-idBadgesRow">' +
            topBadges.map(function (b) {
              return '<span class="lhc-pill blue">' + esc(b) + '</span>';
            }).join('') +
          '</div>' +
        '</div>';
    }

    /* Warnings on identity (max 2 — warnings are never hidden) */
    var idWarningsHTML = '';
    if (warnings.length) {
      idWarningsHTML =
        '<div class="lhc-idWarnings">' +
          warnings.slice(0, 2).map(function (w) {
            return '<span class="lhc-pill warn">⚠️ ' + esc(w) + '</span>';
          }).join('') +
        '</div>';
    }

    var frontHTML =
      '<div class="lhc-cardFront">' +

        /* Type pill */
        '<div class="lhc-idType">' + esc(typeLabel) + '</div>' +

        /* Big score */
        '<div class="lhc-idScoreWrap">' +
          '<div class="lhc-idScoreBadge">' +
            '<div class="lhc-idScoreNum">' + score + '</div>' +
            '<div class="lhc-idScoreMax">/100</div>' +
          '</div>' +
          '<div class="lhc-idTier">' + esc(tierLbl) + '</div>' +
        '</div>' +

        /* Store name */
        '<div class="lhc-idName">' + esc(store.store_name || 'Unnamed Store') + '</div>' +

        /* Verdict */
        (store.verdict
          ? '<div class="lhc-idVerdict">&ldquo;' + esc(store.verdict) + '&rdquo;</div>'
          : '') +

        /* Company about */
        (store.company_about
          ? '<div class="lhc-idAbout">' + esc(store.company_about) + '</div>'
          : '') +

        /* Tags */
        tagsHTML +

        /* Badges */
        idBadgesHTML +

        /* Warnings */
        idWarningsHTML +

        /* Actions */
        '<div class="lhc-cardActions">' +
          '<a class="lhc-btn primary" href="' + esc(visitLink) + '" target="_blank" rel="noopener">Visit Site →</a>' +
          '<a class="lhc-btn ghost" href="' + esc(reviewLink) + '">Read Review →</a>' +
        '</div>' +

      '</div>';


    /* ╔═══════════════════════════════════════════════════════════════════════╗
       ║  STATS VIEW (back) — data-dense, comparison-focused                 ║
       ╚═══════════════════════════════════════════════════════════════════════╝ */

    /* Metrics bars */
    var metricsHTML = '';
    metrics.forEach(function (m) {
      var val = parseInt(store[m.key], 10) || 0;
      var pct = Math.round((val / m.max) * 100);
      metricsHTML +=
        '<div class="lhc-metric">' +
          '<div class="lhc-metricLabel">' + m.icon + ' ' + esc(m.label) + '</div>' +
          '<div class="lhc-metricBar"><div class="lhc-metricFill" style="width:' + pct + '%"></div></div>' +
          '<div class="lhc-metricVal">' + val + '/' + m.max + '</div>' +
        '</div>';
    });

    /* Pros */
    var pros = [store.pro_1, store.pro_2, store.pro_3].filter(Boolean);
    var prosHTML = '';
    if (pros.length) {
      prosHTML =
        '<div class="lhc-pcCol">' +
          '<div class="lhc-pcLabel">✅ Pros</div>' +
          pros.map(function (p) { return '<div class="lhc-pcItem">– ' + esc(p) + '</div>'; }).join('') +
        '</div>';
    }

    /* Cons */
    var cons = [store.con_1, store.con_2].filter(Boolean);
    var consHTML = '';
    if (cons.length) {
      consHTML =
        '<div class="lhc-pcCol">' +
          '<div class="lhc-pcLabel">❌ Cons</div>' +
          cons.map(function (c) { return '<div class="lhc-pcItem">– ' + esc(c) + '</div>'; }).join('') +
        '</div>';
    }

    /* Full badges */
    var badgesHTML = '';
    if (badges.length) {
      badgesHTML =
        '<div class="lhc-cardSection">' +
          '<div class="lhc-sectionLabel">🏅 Badges</div>' +
          '<div class="lhc-pillRow">' +
            badges.map(function (b) { return '<span class="lhc-pill blue">' + esc(b) + '</span>'; }).join('') +
          '</div>' +
        '</div>';
    }

    /* Full warnings */
    var warningsHTML = '';
    if (warnings.length) {
      warningsHTML =
        '<div class="lhc-cardSection">' +
          '<div class="lhc-sectionLabel">⚠️ Warnings</div>' +
          '<div class="lhc-pillRow">' +
            warnings.map(function (w) { return '<span class="lhc-pill warn">⚠️ ' + esc(w) + '</span>'; }).join('') +
          '</div>' +
        '</div>';
    }

    var statsHTML =
      '<div class="lhc-cardStats">' +

        /* Head */
        '<div class="lhc-cardHead">' +
          '<div class="lhc-cardHeadLeft">' +
            '<div class="lhc-cardType">' + esc(typeLabel) + '</div>' +
            '<div class="lhc-cardName">' + esc(store.store_name || 'Unnamed Store') + '</div>' +
          '</div>' +
          '<div class="lhc-scoreWrap">' +
            '<div class="lhc-scoreBadge">' +
              '<div class="lhc-scoreNum">' + score + '</div>' +
              '<div class="lhc-scoreMax">/100</div>' +
            '</div>' +
            '<div class="lhc-scoreTier">' + esc(tierLbl) + '</div>' +
          '</div>' +
        '</div>' +

        /* Verdict */
        (store.verdict
          ? '<div class="lhc-cardVerdict">&ldquo;' + esc(store.verdict) + '&rdquo;</div>'
          : '') +

        /* Metrics */
        '<div class="lhc-cardMetrics">' + metricsHTML + '</div>' +

        /* Pros/Cons */
        ((prosHTML || consHTML)
          ? '<div class="lhc-cardPC">' + prosHTML + consHTML + '</div>'
          : '') +

        /* Badges */
        badgesHTML +

        /* Warnings */
        warningsHTML +

        /* Actions */
        '<div class="lhc-cardActions">' +
          '<a class="lhc-btn primary" href="' + esc(visitLink) + '" target="_blank" rel="noopener">Visit Site →</a>' +
          '<a class="lhc-btn ghost" href="' + esc(reviewLink) + '">Read Review →</a>' +
        '</div>' +

      '</div>';


    /* ╔═══════════════════════════════════════════════════════════════════════╗
       ║  ASSEMBLE CARD                                                       ║
       ╚═══════════════════════════════════════════════════════════════════════╝ */
    return '' +
    '<div class="lhc-card" data-tier="' + tier + '" data-type="' + esc(type) + '"' +
    '     data-name="' + esc((store.store_name || '').toLowerCase()) + '"' +
    '     data-tags="' + esc((store.tags || '').toLowerCase()) + '"' +
    '     style="animation-delay:' + (index * 0.07) + 's">' +
      '<div class="lhc-cardStripe"></div>' +
      frontHTML +
      statsHTML +
    '</div>';
  }


  /* ═══════════════════════════════════════════════════════════════════════════
     FILTER & RENDER ALL CARDS
     ═══════════════════════════════════════════════════════════════════════════ */
  function renderAll() {
    console.log('[LHC] renderAll() — stores:', allStores.length, '| filter:', activeFilter, '| view:', activeView, '| search:', searchQuery);
    var q = searchQuery.toLowerCase().trim();

    var filtered = allStores.filter(function (store) {
      /* Status gate */
      if ((store.status || '').toLowerCase() !== 'live') return false;

      /* Type filter */
      var type = (store.type || 'seller').toLowerCase();
      if (activeFilter !== 'all' && type !== activeFilter) return false;

      /* Search filter — matches name OR any tag */
      if (q) {
        var name = (store.store_name || '').toLowerCase();
        var tags = (store.tags || '').toLowerCase();
        if (name.indexOf(q) === -1 && tags.indexOf(q) === -1) return false;
      }

      return true;
    });

    /* Sort: highest score first */
    filtered.sort(function (a, b) {
      return (parseInt(b.overall_score, 10) || 0) - (parseInt(a.overall_score, 10) || 0);
    });

    console.log('[LHC] filtered:', filtered.length, 'cards to render');

    /* Render */
    if (filtered.length === 0) {
      grid.style.display = 'none';
      emptyEl.style.display = 'block';
    } else {
      grid.style.display = '';
      emptyEl.style.display = 'none';
      grid.innerHTML = filtered.map(function (s, i) { return renderCard(s, i); }).join('');
    }

    /* Count */
    var total = allStores.filter(function (s) {
      return (s.status || '').toLowerCase() === 'live';
    }).length;
    countEl.textContent = 'Showing ' + filtered.length + ' of ' + total;
    console.log('[LHC] renderAll() complete ✅');
  }


  /* ═══════════════════════════════════════════════════════════════════════════
     INIT — Grab DOM refs, wire events, fetch data or use demo
     ═══════════════════════════════════════════════════════════════════════════ */
  function init() {
    console.log('[LHC] init() called');

    /* ── DOM refs (now safe — DOM is ready) ── */
    grid          = document.getElementById('lhcGrid');
    emptyEl       = document.getElementById('lhcEmpty');
    loadingEl     = document.getElementById('lhcLoading');
    countEl       = document.getElementById('lhcCount');
    searchInput   = document.getElementById('lhcSearch');
    tabsEl        = document.getElementById('lhcTabs');
    viewToggleEl  = document.getElementById('lhcViewToggle');
    lhcWrap       = document.querySelector('.lhc');

    console.log('[LHC] DOM check — grid:', !!grid, '| loading:', !!loadingEl, '| search:', !!searchInput, '| tabs:', !!tabsEl, '| viewToggle:', !!viewToggleEl);

    /* Safety: if DOM elements missing, abort with visible error */
    if (!grid || !loadingEl || !searchInput || !tabsEl) {
      console.error('[LHC] ❌ DOM elements NOT found! The HTML block may not have rendered yet or IDs are wrong.');
      console.log('[LHC] Hint: check "View Page Source" on the live site — search for "lhcGrid". If missing, WordPress is stripping the HTML or the block order is wrong.');
      return;
    }

    /* ── Event: search — debounced 200ms ── */
    var debounce;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        searchQuery = searchInput.value;
        renderAll();
      }, 200);
    });

    /* ── Event: tab clicks (type filter) ── */
    tabsEl.addEventListener('click', function (e) {
      var tab = e.target.closest('.lhc-tab');
      if (!tab) return;
      var allTabs = tabsEl.querySelectorAll('.lhc-tab');
      for (var i = 0; i < allTabs.length; i++) allTabs[i].classList.remove('active');
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter');
      renderAll();
    });

    /* ── Event: view toggle (Identity ↔ Stats) ── */
    if (viewToggleEl) {
      viewToggleEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.lhc-viewBtn');
        if (!btn) return;
        var view = btn.getAttribute('data-view');
        if (view === activeView) return; /* already active */

        /* Update button state */
        var allBtns = viewToggleEl.querySelectorAll('.lhc-viewBtn');
        for (var i = 0; i < allBtns.length; i++) allBtns[i].classList.remove('active');
        btn.classList.add('active');

        /* Switch view class on wrapper */
        activeView = view;
        lhcWrap.classList.remove('view-identity', 'view-stats');
        lhcWrap.classList.add('view-' + view);

        console.log('[LHC] View switched to:', view);
      });
    }

    /* ── Load data ── */
    console.log('[LHC] SHEET_URL:', SHEET_URL ? SHEET_URL : '(empty — using demo data)');

    if (SHEET_URL) {
      fetch(SHEET_URL)
        .then(function (res) {
          console.log('[LHC] fetch status:', res.status);
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.text();
        })
        .then(function (text) {
          allStores = parseCSV(text);
          console.log('[LHC] parsed', allStores.length, 'rows from sheet');
          loadingEl.style.display = 'none';
          renderAll();
        })
        .catch(function (err) {
          console.error('[LHC] ❌ failed to load sheet:', err);
          loadingEl.innerHTML =
            '<p style="color:#DA6220;font-family:Inter,sans-serif;font-weight:700;">' +
            'Failed to load store data. Check the Google Sheet URL.</p>';
        });
    } else {
      /* Demo mode */
      allStores = DEMO_DATA;
      console.log('[LHC] demo mode — loaded', allStores.length, 'stores');
      loadingEl.style.display = 'none';
      renderAll();
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     BOOT — Retry up to 5 seconds in case WordPress injects HTML async
     ═══════════════════════════════════════════════════════════════════════════ */
  var attempts = 0;
  function boot() {
    var found = document.getElementById('lhcGrid');
    attempts++;
    console.log('[LHC] boot attempt', attempts, '— #lhcGrid found:', !!found);

    if (found) {
      init();
    } else if (attempts < 50) {
      setTimeout(boot, 100);
    } else {
      console.error('[LHC] ❌ GAVE UP after 5s — #lhcGrid never appeared in the DOM.');
      console.error('[LHC] Most likely cause: WordPress.com is STRIPPING <script> tags or the Custom HTML block is not rendering.');
      console.error('[LHC] TEST: Open your live page → View Page Source → Ctrl+F for "lhcGrid"');
    }
  }

  if (document.readyState === 'loading') {
    console.log('[LHC] DOM still loading — waiting for DOMContentLoaded…');
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    console.log('[LHC] DOM already ready — booting now');
    boot();
  }

})();
