/*
  Warnings:

  - You are about to drop the column `image_url` on the `images` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "images" DROP COLUMN "image_url",
ADD COLUMN     "image_id" TEXT;
