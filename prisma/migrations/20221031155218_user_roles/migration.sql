-- CreateEnum
CREATE TYPE "OraganizationRole" AS ENUM ('employee', 'product_manager', 'warehouse_manager', 'employee_manager', 'organization_manager', 'owner');

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "roles" "OraganizationRole"[];
