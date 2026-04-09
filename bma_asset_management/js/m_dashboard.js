/**
 * version 00033
 * ฟังก์ชันจัดการ Dashboard สำหรับหน้าจอมือถือ
 * ปรับปรุง: แสดงชื่อรายการไว้ที่ด้านข้างของกราฟวงกลม
 */
function renderMobileDashboard(data) {
  const stats = {
    total: data.length,
    normal: data.filter(d => ['ปกติ','ใช้งานได้'].some(s => d.status.includes(s))).length,
    broken: data.filter(d => ['ชำรุด','พัง'].some(s => d.status.includes(s))).length
  };

  const totalEl = document.getElementById('m-total');
  const normalEl = document.getElementById('m-normal');
  const brokenEl = document.getElementById('m-broken');
  
  if(totalEl) totalEl.innerText = stats.total.toLocaleString();
  if(normalEl) normalEl.innerText = stats.normal.toLocaleString();
  if(brokenEl) brokenEl.innerText = stats.broken.toLocaleString();

  const typeMap = groupAndSortData(data, 'type', 5);
  
  // เรียกใช้ฟังก์ชันวาดกราฟ พร้อมตั้งค่า Legend ไว้ด้านข้าง
  updateMobileChart('mTypeChart', 'doughnut', Object.keys(typeMap), Object.values(typeMap));
}

/**
 * ฟังก์ชันสำหรับวาดกราฟบนมือถือโดยเฉพาะ
 */
function updateMobileChart(id, type, labels, values) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  if (charts[id]) charts[id].destroy();

  charts[id] = new Chart(canvas, {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: ['#064e3b', '#059669', '#10b981', '#34d399', '#6ee7b7']
      }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right', // แสดงชื่อรายการด้านข้างขวา
          labels: {
            font: { family: 'Sarabun', size: 9 },
            boxWidth: 8
          }
        }
      }
    }
  });
}
