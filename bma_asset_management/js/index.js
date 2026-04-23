/**
 * version 00044 (Fixed)
 * ไฟล์: index.js
 * หน้าที่: จัดการการนำทาง, การพับเมนู Sidebar, และควบคุมการวาดกราฟให้เสถียร
 */

let globalData = [];    
let charts = {};        
let currentTab = 'dashboard'; 
let isMobile = window.innerWidth < 768;

window.onload = fetchData; 

window.onresize = () => {
    const newIsMobile = window.innerWidth < 768;
    if(newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        renderCurrentPage();
    }
};

/**
 * toggleSidebar: สลับการแสดงผล Sidebar (ยุบ/ขยาย)
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        
        // บันทึกสถานะเพื่อคงไว้เมื่อ Refresh หน้าจอ
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
        
        // บังคับให้กราฟ Resize ตามพื้นที่ที่เปลี่ยนไปหลังจาก Animation จบ
        setTimeout(() => {
            Object.values(charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') chart.resize();
            });
        }, 350);
    }
}

/**
 * fetchData: ดึงข้อมูลจาก Google Apps Script
 */
async function fetchData() {
    const loadingText = document.getElementById('loading-text');
    try {
        if (typeof WEB_APP_URL === 'undefined') throw new Error("กรุณาตรวจสอบไฟล์ api-config.js");
        
        const response = await fetch(WEB_APP_URL);
        globalData = await response.json();
        
        if (globalData.error) throw new Error(globalData.error);
        
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.classList.add('hidden');
                // คืนค่าสถานะ Sidebar ที่เคยบันทึกไว้
                if (localStorage.getItem('sidebarCollapsed') === 'true') {
                    document.getElementById('sidebar')?.classList.add('collapsed');
                }
                renderCurrentPage();
            }, 500);
        }
    } catch (err) {
        if (loadingText) loadingText.innerText = "เกิดข้อผิดพลาด: " + err.message;
        console.error("Fetch error:", err);
    }
}

/**
 * switchTab: เปลี่ยนหน้าระหว่าง Dashboard และ Inventory
 */
function switchTab(tabId) {
    if (currentTab === tabId) return;
    currentTab = tabId;
    renderCurrentPage();
}

/**
 * renderCurrentPage: โหลด HTML Template และสั่งวาดข้อมูล
 */
async function renderCurrentPage() {
    const mainContent = document.getElementById('main-content');
    const pageTitle = document.getElementById('page-title');
    
    updateNavUI();

    try {
        const fileName = currentTab === 'dashboard' ? 'dashboard.html' : 'assets-list.html';
        const response = await fetch(fileName);
        const html = await response.text();
        
        // ฉีด HTML เข้าไปในหน้าจอ
        mainContent.innerHTML = html;
        pageTitle.innerText = currentTab === 'dashboard' ? 'ภาพรวมระบบ' : 'รายการทรัพย์สิน';

        // สำคัญมาก: ใช้ requestAnimationFrame เพื่อให้ Browser วาด DOM เสร็จก่อนวาดกราฟ
        requestAnimationFrame(() => {
            setTimeout(() => {
                if (currentTab === 'dashboard') {
                    if (isMobile) {
                        if (typeof renderMobileDashboard === 'function') renderMobileDashboard(globalData);
                    } else {
                        if (typeof renderDesktopDashboard === 'function') renderDesktopDashboard(globalData);
                    }
                } else {
                    if (isMobile) {
                        if (typeof renderMobileTable === 'function') renderMobileTable(globalData);
                    } else {
                        if (typeof renderDesktopTable === 'function') renderDesktopTable(globalData);
                    }
                }
            }, 50); // Delay สั้นๆ เพื่อความมั่นใจว่า Canvas Element พร้อมรับ Context
        });

    } catch (err) {
        mainContent.innerHTML = `<div class="p-8 text-red-500">ไม่สามารถโหลดหน้าได้: ${err.message}</div>`;
    }
}

function updateNavUI() {
    ['dashboard', 'inventory'].forEach(t => {
        const btn = document.getElementById(`btn-${t}`);
        if (btn) t === currentTab ? btn.classList.add('active') : btn.classList.remove('active');
        
        const mBtn = document.getElementById(`m-btn-${t}`);
        if (mBtn) {
            if (t === currentTab) {
                mBtn.classList.replace('text-white/50', 'text-white');
            } else {
                mBtn.classList.replace('text-white', 'text-white/50');
            }
        }
    });
}

function filterTable() {
    const query = document.getElementById('searchInput')?.value.toLowerCase() || "";
    const filtered = globalData.filter(item => 
        (item.type?.toLowerCase().includes(query)) || 
        (item.id?.toLowerCase().includes(query)) ||
        (item.dept?.toLowerCase().includes(query))
    );
    
    if (isMobile) {
        if (typeof renderMobileTable === 'function') renderMobileTable(filtered);
    } else {
        if (typeof renderDesktopTable === 'function') renderDesktopTable(filtered);
    }
}

function groupAndSortData(data, key, limit) {
    const counts = data.reduce((acc, curr) => {
        const val = curr[key] || 'ไม่ระบุ';
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, limit);
}
