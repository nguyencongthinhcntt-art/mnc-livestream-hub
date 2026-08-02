import React from 'react';
import { DollarSign, Package, Plus, Calculator, CheckCircle2, Tag, AlertTriangle, Check, TrendingUp, Wallet, ShoppingBag } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import LivestreamSelector from './LivestreamSelector';
import { 
  addBudgetItem, 
  deleteBudgetItem, 
  addSKUItem, 
  deleteSKUItem, 
  addVoucherItem,
  deleteVoucherItem, 
  updatePlanningStatus 
} from './actions';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PlanningPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const urlSelectedId = typeof params.id === 'string' ? params.id : undefined;

  const livestreams = await prisma.livestream.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, code: true, title: true, brand: true, status: true },
  });

  const selectedId = urlSelectedId || (livestreams.length > 0 ? livestreams[0].id : '');

  const planningData = selectedId
    ? await prisma.livestream.findUnique({
        where: { id: selectedId },
        include: { 
          budgets: true, 
          skus: true, 
          vouchers: true 
        },
      })
    : null;

  // --- TÍNH TOÁN CHỈ SỐ P&L SIMULATOR ---
  const targetGMV = Number(planningData?.targetGMV || 0);
  const totalBudget = planningData?.budgets?.reduce((acc: number, b: any) => acc + Number(b.estimatedCost), 0) || 0;
  
  // Ước tính Phí sàn & Vận hành E-com (~10% GMV)
  const estimatedPlatformFee = targetGMV * 0.10;
  
  // Ước tính GMV tối đa dựa trên Tồn kho SKUs
  const maxPotentialGMV = planningData?.skus?.reduce((acc: number, s: any) => acc + (Number(s.streamPrice) * Number(s.stockAllocated)), 0) || 0;

  // Tỷ lệ Ngân sách / Target GMV
  const budgetRatioNum = targetGMV > 0 ? (totalBudget / targetGMV) * 100 : 0;
  const budgetRatio = budgetRatioNum.toFixed(1);
  
  // ROI Dự kiến
  const expectedROINum = totalBudget > 0 ? targetGMV / totalBudget : 0;
  const expectedROI = expectedROINum.toFixed(2);

  const isStockEnough = maxPotentialGMV >= targetGMV;

  const isApproved = planningData?.status === 'Approved' || planningData?.status === 'APPROVED';

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Top Bar: Selector & Nút Phê Duyệt Kế Hoạch */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lập Kế Hoạch & P&L Dự Toán</h1>
            <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
              isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
             {isApproved ? '✓ Đã chốt kế hoạch' : '⏳ Đang lên nháp'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Mô phỏng P&L, Phân bổ Ngân sách & Chiến lược Deal Matrix</p>
        </div>

        <div className="flex items-center gap-3">
          {livestreams.length > 0 && (
            <LivestreamSelector livestreams={livestreams} selectedId={selectedId} />
          )}

          {planningData && (
            <form action={async () => {
              'use server';
              // Truyền trực tiếp status hiện tại sang cho updatePlanningStatus trong actions.ts xử lý
              await updatePlanningStatus(selectedId, planningData.status);
            }}>
              <button
                type="submit"
                className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isApproved 
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 shadow-md'
                }`}
              >
                <CheckCircle2 size={18} />
                {isApproved ? 'Chuyển về Draft' : 'Duyệt Kế Hoạch'}
              </button>
            </form>
          )}
        </div>
      </div>

      {!planningData ? (
        <div className="bg-white p-16 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            📡
          </div>
          <p className="text-slate-600 font-semibold">Chưa có phiên Livestream nào trong hệ thống.</p>
          <p className="text-xs text-slate-400">Vui lòng tạo phiên livestream mới từ menu Portfolio.</p>
        </div>
      ) : (
        <>
          {/* Dashboard P&L Simulator */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Calculator size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold uppercase tracking-wider text-emerald-400">P&L Simulator & Financial Health Check</h2>
                  <p className="text-xs text-slate-400">Chỉ số tài chính mô phỏng theo thời gian thực</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Target GMV */}
              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/60 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Target GMV</span>
                  <TrendingUp size={14} className="text-slate-400" />
                </div>
                <div className="text-xl font-extrabold text-white mt-2">{targetGMV.toLocaleString('vi-VN')} đ</div>
              </div>

              {/* Ngân sách */}
              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/60 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Tổng Ngân Sách</span>
                  <Wallet size={14} className="text-amber-400" />
                </div>
                <div className="text-xl font-extrabold text-amber-400 mt-2">{totalBudget.toLocaleString('vi-VN')} đ</div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(budgetRatioNum, 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-medium">Tỷ lệ: {budgetRatio}% GMV</div>
              </div>

              {/* Phí sàn */}
              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/60 shadow-inner">
                <div className="text-xs text-slate-400 font-medium">Phí Sàn Dự Kiến (10%)</div>
                <div className="text-xl font-extrabold text-rose-400 mt-2">{estimatedPlatformFee.toLocaleString('vi-VN')} đ</div>
                <div className="text-[10px] text-slate-400 mt-1 font-medium">Phí hoa hồng sàn & thanh toán</div>
              </div>

              {/* ROI */}
              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/60 shadow-inner">
                <div className="text-xs text-slate-400 font-medium">ROI Dự Kiến (GMV/CP)</div>
                <div className={`text-2xl font-black mt-1 ${expectedROINum >= 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {expectedROI}x
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-medium">Mục tiêu tối thiểu: {expectedROINum >= 5 ? '✅ Đạt chuẩn' : '⚠️ Cần tối ưu'}</div>
              </div>

              {/* GMV Kho cấp */}
              <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/60 shadow-inner">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>GMV Kho Cấp Tối Đa</span>
                  <ShoppingBag size={14} className="text-purple-400" />
                </div>
                <div className="text-xl font-extrabold text-purple-300 mt-2">{maxPotentialGMV.toLocaleString('vi-VN')} đ</div>
                <div className="mt-2">
                  {isStockEnough ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      <Check size={12} /> Đủ hàng đạt Target
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-md animate-pulse">
                      <AlertTriangle size={12} /> Cảnh báo thiếu hàng!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Ngân Sách */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <DollarSign size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">1. Dự Toán Ngân Sách Chi Tiết</h2>
                <p className="text-xs text-slate-500">Phân bổ chi phí cho Host, Ads, Studio và Seeding</p>
              </div>
            </div>

            <form action={async (formData: FormData) => {
              'use server';
              const category = formData.get('category') as string;
              const estimatedCost = Number(formData.get('estimatedCost'));
              const notes = formData.get('notes') as string;
              await addBudgetItem({ livestreamId: selectedId, category, estimatedCost, notes });
            }} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <select name="category" className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none bg-white font-medium text-slate-700 focus:ring-2 focus:ring-amber-500/20">
                <option value="Host / KOL">Host / KOL</option>
                <option value="Studio / Thiết bị">Studio / Thiết bị</option>
                <option value="Quảng cáo (Ads/Traffic)">Quảng cáo (Ads/Traffic)</option>
                <option value="Seeding / Quà tặng">Seeding / Quà tặng</option>
                <option value="Chi phí khác">Chi phí khác</option>
              </select>

              <input type="number" name="estimatedCost" placeholder="Chi phí (VNĐ)" required className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-amber-500/20" />
              <input type="text" name="notes" placeholder="Ghi chú chi tiết" className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-amber-500/20" />

              <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold py-2 flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer">
                <Plus size={16} /> Thêm Chi Phí
              </button>
            </form>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3.5">Hạng mục</th>
                    <th className="p-3.5">Chi phí dự toán</th>
                    <th className="p-3.5">Ghi chú</th>
                    <th className="p-3.5 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {planningData.budgets?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center bg-slate-50/50">
                        <div className="text-slate-400 text-xs font-medium">Chưa có khoản chi phí nào được tạo.</div>
                      </td>
                    </tr>
                  ) : (
                    planningData.budgets?.map((b: any) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-semibold text-slate-800">{b.category}</td>
                        <td className="p-3.5 font-bold text-amber-700">{Number(b.estimatedCost).toLocaleString('vi-VN')} đ</td>
                        <td className="p-3.5 text-slate-500 text-xs">{b.notes || '-'}</td>
                        <td className="p-3.5 text-center">
                          <form action={async () => {
                            'use server';
                            await deleteBudgetItem(b.id);
                          }}>
                            <button type="submit" className="text-rose-500 hover:text-rose-700 text-xs font-semibold hover:underline cursor-pointer">
                              Xóa
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: SKU Matrix & Deal Strategy */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">2. Danh Mục Sản Phẩm & Chiến Lược Deal (SKU Matrix)</h2>
                <p className="text-xs text-slate-500">Phân bổ vai trò HERO, BAIT, MARGIN để tối ưu GMV</p>
              </div>
            </div>

            <form action={async (formData: FormData) => {
              'use server';
              const skuCode = formData.get('skuCode') as string;
              const productName = formData.get('productName') as string;
              const originalPrice = Number(formData.get('originalPrice'));
              const streamPrice = Number(formData.get('streamPrice'));
              const stockAllocated = Number(formData.get('stockAllocated'));
              const role = formData.get('role') as string;
              await addSKUItem({ livestreamId: selectedId, skuCode, productName, originalPrice, streamPrice, stockAllocated, role });
            }} className="grid grid-cols-1 md:grid-cols-7 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <input type="text" name="skuCode" placeholder="Mã SKU" required className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-purple-500/20" />
              <input type="text" name="productName" placeholder="Tên sản phẩm" required className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-purple-500/20" />
              
              <select name="role" className="border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none bg-white font-medium text-slate-700 focus:ring-2 focus:ring-purple-500/20">
                <option value="HERO">⭐ HERO (Chủ lực)</option>
                <option value="BAIT">🔥 BAIT (Phễu Giá Sốc)</option>
                <option value="MARGIN">💰 MARGIN (Lợi Nhuận)</option>
              </select>

              <input type="number" name="originalPrice" placeholder="Giá niêm yết" required className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-purple-500/20" />
              <input type="number" name="streamPrice" placeholder="Giá Stream" required className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-purple-500/20" />
              <input type="number" name="stockAllocated" placeholder="Số lượng tồn kho" required className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-purple-500/20" />
              
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold py-2 flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
                <Plus size={14} /> Thêm SKU
              </button>
            </form>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3.5">Mã SKU / Tên Sản Phẩm</th>
                    <th className="p-3.5">Vai Trò (Role)</th>
                    <th className="p-3.5">Giá Niêm Yết</th>
                    <th className="p-3.5">Giá Stream</th>
                    <th className="p-3.5">Tồn Kho</th>
                    <th className="p-3.5">GMV Tiềm Năng</th>
                    <th className="p-3.5">% Đóng Góp</th>
                    <th className="p-3.5 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {planningData.skus?.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center bg-slate-50/50">
                        <div className="text-slate-400 text-xs font-medium">Chưa có sản phẩm nào trong Deal Matrix.</div>
                      </td>
                    </tr>
                  ) : (
                    planningData.skus?.map((sku: any) => {
                      const potentialGMV = Number(sku.streamPrice) * Number(sku.stockAllocated);
                      const contributionShare = maxPotentialGMV > 0 
                        ? ((potentialGMV / maxPotentialGMV) * 100).toFixed(1) 
                        : '0';

                      return (
                        <tr key={sku.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{sku.productName}</div>
                            <div className="text-xs text-slate-400 font-mono">{sku.skuCode}</div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md ${
                              sku.role === 'HERO' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              sku.role === 'BAIT' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              {sku.role === 'HERO' ? '⭐ HERO' : sku.role === 'BAIT' ? '🔥 BAIT' : '💰 MARGIN'}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-400 line-through text-xs">
                            {Number(sku.originalPrice).toLocaleString('vi-VN')} đ
                          </td>
                          <td className="p-3.5 font-bold text-emerald-600">
                            {Number(sku.streamPrice).toLocaleString('vi-VN')} đ
                          </td>
                          <td className="p-3.5 text-slate-700 font-medium text-xs">
                            {sku.stockAllocated} món
                          </td>
                          <td className="p-3.5 font-bold text-purple-700">
                            {potentialGMV.toLocaleString('vi-VN')} đ
                          </td>
                          <td className="p-3.5 font-semibold text-slate-600 text-xs">
                            {contributionShare}%
                          </td>
                          <td className="p-3.5 text-center">
                            <form action={async () => {
                              'use server';
                              await deleteSKUItem(sku.id);
                            }}>
                              <button 
                                type="submit" 
                                className="text-rose-500 hover:text-rose-700 text-xs font-semibold hover:underline cursor-pointer"
                              >
                                Xóa
                              </button>
                            </form>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Voucher & Chương Trình Khuyến Mãi */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <Tag size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">3. Chương Trình Khuyến Mãi & Voucher (Promotions)</h2>
                <p className="text-xs text-slate-500">Quản lý ngân sách Voucher từ Brand và Sàn tài trợ</p>
              </div>
            </div>

            <form action={addVoucherItem} className="grid grid-cols-1 md:grid-cols-6 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <input type="hidden" name="livestreamId" value={selectedId || ''} />

              <input 
                type="text" 
                name="code" 
                placeholder="Mã Voucher (VD: MEGA50K)" 
                required 
                defaultValue=""
                className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-rose-500/20 uppercase font-mono" 
              />
              
              <select 
                name="discountType" 
                defaultValue="Giảm Tiền Mặt"
                className="border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none bg-white font-medium text-slate-700 focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="Giảm Tiền Mặt">Giảm Tiền Mặt (VNĐ)</option>
                <option value="Giảm %">Giảm Theo %</option>
                <option value="Quà Tặng (GWP)">Quà Tặng Kèm (GWP)</option>
              </select>

              <input 
                type="number" 
                name="value" 
                placeholder="Mức giảm / Giá trị" 
                required 
                defaultValue=""
                className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-rose-500/20" 
              />
              
              <input 
                type="number" 
                name="quantity" 
                placeholder="Số lượng mã" 
                required 
                defaultValue=""
                className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-rose-500/20" 
              />
              
              <select 
                name="sponsor" 
                defaultValue="Brand Tài Trợ"
                className="border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none bg-white font-medium text-slate-700 focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="Brand Tài Trợ">Brand Tài Trợ</option>
                <option value="Sàn Tài Trợ">Sàn Tài Trợ</option>
                <option value="Co-sponsor 50/50">Co-sponsor 50/50</option>
              </select>

              <button 
                type="submit" 
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold py-2 flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
              >
                + Thêm Voucher
              </button>
            </form>

            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                    <th className="p-3.5">Mã Voucher</th>
                    <th className="p-3.5">Loại Ưu Đãi</th>
                    <th className="p-3.5">Mức Giảm / Giá Trị</th>
                    <th className="p-3.5">Số Lượng</th>
                    <th className="p-3.5">Đơn Vị Tài Trợ</th>
                    <th className="p-3.5 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {!planningData.vouchers || planningData.vouchers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center bg-slate-50/50">
                        <div className="text-slate-400 text-xs font-medium">Chưa cấu hình voucher nào.</div>
                      </td>
                    </tr>
                  ) : (
                    planningData.vouchers.map((v: any) => (
                      <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold font-mono text-rose-600">{v.code}</td>
                        <td className="p-3.5 font-medium text-slate-700 text-xs">{v.discountType}</td>
                        <td className="p-3.5 font-bold text-slate-900">
                          {Number(v.value).toLocaleString('vi-VN')} {v.discountType === 'Giảm %' ? '%' : 'đ'}
                        </td>
                        <td className="p-3.5 text-slate-700 text-xs">{v.quantity} mã</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${
                            v.sponsor === 'Sàn Tài Trợ' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {v.sponsor}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <form action={async () => {
                            'use server';
                            await deleteVoucherItem(v.id);
                          }}>
                            <button type="submit" className="text-rose-500 hover:text-rose-700 text-xs font-semibold hover:underline cursor-pointer">
                              Xóa
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// import React from 'react';
// import { DollarSign, Package, Plus, Calculator, CheckCircle2, Tag, AlertTriangle, Check, TrendingUp, Wallet, ShoppingBag } from 'lucide-react';
// import { prisma } from '@/lib/prisma';
// import LivestreamSelector from './LivestreamSelector';
// import { 
//   addBudgetItem, 
//   deleteBudgetItem, 
//   addSKUItem, 
//   deleteSKUItem, 
//   addVoucherItem,
//   deleteVoucherItem, 
//   updatePlanningStatus 
// } from './actions';

// export const revalidate = 0;
// export const dynamic = 'force-dynamic';

// interface PageProps {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }

// export default async function PlanningPage({ searchParams }: PageProps) {
//   const params = await searchParams;
//   const urlSelectedId = typeof params.id === 'string' ? params.id : undefined;

//   const livestreams = await prisma.livestream.findMany({
//     orderBy: { createdAt: 'desc' },
//     select: { id: true, code: true, title: true, brand: true, status: true },
//   });

//   const selectedId = urlSelectedId || (livestreams.length > 0 ? livestreams[0].id : '');

//   const planningData = selectedId
//     ? await prisma.livestream.findUnique({
//         where: { id: selectedId },
//         include: { 
//           budgets: true, 
//           skus: true, 
//           vouchers: true 
//         },
//       })
//     : null;

//   // --- TÍNH TOÁN CHỈ SỐ P&L SIMULATOR ---
//   const targetGMV = Number(planningData?.targetGMV || 0);
//   const totalBudget = planningData?.budgets?.reduce((acc: number, b: any) => acc + Number(b.estimatedCost), 0) || 0;
  
//   // Ước tính Phí sàn & Vận hành E-com (~10% GMV)
//   const estimatedPlatformFee = targetGMV * 0.10;
  
//   // Ước tính GMV tối đa dựa trên Tồn kho SKUs
//   const maxPotentialGMV = planningData?.skus?.reduce((acc: number, s: any) => acc + (Number(s.streamPrice) * Number(s.stockAllocated)), 0) || 0;

//   // Tỷ lệ Ngân sách / Target GMV
//   const budgetRatioNum = targetGMV > 0 ? (totalBudget / targetGMV) * 100 : 0;
//   const budgetRatio = budgetRatioNum.toFixed(1);
  
//   // ROI Dự kiến
//   const expectedROINum = totalBudget > 0 ? targetGMV / totalBudget : 0;
//   const expectedROI = expectedROINum.toFixed(2);

//   const isStockEnough = maxPotentialGMV >= targetGMV;

//   const isApproved = planningData?.status === 'Approved' || planningData?.status === 'APPROVED';

//   return (
//     <div className="p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      
//       {/* 🌟 HERO BANNER: ĐƯA LỰA CHỌN PHIÊN LIVESTREAM LÊN TRỌNG TÂM UI/UX */}
//       <div className="relative overflow-visible rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 shadow-xl border border-slate-800 text-white z-20">
//         <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-30">
          
//           {/* Tiêu đề & Hướng dẫn */}
//           <div className="space-y-2 flex-1">
//             <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
//               Lập Kế Hoạch & P&L Dự Toán
//             </h1>
//             <p className="text-slate-300 text-sm max-w-xl">
//               Chọn phiên livestream ở bảng điều khiển bên phải để hệ thống tự động đồng bộ ngân sách, cấu hình SKU Matrix và mô phỏng chỉ số tài chính thời gian thực.
//             </p>
//           </div>

//           {/* Cụm Selector & Nút Duyệt trạng thái đã tối ưu responsive, chống đè và tràn dropdown */}
//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-lg w-full lg:w-auto">
//             {livestreams.length > 0 && (
//               <div className="w-full sm:min-w-[280px] lg:min-w-[320px]">
//                 <label className="block text-[11px] font-semibold text-blue-300 uppercase tracking-wide mb-1">
//                   Phiên Livestream Đang Chọn:
//                 </label>
//                 <div className="w-full">
//                   <LivestreamSelector livestreams={livestreams} selectedId={selectedId} />
//                 </div>
//               </div>
//             )}

//             {planningData && (
//               <div className="flex items-end pt-2 sm:pt-0">
//                 <form action={async () => {
//                   'use server';
//                   await updatePlanningStatus(selectedId, planningData.status);
//                 }} className="w-full">
//                   <button
//                     type="submit"
//                     className={`w-full sm:w-auto px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md whitespace-nowrap ${
//                       isApproved 
//                         ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600' 
//                         : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
//                     }`}
//                   >
//                     <CheckCircle2 size={18} />
//                     {isApproved ? 'Chuyển về Draft' : 'Duyệt Kế Hoạch'}
//                   </button>
//                 </form>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>

//       {/* Trạng thái hiển thị Badge chênh lệch nhỏ phía dưới */}
//       <div className="flex items-center justify-between px-1">
//         <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
//           Trạng thái hiện tại: <span className={isApproved ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
//             {isApproved ? '✓ Đã chốt kế hoạch' : '⏳ Đang ở bản nháp (Draft)'}
//           </span>
//         </div>
//       </div>

//       {!planningData ? (
//         <div className="bg-white p-16 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
//           <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
//             📡
//           </div>
//           <p className="text-slate-600 font-semibold">Chưa có phiên Livestream nào trong hệ thống.</p>
//           <p className="text-xs text-slate-400">Vui lòng tạo phiên livestream mới từ menu Portfolio.</p>
//         </div>
//       ) : (
//         <>
//           {/* Dashboard P&L Simulator */}
//           <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-5">
//             <div className="flex items-center justify-between border-b border-slate-800 pb-4">
//               <div className="flex items-center gap-2.5">
//                 <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
//                   <Calculator size={20} />
//                 </div>
//                 <div>
//                   <h2 className="text-base font-bold uppercase tracking-wider text-emerald-400">P&L Simulator & Financial Health Check</h2>
//                   <p className="text-xs text-slate-400">Chỉ số tài chính mô phỏng theo thời gian thực</p>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
//               {/* Target GMV */}
//               <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/60 shadow-inner">
//                 <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
//                   <span>Target GMV</span>
//                   <TrendingUp size={14} className="text-slate-400" />
//                 </div>
//                 <div className="text-xl font-extrabold text-white mt-2">{targetGMV.toLocaleString('vi-VN')} đ</div>
//               </div>

//               {/* Ngân sách */}
//               <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/60 shadow-inner">
//                 <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
//                   <span>Tổng Ngân Sách</span>
//                   <Wallet size={14} className="text-amber-400" />
//                 </div>
//                 <div className="text-xl font-extrabold text-amber-400 mt-2">{totalBudget.toLocaleString('vi-VN')} đ</div>
//                 <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2.5 overflow-hidden">
//                   <div 
//                     className="bg-amber-400 h-full rounded-full transition-all duration-300" 
//                     style={{ width: `${Math.min(budgetRatioNum, 100)}%` }}
//                   />
//                 </div>
//                 <div className="text-[10px] text-slate-400 mt-1 font-medium">Tỷ lệ: {budgetRatio}% GMV</div>
//               </div>

//               {/* Phí sàn */}
//               <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/60 shadow-inner">
//                 <div className="text-xs text-slate-400 font-medium">Phí Sàn Dự Kiến (10%)</div>
//                 <div className="text-xl font-extrabold text-rose-400 mt-2">{estimatedPlatformFee.toLocaleString('vi-VN')} đ</div>
//                 <div className="text-[10px] text-slate-400 mt-1 font-medium">Phí hoa hồng sàn & thanh toán</div>
//               </div>

//               {/* ROI */}
//               <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/60 shadow-inner">
//                 <div className="text-xs text-slate-400 font-medium">ROI Dự Kiến (GMV/CP)</div>
//                 <div className={`text-2xl font-black mt-1 ${expectedROINum >= 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
//                   {expectedROI}x
//                 </div>
//                 <div className="text-[10px] text-slate-400 mt-1 font-medium">Mục tiêu tối thiểu: {expectedROINum >= 5 ? '✅ Đạt chuẩn' : '⚠️ Cần tối ưu'}</div>
//               </div>

//               {/* GMV Kho cấp */}
//               <div className="bg-slate-800/90 p-4 rounded-xl border border-slate-700/60 shadow-inner sm:col-span-2 md:col-span-1">
//                 <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
//                   <span>GMV Kho Cấp Tối Đa</span>
//                   <ShoppingBag size={14} className="text-purple-400" />
//                 </div>
//                 <div className="text-xl font-extrabold text-purple-300 mt-2">{maxPotentialGMV.toLocaleString('vi-VN')} đ</div>
//                 <div className="mt-2">
//                   {isStockEnough ? (
//                     <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">
//                       <Check size={12} /> Đủ hàng đạt Target
//                     </span>
//                   ) : (
//                     <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-md animate-pulse">
//                       <AlertTriangle size={12} /> Cảnh báo thiếu hàng!
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Section 1: Ngân Sách */}
//           <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
//             <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
//               <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
//                 <DollarSign size={20} />
//               </div>
//               <div>
//                 <h2 className="text-lg font-bold text-slate-900">1. Dự Toán Ngân Sách Chi Tiết</h2>
//                 <p className="text-xs text-slate-500">Phân bổ chi phí cho Host, Ads, Studio và Seeding</p>
//               </div>
//             </div>

//             <form action={async (formData: FormData) => {
//               'use server';
//               const category = formData.get('category') as string;
//               const estimatedCost = Number(formData.get('estimatedCost'));
//               const notes = formData.get('notes') as string;
//               await addBudgetItem({ livestreamId: selectedId, category, estimatedCost, notes });
//             }} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
//               <select name="category" className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none bg-white font-medium text-slate-700 focus:ring-2 focus:ring-amber-500/20">
//                 <option value="Host / KOL">Host / KOL</option>
//                 <option value="Studio / Thiết bị">Studio / Thiết bị</option>
//                 <option value="Quảng cáo (Ads/Traffic)">Quảng cáo (Ads/Traffic)</option>
//                 <option value="Seeding / Quà tặng">Seeding / Quà tặng</option>
//                 <option value="Chi phí khác">Chi phí khác</option>
//               </select>

//               <input type="number" name="estimatedCost" placeholder="Chi phí (VNĐ)" required className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-amber-500/20" />
//               <input type="text" name="notes" placeholder="Ghi chú chi tiết" className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-amber-500/20" />

//               <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold py-2 flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer">
//                 <Plus size={16} /> Thêm Chi Phí
//               </button>
//             </form>

//             <div className="overflow-x-auto rounded-xl border border-slate-200/80">
//               <table className="w-full text-left text-sm border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
//                     <th className="p-3.5">Hạng mục</th>
//                     <th className="p-3.5">Chi phí dự toán</th>
//                     <th className="p-3.5">Ghi chú</th>
//                     <th className="p-3.5 text-center">Thao tác</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {planningData.budgets?.length === 0 ? (
//                     <tr>
//                       <td colSpan={4} className="p-8 text-center bg-slate-50/50">
//                         <div className="text-slate-400 text-xs font-medium">Chưa có khoản chi phí nào được tạo.</div>
//                       </td>
//                     </tr>
//                   ) : (
//                     planningData.budgets?.map((b: any) => (
//                       <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
//                         <td className="p-3.5 font-semibold text-slate-800">{b.category}</td>
//                         <td className="p-3.5 font-bold text-amber-700">{Number(b.estimatedCost).toLocaleString('vi-VN')} đ</td>
//                         <td className="p-3.5 text-slate-500 text-xs">{b.notes || '-'}</td>
//                         <td className="p-3.5 text-center">
//                           <form action={async () => {
//                             'use server';
//                             await deleteBudgetItem(b.id);
//                           }}>
//                             <button type="submit" className="text-rose-500 hover:text-rose-700 text-xs font-semibold hover:underline cursor-pointer">
//                               Xóa
//                             </button>
//                           </form>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Section 2: SKU Matrix & Deal Strategy */}
//           <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
//             <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
//               <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
//                 <Package size={20} />
//               </div>
//               <div>
//                 <h2 className="text-lg font-bold text-slate-900">2. Danh Mục Sản Phẩm & Chiến Lược Deal (SKU Matrix)</h2>
//                 <p className="text-xs text-slate-500">Phân bổ vai trò HERO, BAIT, MARGIN để tối ưu GMV</p>
//               </div>
//             </div>

//             <form action={async (formData: FormData) => {
//               'use server';
//               const skuCode = formData.get('skuCode') as string;
//               const productName = formData.get('productName') as string;
//               const originalPrice = Number(formData.get('originalPrice'));
//               const streamPrice = Number(formData.get('streamPrice'));
//               const stockAllocated = Number(formData.get('stockAllocated'));
//               const role = formData.get('role') as string;
//               await addSKUItem({ livestreamId: selectedId, skuCode, productName, originalPrice, streamPrice, stockAllocated, role });
//             }} className="grid grid-cols-1 md:grid-cols-7 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
//               <input type="text" name="skuCode" placeholder="Mã SKU" required className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-purple-500/20" />
//               <input type="text" name="productName" placeholder="Tên sản phẩm" required className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-purple-500/20" />
              
//               <select name="role" className="border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none bg-white font-medium text-slate-700 focus:ring-2 focus:ring-purple-500/20">
//                 <option value="HERO">⭐ HERO (Chủ lực)</option>
//                 <option value="BAIT">🔥 BAIT (Phễu Giá Sốc)</option>
//                 <option value="MARGIN">💰 MARGIN (Lợi Nhuận)</option>
//               </select>

//               <input type="number" name="originalPrice" placeholder="Giá niêm yết" required className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-purple-500/20" />
//               <input type="number" name="streamPrice" placeholder="Giá Stream" required className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-purple-500/20" />
//               <input type="number" name="stockAllocated" placeholder="Số lượng tồn kho" required className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-purple-500/20" />
              
//               <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold py-2 flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer">
//                 <Plus size={14} /> Thêm SKU
//               </button>
//             </form>

//             <div className="overflow-x-auto rounded-xl border border-slate-200/80">
//               <table className="w-full text-left text-sm border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
//                     <th className="p-3.5">Mã SKU / Tên Sản Phẩm</th>
//                     <th className="p-3.5">Vai Trò (Role)</th>
//                     <th className="p-3.5">Giá Niêm Yết</th>
//                     <th className="p-3.5">Giá Stream</th>
//                     <th className="p-3.5">Tồn Kho</th>
//                     <th className="p-3.5">GMV Tiềm Năng</th>
//                     <th className="p-3.5">% Đóng Góp</th>
//                     <th className="p-3.5 text-center">Thao Tác</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {planningData.skus?.length === 0 ? (
//                     <tr>
//                       <td colSpan={8} className="p-8 text-center bg-slate-50/50">
//                         <div className="text-slate-400 text-xs font-medium">Chưa có sản phẩm nào trong Deal Matrix.</div>
//                       </td>
//                     </tr>
//                   ) : (
//                     planningData.skus?.map((sku: any) => {
//                       const potentialGMV = Number(sku.streamPrice) * Number(sku.stockAllocated);
//                       const contributionShare = maxPotentialGMV > 0 
//                         ? ((potentialGMV / maxPotentialGMV) * 100).toFixed(1) 
//                         : '0';

//                       return (
//                         <tr key={sku.id} className="hover:bg-slate-50/80 transition-colors">
//                           <td className="p-3.5">
//                             <div className="font-semibold text-slate-900">{sku.productName}</div>
//                             <div className="text-xs text-slate-400 font-mono">{sku.skuCode}</div>
//                           </td>
//                           <td className="p-3.5">
//                             <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md ${
//                               sku.role === 'HERO' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
//                               sku.role === 'BAIT' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
//                             }`}>
//                               {sku.role === 'HERO' ? '⭐ HERO' : sku.role === 'BAIT' ? '🔥 BAIT' : '💰 MARGIN'}
//                             </span>
//                           </td>
//                           <td className="p-3.5 text-slate-400 line-through text-xs">
//                             {Number(sku.originalPrice).toLocaleString('vi-VN')} đ
//                           </td>
//                           <td className="p-3.5 font-bold text-emerald-600">
//                             {Number(sku.streamPrice).toLocaleString('vi-VN')} đ
//                           </td>
//                           <td className="p-3.5 text-slate-700 font-medium text-xs">
//                             {sku.stockAllocated} món
//                           </td>
//                           <td className="p-3.5 font-bold text-purple-700">
//                             {potentialGMV.toLocaleString('vi-VN')} đ
//                           </td>
//                           <td className="p-3.5 font-semibold text-slate-600 text-xs">
//                             {contributionShare}%
//                           </td>
//                           <td className="p-3.5 text-center">
//                             <form action={async () => {
//                               'use server';
//                               await deleteSKUItem(sku.id);
//                             }}>
//                               <button 
//                                 type="submit" 
//                                 className="text-rose-500 hover:text-rose-700 text-xs font-semibold hover:underline cursor-pointer"
//                               >
//                                 Xóa
//                               </button>
//                             </form>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Section 3: Voucher & Chương Trình Khuyến Mãi */}
//           <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
//             <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
//               <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
//                 <Tag size={20} />
//               </div>
//               <div>
//                 <h2 className="text-lg font-bold text-slate-900">3. Chương Trình Khuyến Mãi & Voucher (Promotions)</h2>
//                 <p className="text-xs text-slate-500">Quản lý ngân sách Voucher từ Brand và Sàn tài trợ</p>
//               </div>
//             </div>

//             <form action={addVoucherItem} className="grid grid-cols-1 md:grid-cols-6 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
//               <input type="hidden" name="livestreamId" value={selectedId || ''} />

//               <input 
//                 type="text" 
//                 name="code" 
//                 placeholder="Mã Voucher (VD: MEGA50K)" 
//                 required 
//                 defaultValue=""
//                 className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-rose-500/20 uppercase font-mono" 
//               />
              
//               <select 
//                 name="discountType" 
//                 defaultValue="Giảm Tiền Mặt"
//                 className="border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none bg-white font-medium text-slate-700 focus:ring-2 focus:ring-rose-500/20"
//               >
//                 <option value="Giảm Tiền Mặt">Giảm Tiền Mặt (VNĐ)</option>
//                 <option value="Giảm %">Giảm Theo %</option>
//                 <option value="Quà Tặng (GWP)">Quà Tặng Kèm (GWP)</option>
//               </select>

//               <input 
//                 type="number" 
//                 name="value" 
//                 placeholder="Mức giảm / Giá trị" 
//                 required 
//                 defaultValue=""
//                 className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-rose-500/20" 
//               />
              
//               <input 
//                 type="number" 
//                 name="quantity" 
//                 placeholder="Số lượng mã" 
//                 required 
//                 defaultValue=""
//                 className="border border-slate-200 rounded-lg px-2.5 py-2 text-xs outline-none bg-white focus:ring-2 focus:ring-rose-500/20" 
//               />
              
//               <select 
//                 name="sponsor" 
//                 defaultValue="Brand Tài Trợ"
//                 className="border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none bg-white font-medium text-slate-700 focus:ring-2 focus:ring-rose-500/20"
//               >
//                 <option value="Brand Tài Trợ">Brand Tài Trợ</option>
//                 <option value="Sàn Tài Trợ">Sàn Tài Trợ</option>
//                 <option value="Co-sponsor 50/50">Co-sponsor 50/50</option>
//               </select>

//               <button 
//                 type="submit" 
//                 className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold py-2 flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
//               >
//                 + Thêm Voucher
//               </button>
//             </form>

//             <div className="overflow-x-auto rounded-xl border border-slate-200/80">
//               <table className="w-full text-left text-sm border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
//                     <th className="p-3.5">Mã Voucher</th>
//                     <th className="p-3.5">Loại Ưu Đãi</th>
//                     <th className="p-3.5">Mức Giảm / Giá Trị</th>
//                     <th className="p-3.5">Số Lượng</th>
//                     <th className="p-3.5">Đơn Vị Tài Trợ</th>
//                     <th className="p-3.5 text-center">Thao Tác</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {!planningData.vouchers || planningData.vouchers.length === 0 ? (
//                     <tr>
//                       <td colSpan={6} className="p-8 text-center bg-slate-50/50">
//                         <div className="text-slate-400 text-xs font-medium">Chưa cấu hình voucher nào.</div>
//                       </td>
//                     </tr>
//                   ) : (
//                     planningData.vouchers.map((v: any) => (
//                       <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
//                         <td className="p-3.5 font-bold font-mono text-rose-600">{v.code}</td>
//                         <td className="p-3.5 font-medium text-slate-700 text-xs">{v.discountType}</td>
//                         <td className="p-3.5 font-bold text-slate-900">
//                           {Number(v.value).toLocaleString('vi-VN')} {v.discountType === 'Giảm %' ? '%' : 'đ'}
//                         </td>
//                         <td className="p-3.5 text-slate-700 text-xs">{v.quantity} mã</td>
//                         <td className="p-3.5">
//                           <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${
//                             v.sponsor === 'Sàn Tài Trợ' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
//                           }`}>
//                             {v.sponsor}
//                           </span>
//                         </td>
//                         <td className="p-3.5 text-center">
//                           <form action={async () => {
//                             'use server';
//                             await deleteVoucherItem(v.id);
//                           }}>
//                             <button type="submit" className="text-rose-500 hover:text-rose-700 text-xs font-semibold hover:underline cursor-pointer">
//                               Xóa
//                             </button>
//                           </form>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }