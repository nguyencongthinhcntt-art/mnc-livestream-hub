import React from 'react';
import { 
  Clock, 
  User, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Flag, 
  Filter, 
  AlertTriangle,
  ListTodo,
  Sparkles,
  Layers
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import LivestreamDropdown from './LivestreamDropdown';
import OwnerFilter from './OwnerFilter';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

// --- SERVER ACTIONS ---
async function addTaskItem(formData: FormData) {
  'use server';
  const livestreamId = formData.get('livestreamId') as string;
  const phase = formData.get('phase') as string;
  const taskName = formData.get('taskName') as string;
  const assignee = formData.get('assignee') as string;
  const dueDateVal = formData.get('dueDate') as string;
  const priority = (formData.get('priority') as string) || 'MEDIUM';

  if (!livestreamId || !taskName) return;

  await prisma.taskItem.create({
    data: {
      livestreamId,
      phase,
      taskName,
      assignee: assignee || 'Chưa gán',
      isCompleted: false,
      priority,
      dueDate: dueDateVal ? new Date(dueDateVal) : null,
    },
  });

  revalidatePath('/checklist');
}

async function toggleTaskStatus(id: string, currentStatus: boolean) {
  'use server';
  if (!id) return;

  await prisma.taskItem.update({
    where: { id },
    data: { isCompleted: !currentStatus },
  });

  revalidatePath('/checklist');
}

async function deleteTaskItem(id: string) {
  'use server';
  if (!id) return;

  await prisma.taskItem.delete({ where: { id } });

  revalidatePath('/checklist');
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ChecklistPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const urlSelectedId = typeof params.id === 'string' ? params.id : undefined;
  const statusFilter = typeof params.status === 'string' ? params.status : 'ALL';
  const ownerFilter = typeof params.owner === 'string' ? params.owner : 'ALL';

  const livestreams = await prisma.livestream.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, code: true, title: true, brand: true, status: true },
  });

  const selectedId = urlSelectedId || (livestreams.length > 0 ? livestreams[0].id : '');

  const planningData = selectedId
    ? await prisma.livestream.findUnique({
        where: { id: selectedId },
        include: { checklists: { orderBy: { createdAt: 'asc' } } },
      })
    : null;

  const rawTasks = planningData?.checklists || [];
  const assigneesList = Array.from(new Set(rawTasks.map((t: any) => t.assignee).filter(Boolean))) as string[];

  const tasks = rawTasks.filter((t: any) => {
    if (statusFilter === 'DONE' && !t.isCompleted) return false;
    if (statusFilter === 'TODO' && t.isCompleted) return false;
    if (ownerFilter !== 'ALL' && t.assignee !== ownerFilter) return false;
    return true;
  });

  const beforeTasks = tasks.filter((t: any) => t.phase === 'BEFORE');
  const duringTasks = tasks.filter((t: any) => t.phase === 'DURING');
  const afterTasks = tasks.filter((t: any) => t.phase === 'AFTER');

  const totalTasks = rawTasks.length;
  const completedTasks = rawTasks.filter((t: any) => t.isCompleted).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans text-slate-800 antialiased">
      
      {/* 1. HEADER & DROPDOWN LỰA CHỌN PHIÊN */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ListTodo className="text-indigo-600" size={26} /> Checklist Quản Lý Công Việc
            </h1>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Tiến độ: {completedTasks}/{totalTasks} ({progressPercent}%)
            </span>
          </div>
          <p className="text-sm text-slate-500">Chuẩn hóa quy trình vận hành chi tiết trước, trong và sau phiên Livestream</p>
        </div>

        {livestreams.length > 0 && (
          <LivestreamDropdown livestreams={livestreams} selectedId={selectedId} />
        )}
      </div>

      {!planningData ? (
        <div className="bg-white p-16 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
          <p className="text-slate-500 font-medium">Chưa chọn phiên livestream hợp lệ hoặc chưa có dữ liệu.</p>
        </div>
      ) : (
        <>
          {/* 2. KHU VỰC TIẾN ĐỘ BANNER (DASHBOARD KPI) */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Tiến Độ Hoàn Thành Phiên Live
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Đã hoàn thành {completedTasks} trên tổng số {totalTasks} đầu việc
                  </p>
                </div>
              </div>
              
              <div className="flex items-baseline gap-1 bg-white/10 px-3.5 py-1.5 rounded-xl backdrop-blur-md border border-white/10 shadow-xs">
                <span className="text-2xl font-black text-emerald-400 tracking-tight">{progressPercent}%</span>
              </div>
            </div>

            <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 h-full transition-all duration-500 rounded-full shadow-xs" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 3. KHU VỰC THÊM ĐẦU VIỆC MỚI (ACTION AREA) */}
          <form 
            action={addTaskItem} 
            className="bg-indigo-50/50 border-2 border-indigo-100/90 p-5 rounded-2xl shadow-xs space-y-4 relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600" />

            <div className="flex items-center justify-between border-b border-indigo-100/80 pb-3">
              <div className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                Thêm Đầu Việc Mới
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Tạo công việc & Phân công nhiệm vụ</span>
            </div>

            <input type="hidden" name="livestreamId" value={selectedId} />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-4">
                <select 
                  name="phase" 
                  className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none shadow-xs"
                >
                  <option value="BEFORE">⏳ 1. Trước Livestream</option>
                  <option value="DURING">▶️ 2. Trong Livestream</option>
                  <option value="AFTER">🏁 3. Sau Livestream</option>
                </select>
              </div>

              <div className="md:col-span-8">
                <input 
                  type="text" 
                  name="taskName" 
                  placeholder="Nhập tên công việc cụ thể..." 
                  required 
                  className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 bg-white placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none shadow-xs" 
                />
              </div>

              <div className="md:col-span-4">
                <input 
                  type="text" 
                  name="assignee" 
                  placeholder="Người phụ trách (Owner)" 
                  className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 bg-white placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none shadow-xs" 
                />
              </div>

              <div className="md:col-span-3">
                <input 
                  type="datetime-local" 
                  name="dueDate" 
                  className="w-full border border-slate-200/90 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none shadow-xs" 
                />
              </div>

              <div className="md:col-span-3">
                <select 
                  name="priority" 
                  className="w-full border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all outline-none shadow-xs"
                >
                  <option value="HIGH">🔥 Khẩn cấp (High)</option>
                  <option value="MEDIUM">⚡ Trung bình (Medium)</option>
                  <option value="LOW">☕ Thấp (Low)</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl text-sm font-bold px-4 py-2.5 flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus size={16} /> Thêm Việc
                </button>
              </div>
            </div>
          </form>

          {/* ========================================================= */}
          {/* 4 & 5. KHU VỰC THỐNG NHẤT: BỘ LỌC + DANH SÁCH CÔNG VIỆC     */}
          {/* ========================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
            
            {/* 4A. THANH BỘ LỌC (HEADER CỦA KHỐI DANH SÁCH) */}
            <div className="p-4 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 tracking-wider">
                <Filter size={15} className="text-indigo-600" /> 
                <span>BỘ LỌC CÔNG VIỆC</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1 bg-white border border-slate-200/80 p-1 rounded-xl shadow-2xs">
                  <a 
                    href={`/checklist?id=${selectedId}&status=ALL&owner=${ownerFilter}`} 
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tất cả ({totalTasks})
                  </a>
                  <a 
                    href={`/checklist?id=${selectedId}&status=TODO&owner=${ownerFilter}`} 
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === 'TODO' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Chưa xong ({totalTasks - completedTasks})
                  </a>
                  <a 
                    href={`/checklist?id=${selectedId}&status=DONE&owner=${ownerFilter}`} 
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === 'DONE' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Đã xong ({completedTasks})
                  </a>
                </div>

                <OwnerFilter
                  selectedId={selectedId}
                  statusFilter={statusFilter}
                  ownerFilter={ownerFilter}
                  assigneesList={assigneesList}
                />
              </div>
            </div>

            {/* 4B. CÁC PHÂN PHẦN DANH SÁCH CÔNG VIỆC NHẬP THÀNH 1 DÒNG DỮ LIỆU */}
            <div className="p-4 sm:p-5 space-y-6 bg-slate-50/30">
              <TaskSection 
                title="Trước Livestream (Pre-Stream)" 
                icon={<Clock size={17} className="text-amber-500" />} 
                tasks={beforeTasks} 
                onToggle={toggleTaskStatus}
                onDelete={deleteTaskItem}
              />

              <TaskSection 
                title="Trong Livestream (Live Session)" 
                icon={<AlertCircle size={17} className="text-indigo-500" />} 
                tasks={duringTasks} 
                onToggle={toggleTaskStatus}
                onDelete={deleteTaskItem}
              />

              <TaskSection 
                title="Sau Livestream (Post-Stream)" 
                icon={<CheckCircle2 size={17} className="text-emerald-500" />} 
                tasks={afterTasks} 
                onToggle={toggleTaskStatus}
                onDelete={deleteTaskItem}
              />
            </div>

          </div>
        </>
      )}
    </div>
  );
}

