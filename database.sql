-- Database Creation
-- run: CREATE DATABASE bid_and_win;

-- CONNECT TO DATABASE first
-- \c bid_and_win

-- 1. Create ENUM Types (PostgreSQL specific)
CREATE TYPE "enum_Users_role" AS ENUM ('user', 'admin');
CREATE TYPE "enum_Auctions_status" AS ENUM ('LIVE', 'ENDED', 'UPCOMING');

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS "Users" (
    "id" SERIAL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "passwordHash" VARCHAR(255) NOT NULL,
    "secretKeyHash" VARCHAR(255) NOT NULL,
    "role" "enum_Users_role" DEFAULT 'user',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("id")
);

-- 3. Create Auctions Table
CREATE TABLE IF NOT EXISTS "Auctions" (
    "id" SERIAL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "startingPrice" DECIMAL(10, 2) NOT NULL,
    "currentPrice" DECIMAL(10, 2) DEFAULT 0,
    "startTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "status" "enum_Auctions_status" DEFAULT 'LIVE',
    "createdBy" INTEGER NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "winnerId" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("id")
);

-- 4. Create Bids Table
CREATE TABLE IF NOT EXISTS "Bids" (
    "id" SERIAL,
    "amount" DECIMAL(10, 2) NOT NULL,
    "userId" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "auctionId" INTEGER REFERENCES "Auctions" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY ("id")
);
