-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "EquipmentOnReservation" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