// --- SUB COMPONENT GIAI ĐOẠN TASK ---
function TaskSection({ 
  title, 
  icon, 
  tasks, 
  onToggle, 
  onDelete 
}: { 
  title: string; 
  icon: React.ReactNode; 
  tasks: any[]; 
  onToggle: (id: string, currentStatus: boolean) => Promise<void>; 
  onDelete: (id: string) => Promise<void>; 
}) {
  const now = new Date();

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Tiêu đề từng nhóm công việc */}
      <div className="bg-slate-50/90 px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">{title}</h3>
        </div>
        <span className="bg-slate-200/70 text-slate-600 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
          {tasks.length}
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {tasks.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6 font-medium">Chưa có công việc nào trong giai đoạn này.</p>
        ) : (
          tasks.map((item: any) => {
            const isOverdue = item.dueDate && new Date(item.dueDate) < now && !item.isCompleted;

            return (
              <div 
                key={item.id} 
                className={`p-3.5 sm:px-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
                  isOverdue ? 'bg-rose-50/40' : 'hover:bg-slate-50/70'
                }`}
              >
                {/* Form Checkbox + Tên task */}
                <form action={onToggle.bind(null, item.id, item.isCompleted)} className="flex items-start md:items-center gap-3 flex-1 cursor-pointer">
                  <button type="submit" className="mt-0.5 md:mt-0 flex items-center justify-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={item.isCompleted}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer pointer-events-none"
                    />
                  </button>
                  <span className={`text-sm font-medium leading-relaxed ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.taskName}
                  </span>
                </form>

                {/* Metadata Badges */}
                <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 ml-7 md:ml-0">
                  {/* Priority */}
                  {item.priority === 'HIGH' && (
                    <span className="bg-rose-50 text-rose-700 border border-rose-200/60 px-2 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1">
                      <Flag size={10} /> Khẩn cấp
                    </span>
                  )}
                  {item.priority === 'MEDIUM' && (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                      Trung bình
                    </span>
                  )}
                  {item.priority === 'LOW' && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      Thấp
                    </span>
                  )}

                  {/* Due Date */}
                  {item.dueDate && (
                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md font-semibold text-[11px] ${
                      isOverdue 
                        ? 'bg-rose-100/90 text-rose-700 border border-rose-200' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isOverdue ? <AlertTriangle size={12} className="text-rose-600" /> : <Calendar size={12} className="text-slate-400" />}
                      {new Date(item.dueDate).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {isOverdue && <span className="ml-0.5 text-[10px] uppercase font-bold text-rose-600">(Trễ)</span>}
                    </div>
                  )}

                  {/* Assignee */}
                  <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-0.5 rounded-md font-semibold text-[11px] text-slate-600">
                    <User size={12} className="text-slate-400" /> {item.assignee || 'Chưa gán'}
                  </div>
                  
                  {/* Delete Button */}
                  <form action={onDelete.bind(null, item.id)}>
                    <button type="submit" className="text-slate-300 hover:text-rose-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-rose-50" title="Xóa công việc">
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}