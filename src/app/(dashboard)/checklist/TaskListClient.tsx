'use client';

import React, { useState, useEffect } from 'react';
import { Clock, User, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TaskListClient({ selectedId, initialTasks = [] }: { selectedId: string; initialTasks: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Đồng bộ task từ props vào local state để cập nhật UI mượt mà ngay lập tức
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const [phase, setPhase] = useState('BEFORE');
  const [taskName, setTaskName] = useState('');
  const [assignee, setAssignee] = useState('');

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim() || !selectedId) return;

    setLoading(true);
    try {
      const res = await fetch('/api/checklist/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ livestreamId: selectedId, phase, taskName, assignee }),
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks((prev: any[]) => [newTask, ...prev]);
        setTaskName('');
        setAssignee('');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    // Cập nhật UI ngay lập tức trước khi chờ response từ API (Optimistic Update)
    setTasks((prev: any[]) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !currentStatus } : t))
    );

    try {
      const res = await fetch(`/api/checklist/tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isCompleted: !currentStatus }),
      });
      if (!res.ok) {
        // Rollback lại nếu lỗi
        setTasks((prev: any[]) =>
          prev.map((t) => (t.id === id ? { ...t, isCompleted: currentStatus } : t))
        );
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    // Xóa ngay khỏi UI
    setTasks((prev: any[]) => prev.filter((t) => t.id !== id));

    try {
      await fetch(`/api/checklist/tasks?id=${id}`, {
        method: 'DELETE',
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const beforeTasks = safeTasks.filter((t) => t.phase === 'BEFORE');
  const duringTasks = safeTasks.filter((t) => t.phase === 'DURING');
  const afterTasks = safeTasks.filter((t) => t.phase === 'AFTER');

  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter((t) => t.isCompleted).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Thanh tiến độ tổng quan */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-600">
          <span>TIẾN ĐỘ HOÀN THÀNH TOÀN BỘ PHIÊN ({completedTasks}/{totalTasks})</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500 rounded-full" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Form thêm việc được tô màu nền và viền riêng biệt để nổi bật */}
<form onSubmit={handleAddTask} className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white p-5 rounded-2xl border-2 border-dashed border-blue-200 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
  <select 
    value={phase} 
    onChange={(e) => setPhase(e.target.value)}
    className="border border-blue-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white font-semibold text-slate-700 cursor-pointer shadow-sm"
  >
    <option value="BEFORE">⏳ 1. Trước Livestream</option>
    <option value="DURING">▶️ 2. Trong Livestream</option>
    <option value="AFTER">🏁 3. Sau Livestream</option>
  </select>

  <input 
    type="text" 
    value={taskName}
    onChange={(e) => setTaskName(e.target.value)}
    placeholder="Nhập tên công việc cụ thể..." 
    required 
    className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white md:col-span-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" 
  />

  <input 
    type="text" 
    value={assignee}
    onChange={(e) => setAssignee(e.target.value)}
    placeholder="Người phụ trách (Owner)" 
    className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm" 
  />

  <button 
    type="submit" 
    disabled={loading}
    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold py-2.5 flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
  >
    <Plus size={16} /> {loading ? 'Đang thêm...' : 'Thêm Việc'}
  </button>
</form>

      {/* Danh sách các phần checklist */}
      <div className="space-y-6">
        <TaskSection title="Trước Livestream (Pre-Stream)" icon={<Clock size={18} className="text-amber-500" />} tasks={beforeTasks} onToggle={handleToggle} onDelete={handleDelete} />
        <TaskSection title="Trong Livestream (Live Session)" icon={<AlertCircle size={18} className="text-blue-500" />} tasks={duringTasks} onToggle={handleToggle} onDelete={handleDelete} />
        <TaskSection title="Sau Livestream (Post-Stream)" icon={<CheckCircle2 size={18} className="text-emerald-500" />} tasks={afterTasks} onToggle={handleToggle} onDelete={handleDelete} />
      </div>
    </div>
  );
}

function TaskSection({ title, icon, tasks, onToggle, onDelete }: { title: string; icon: React.ReactNode; tasks: any[]; onToggle: any; onDelete: any }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center gap-2">
        {icon}
        <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
        <span className="ml-auto bg-slate-200/70 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold">
          {tasks.length} đầu việc
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {tasks.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">Chưa có công việc nào trong giai đoạn này.</p>
        ) : (
          tasks.map((item: any) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
              <div 
                className="flex items-center gap-3 cursor-pointer flex-1" 
                onClick={() => onToggle(item.id, item.isCompleted)}
              >
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  onChange={() => {}} 
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer pointer-events-none"
                />
                <span className={`text-sm font-medium select-none ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {item.taskName}
                </span>
              </div>

              <div className="flex items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                  <User size={13} className="text-slate-400" /> {item.assignee || 'Chưa gán'}
                </div>
                
                <button 
                  onClick={() => onDelete(item.id)} 
                  className="text-slate-300 hover:text-rose-500 transition-colors cursor-pointer p-1" 
                  title="Xóa task"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}