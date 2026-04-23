/**
 * version 00034
 * ไฟล์: index.js
 * หน้าที่: หัวใจหลักของระบบ จัดการการนำทาง (Navigation), การโหลดข้อมูล (Fetch API), และการสลับหน้าจอตามอุปกรณ์ (Responsive)
 */

let globalData = [];    // เก็บข้อมูลทรัพย์สินทั้งหมดที่โหลดมาจาก API
let charts = {};        // เก็บ Instance ของ Chart.js เพื่อใช้ทำลายกราฟเก่าก่อนสร้างใหม่
let currentTab = 'dashboard'; 
let isMobile = window.innerWidth < 768;

window.onload = fetchData; // เริ่มโหลดข้อมูลทันทีเมื่อเปิดเว็บ

// ตรวจสอบการเปลี่ยนขนาดหน้าจอเพื่อสลับ Layout
window.onresize = () => {
    const newIsMobile = window.innerWidth < 768;
    if(newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        renderCurrentPage();
    }
};

/**
 * fetchData: ดึงข้อมูลจาก Google Sheets (ผ่าน Web App URL)
 */
async function fetchData() {
    const loadingText = document.getElementById('loading-text');
    try {
        if (typeof WEB_APP_URL === 'undefined') throw new Error("กรุณาตั้งค่า WEB_APP_URL ใน api-config.js");
        
        const response = await fetch(WEB_APP_URL);
        globalData = await response.json();
        
        if (globalData.error) throw new Error(globalData.error);
        
        // ซ่อนหน้า Loading เมื่อโหลดสำเร็จ
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => loading.classList.add('hidden'), 500);
        }
        renderCurrentPage();
    } catch (err) {
        if (loadingText) loadingText.innerHTML = `<span class="text-red-600">เกิดข้อผิดพลาด: ${err.message}</span>`;
        console.error(err);
    }
}

/**
 * switchTab: สลับเมนูหน้าจอ (Dashboard / รายการทรัพย์สิน)
 */
function switchTab(tabId) {
    currentTab = tabId;
    updateNavUI(tabId);
    renderCurrentPage();
}

/**
 * updateNavUI: เปลี่ยนสีและสไตล์ของเมนูที่ถูกเลือก
 */
function updateNavUI(tabId) {
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const btn = document.getElementById('btn-' + tabId);
    if(btn) btn.classList.add('active');

    // อัปเดตเมนู Mobile
    const mDash = document.getElementById('m-btn-dashboard');
    const mInv = document.getElementById('m-btn-inventory');
    if(mDash && mInv) {
        const activeColor = '#059669', inactiveColor = '#94a3b8';
        mDash.style.color = tabId === 'dashboard' ? activeColor : inactiveColor;
        mInv.style.color = tabId === 'inventory' ? activeColor : inactiveColor;
    }
    
    const titleEl = document.getElementById('page-title');
    if(titleEl) titleEl.innerText = tabId === 'dashboard' ? 'Dashboard สรุปภาพรวม' : 'บัญชีทรัพย์สินทั้งหมด';
}

/**
 * renderCurrentPage: โหลดไฟล์ HTML Template และส่งข้อมูลไป Render ตามหน้าจอที่เลือก
 */
async function renderCurrentPage() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const fileName = currentTab === 'dashboard' ? 'dashboard.html' : 'assets-list.html';
    
    try {
        const res = await fetch(fileName);
        if (!res.ok) throw new Error(`โหลดไฟล์เทมเพลตไม่สำเร็จ (${fileName})`);
        mainContent.innerHTML = await res.text();

        // ตรวจสอบหน้าและส่งข้อมูลไปให้ฟังก์ชันใน dashboard.js หรือ assets-list.js
        if (currentTab === 'dashboard') {
            if (typeof renderDesktopDashboard === 'function' && typeof renderMobileDashboard === 'function') {
                isMobile ? renderMobileDashboard(globalData) : renderDesktopDashboard(globalData);
            }
        } else {
            if (typeof renderDesktopTable === 'function' && typeof renderMobileTable === 'function') {
                isMobile ? renderMobileTable(globalData) : renderDesktopTable(globalData);
            }
        }
    } catch (err) {
        mainContent.innerHTML = `<div class="p-8 text-red-500 font-bold">เกิดข้อผิดพลาดในการโหลดเนื้อหา: ${err.message}</div>`;
    }
}

/**
 * filterTable: ฟังก์ชันค้นหาข้อมูล (เรียกจาก input onkeyup ใน HTML)
 */
function filterTable() {
    const query = document.getElementById('searchInput')?.value.toLowerCase() || "";
    const filtered = globalData.filter(item => 
        (item.type && item.type.toLowerCase().includes(query)) || 
        (item.id && item.id.toLowerCase().includes(query)) ||
        (item.dept && item.dept.toLowerCase().includes(query)) ||
        (item.owner && item.owner.toLowerCase().includes(query))
    );
    
    if (isMobile) {
        if (typeof renderMobileTable === 'function') renderMobileTable(filtered);
    } else {
        if (typeof renderDesktopTable === 'function') renderDesktopTable(filtered);
    }
}

/**
 * groupAndSortData: ฟังก์ชันช่วยจัดกลุ่มข้อมูล (Helper Function)
 */
function groupAndSortData(data, key, limit) {
    const counts = data.reduce((acc, curr) => {
        const val = curr[key] || 'ไม่ระบุ';
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});
    return Object.fromEntries(Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, limit));
}
