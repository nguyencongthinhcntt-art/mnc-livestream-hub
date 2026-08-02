'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. Thêm công việc mới
export async function addChecklistTask(data: {
  livestreamId: string;
  stage: string;
  title: string;
  owner?: string | null;
  dueDate?: string | null;
  priority?: string | null;
}) {
  try {
    await prisma.checklist.create({
      data: {
        livestreamId: data.livestreamId,
        stage: data.stage,
        title: data.title,
        owner: data.owner || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        priority: data.priority || 'Medium',
      },
    });
    revalidatePath('/checklist');
    return { success: true };
  } catch (error) {
    console.error('Error adding checklist task:', error);
    return { success: false, error: 'Failed to add task' };
  }
}

// 2. Cập nhật trạng thái hoàn thành (Toggle)
export async function toggleChecklistTask(taskId: string, completed: boolean) {
  try {
    await prisma.checklist.update({
      where: { id: taskId },
      data: { completed },
    });
    revalidatePath('/checklist');
    return { success: true };
  } catch (error) {
    console.error('Error toggling task:', error);
    return { success: false, error: 'Failed to toggle task' };
  }
}

// 3. Xóa công việc
export async function deleteChecklistTask(taskId: string) {
  try {
    await prisma.checklist.delete({
      where: { id: taskId },
    });
    revalidatePath('/checklist');
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task' };
  }
}