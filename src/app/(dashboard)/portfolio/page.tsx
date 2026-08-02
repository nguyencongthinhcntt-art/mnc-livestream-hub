// import StatusSelect from './StatusSelect';
// import React from 'react';
// import { Search } from 'lucide-react';
// import { getLivestreams } from './actions';
// import CreateLivestreamModal from './CreateLivestreamModal';

// export default async function PortfolioPage() {
//   const portfolios = await getLivestreams();

//   const getStatusBadge = (status: string) => {
//     const styles: Record<string, string> = {
//       Draft: 'bg-gray-100 text-gray-700 border-gray-300',
//       Approved: 'bg-blue-50 text-blue-700 border-blue-200',
//       Preparing: 'bg-yellow-50 text-yellow-700 border-yellow-200',
//       Live: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
//       Completed: 'bg-green-50 text-green-700 border-green-200',
//     };
//     return (
//       <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.Draft}`}>
//         {status}
//       </span>
//     );
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Livestream Portfolio</h1>
//           <p className="text-sm text-gray-500">Quản lý tập trung toàn bộ danh sách các phiên Livestream (Real-time Database)</p>
//         </div>
        
//         {/* Nút bấm mở Modal tạo mới */}
//         <CreateLivestreamModal />
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
//         <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-80">
//           <Search size={18} className="text-gray-400" />
//           <input
//             type="text"
//             placeholder="Tìm theo tên hoặc mã chương trình..."
//             className="w-full text-sm outline-none bg-transparent"
//           />
//         </div>
//         <div className="flex items-center gap-3">
//           <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
//             <option value="All">Tất cả thương hiệu</option>
//             <option value="L’Oréal Paris">L’Oréal Paris</option>
//             <option value="Maybelline">Maybelline</option>
//             <option value="3CE">3CE</option>
//           </select>
//         </div>
//       </div>

