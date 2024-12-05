/*
  Warnings:

  - Added the required column `type` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `resource` ADD COLUMN `type` ENUM('VIDEO', 'ARTICLE', 'BOOK') NOT NULL;
