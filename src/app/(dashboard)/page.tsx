// export default function HomePage() {
//   return (
//     <div className="p-8">
//       <div className="mx-auto max-w-3xl">
//         <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
//           Chào mừng đến MNC Livestream Hub
//         </h1>
//         <p className="mt-2 text-sm text-zinc-600">
//           Chọn một mục từ sidebar để bắt đầu quản lý chiến dịch livestream.
//         </p>
//       </div>
//     </div>
//   );
// }

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/portfolio');
}