'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface OwnerFilterProps {
  selectedId: string;
  statusFilter: string;
  ownerFilter: string;
  assigneesList: string[];
}

export default function OwnerFilter({
  selectedId,
  statusFilter,
  ownerFilter,
  assigneesList,
}: OwnerFilterProps) {
  const router = useRouter();

  return (
    <select
      value={ownerFilter}
      onChange={(e) => {
        router.push(
          `/checklist?id=${selectedId}&status=${statusFilter}&owner=${e.target.value}`
        );
      }}
      className="border border-slate-200 bg-slate-50 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 outline-none cursor-pointer"
    >
      <option value="ALL">👤 Tất cả Người phụ trách</option>
      {assigneesList.map((person) => (
        <option key={person} value={person}>
          {person}
        </option>
      ))}
    </select>
  );
}