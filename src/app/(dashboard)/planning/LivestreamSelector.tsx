'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Radio } from 'lucide-react';

interface Livestream {
  id: string;
  code: string;
  title: string;
  brand?: string;
  status?: string;
}

interface Props {
  livestreams: Livestream[];
  selectedId: string;
}

export default function LivestreamSelector({ livestreams, selectedId }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedLive = livestreams.find((l) => l.id === selectedId) || livestreams[0];

  // Lọc danh sách theo từ khóa tìm kiếm
  const filteredLivestreams = livestreams.filter(
    (l) =>
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.brand && l.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (id: string) => {
    setIsOpen(false);
    setSearchTerm('');
    router.push(`/planning?id=${id}`);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Nút trigger hiển thị phiên đang chọn */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 shadow-sm transition-all max-w-[340px] md:max-w-[420px] cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0">
            {selectedLive?.code}
          </span>
          <span className="truncate font-semibold">{selectedLive?.title}</span>
        </div>
        <ChevronDown size={14} className="text-slate-400 shrink-0" />
      </button>

      {/* Popover Dropdown khi bấm vào */}
      {isOpen && (
        <>
          {/* Overlay bấm ra ngoài để đóng */}
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl bg-white shadow-2xl border border-slate-200 z-30 p-2 space-y-2">
            {/* Ô tìm kiếm */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm mã LS, tên chiến dịch, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Danh sách cuộn mượt */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 rounded-lg">
              {filteredLivestreams.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">Không tìm thấy phiên live nào.</div>
              ) : (
                filteredLivestreams.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleSelect(l.id)}
                    className={`w-full text-left p-2.5 hover:bg-slate-50 transition-colors flex items-start justify-between gap-2 ${
                      l.id === selectedId ? 'bg-emerald-50/60' : ''
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold bg-slate-200 text-slate-700 px-1 rounded">
                          {l.code}
                        </span>
                        {l.brand && <span className="text-[10px] font-medium text-slate-500">• {l.brand}</span>}
                      </div>
                      <div className="text-xs font-semibold text-slate-800 line-clamp-2">{l.title}</div>
                    </div>
                    {l.id === selectedId && <Radio size={14} className="text-emerald-600 mt-1 shrink-0" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}