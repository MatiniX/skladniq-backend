/*
  Warnings:

  - The values [quantitiy] on the enum `StorageUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StorageUnit_new" AS ENUM ('quantity', 'weight', 'length', 'area', 'volume');
ALTER TABLE "products" ALTER COLUMN "storageUnit" TYPE "StorageUnit_new" USING ("storageUnit"::text::"StorageUnit_new");
ALTER TABLE "product_attributes" ALTER COLUMN "unit" TYPE "StorageUnit_new" USING ("unit"::text::"StorageUnit_new");
ALTER TYPE "StorageUnit" RENAME TO "StorageUnit_old";
ALTER TYPE "StorageUnit_new" RENAME TO "StorageUnit";
DROP TYPE "StorageUnit_old";
COMMIT;

-- AlterTable
ALTER TABLE "warehouse_products" ADD COLUMN     "unlimitedCapacity" BOOLEAN NOT NULL DEFAULT false;
