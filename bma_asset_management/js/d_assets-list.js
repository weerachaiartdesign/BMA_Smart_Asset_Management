/**
 * version 00033
 * ฟังก์ชันสำหรับวาดตารางรายการทรัพย์สินบน Desktop
 */
function renderDesktopTable(data) {
  const body = document.getElementById('table-body');
  if (!body) return;

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
        ${item.url ? `<a href="${item.url}" target="_blank" class="text-emerald-600 hover:underline text-xs">Link</a>` : '-'}
      </td>
    </tr>
  `).join('');
}
