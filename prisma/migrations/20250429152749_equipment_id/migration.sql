/*
  Warnings:

  - The primary key for the `Equipment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Equipment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `EquipmentOnReservation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `equipmentId` on the `EquipmentOnReservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `equipmentId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EquipmentOnReservation" DROP CONSTRAINT "EquipmentOnReservation_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_equipmentId_fkey";

-- AlterTable
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "EquipmentOnReservation" DROP CONSTRAINT "EquipmentOnReservation_pkey",
DROP COLUMN "equipmentId",
ADD COLUMN     "equipmentId" BIGINT NOT NULL,
ADD CONSTRAINT "EquipmentOnReservation_pkey" PRIMARY KEY ("equipmentId", "reservationId");

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "equipmentId",
ADD COLUMN     "equipmentId" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentOnReservation" ADD CONSTRAINT "EquipmentOnReservation_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
