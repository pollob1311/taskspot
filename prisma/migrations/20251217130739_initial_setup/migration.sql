-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('STARTED', 'PENDING', 'APPROVED', 'REJECTED', 'REVERSED');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('EARN', 'SPEND', 'BONUS', 'REFERRAL', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "OfferDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "countryCode" TEXT,
    "avatarUrl" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "kycVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "fraudScore" INTEGER NOT NULL DEFAULT 0,
    "totalEarned" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "availableBalance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "pendingBalance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "deviceFingerprint" TEXT,
    "referralCode" TEXT,
    "referredById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "cpaNetwork" TEXT NOT NULL,
    "externalOfferId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "payout" DECIMAL(10,4) NOT NULL,
    "userReward" DECIMAL(10,4) NOT NULL,
    "rewardPoints" INTEGER NOT NULL,
    "countries" TEXT[],
    "deviceTypes" TEXT[],
    "thumbnailUrl" TEXT,
    "difficulty" "OfferDifficulty" NOT NULL DEFAULT 'MEDIUM',
    "avgCompletionTime" INTEGER,
    "conversionRate" DECIMAL(5,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOffer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'STARTED',
    "rewardPoints" INTEGER,
    "ipAddress" TEXT,
    "deviceFingerprint" TEXT,
    "transactionId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "UserOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "pointsDeducted" INTEGER NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "paymentDetails" JSONB NOT NULL,
    "transactionHash" TEXT,
    "adminNotes" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "refereeId" TEXT NOT NULL,
    "totalEarned" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "commissionEarned" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adType" TEXT NOT NULL,
    "adNetwork" TEXT NOT NULL,
    "pointsEarned" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FraudLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_referralCode_idx" ON "User"("referralCode");

-- CreateIndex
CREATE INDEX "User_fraudScore_idx" ON "User"("fraudScore");

-- CreateIndex
CREATE INDEX "Offer_isActive_idx" ON "Offer"("isActive");

-- CreateIndex
CREATE INDEX "Offer_isFeatured_idx" ON "Offer"("isFeatured");

-- CreateIndex
CREATE INDEX "Offer_category_idx" ON "Offer"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_cpaNetwork_externalOfferId_key" ON "Offer"("cpaNetwork", "externalOfferId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOffer_transactionId_key" ON "UserOffer"("transactionId");

-- CreateIndex
CREATE INDEX "UserOffer_userId_idx" ON "UserOffer"("userId");

-- CreateIndex
CREATE INDEX "UserOffer_status_idx" ON "UserOffer"("status");

-- CreateIndex
CREATE INDEX "UserOffer_transactionId_idx" ON "UserOffer"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOffer_userId_offerId_key" ON "UserOffer"("userId", "offerId");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- CreateIndex
CREATE INDEX "Withdrawal_userId_idx" ON "Withdrawal"("userId");

-- CreateIndex
CREATE INDEX "Withdrawal_status_idx" ON "Withdrawal"("status");

-- CreateIndex
CREATE INDEX "Withdrawal_requestedAt_idx" ON "Withdrawal"("requestedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_refereeId_key" ON "Referral"("refereeId");

-- CreateIndex
CREATE INDEX "Referral_referrerId_idx" ON "Referral"("referrerId");

-- CreateIndex
CREATE INDEX "AdView_userId_idx" ON "AdView"("userId");

-- CreateIndex
CREATE INDEX "AdView_createdAt_idx" ON "AdView"("createdAt");

-- CreateIndex
CREATE INDEX "FraudLog_userId_idx" ON "FraudLog"("userId");

-- CreateIndex
CREATE INDEX "FraudLog_severity_idx" ON "FraudLog"("severity");

-- CreateIndex
CREATE INDEX "FraudLog_createdAt_idx" ON "FraudLog"("createdAt");

-- AddForeignKey
ALTER TABLE "UserOffer" ADD CONSTRAINT "UserOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOffer" ADD CONSTRAINT "UserOffer_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdrawal" ADD CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdView" ADD CONSTRAINT "AdView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FraudLog" ADD CONSTRAINT "FraudLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
