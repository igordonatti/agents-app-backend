/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `endUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_endUserId_fkey";

-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_folderId_fkey";

-- DropForeignKey
ALTER TABLE "image" DROP CONSTRAINT "image_messageId_fkey";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "chat";

-- DropTable
DROP TABLE "endUser";

-- DropTable
DROP TABLE "image";

-- DropEnum
DROP TYPE "SenderType";
