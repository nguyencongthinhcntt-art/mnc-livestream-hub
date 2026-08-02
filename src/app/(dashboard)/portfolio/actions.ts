'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. Lấy danh sách chương trình Livestream từ Database
export async function getLivestreams() {
  try {
    const livestreams = await prisma.livestream.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return livestreams;
  } catch (error) {
    console.error('Lỗi lấy danh sách Livestream:', error);
    return [];
  }
}

// 2. Thêm một chương trình Livestream mới vào Database
export async function createLivestream(data: {
  code: string;
  title: string;
  brand: string;
  platform: string;
  owner: string;
  targetGMV: number;
}) {
  try {
    const newLivestream = await prisma.livestream.create({
      data: {
        code: data.code,
        title: data.title,
        brand: data.brand,
        platform: data.platform,
        owner: data.owner,
        targetGMV: Number(data.targetGMV),
        dateTime: new Date(),
        status: 'Preparing',
      },
    });

    // Cập nhật lại giao diện trang /portfolio ngay lập tức
    revalidatePath('/portfolio');
    return { success: true, data: newLivestream };
  } catch (error) {
    console.error('Lỗi khi tạo Livestream:', error);
    return { success: false, error: 'Không thể tạo chương trình mới' };
  }
}

// Cập nhật trạng thái của phiên Livestream
export async function updateLivestreamStatus(id: string, status: string) {
  try {
    const updated = await prisma.livestream.update({
      where: { id },
      data: { status },
    });

    revalidatePath('/portfolio');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
    return { success: false, error: 'Không thể cập nhật trạng thái' };
  }
}