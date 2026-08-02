'use client';

import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PortfolioFilters({
  uniqueBrands,
  searchKeyword,
  selectedBrand,
}: {
  uniqueBrands: string[];
  searchKeyword: string;
  selectedBrand: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.replace(`/portfolio?${params.toString()}`, { scroll: false });
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'All') {
      params.set('brand', value);
    } else {
      params.delete('brand');
    }
    router.push(`/portfolio?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/portfolio');
  };

  const isFiltered = Boolean(searchKeyword || (selectedBrand && selectedBrand !== 'All'));

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full sm:w-96">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 shrink-0" />
        <input
          type="text"
          defaultValue={searchKeyword}
          onChange={handleSearchChange}
          placeholder="Tìm theo tên hoặc mã chiến dịch..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400"
        />
      </div>

      {/* Brand Select & Reset */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-auto">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={selectedBrand || 'All'}
            onChange={handleBrandChange}
            className="w-full sm:w-auto pl-9 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 cursor-pointer outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
          >
            <option value="All">Tất cả thương hiệu</option>
            {uniqueBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {isFiltered && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
            title="Xóa bộ lọc"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Đặt lại</span>
          </button>
        )}
      </div>
    </div>
  );
}