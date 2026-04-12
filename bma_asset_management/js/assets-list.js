/**
 * version 00033
 * ไฟล์รวมฟังก์ชันสำหรับแสดงผลรายการทรัพย์สินทั้ง Desktop และ Mobile
 */

/**
 * ฟังก์ชันสำหรับวาดตารางรายการทรัพย์สินบน Desktop
 */
function renderDesktopTable(data) {
  const body = document.getElementById('table-body');
  if (!body) return;

  if (data.length === 0) {
    body.innerHTML = `<tr><td colspan="6" class="px-6 py-10 text-center text-slate-400">ไม่พบข้อมูลที่ค้นหา</td></tr>`;
    return;
  }

  body.innerHTML = data.map(item => `
    <tr class="hover:bg-slate-50 transition border-b border-slate-100">
      <td class="px-6 py-4 font-mono text-xs font-bold text-slate-500">${item.id}</td>
      <td class="px-6 py-4 text-sm font-bold text-slate-700">${item.type}</td>
      <td class="px-6 py-4 text-xs text-slate-500">
        <div class="font-bold text-slate-700">${item.brand || '-'}</div>
        <div>${item.model || '-'}</div>
        <div class="text-[10px] opacity-70">S/N: ${item.serial || '-'}</div>
      </td>
      <td class="px-6 py-4 text-xs">
        <div class="font-bold text-slate-700">${item.dept}</div>
        <div class="text-slate-500">${item.location}</div>
        <div class="text-emerald-600 font-semibold">${item.owner}</div>
      </td>
      <td class="px-6 py-4 text-center">
        <span class="px-3 py-1 rounded-full text-[10px] font-bold ${item.status.includes('ปกติ') ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}">
          ${item.status}
        </span>
      </td>
      <td class="px-6 py-4 text-center">
        ${item.url ? `<a href="${item.url}" target="_blank" class="text-emerald-600 hover:underline text-xs font-bold">เปิดดู</a>` : '-'}
      </td>
    </tr>
  `).join('');
}

/**
 * ฟังก์ชันแสดงผลรายการทรัพย์สินแบบ Card สำหรับมือถือ
 */
function renderMobileTable(data) {
  const container = document.getElementById('mobile-list');
  if (!container) return;

  if (data.length === 0) {
    container.innerHTML = `<div class="p-8 text-center text-slate-400">ไม่พบข้อมูลที่ค้นหา</div>`;
    return;
  }

  container.innerHTML = data.map(item => `
    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3">
      <div class="flex justify-between items-start mb-2">
        <span class="text-[10px] font-mono font-bold text-slate-400">${item.id}</span>
        <span class="text-[9px] px-2 py-0.5 rounded-full font-bold ${item.status.includes('ปกติ') ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}">${item.status}</span>
      </div>
      <h4 class="font-bold text-slate-800 text-sm mb-1">${item.type}</h4>
      <div class="text-[11px] text-slate-500 space-y-0.5 border-l-2 border-slate-100 pl-2">
        <div class="font-bold text-slate-700">${item.brand || ''} ${item.model || ''}</div>
        <div>หน่วยงาน: ${item.dept}</div>
        <div class="text-emerald-600 font-semibold">ผู้รับผิดชอบ: ${item.owner}</div>
      </div>
      ${item.url ? `
      <div class="mt-3 pt-2 border-t border-slate-50">
        <a href="${item.url}" target="_blank" class="text-emerald-600 text-[10px] font-bold block text-right">ดูรายละเอียดเพิ่มเติม →</a>
      </div>` : ''}
    </div>
  `).join('');
}
