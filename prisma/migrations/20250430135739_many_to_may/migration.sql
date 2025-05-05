/*
  Warnings:

  - You are about to drop the column `equipmentId` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_equipmentId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "equipmentId";