//       {/* Data Table */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 <th className="p-4">Mã / Tên Livestream</th>
//                 <th className="p-4">Thương hiệu</th>
//                 <th className="p-4">Nền tảng</th>
//                 <th className="p-4">Thời gian phát</th>
//                 <th className="p-4">Phụ trách</th>
//                 <th className="p-4">GMV Mục tiêu / Thực tế</th>
//                 <th className="p-4">Trạng thái</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 text-sm">
//               {portfolios.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="p-8 text-center text-gray-500">
//                     Chưa có chương trình Livestream nào. Hãy bấm nút "Tạo chương trình mới" ở trên nhé!
//                   </td>
//                 </tr>
//               ) : (
//                 portfolios.map((item) => (
//                   <tr key={item.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="p-4">
//                       <div className="font-semibold text-gray-900">{item.title}</div>
//                       <div className="text-xs text-gray-500">{item.code}</div>
//                     </td>
//                     <td className="p-4 text-gray-700">{item.brand}</td>
//                     <td className="p-4 text-gray-700">{item.platform}</td>
//                     <td className="p-4 text-gray-600 text-xs">
//                       {new Date(item.dateTime).toLocaleString('vi-VN')}
//                     </td>
//                     <td className="p-4 text-gray-700">{item.owner}</td>
//                     <td className="p-4">
//                       <div className="font-medium text-gray-900">{Number(item.actualGMV).toLocaleString('vi-VN')} đ</div>
//                       <div className="text-xs text-gray-400">Mục tiêu: {Number(item.targetGMV).toLocaleString('vi-VN')} đ</div>
//                     </td>
//                     <td className="p-4"><StatusSelect id={item.id} initialStatus={item.status} /></td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import StatusSelect from './StatusSelect';
import React from 'react';
import { getLivestreams } from './actions';
import CreateLivestreamModal from './CreateLivestreamModal';
import PortfolioFilters from './PortfolioFilters';
import { Radio, Video, Clock, DollarSign, Calendar, User, Sparkles } from 'lucide-react';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PortfolioPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchKeyword = params.search || '';
  const selectedBrand = params.brand || '';

  const allPortfolios = await getLivestreams();

  // Lọc dữ liệu trực tiếp trên Server
  const portfolios = allPortfolios.filter((item) => {
    const searchLower = searchKeyword.toLowerCase();
    const matchesSearch =
      !searchKeyword ||
      item.title?.toLowerCase().includes(searchLower) ||
      item.code?.toLowerCase().includes(searchLower);

    const matchesBrand =
      !selectedBrand || selectedBrand === 'All' || item.brand === selectedBrand;

    return matchesSearch && matchesBrand;
  });

  const uniqueBrands = Array.from(new Set(allPortfolios.map((item) => item.brand))).filter(Boolean);

  // Thống kê nhanh
  const liveCount = allPortfolios.filter((i) => i.status === 'Live').length;
  const preparingCount = allPortfolios.filter((i) => i.status === 'Preparing').length;
  const totalActualGMV = allPortfolios.reduce((sum, item) => sum + (Number(item.actualGMV) || 0), 0);

  // Tag nền tảng
  const getPlatformBadge = (platform: string) => {
    const p = platform?.toLowerCase() || '';
    if (p.includes('shopee')) {
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-orange-50 text-orange-600 border border-orange-200/60">Shopee</span>;
    }
    if (p.includes('tiktok')) {
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white">TikTok Shop</span>;
    }
    if (p.includes('lazada')) {
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 border border-blue-200/60">Lazada</span>;
    }
    return <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600">{platform}</span>;
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Livestream Portfolio</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Sparkles size={12} /> Real-time
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Quản lý và theo dõi tập trung toàn bộ chiến dịch Livestream của doanh nghiệp</p>
        </div>
        
        <CreateLivestreamModal />
      </div>

      {/* Thẻ thống kê KPI lấp đầy khoảng trống */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng chương trình</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{allPortfolios.length}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Video size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Đang Phát (Live)</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{liveCount}</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl relative">
            <Radio size={22} className={liveCount > 0 ? "animate-pulse" : ""} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Đang Chuẩn Bị</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{preparingCount}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng GMV Thực Tế</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {totalActualGMV.toLocaleString('vi-VN')} <span className="text-xs font-normal text-slate-400">đ</span>
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign size={22} />
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <PortfolioFilters 
        uniqueBrands={uniqueBrands} 
        searchKeyword={searchKeyword} 
        selectedBrand={selectedBrand} 
      />

      {/* Table Data */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Chương trình</th>
                <th className="p-4">Thương hiệu</th>
                <th className="p-4">Nền tảng</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4">Phụ trách</th>
                <th className="p-4">Mục tiêu vs Thực tế (GMV)</th>
                <th className="p-4 pr-6">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {portfolios.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">
                    Không tìm thấy chương trình Livestream nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                portfolios.map((item) => {
                  const target = Number(item.targetGMV) || 0;
                  const actual = Number(item.actualGMV) || 0;
                  const percent = target > 0 ? Math.min(Math.round((actual / target) * 100), 100) : 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-4 pl-6 max-w-xs">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-xs font-mono text-slate-400 mt-0.5">{item.code}</div>
                      </td>

                      <td className="p-4">
                        <span className="font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-xs">
                          {item.brand}
                        </span>
                      </td>

                      <td className="p-4">
                        {getPlatformBadge(item.platform)}
                      </td>

                      <td className="p-4 text-slate-600 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Calendar size={13} className="text-slate-400 shrink-0" />
                          <span>{new Date(item.dateTime).toLocaleString('vi-VN')}</span>
                        </div>
                      </td>

                      <td className="p-4 text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <User size={13} className="text-slate-400 shrink-0" />
                          <span>{item.owner}</span>
                        </div>
                      </td>

                      <td className="p-4 min-w-[180px]">
                        <div className="flex justify-between items-baseline mb-1 text-xs">
                          <span className="font-bold text-slate-900">{actual.toLocaleString('vi-VN')} đ</span>
                          <span className="text-[11px] text-slate-400">MT: {target.toLocaleString('vi-VN')} đ</span>
                        </div>
                        {/* Thanh tiến độ GMV */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </td>

                      <td className="p-4 pr-6">
                        <StatusSelect id={item.id} initialStatus={item.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}