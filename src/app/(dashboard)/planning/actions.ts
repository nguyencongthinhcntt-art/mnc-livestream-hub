'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. Thêm Chi Phí Ngân Sách
export async function addBudgetItem(data: {
  livestreamId: string;
  category: string;
  estimatedCost: number;
  notes?: string;
}) {
  if (!data.livestreamId) return;

  // Sử dụng prisma.budget khớp với model Budget trong schema.prisma
  await prisma.budget.create({
    data: {
      livestreamId: data.livestreamId,
      category: data.category,
      estimatedCost: data.estimatedCost,
      notes: data.notes || '',
    },
  });

  revalidatePath('/planning');
}

// 2. Xóa Chi Phí Ngân Sách
export async function deleteBudgetItem(id: string) {
  if (!id) return;

  await prisma.budget.delete({
    where: { id },
  });

  revalidatePath('/planning');
}

// 3. Thêm SKU
export async function addSKUItem(data: {
  livestreamId: string;
  skuCode: string;
  productName: string;
  originalPrice: number;
  streamPrice: number;
  stockAllocated: number;
  role: string;
}) {
  if (!data.livestreamId) return;

  // Sử dụng prisma.livestreamSKU khớp với model LivestreamSKU trong schema.prisma
  await prisma.livestreamSKU.create({
    data: {
      livestreamId: data.livestreamId,
      skuCode: data.skuCode,
      productName: data.productName,
      originalPrice: data.originalPrice,
      streamPrice: data.streamPrice,
      stockAllocated: data.stockAllocated,
      role: data.role,
    },
  });

  revalidatePath('/planning');
}

// 4. Xóa SKU
export async function deleteSKUItem(id: string) {
  if (!id) return;

  await prisma.livestreamSKU.delete({
    where: { id },
  });

  revalidatePath('/planning');
}

// 5. Thêm Voucher
export async function addVoucherItem(formData: FormData) {
  const livestreamId = formData.get('livestreamId') as string;
  const code = formData.get('code') as string;
  const discountType = formData.get('discountType') as string;
  const value = Number(formData.get('value'));
  const quantity = Number(formData.get('quantity'));
  const sponsor = formData.get('sponsor') as string;

  if (!livestreamId || !code) return;

  // Sử dụng prisma.voucherItem khớp với model VoucherItem trong schema.prisma
  await prisma.voucherItem.create({
    data: {
      livestreamId,
      code,
      discountType,
      value,
      quantity,
      sponsor,
    },
  });

  revalidatePath('/planning');
}

// 6. Xóa Voucher
export async function deleteVoucherItem(id: string) {
  if (!id) return;

  await prisma.voucherItem.delete({
    where: { id },
  });

  revalidatePath('/planning');
}

// 7. Cập nhật Trạng thái Phê Duyệt Kế Hoạch
export async function updatePlanningStatus(id: string, currentStatus: string) {
  if (!id) return;

  // Chuyển đổi trạng thái đảm bảo khớp dạng TitleCase ("Approved" / "Draft") trong Schema
  const isApproved = currentStatus === 'Approved' || currentStatus === 'APPROVED';
  const newStatus = isApproved ? 'Draft' : 'Approved';

  await prisma.livestream.update({
    where: { id },
    data: { 
      status: newStatus 
    },
  });

  // Đồng bộ lại dữ liệu cho cả 2 trang
  revalidatePath('/planning');
  revalidatePath('/portfolio');
}