import { Chart as ChartJS, CategoryScale, LinearScale, BarElement  } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement );

const COLORS = { bar: ' #2a8dff', highlight: '#416B91', track: '#EEF2F6', text: '#1E293B', muted: '#718096' };

// 막대 오른쪽 끝에 "83개" 표시 (Chart.js 기본 기능에 없어 작은 플러그인으로 구현)
const valueLabelPlugin = {
  id: 'valueLabel',
  afterDatasetsDraw(chart, _args, opts) {
    const { ctx, chartArea } = chart;
    const meta = chart.getDatasetMeta(0);
    ctx.save();
    ctx.font = '600 12px sans-serif';
    ctx.fillStyle = opts.color;
    ctx.textBaseline = 'middle';
    meta.data.forEach((bar, i) => {
      ctx.fillText(`${chart.data.datasets[0].data[i]}${opts.unit}`, chartArea.right + 8, bar.y);
    });
    ctx.restore();
  },
};

/*
  가로형 게이지 막대 차트
  data:      [{ label: '일반주점', value: 83 }, ...]
  max:       게이지 최댓값 
 */
export const StoreGaugeChart =({ data = [], max, highlight, unit = '개', rowHeight = 40 }) => {
  if (!data.length) return <li style={{ color: COLORS.muted, fontSize: 13 }}>표시할 데이터가 없습니다.</li>;

  const values = data.map((d) => d.value); //선택한 행정동의 점포에 대한 점포수
  const domainMax = max ?? Math.max(...values, 1); 
  const bar = { barThickness: 12, borderRadius: 6, borderSkipped: false, grouped: false };

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      // 실제 값 
      { ...bar, label: '점포 수', data: values,
        backgroundColor: data.map((d) => (d.label === highlight ? COLORS.highlight : COLORS.bar)) },
      //회색 트랙 
      { ...bar, label: 'track', data: data.map(() => domainMax), backgroundColor: COLORS.track },
    ],
  };

  const options = {
    indexAxis: 'y',                 // 가로 막대
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { right: 48 } },
    scales: {
      x: { min: 0, max: domainMax, display: false },
      y: { grid: { display: false }, border: { display: false },
           ticks: { color: COLORS.text, font: { size:11 } } },
    },
    
    plugins: {
      legend: { display: false },
    
      
      
      valueLabel: { unit, color: COLORS.text },
    },
    
  };

  return (
    <div style={{ height: data.length * rowHeight + 16 }}>
      <Bar data={chartData} options={options} plugins={[valueLabelPlugin]} />
    </div>
  );
}