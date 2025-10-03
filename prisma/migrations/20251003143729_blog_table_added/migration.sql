-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('DRAFT', 'PUBLISH');

-- CreateTable
CREATE TABLE "CustomField" (
    "id" TEXT NOT NULL,
    "reading_time" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meta" (
    "id" TEXT NOT NULL,
    "seo_title" TEXT NOT NULL,
    "seo_description" TEXT NOT NULL,
    "focus_keyword" TEXT NOT NULL,
    "keywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'DRAFT',
    "content" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "categories" TEXT[],
    "tags" TEXT[],
    "featured_media" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "metaId" TEXT NOT NULL,
    "customFieldId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_metaId_key" ON "Blog"("metaId");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_customFieldId_key" ON "Blog"("customFieldId");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_metaId_fkey" FOREIGN KEY ("metaId") REFERENCES "Meta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "CustomField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
