-- CreateTable
CREATE TABLE "visual_identity" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "folder_id" BIGINT NOT NULL,

    CONSTRAINT "visual_identity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "visual_identity" ADD CONSTRAINT "visual_identity_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
