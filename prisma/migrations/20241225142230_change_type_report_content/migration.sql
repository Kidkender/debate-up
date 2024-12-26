/*
  Warnings:

  - You are about to alter the column `contentType` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.

*/
-- AlterTable
ALTER TABLE `Report` MODIFY `contentType` ENUM('FORUM', 'COMMENT') NOT NULL;
