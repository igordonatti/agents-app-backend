/*
  Warnings:

  - The primary key for the `documents_info` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `folders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tenants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `description` to the `visual_identity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "documents_info" DROP CONSTRAINT "documents_info_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_id_tenant_fkey";

-- DropForeignKey
ALTER TABLE "visual_identity" DROP CONSTRAINT "visual_identity_folder_id_fkey";

-- DropIndex
DROP INDEX "visual_identity_folder_id_key";

-- AlterTable
ALTER TABLE "documents_info" DROP CONSTRAINT "documents_info_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "folder_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "documents_info_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "documents_info_id_seq";

-- AlterTable
ALTER TABLE "folders" DROP CONSTRAINT "folders_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "id_tenant" SET DATA TYPE TEXT,
ADD CONSTRAINT "folders_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "folders_id_seq";

-- AlterTable
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tenants_id_seq";

-- AlterTable
ALTER TABLE "visual_identity" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "file_id" TEXT,
ALTER COLUMN "folder_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "documents_info" ADD CONSTRAINT "documents_info_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_id_tenant_fkey" FOREIGN KEY ("id_tenant") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visual_identity" ADD CONSTRAINT "visual_identity_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
