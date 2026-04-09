/**
 * version 00033
 * ฟังก์ชันจัดการ Dashboard สำหรับหน้าจอมือถือ
 */
function renderMobileDashboard(data) {
  const stats = {
    total: data.length,
    normal: data.filter(d => ['ปกติ','ใช้งานได้'].some(s => d.status.includes(s))).length,
    broken: data.filter(d => ['ชำรุด','พัง'].some(s => d.status.includes(s))).length
  };

  document.getElementById('m-total').innerText = stats.total.toLocaleString();
  document.getElementById('m-normal').innerText = stats.normal.toLocaleString();
  document.getElementById('m-broken').innerText = stats.broken.toLocaleString();

  const typeMap = groupAndSortData(data, 'type', 5);
  // ใช้กราฟแบบแนวนอนสำหรับมือถือเพื่อให้ดูง่ายขึ้น
  updateChart('mTypeChart', 'doughnut', Object.keys(typeMap), Object.values(typeMap));
}
