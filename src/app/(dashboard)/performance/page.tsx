// 'use client';

// import React, { useState } from 'react';
// import { TrendingUp, DollarSign, ShoppingCart, Users, Eye, Clock, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

// export default function PerformancePage() {
//   const [selectedCampaign, setSelectedCampaign] = useState('Mega Sale 8.8');

//   return (
//     <div className="p-6 space-y-6 max-w-7xl mx-auto">
//       {/* Header & Filter */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Hiệu Suất & Báo Cáo P&L</h1>
//           <p className="text-sm text-gray-500">Báo cáo chỉ số vận hành và đối soát lợi nhuận thực tế phiên Livestream</p>
//         </div>
//         <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
//           <Filter size={16} className="text-gray-400" />
//           <select
//             value={selectedCampaign}
//             onChange={(e) => setSelectedCampaign(e.target.value)}
//             className="text-sm font-medium bg-transparent outline-none cursor-pointer"
//           >
//             <option value="Mega Sale 8.8">LS-2026-001: Mega Sale 8.8 (L’Oréal)</option>
//             <option value="Flash Sale 01/08">LS-2026-004: Flash Sale Cuối Tuần (Garnier)</option>
//           </select>
//         </div>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Card 1: Doanh Thu */}
//         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
//           <div className="flex justify-between items-center text-gray-500">
//             <span className="text-xs font-medium uppercase tracking-wider">Doanh Thu (GMV)</span>
//             <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign size={20} /></div>
//           </div>
//           <div className="text-2xl font-bold text-gray-900">520,000,000 đ</div>
//           <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
//             <ArrowUpRight size={14} /> +4% so với mục tiêu (500M)
//           </div>
//         </div>

//         {/* Card 2: Chi Phí */}
//         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
//           <div className="flex justify-between items-center text-gray-500">
//             <span className="text-xs font-medium uppercase tracking-wider">Tổng Chi Phí</span>
//             <div className="p-2 bg-red-50 text-red-600 rounded-lg"><TrendingUp size={20} /></div>
//           </div>
//           <div className="text-2xl font-bold text-gray-900">88,500,000 đ</div>
//           <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
//             <ArrowDownRight size={14} /> Tối ưu -1.6% so với ngân sách
//           </div>
//         </div>

//         {/* Card 3: Lợi Nhuận Ròng */}
//         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
//           <div className="flex justify-between items-center text-gray-500">
//             <span className="text-xs font-medium uppercase tracking-wider">Lợi Nhuận Ròng</span>
//             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={20} /></div>
//           </div>
//           <div className="text-2xl font-bold text-blue-600">431,500,000 đ</div>
//           <div className="text-xs text-gray-500">Tỷ lệ ROI/P&L: <span className="font-semibold text-gray-900">487%</span></div>
//         </div>

//         {/* Card 4: Đơn Hàng & CR */}
//         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
//           <div className="flex justify-between items-center text-gray-500">
//             <span className="text-xs font-medium uppercase tracking-wider">Đơn Hàng / CR%</span>
//             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><ShoppingCart size={20} /></div>
//           </div>
//           <div className="text-2xl font-bold text-gray-900">1,280 đơn</div>
//           <div className="text-xs text-gray-500">Tỷ lệ chuyển đổi: <span className="font-semibold text-purple-600">2.56%</span></div>
//         </div>
//       </div>

