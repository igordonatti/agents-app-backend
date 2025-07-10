-- CreateTable
CREATE TABLE "documents_info" (
    "id" BIGSERIAL NOT NULL,
    "id_original" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "folder_id" BIGINT NOT NULL,
    "file_name" TEXT,

    CONSTRAINT "documents_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "id" BIGSERIAL NOT NULL,
    "id_folder" TEXT NOT NULL,
    "id_tenant" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prompt" TEXT,
    "name" TEXT DEFAULT '',

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_original" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "folders_id_key" ON "folders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "folders_id_folder_key" ON "folders"("id_folder");

-- AddForeignKey
ALTER TABLE "documents_info" ADD CONSTRAINT "documents_info_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_id_tenant_fkey" FOREIGN KEY ("id_tenant") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
