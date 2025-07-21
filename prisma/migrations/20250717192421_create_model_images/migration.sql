-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "image_id" TEXT,
    "name" TEXT,
    "chat_id" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);