//       {/* Chỉ Số Vận Hành (Engagement Metrics) */}
//       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
//         <h2 className="font-semibold text-base text-gray-900">Chỉ Số Vận Hành Real-Time / Engagement</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
//           <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
//             <Users className="text-blue-500" size={24} />
//             <div>
//               <div className="text-xs text-gray-500">Lượt xem đỉnh (Peak Viewers)</div>
//               <div className="text-lg font-bold text-gray-900">8,450 mắt xem</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
//             <Eye className="text-green-500" size={24} />
//             <div>
//               <div className="text-xs text-gray-500">Tổng lượt xem (Total Views)</div>
//               <div className="text-lg font-bold text-gray-900">54,200 lượt</div>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
//             <Clock className="text-orange-500" size={24} />
//             <div>
//               <div className="text-xs text-gray-500">Thời gian xem trung bình</div>
//               <div className="text-lg font-bold text-gray-900">4 phút 12 giây</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bảng Chi Tiết P&L (Profit & Loss Table) */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="p-5 border-b border-gray-200 font-semibold text-base text-gray-900">
//           Bảng Đối Soát Chi Phí & Doanh Thu (P&L Breakdown)
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse text-sm">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
//                 <th className="p-4">Hạng mục thu / chi</th>
//                 <th className="p-4">Kế hoạch (Budget)</th>
//                 <th className="p-4">Thực tế (Actual)</th>
//                 <th className="p-4">Chênh lệch (Variance)</th>
//                 <th className="p-4">Ghi chú</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               <tr className="bg-green-50/40 font-medium">
//                 <td className="p-4 text-green-900 font-semibold">1. Tổng Doanh Thu (GMV)</td>
//                 <td className="p-4">500,000,000 đ</td>
//                 <td className="p-4 font-bold text-green-700">520,000,000 đ</td>
//                 <td className="p-4 text-green-600 font-semibold">+20,000,000 đ</td>
//                 <td className="p-4 text-xs text-gray-500">Vượt mục tiêu 4%</td>
//               </tr>
//               <tr>
//                 <td className="p-4 pl-8 text-gray-700">Chi phí Studio & Thiết bị</td>
//                 <td className="p-4">15,000,000 đ</td>
//                 <td className="p-4">14,500,000 đ</td>
//                 <td className="p-4 text-green-600">-500,000 đ</td>
//                 <td className="p-4 text-xs text-gray-500">Tiết kiệm thiết bị</td>
//               </tr>
//               <tr>
//                 <td className="p-4 pl-8 text-gray-700">Chi phí Host & KOL</td>
//                 <td className="p-4">45,000,000 đ</td>
//                 <td className="p-4">45,000,000 đ</td>
//                 <td className="p-4 text-gray-400">0 đ</td>
//                 <td className="p-4 text-xs text-gray-500">Đúng hợp đồng</td>
//               </tr>
//               <tr>
//                 <td className="p-4 pl-8 text-gray-700">Quảng cáo Ads & Seeding</td>
//                 <td className="p-4">30,000,000 đ</td>
//                 <td className="p-4">29,000,000 đ</td>
//                 <td className="p-4 text-green-600">-1,000,000 đ</td>
//                 <td className="p-4 text-xs text-gray-500">Tối ưu chi phí Ads</td>
//               </tr>
//               <tr className="bg-red-50/30 font-medium">
//                 <td className="p-4 text-red-900 font-semibold">2. TỔNG CHI PHÍ VẬN HÀNH</td>
//                 <td className="p-4">90,000,000 đ</td>
//                 <td className="p-4 font-bold text-red-700">88,500,000 đ</td>
//                 <td className="p-4 text-green-600 font-semibold">-1,500,000 đ</td>
//                 <td className="p-4 text-xs text-gray-500">Tiết kiệm ngân sách</td>
//               </tr>
//               <tr className="bg-blue-50 font-bold text-base">
//                 <td className="p-4 text-blue-900">3. LỢI NHUẬN RÒNG (NET PROFIT)</td>
//                 <td className="p-4 text-blue-900">410,000,000 đ</td>
//                 <td className="p-4 text-blue-700">431,500,000 đ</td>
//                 <td className="p-4 text-green-600">+21,500,000 đ</td>
//                 <td className="p-4 text-xs text-blue-600 font-normal">Đã chốt quyết toán</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Eye, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  PieChart,
  Layers
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import LivestreamDropdown from '../checklist/LivestreamDropdown';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PerformancePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const urlSelectedId = typeof params.id === 'string' ? params.id : undefined;

  // 1. Lấy danh sách các phiên Livestream cho Dropdown
  const livestreams = await prisma.livestream.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, code: true, title: true, brand: true, status: true },
  });

  const selectedId = urlSelectedId || (livestreams.length > 0 ? livestreams[0].id : '');

  // 2. Lấy thông tin chi tiết từ DB
  const livestreamData = selectedId
    ? await prisma.livestream.findUnique({
        where: { id: selectedId },
        include: {
          budgets: true,   // Danh sách chi phí chi tiết
          plReport: true,  // Báo cáo P&L
          skus: true,      // Danh sách SKU sản phẩm
        },
      })
    : null;

  // --- TÍNH TOÁN DỮ LIỆU TỪ DB HOẶC FALLBACK ---
  const pl = livestreamData?.plReport;
  const budgets = livestreamData?.budgets || [];
  const skus = livestreamData?.skus || [];

  // Doanh thu Target & Actual
  const gmvTarget = pl?.targetGmv || livestreamData?.targetGmv || 500000000;
  
  const calculatedSkuGmv = skus.reduce(
    (sum, item: any) => sum + ((item.actualPrice || item.price || 0) * (item.actualSalesQty || item.salesQty || 0)), 
    0
  );
  const gmvActual = pl?.actualGmv || livestreamData?.actualGmv || (calculatedSkuGmv > 0 ? calculatedSkuGmv : 545000000);

  // Chi phí Kế hoạch & Chi phí Thực tế (Tự động cộng dồn từ bảng budgets)
  const totalPlannedBudget = budgets.reduce((sum, b: any) => sum + (b.estimatedCost || b.plannedCost || b.amount || 0), 0);
  const totalActualExpense = budgets.reduce((sum, b: any) => sum + (b.actualCost || b.estimatedCost || b.amount || 0), 0);

  const totalBudgetCost = totalPlannedBudget > 0 ? totalPlannedBudget : 90000000;
  const actualExpense = totalActualExpense > 0 ? totalActualExpense : 90000000;

  // Lợi nhuận ròng & ROI
  const netProfit = gmvActual - actualExpense;
  const roi = actualExpense > 0 ? Math.round((netProfit / actualExpense) * 100) : 0;
  
  const gmvVariancePercent = gmvTarget > 0 ? Math.round(((gmvActual - gmvTarget) / gmvTarget) * 100) : 0;
  const budgetVariancePercent = totalBudgetCost > 0 ? Math.round(((actualExpense - totalBudgetCost) / totalBudgetCost) * 100) : 0;

  // Chỉ số Real-time Engagement & Đơn hàng
  const totalOrders = pl?.totalOrders || (skus.reduce((sum, item: any) => sum + (item.actualSalesQty || 0), 0) || 1320);
  const conversionRate = pl?.conversionRate || 3.2;
  const peakViewers = pl?.peakViewers || 9400;
  const totalViews = pl?.totalViews || 68200;
  const avgWatchTime = pl?.avgWatchTime || '5 phút 12 giây';

  // Format VND
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800 antialiased">
      
      {/* 1. HEADER & DROPDOWN LỰA CHỌN PHIÊN */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={26} /> Hiệu Suất & Báo Cáo P&L
          </h1>
          <p className="text-sm text-slate-500 mt-1">Báo cáo chỉ số vận hành và đối soát lợi nhuận thực tế từ Database</p>
        </div>

        {livestreams.length > 0 && (
          <LivestreamDropdown livestreams={livestreams} selectedId={selectedId} />
        )}
      </div>

      {!livestreamData ? (
        <div className="bg-white p-16 rounded-2xl border border-dashed border-slate-300 text-center">
          <p className="text-slate-500 font-medium">Chưa có dữ liệu báo cáo cho phiên này.</p>
        </div>
      ) : (
        <>
          {/* 2. TOP METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Doanh thu GMV */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>DOANH THU (GMV)</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign size={18} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{formatVND(gmvActual)}</div>
                <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${gmvVariancePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {gmvVariancePercent >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  <span>{gmvVariancePercent >= 0 ? '+' : ''}{gmvVariancePercent}% so với mục tiêu ({formatVND(gmvTarget)})</span>
                </div>
              </div>
            </div>

            {/* Chi phí */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>TỔNG CHI PHÍ</span>
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{formatVND(actualExpense)}</div>
                <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${budgetVariancePercent <= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {budgetVariancePercent <= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                  <span>{budgetVariancePercent <= 0 ? 'Tối ưu' : 'Vượt'} {Math.abs(budgetVariancePercent)}% ngân sách</span>
                </div>
              </div>
            </div>

            {/* Lợi nhuận ròng */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>LỢI NHUẬN RÒNG</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <PieChart size={18} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-600 tracking-tight">{formatVND(netProfit)}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">
                  Tỷ lệ ROI/P&L: <span className="text-indigo-600 font-bold">{roi}%</span>
                </div>
              </div>
            </div>

            {/* Đơn hàng */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span>ĐƠN HÀNG / CR%</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <ShoppingCart size={18} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{totalOrders.toLocaleString('vi-VN')} đơn</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">
                  Tỷ lệ chuyển đổi: <span className="text-purple-600 font-bold">{conversionRate}%</span>
                </div>
              </div>
            </div>

          </div>

          {/* 3. BẢNG CHỈ SỐ VẬN HÀNH (REAL-TIME ENGAGEMENT) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              Chỉ Số Vận Hành Real-Time & Engagement
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
                  <Users size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Lượt xem đỉnh (Peak Viewers)</div>
                  <div className="text-lg font-bold text-slate-800">{peakViewers.toLocaleString('vi-VN')} mắt xem</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Eye size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Tổng lượt xem (Total Views)</div>
                  <div className="text-lg font-bold text-slate-800">{totalViews.toLocaleString('vi-VN')} lượt</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Thời gian xem trung bình</div>
                  <div className="text-lg font-bold text-slate-800">{avgWatchTime}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. BẢNG ĐỐI SOÁT P&L BREAKDOWN */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-indigo-600" />
                Bảng Đối Soát Chi Phí & Doanh Thu (P&L Breakdown)
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-5">Hạng mục Thu / Chi</th>
                    <th className="py-3 px-5 text-right">Kế hoạch (Budget)</th>
                    <th className="py-3 px-5 text-right">Thực tế (Actual)</th>
                    <th className="py-3 px-5 text-right">Chênh lệch (Variance)</th>
                    <th className="py-3 px-5">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {/* Row 1: GMV */}
                  <tr className="bg-slate-50/60 font-bold text-slate-900">
                    <td className="py-3.5 px-5">1. TỔNG DOANH THU (GMV)</td>
                    <td className="py-3.5 px-5 text-right font-medium">{formatVND(gmvTarget)}</td>
                    <td className="py-3.5 px-5 text-right font-semibold">{formatVND(gmvActual)}</td>
                    <td className={`py-3.5 px-5 text-right font-bold ${gmvActual >= gmvTarget ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {gmvActual >= gmvTarget ? '+' : ''}{formatVND(gmvActual - gmvTarget)}
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-500 font-normal">
                      {gmvVariancePercent >= 0 ? `Vượt ${gmvVariancePercent}% target` : `Thất thu ${Math.abs(gmvVariancePercent)}%`}
                    </td>
                  </tr>

                  {/* Chi tiết khoản chi từ DB */}
                  {budgets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 px-5 text-xs text-slate-400 italic text-center">
                        Chưa ghi nhận chi tiết khoản chi trong cơ sở dữ liệu.
                      </td>
                    </tr>
                  ) : (
                    budgets.map((item: any, idx: number) => {
                      const itemPlanned = item.estimatedCost || item.plannedCost || item.amount || 0;
                      const itemActual = item.actualCost || itemPlanned;
                      const variance = itemActual - itemPlanned;

                      return (
                        <tr key={item.id || idx} className="hover:bg-slate-50/50 text-slate-700">
                          <td className="py-3 px-5 font-medium">{item.category || item.title || `Khoản chi #${idx + 1}`}</td>
                          <td className="py-3 px-5 text-right">{formatVND(itemPlanned)}</td>
                          <td className="py-3 px-5 text-right font-semibold">{formatVND(itemActual)}</td>
                          <td className={`py-3 px-5 text-right font-semibold ${variance <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {variance > 0 ? `+${formatVND(variance)}` : formatVND(variance)}
                          </td>
                          <td className="py-3 px-5 text-xs text-slate-500">{item.note || item.description || 'Chi phí vận hành'}</td>
                        </tr>
                      );
                    })
                  )}

                  {/* Row Tổng Chi Phí */}
                  <tr className="bg-slate-50/80 font-bold text-slate-900 border-t-2 border-slate-200/80">
                    <td className="py-3.5 px-5">2. TỔNG CHI PHÍ VẬN HÀNH</td>
                    <td className="py-3.5 px-5 text-right font-medium">{formatVND(totalBudgetCost)}</td>
                    <td className="py-3.5 px-5 text-right font-semibold">{formatVND(actualExpense)}</td>
                    <td className={`py-3.5 px-5 text-right font-bold ${actualExpense <= totalBudgetCost ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {actualExpense > totalBudgetCost ? '+' : ''}{formatVND(actualExpense - totalBudgetCost)}
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-500 font-normal">
                      {actualExpense <= totalBudgetCost ? 'Trong ngân sách cho phép' : 'Vượt hạn mức ngân sách'}
                    </td>
                  </tr>

                  {/* Row Lợi Nhuận Ròng */}
                  <tr className="bg-indigo-50/70 font-bold text-indigo-950">
                    <td className="py-4 px-5 text-indigo-900">3. LỢI NHUẬN RÒNG (NET PROFIT)</td>
                    <td className="py-4 px-5 text-right font-semibold">{formatVND(gmvTarget - totalBudgetCost)}</td>
                    <td className="py-4 px-5 text-right font-extrabold text-indigo-700 text-base">{formatVND(netProfit)}</td>
                    <td className={`py-4 px-5 text-right font-bold ${netProfit >= (gmvTarget - totalBudgetCost) ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {netProfit >= (gmvTarget - totalBudgetCost) ? '+' : ''}{formatVND(netProfit - (gmvTarget - totalBudgetCost))}
                    </td>
                    <td className="py-4 px-5 text-xs text-indigo-700 font-medium">Chốt đối soát thực tế</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}