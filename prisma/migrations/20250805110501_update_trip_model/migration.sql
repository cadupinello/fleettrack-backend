/*
  Warnings:

  - You are about to drop the column `routeId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_routeId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_vehicleId_fkey";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "routeId",
ADD COLUMN     "tripId" TEXT;

-- DropTable
DROP TABLE "Route";

-- DropEnum
DROP TYPE "RouteStatus";

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "fareValue" DOUBLE PRECISION,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "distance" DOUBLE PRECISION,
    "status" "TripStatus" NOT NULL DEFAULT 'PLANNED',
    "driverId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trip_code_key" ON "Trip"("code");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
