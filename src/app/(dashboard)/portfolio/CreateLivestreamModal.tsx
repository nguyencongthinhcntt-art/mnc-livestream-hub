'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createLivestream } from './actions';

export default function CreateLivestreamModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    brand: 'L’Oréal Paris',
    platform: 'TikTok Shop',
    owner: '',
    targetGMV: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createLivestream(formData);
    if (result.success) {
      setIsOpen(false);
      setFormData({
        code: '',
        title: '',
        brand: 'L’Oréal Paris',
        platform: 'TikTok Shop',
        owner: '',
        targetGMV: 0,
      });
    } else {
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <Plus size={16} /> Tạo chương trình mới
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Tạo phiên Livestream mới</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mã chương trình</label>
                <input
                  type="text"
                  required
                  placeholder="VD: LS-2026-002"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tên Livestream</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Super Brand Day"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Thương hiệu</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  >
                    <option value="L’Oréal Paris">L’Oréal Paris</option>
                    <option value="Maybelline">Maybelline</option>
                    <option value="3CE">3CE</option>
                    <option value="Garnier">Garnier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nền tảng</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  >
                    <option value="TikTok Shop">TikTok Shop</option>
                    <option value="Shopee">Shopee</option>
                    <option value="Lazada">Lazada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Người phụ trách</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn B"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Target GMV (VNĐ)</label>
                <input
                  type="number"
                  required
                  placeholder="VD: 300000000"
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.targetGMV || ''}
                  onChange={(e) => setFormData({ ...formData, targetGMV: Number(e.target.value) })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}