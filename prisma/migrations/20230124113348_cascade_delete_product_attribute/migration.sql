-- DropForeignKey
ALTER TABLE "product_attributes" DROP CONSTRAINT "product_attributes_productId_fkey";

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
