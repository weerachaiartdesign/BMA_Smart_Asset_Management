/**
 * version 00035
 * ปรับปรุง: 
 * 1. ระบบพับ Sidebar
 * 2. การควบคุม Pagination สำหรับหน้า Assets
 * 3. สีเมนู Mobile
 */

let globalData = [];
let charts = {};
let currentTab = 'dashboard';
let isMobile = window.innerWidth < 768;
let rowsPerPage = 25; // ค่าตั้งต้นของจำนวนรายการต่อหน้า

window.onload = fetchData;

window.onresize = () => {
    const newIsMobile = window.innerWidth < 768;
    if(newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        renderCurrentPage();
    }
};

// 3. ฟังก์ชันพับ/เปิด Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('collapsed');
}

async function fetchData() {
    const loadingText = document.getElementById('loading-text');
    try {
        const response = await fetch(WEB_APP_URL);
        globalData = await response.json();
        
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.classList.add('hidden'), 500);
        }
        renderCurrentPage();
    } catch (err) {
        if (loadingText) loadingText.innerHTML = `<span class="text-red-600">Error: ${err.message}</span>`;
    }
}

function switchTab(tabId) {
    currentTab = tabId;
    updateNavUI(tabId);
    renderCurrentPage();
}

function updateNavUI(tabId) {
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const btn = document.getElementById('btn-' + tabId);
    if(btn) btn.classList.add('active');

    // 1. อัปเดตเมนู Mobile สีเขียว กทม.
    const mDash = document.getElementById('m-btn-dashboard');
    const mInv = document.getElementById('m-btn-inventory');
    if(mDash && mInv) {
        mDash.classList.toggle('active', tabId === 'dashboard');
        mInv.classList.toggle('active', tabId === 'inventory');
    }
    
    document.getElementById('page-title').innerText = tabId === 'dashboard' ? 'ภาพรวมระบบ' : 'รายการทรัพย์สิน';
}

async function renderCurrentPage() {
    const mainContent = document.getElementById('main-content');
    const fileName = currentTab === 'dashboard' ? 'dashboard.html' : 'assets-list.html';
    
    try {
        const res = await fetch(fileName);
        mainContent.innerHTML = await res.text();

        if (currentTab === 'dashboard') {
            isMobile ? renderMobileDashboard(globalData) : renderDesktopDashboard(globalData);
        } else {
            // ส่งค่า rowsPerPage ไปใช้ในการแสดงผลหน้าแรก
            filterTable(); 
        }
    } catch (err) {
        mainContent.innerHTML = `<div class="p-8 text-red-500">Error: ${err.message}</div>`;
    }
}

/**
 * 2. ปรับปรุงการกรองข้อมูลและแสดงผลตามจำนวนรายการ (Pagination Logic)
 */
function filterTable() {
    const query = document.getElementById('searchInput')?.value.toLowerCase() || "";
    const rowSelect = document.getElementById('rowSelect');
    if (rowSelect) rowsPerPage = rowSelect.value === 'All' ? globalData.length : parseInt(rowSelect.value);

    const filtered = globalData.filter(item => 
        Object.values(item).some(val => String(val).toLowerCase().includes(query))
    );
    
    // ตัดข้อมูลตามจำนวนรายการที่เลือก (สมมติแสดงเฉพาะหน้าแรกก่อน)
    const paginatedData = filtered.slice(0, rowsPerPage);

    if (isMobile) {
        renderMobileTable(paginatedData);
    } else {
        renderDesktopTable(paginatedData);
    }
    
    // อัปเดตตัวเลขจำนวนที่แสดง
    const countEl = document.getElementById('show-count');
    if (countEl) countEl.innerText = `แสดง ${paginatedData.length} จาก ${filtered.length} รายการ`;
}

function groupAndSortData(data, key, limit) {
    const counts = data.reduce((acc, curr) => {
        const val = curr[key] || 'ไม่ระบุ';
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});
    return Object.fromEntries(Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, limit));
}
