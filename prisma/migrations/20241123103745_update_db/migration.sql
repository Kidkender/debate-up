/*
  Warnings:

  - You are about to drop the column `created_at` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `coursecontent` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `coursecontent` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `coursecontent` table. All the data in the column will be lost.
  - You are about to drop the column `ai_response` on the `debatesession` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `debatesession` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `debatesession` table. All the data in the column will be lost.
  - You are about to drop the column `user_response` on the `debatesession` table. All the data in the column will be lost.
  - You are about to alter the column `feedback_score` on the `debatesession` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the column `course_id` on the `feedback` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `feedback` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `feedback` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `forum` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `forum` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `forum` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `forumcomment` table. All the data in the column will be lost.
  - You are about to drop the column `forum_id` on the `forumcomment` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `forumcomment` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `is_read` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `resource` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `resource` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `usercourseporgress` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `CourseContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CourseContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aiResponse` to the `DebateSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DebateSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `DebateSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userResponse` to the `DebateSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseId` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Forum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Forum` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forumId` to the `ForumComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ForumComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ForumComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Resource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `coursecontent` DROP FOREIGN KEY `CourseContent_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `debatesession` DROP FOREIGN KEY `DebateSession_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `Feedback_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `Feedback_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `forum` DROP FOREIGN KEY `Forum_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `forumcomment` DROP FOREIGN KEY `ForumComment_forum_id_fkey`;

-- DropForeignKey
ALTER TABLE `forumcomment` DROP FOREIGN KEY `ForumComment_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `usercourseporgress` DROP FOREIGN KEY `UserCoursePorgress_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `usercourseporgress` DROP FOREIGN KEY `UserCoursePorgress_user_id_fkey`;

-- AlterTable
ALTER TABLE `course` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `coursecontent` DROP COLUMN `course_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `courseId` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `debatesession` DROP COLUMN `ai_response`,
    DROP COLUMN `created_at`,
    DROP COLUMN `user_id`,
    DROP COLUMN `user_response`,
    ADD COLUMN `aiResponse` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD COLUMN `userResponse` VARCHAR(191) NOT NULL,
    MODIFY `feedback_score` DOUBLE NULL;

-- AlterTable
ALTER TABLE `feedback` DROP COLUMN `course_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `user_id`,
    ADD COLUMN `courseId` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `forum` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `user_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `forumcomment` DROP COLUMN `created_at`,
    DROP COLUMN `forum_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `forumId` INTEGER NOT NULL,
    ADD COLUMN `parentId` INTEGER NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `created_at`,
    DROP COLUMN `is_read`,
    DROP COLUMN `user_id`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isRead` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `resource` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `create_at`,
    DROP COLUMN `update_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `social_login_type` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `usercourseporgress`;

-- CreateTable
CREATE TABLE `UserCourseProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `progress` DOUBLE NOT NULL DEFAULT 0,
    `lastAccessed` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `RefreshToken_token_key` ON `RefreshToken`(`token`);

-- AddForeignKey
ALTER TABLE `CourseContent` ADD CONSTRAINT `CourseContent_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCourseProgress` ADD CONSTRAINT `UserCourseProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCourseProgress` ADD CONSTRAINT `UserCourseProgress_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DebateSession` ADD CONSTRAINT `DebateSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Forum` ADD CONSTRAINT `Forum_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForumComment` ADD CONSTRAINT `ForumComment_forumId_fkey` FOREIGN KEY (`forumId`) REFERENCES `Forum`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForumComment` ADD CONSTRAINT `ForumComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForumComment` ADD CONSTRAINT `ForumComment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `ForumComment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
