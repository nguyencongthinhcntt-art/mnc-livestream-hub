import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang dọn dẹp dữ liệu cũ...');
  try {
    if ((prisma as any).voucherItem) await (prisma as any).voucherItem.deleteMany({});
    if ((prisma as any).sKUItem) await (prisma as any).sKUItem.deleteMany({});
    if ((prisma as any).budgetItem) await (prisma as any).budgetItem.deleteMany({});
    await prisma.livestream.deleteMany({});
  } catch (e) {
    console.log('Lưu ý dọn dẹp:', e);
  }

  console.log('🚀 Đang bơm 10 phiên livestream dữ liệu test...');

  const platforms = ['TikTok Shop', 'Shopee', 'Lazada'];
  const brands = ['Maybelline New York', 'Garnier', 'L’Oréal Paris', 'CeraVe', 'La Roche-Posay'];
  const statuses = ['DRAFT', 'APPROVED', 'COMPLETED'];

  for (let i = 1; i <= 10; i++) {
    const brand = brands[(i - 1) % brands.length];
    const platform = platforms[(i - 1) % platforms.length];
    const status = statuses[(i - 1) % statuses.length];

    // Tạo ngày livestream ngẫu nhiên trong vài ngày tới
    const streamDate = new Date();
    streamDate.setDate(streamDate.getDate() + i);

    await prisma.livestream.create({
      data: {
        code: `LS-2026-00${i}`,
        title: `[Mega Stream 2026] Chiến dịch mẫu #${i} (${brand})`,
        brand: brand,
        platform: platform,
        dateTime: streamDate, // 👈 Đã thêm trường dateTime bắt buộc
        targetGMV: 100000000 * i,
        status: status,
        budgets: {
          create: [
            { category: 'Host / KOL', estimatedCost: 10000000 * i, notes: 'Chi phí Book Host' },
            { category: 'Quảng cáo (Ads/Traffic)', estimatedCost: 5000000 * i, notes: 'Chạy Live Ads' },
            { category: 'Studio / Thiết bị', estimatedCost: 3000000 * i, notes: 'Setup Studio Mega' },
          ],
        },
        skus: {
          create: [
            {
              skuCode: `SKU-TEST-${i}-01`,
              productName: `Sản phẩm mẫu Hero ${i}`,
              role: 'HERO',
              originalPrice: 300000,
              streamPrice: 200000,
              stockAllocated: 500 * i,
            },
            {
              skuCode: `SKU-TEST-${i}-02`,
              productName: `Sản phẩm Mồi Bait ${i}`,
              role: 'BAIT',
              originalPrice: 150000,
              streamPrice: 99000,
              stockAllocated: 800 * i,
            },
          ],
        },
        vouchers: {
          create: [
            {
              code: `VOUCHER${i}0K`,
              discountType: 'Giảm Tiền Mặt',
              value: 10000 * i,
              quantity: 100,
              sponsor: 'Brand Tài Trợ',
            },
          ],
        },
      },
    });
  }

  console.log('✅ Đã nạp thành công 10 phiên livestream!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });