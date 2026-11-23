'use client';

import { useState, useMemo } from 'react';
import { PieChart as PieChartIcon, TrendingDown, TrendingUp, Info } from 'lucide-react';
import { RwCashTransactionItem } from '@/types';

interface KasPieChartProps {
  transactions: RwCashTransactionItem[];
}

// Skema warna harmonis untuk masing-masing kategori
const CATEGORY_COLORS: Record<string, string> = {
  // Pengeluaran
  'Keamanan & Satpam': '#3b82f6', // Biru
  'Kebersihan & Sampah': '#10b981', // Hijau Emerald
  'Perawatan Sarana & Prasarana': '#f59e0b', // Amber
  'Listrik Pos RW & PJU': '#eab308', // Kuning
  'Kegiatan Lingkungan & PHBI': '#8b5cf6', // Ungu
  'Santunan & Sosial Warga': '#ec4899', // Pink Rose
  'Operasional & ATK RW': '#64748b', // Slate
  'Pengeluaran Lainnya': '#94a3b8',
  
  // Pemasukan
  'Iuran Warga': '#16a34a', // Hijau Tua
  'Donasi & Sukarela': '#06b6d4', // Cyan
  'Sewa Fasilitas RW': '#6366f1', // Indigo
  'Bantuan Pemerintah/Kelurahan': '#f97316', // Oranye
  'Kas Lainnya': '#a855f7', // Violet
};

// Fallback palette jika ada kategori kustom
const PALETTE = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', 
  '#06b6d4', '#f97316', '#14b8a6', '#6366f1', '#84cc16'
];

interface ChartItem {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

interface SliceItem extends ChartItem {
  path: string;
  startAngle: number;
  endAngle: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function computeSlices(
  chartData: ChartItem[],
  center: number,
  radius: number,
  holeRadius: number
): SliceItem[] {
  let currentAngle = 0;
  return chartData.map((item) => {
    const angle = (item.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    // Handle full 100% single category circle edge case
    if (item.percentage >= 99.9) {
      return {
        ...item,
        path: `
          M ${center} ${center - radius}
          A ${radius} ${radius} 0 1 0 ${center} ${center + radius}
          A ${radius} ${radius} 0 1 0 ${center} ${center - radius}
          M ${center} ${center - holeRadius}
          A ${holeRadius} ${holeRadius} 0 1 1 ${center} ${center + holeRadius}
          A ${holeRadius} ${holeRadius} 0 1 1 ${center} ${center - holeRadius}
          Z
        `,
        startAngle,
        endAngle,
      };
    }

    const p1 = polarToCartesian(center, center, radius, endAngle);
    const p2 = polarToCartesian(center, center, radius, startAngle);
    const p3 = polarToCartesian(center, center, holeRadius, startAngle);
    const p4 = polarToCartesian(center, center, holeRadius, endAngle);
    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = [
      `M ${p2.x} ${p2.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${p1.x} ${p1.y}`,
      `L ${p4.x} ${p4.y}`,
      `A ${holeRadius} ${holeRadius} 0 ${largeArcFlag} 0 ${p3.x} ${p3.y}`,
      'Z',
    ].join(' ');

    return {
      ...item,
      path,
      startAngle,
      endAngle,
    };
  });
}

export default function KasPieChart({ transactions }: KasPieChartProps) {
  const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Kalkulasi agregasi berdasarkan kategori
  const { chartData, totalAmount } = useMemo(() => {
    const filtered = transactions.filter((t) => t.type === activeTab);
    const categoryTotals: Record<string, number> = {};
    let total = 0;

    for (const t of filtered) {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      total += t.amount;
    }

    const items = Object.entries(categoryTotals)
      .map(([category, amount], idx) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: CATEGORY_COLORS[category] || PALETTE[idx % PALETTE.length],
      }))
      .sort((a, b) => b.amount - a.amount);

    return { chartData: items, totalAmount: total };
  }, [transactions, activeTab]);

  // Kalkulasi koordinat SVG Pie/Donut (Path Segments)
  const size = 260;
  const center = size / 2;
  const radius = 95;
  const holeRadius = 58; // Donut style

  const slices = useMemo(
    () => computeSlices(chartData, center, radius, holeRadius),
    [chartData, center, radius, holeRadius]
  );

  return (
    <div className="card p-6 bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* Header & Tab Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-(--color-rw-primary)" />
            Diagram Alokasi Dana Kas RW
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Visualisasi persentase penggunaan dana dan komposisi sumber kas.
          </p>
        </div>

        <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('EXPENSE');
              setHoveredIndex(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'EXPENSE'
                ? 'bg-white text-red-600 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('INCOME');
              setHoveredIndex(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'INCOME'
                ? 'bg-white text-green-700 shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Pemasukan
          </button>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
          {/* Sisi Kiri: Donut Chart SVG */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-65 h-65">
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                {slices.map((slice, idx) => {
                  const isHovered = hoveredIndex === idx;
                  return (
                    <path
                      key={slice.category}
                      d={slice.path}
                      fill={slice.color}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-all duration-300 cursor-pointer"
                      style={{
                        transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                        transformOrigin: `${center}px ${center}px`,
                        filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none',
                      }}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                })}
              </svg>

              {/* Teks di tengah Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {hoveredIndex !== null ? chartData[hoveredIndex].category : 'Total'}
                </span>
                <span className="text-base font-extrabold text-gray-900 mt-0.5">
                  {hoveredIndex !== null
                    ? `${chartData[hoveredIndex].percentage.toFixed(1)}%`
                    : formatRupiah(totalAmount)}
                </span>
                {hoveredIndex !== null && (
                  <span className="text-[10px] text-gray-500 font-medium">
                    {formatRupiah(chartData[hoveredIndex].amount)}
                  </span>
                )}
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mt-4 text-center">
              Arahkan kursor / klik pada bagian diagram untuk melihat rincian
            </p>
          </div>

          {/* Sisi Kanan: Legend & Persentase Bar */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 pb-1 uppercase tracking-wider">
              <span>Pos Kategori</span>
              <span>Nominal & Porsi</span>
            </div>

            <div className="space-y-2.5 max-h-75 overflow-y-auto pr-1">
              {chartData.map((item, idx) => {
                const isHovered = hoveredIndex === idx;
                return (
                  <div
                    key={item.category}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isHovered
                        ? 'border-(--color-rw-primary) bg-emerald-50/40 shadow-xs'
                        : 'border-gray-100 bg-gray-50/50 hover:bg-gray-100/60'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <div className="flex items-center gap-2 font-bold text-gray-800">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-gray-900">{formatRupiah(item.amount)}</span>
                        <span className="text-gray-400 text-[11px] ml-1.5 font-semibold">
                          ({item.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Proportion Bar */}
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-gray-400">
          <Info className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p className="font-semibold text-gray-600">
            Belum ada transaksi {activeTab === 'EXPENSE' ? 'pengeluaran' : 'pemasukan'} yang tercatat.
          </p>
        </div>
      )}
    </div>
  );
}
