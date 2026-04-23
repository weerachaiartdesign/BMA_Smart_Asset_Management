/**
 * version 00001
 * ไฟล์: asset-detail.js
 * หน้าที่: จัดการการแสดงรายละเอียดทรัพย์สินแบบ Modal
 * รองรับ: ทั้ง Desktop และ Mobile
 */

// ตัวแปรสำหรับเก็บ Modal Element
let modalContainer = null;

/**
 * ฟังก์ชันเปิด Modal แสดงรายละเอียดทรัพย์สิน
 * @param {Object} item - ข้อมูลทรัพย์สิน
 */
function showAssetDetail(item) {
    // สร้าง Modal ถ้ายังไม่มี
    if (!modalContainer) {
        createModalContainer();
    }
    
    // แสดง Modal
    modalContainer.style.display = 'flex';
    
    // เติมข้อมูลลงใน Modal
    document.getElementById('detail-id').innerText = item.id || '-';
    document.getElementById('detail-type').innerText = item.type || '-';
    document.getElementById('detail-brand').innerText = item.brand || '-';
    document.getElementById('detail-model').innerText = item.model || '-';
    document.getElementById('detail-serial').innerText = item.serial || '-';
    document.getElementById('detail-dept').innerText = item.dept || '-';
    document.getElementById('detail-location').innerText = item.location || '-';
    document.getElementById('detail-owner').innerText = item.owner || '-';
    
    // ข้อมูลเพิ่มเติม (ถ้ามี)
    document.getElementById('detail-acquired').innerText = item.acquired_date || '-';
    document.getElementById('detail-price').innerText = item.price ? formatPrice(item.price) : '-';
    document.getElementById('detail-age').innerText = item.age ? calculateAge(item.age) : '-';
    document.getElementById('detail-remark').innerText = item.remark || '-';
    
    // จัดการสถานะ
    const statusEl = document.getElementById('detail-status');
    if (statusEl) {
        statusEl.innerText = item.status || '-';
        if (item.status && (item.status.includes('ปกติ') || item.status.includes('ใช้งานได้'))) {
            statusEl.className = 'px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700';
        } else if (item.status && (item.status.includes('ชำรุด') || item.status.includes('พัง') || item.status.includes('รอซ่อม'))) {
            statusEl.className = 'px-3 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700';
        } else if (item.status && item.status.includes('รอจำหน่าย')) {
            statusEl.className = 'px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600';
        } else {
            statusEl.className = 'px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600';
        }
    }
    
    // จัดการลิงก์ URL
    const urlLink = document.getElementById('detail-url');
    if (urlLink) {
        if (item.url) {
            urlLink.href = item.url;
            urlLink.style.display = 'flex';
        } else {
            urlLink.style.display = 'none';
        }
    }
    
    // จัดการรูปภาพ (เตรียมไว้สำหรับอนาคต)
    const imageSection = document.getElementById('detail-image-section');
    const imageContainer = document.getElementById('detail-images');
    if (imageSection && imageContainer) {
        if (item.images && item.images.length > 0) {
            imageSection.style.display = 'block';
            imageContainer.innerHTML = item.images.map(img => `
                <img src="${img}" class="detail-image" onclick="openImageZoom('${img}')" alt="รูปภาพประกอบ">
            `).join('');
        } else {
            imageSection.style.display = 'none';
        }
    }
    
    // ป้องกันการ scroll ของ body ข้างหลัง
    document.body.style.overflow = 'hidden';
}

/**
 * ฟังก์ชันปิด Modal
 * @param {Event} event - Event object (optional)
 */
function closeAssetDetail(event) {
    // ถ้ามี event และ target ไม่ใช่ overlay ให้ไม่ทำอะไร
    if (event && event.target !== event.currentTarget) {
        return;
    }
    
    if (modalContainer) {
        modalContainer.style.display = 'none';
        // คืนค่า scroll ของ body
        document.body.style.overflow = '';
    }
}

/**
 * ฟังก์ชันสร้าง Modal Container (โหลดจาก asset-detail.html)
 */
async function createModalContainer() {
    try {
        const response = await fetch('asset-detail.html');
        const html = await response.text();
        
        // สร้าง div สำหรับใส่ Modal
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = html;
        modalContainer = modalDiv.firstElementChild;
        
        // เพิ่ม Modal เข้าไปใน body
        document.body.appendChild(modalContainer);
        
        // ซ่อนไว้ก่อน
        modalContainer.style.display = 'none';
        
    } catch (error) {
        console.error('ไม่สามารถโหลด Modal template:', error);
    }
}

/**
 * ฟังก์ชันจัดรูปแบบราคา
 * @param {number|string} price - ราคา
 * @returns {string} - ราคาที่จัดรูปแบบแล้ว
 */
function formatPrice(price) {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 0
    }).format(num);
}

/**
 * ฟังก์ชันคำนวณอายุการใช้งาน
 * @param {string|number} age - อายุ (ปี)
 * @returns {string} - ข้อความแสดงอายุ
 */
function calculateAge(age) {
    const years = parseInt(age);
    if (isNaN(years)) return age;
    return `${years} ปี`;
}

/**
 * ฟังก์ชันขยายรูปภาพ (เตรียมไว้สำหรับอนาคต)
 * @param {string} imgSrc - URL รูปภาพ
 */
function openImageZoom(imgSrc) {
    // TODO: สามารถเพิ่มฟังก์ชันขยายรูปภาพในอนาคต
    window.open(imgSrc, '_blank');
}
