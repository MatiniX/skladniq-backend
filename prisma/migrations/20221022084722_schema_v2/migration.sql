/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WarehousePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StorageUnit" AS ENUM ('quantitiy', 'weight', 'length', 'area', 'volume');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "WarehousePermission" DROP CONSTRAINT "WarehousePermission_userId_fkey";

-- DropForeignKey
ALTER TABLE "WarehousePermission" DROP CONSTRAINT "WarehousePermission_warehouseId_fkey";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "WarehousePermission";

-- CreateTable
CREATE TABLE "warehouse_products" (
    "warehouseId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "unitsInStock" INTEGER NOT NULL,
    "maxCapacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_products_pkey" PRIMARY KEY ("warehouseId","productId")
);

-- CreateTable
CREATE TABLE "warehouse_permissions" (
    "warehouseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "permission" "Permission" NOT NULL DEFAULT 'full',

    CONSTRAINT "warehouse_permissions_pkey" PRIMARY KEY ("warehouseId","userId")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "storageUnit" "StorageUnit" NOT NULL,
    "metricUnit" DOUBLE PRECISION NOT NULL,
    "organizationId" UUID,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attributes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "unit" "StorageUnit" NOT NULL,
    "valuePerStorageUnit" DOUBLE PRECISION NOT NULL,
    "displayValue" TEXT NOT NULL,
    "metricUnit" DOUBLE PRECISION NOT NULL,
    "productId" UUID,

    CONSTRAINT "product_attributes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "warehouse_products" ADD CONSTRAINT "warehouse_products_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_products" ADD CONSTRAINT "warehouse_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_permissions" ADD CONSTRAINT "warehouse_permissions_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_permissions" ADD CONSTRAINT "warehouse_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attributes" ADD CONSTRAINT "product_attributes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
