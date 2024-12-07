/*
  Warnings:

  - You are about to drop the column `ContentType` on the `report` table. All the data in the column will be lost.
  - Added the required column `contentType` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `report` DROP COLUMN `ContentType`,
    ADD COLUMN `contentType` VARCHAR(191) NOT NULL;
