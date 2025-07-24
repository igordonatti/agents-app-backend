/*
  Warnings:

  - A unique constraint covering the columns `[folder_id]` on the table `visual_identity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "visual_identity_folder_id_key" ON "visual_identity"("folder_id");
