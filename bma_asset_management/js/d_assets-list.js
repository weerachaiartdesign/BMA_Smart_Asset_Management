/**
 * version 00032
 * Logic สำหรับหน้ารายการทรัพย์สิน (Desktop)
 */
function renderDesktopTable(data) {
  const container = document.getElementById('table-body');
  if (!container) return;

  container.innerHTML = data.map(item => `
    <tr class="hover:bg-emerald-50/40 transition">
      <td class="px-6 py-4 font-mono text-[11px] text-slate-500 font-bold">${item.id}</td>
      <td class="px-6 py-4 font-bold text-slate-700">${item.type}</td>
      <td class="px-6 py-4 text-xs text-slate-600 leading-relaxed">
          <div class="font-semibold">${item.brand || '-'}</div>
          <div class="text-slate-500">${item.model || '-'}</div>
          <div class="text-[10px] text-slate-400 italic">S/N: ${item.serial || '-'}</div>
      </td>
      <td class="px-6 py-4 text-right font-mono font-bold text-slate-700">฿${Number(item.value || 0).toLocaleString()}</td>
      <td class="px-6 py-4 text-xs leading-relaxed">
          <div class="font-bold text-slate-700">${item.dept}</div>
          <div class="text-slate-500 flex items-center gap-1 opacity-80">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg> 
            ${item.location || '-'}
          </div>
          <div class="text-emerald-600 font-semibold">${item.owner || '-'}</div>
      </td>
      <td class="px-6 py-4 text-center">
        <span class="px-3 py-1 rounded-full text-[10px] font-bold ${['ปกติ','ใช้งานได้'].some(s => String(item.status).includes(s)) ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}">${item.status}</span>
      </td>
      <td class="px-6 py-4 text-center">
        ${item.url ? `
          <a href="${item.url}" target="_blank" class="inline-flex p-2 text-[#12643a] hover:bg-emerald-50 rounded-full transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        ` : '<span class="text-slate-300">-</span>'}
      </td>
    </tr>
  `).join('');
}
