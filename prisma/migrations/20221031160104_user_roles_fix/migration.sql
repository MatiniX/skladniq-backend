/*
  Warnings:

  - You are about to drop the column `roles` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "roles";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roles" "OraganizationRole"[];
