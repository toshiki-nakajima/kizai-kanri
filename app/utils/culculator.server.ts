import { PrismaClient } from "@prisma/client";

// PrismaClientのインスタンスをアプリ全体で共有
const prisma = new PrismaClient();

export async function getEquipmentUsageByDate(equipmentId: bigint, startDate: string, endDate: string) {
    // 入力値のバリデーション
    if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
        throw new Error("無効な日付形式です。YYYY-MM-DD形式で入力してください。");
    }

    // 日付文字列をDate型に変換し、時間情報を設定
    const normalizedStartDate = new Date(startDate);
    normalizedStartDate.setHours(0, 0, 0, 0); // 開始日を00:00:00に設定

    const normalizedEndDate = new Date(endDate);
    normalizedEndDate.setHours(23, 59, 59, 999); // 終了日を23:59:59に設定

    try {
        const usage = await prisma.equipmentOnReservation.findMany({
            where: {
                equipmentId: equipmentId,
                reservation: {
                    start: {
                        lte: normalizedEndDate, // 終了日より前
                    },
                    end: {
                        gte: normalizedStartDate, // 開始日より後
                    },
                },
            },
            include: {
                reservation: true,
            },
        });

        // 日付ごとに利用数をマッピング
        const usageByDate: Record<string, number> = {};

        for (const record of usage) {
            const current = new Date(record.reservation.start);
            const reservationEnd = new Date(record.reservation.end);

            while (current <= reservationEnd) {
                const dateKey = current.toISOString().split("T")[0]; // YYYY-MM-DD形式

                // normalizedStartDateからnormalizedEndDateの範囲内のみを対象とする
                if (current >= normalizedStartDate && current <= normalizedEndDate) {
                    usageByDate[dateKey] = (usageByDate[dateKey] || 0) + record.quantity;
                }

                current.setDate(current.getDate() + 1); // 次の日へ
            }
        }

        return usageByDate;
    } catch (error) {
        console.error("Error fetching equipment usage:", error);
        throw new Error("機材の利用状況を取得中にエラーが発生しました");
    } finally {
        // PrismaClientのインスタンスを閉じる
        await prisma.$disconnect();
    }
}

// 日付文字列が有効かどうかを確認するヘルパー関数
function isValidDateString(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}
