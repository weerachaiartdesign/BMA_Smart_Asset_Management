/**
 * version 00032
 * ไฟล์หลัก (Main Controller) ของโปรแกรม
 */
let globalData = [];
let charts = {};
let currentTab = 'dashboard';
let isMobile = window.innerWidth < 768;

window.addEventListener('load', fetchData);
window.addEventListener('resize', () => {
  const newIsMobile = window.innerWidth < 768;
  if(newIsMobile !== isMobile) {
    isMobile = newIsMobile;
    switchTab(currentTab);
  }
});

async function fetchData() {
  try {
    const response = await fetch(WEB_APP_URL);
    globalData = await response.json();
    if (globalData.error) throw new Error(globalData.error);
    await switchTab('dashboard');
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.opacity = '0';
      setTimeout(() => loading.classList.add('hidden'), 500);
    }
  } catch (err) {
    const lt = document.getElementById('loading-text');
    if (lt) lt.innerHTML = `<span class="text-red-600">${err.message}</span>`;
  }
}

async function switchTab(tabId) {
  currentTab = tabId;
  const mainContent = document.getElementById('main-content');
  const prefix = isMobile ? 'm_' : 'd_';
  const pageName = tabId === 'dashboard' ? 'dashboard' : 'assets-list';
  const htmlFile = `${prefix}${pageName}.html`;
  const jsFile = `${prefix}${pageName}.js`;

  try {
    // โหลด HTML
    const htmlRes = await fetch(htmlFile);
    mainContent.innerHTML = await htmlRes.text();

    // โหลด JS ประจำหน้า (Dynamic Script Loading)
    await loadPageScript(jsFile);

    updateNavUI(tabId);
    renderContent();
  } catch (err) {
    console.error("Navigation error:", err);
  }
}

function loadPageScript(src) {
  return new Promise((resolve) => {
    const oldScript = document.querySelector(`script[data-page-script]`);
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.src = src;
    script.dataset.pageScript = "true";
    script.onload = resolve;
    document.body.appendChild(script);
  });
}

function updateNavUI(tabId) {
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
  const desktopBtn = document.getElementById('btn-' + tabId);
  if(desktopBtn) desktopBtn.classList.add('active');

  const mDash = document.getElementById('m-btn-dashboard');
  const mInv = document.getElementById('m-btn-inventory');
  if(mDash && mInv) {
    const activeClass = 'text-emerald-800';
    const inactiveClass = 'text-slate-400';
    if(tabId === 'dashboard') {
      mDash.classList.replace(inactiveClass, activeClass);
      mInv.classList.replace(activeClass, inactiveClass);
    } else {
      mInv.classList.replace(inactiveClass, activeClass);
      mDash.classList.replace(activeClass, inactiveClass);
    }
  }
  document.getElementById('page-title').innerText = tabId === 'dashboard' ? 'Dashboard' : 'รายการทรัพย์สิน';
}

function renderContent() {
  if (currentTab === 'dashboard') {
    isMobile ? renderMobileDashboard(globalData) : renderDesktopDashboard(globalData);
  } else {
    isMobile ? renderMobileTable(globalData) : renderDesktopTable(globalData);
  }
}

function filterTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const filtered = globalData.filter(item => 
    String(item.id).toLowerCase().includes(input) || 
    String(item.type).toLowerCase().includes(input) || 
    String(item.dept).toLowerCase().includes(input) ||
    String(item.location).toLowerCase().includes(input) ||
    (item.owner && String(item.owner).toLowerCase().includes(input))
  );
  isMobile ? renderMobileTable(filtered) : renderDesktopTable(filtered);
}

// Helper Functions
function groupAndSortData(data, key, limit) {
  const counts = data.reduce((acc, curr) => {
    const val = curr[key] || 'ไม่ระบุ';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  return Object.fromEntries(Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, limit));
}

function updateChartInstance(id, type, labels, data, colors) {
  const canvas = document.getElementById(id);
  if(!canvas) return;
  if (charts[id]) charts[id].destroy();
  
  charts[id] = new Chart(canvas.getContext('2d'), {
    type: type === 'horizontalBar' ? 'bar' : type,
    data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 5 }] },
    options: {
      indexAxis: type === 'horizontalBar' ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { 
          display: type === 'doughnut', 
          position: 'left',
          labels: { font: { family: 'Sarabun', size: 10 }, boxWidth: 10 } 
        } 
      }
    }
  });
}
