/*
  Warnings:

  - Added the required column `created` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadline` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `job` ADD COLUMN `created` DATETIME(3) NOT NULL,
    ADD COLUMN `deadline` DATETIME(3) NOT NULL;
