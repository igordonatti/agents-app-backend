/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `documents_info` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `documents_info` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `folders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_folder` on the `folders` table. All the data in the column will be lost.
  - The `id` column on the `folders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `images` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `tenants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `tenants` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `visual_identity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `visual_identity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[fid_onedrive]` on the table `folders` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `folder_id` on the `documents_info` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `fid_onedrive` to the `folders` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id_tenant` on the `folders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `folder_id` on the `visual_identity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "documents_info" DROP CONSTRAINT "documents_info_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_id_tenant_fkey";

-- DropForeignKey
ALTER TABLE "visual_identity" DROP CONSTRAINT "visual_identity_folder_id_fkey";

-- DropIndex
DROP INDEX "folders_id_folder_key";

-- DropIndex
DROP INDEX "folders_id_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "documents_info" DROP CONSTRAINT "documents_info_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "folder_id",
ADD COLUMN     "folder_id" UUID NOT NULL,
ADD CONSTRAINT "documents_info_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "folders" DROP CONSTRAINT "folders_pkey",
DROP COLUMN "id_folder",
ADD COLUMN     "fid_onedrive" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "id_tenant",
ADD COLUMN     "id_tenant" UUID NOT NULL,
ADD CONSTRAINT "folders_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "images" DROP CONSTRAINT "images_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "images_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "visual_identity" DROP CONSTRAINT "visual_identity_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "folder_id",
ADD COLUMN     "folder_id" UUID NOT NULL,
ADD CONSTRAINT "visual_identity_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "folders_fid_onedrive_key" ON "folders"("fid_onedrive");

-- AddForeignKey
ALTER TABLE "documents_info" ADD CONSTRAINT "documents_info_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_id_tenant_fkey" FOREIGN KEY ("id_tenant") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visual_identity" ADD CONSTRAINT "visual_identity_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
