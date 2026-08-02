import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isCompleted } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    // Cập nhật trạng thái hoàn thành task vào database
    const updated = await prisma.taskItem.update({
      where: { id },
      data: { isCompleted: Boolean(isCompleted) },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('❌ Lỗi API PATCH task:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { livestreamId, phase, taskName, assignee } = await request.json();
    const newTask = await prisma.taskItem.create({
      data: {
        livestreamId,
        phase,
        taskName,
        assignee: assignee || 'Chưa gán',
        isCompleted: false,
      },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('❌ Lỗi API POST task:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await prisma.taskItem.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('❌ Lỗi API DELETE task:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}