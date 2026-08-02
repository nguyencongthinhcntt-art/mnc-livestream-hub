'use client';

import React, { useState } from 'react';
import { updateLivestreamStatus } from './actions';

interface StatusSelectProps {
  id: string;
  initialStatus: string;
}

export default function StatusSelect({ id, initialStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  // Danh sách màu sắc tương ứng với từng trạng thái
  const styles: Record<string, string> = {
    Draft: 'bg-gray-100 text-gray-700 border-gray-300',
    Approved: 'bg-blue-50 text-blue-700 border-blue-200',
    Preparing: 'bg-amber-50 text-amber-700 border-amber-200',
    Live: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
    Completed: 'bg-green-50 text-green-700 border-green-200',
  };

  const handleChangeStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);

    const result = await updateLivestreamStatus(id, newStatus);
    if (!result.success) {
      alert('Cập nhật trạng thái thất bại!');
      setStatus(status); // Hoàn tác lại trạng thái cũ nếu lỗi
    }
    setIsUpdating(false);
  };

  return (
    <div className="relative inline-block">
      <select
        value={status}
        onChange={handleChangeStatus}
        disabled={isUpdating}
        className={`px-2.5 py-1 text-xs font-medium rounded-full border cursor-pointer outline-none transition-all ${
          styles[status] || styles.Draft
        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="Draft" className="bg-white text-gray-900">Draft</option>
        <option value="Preparing" className="bg-white text-gray-900">Preparing</option>
        <option value="Approved" className="bg-white text-gray-900">Approved</option>
        <option value="Live" className="bg-white text-gray-900">Live</option>
        <option value="Completed" className="bg-white text-gray-900">Completed</option>
      </select>
    </div>
  );
}