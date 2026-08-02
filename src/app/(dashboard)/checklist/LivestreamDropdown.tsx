// 'use client';

// import React from 'react';
// import { useRouter } from 'next/navigation';

// export default function LivestreamDropdown({ livestreams, selectedId }: { livestreams: any[]; selectedId: string }) {
//   const router = useRouter();

//   return (
//     <select
//       value={selectedId}
//       onChange={(e) => {
//         router.push(`/checklist?id=${e.target.value}`);
//       }}
//       className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold rounded-xl px-4 py-2.5 outline-none cursor-pointer hover:bg-slate-100 transition-colors shadow-sm"
//     >
//       {livestreams.map((item) => (
//         <option key={item.id} value={item.id}>
//           {item.code} - {item.title}
//         </option>
//       ))}
//     </select>
//   );
// }

'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname

interface LivestreamOption {
  id: string;
  code: string;
  title: string;
  brand: string;
  status: string;
}

interface Props {
  livestreams: LivestreamOption[];
  selectedId: string;
}

export default function LivestreamDropdown({ livestreams, selectedId }: Props) {
  const router = useRouter();
  const pathname = usePathname(); // Lấy đường dẫn trang hiện tại (/performance hoặc /checklist)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    if (newId) {
      // Giữ nguyên trang hiện tại và chỉ thay đổi query parameter ?id=
      router.push(`${pathname}?id=${newId}`);
    }
  };

  return (
    <select
      value={selectedId}
      onChange={handleChange}
      className="bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-medium shadow-xs cursor-pointer max-w-md"
    >
      {livestreams.map((item) => (
        <option key={item.id} value={item.id}>
          {item.code} - {item.title}
        </option>
      ))}
    </select>
  );
}