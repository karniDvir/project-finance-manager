-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'TRANSACTION', 'CREDIT');

-- CreateEnum
CREATE TYPE "public"."PaymentSource" AS ENUM ('LOAN', 'BALANCE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Beneficiary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receipt" TEXT,
    "beneficiaryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentTypeId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentType" (
    "id" TEXT NOT NULL,
    "method" "public"."PaymentMethod" NOT NULL,
    "source" "public"."PaymentSource" NOT NULL,

    CONSTRAINT "PaymentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Loan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amountReturned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LoanRepayment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loanId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LoanRepayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Beneficiary" ADD CONSTRAINT "Beneficiary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "public"."Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_paymentTypeId_fkey" FOREIGN KEY ("paymentTypeId") REFERENCES "public"."PaymentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Loan" ADD CONSTRAINT "Loan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LoanRepayment" ADD CONSTRAINT "LoanRepayment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "public"."Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LoanRepayment" ADD CONSTRAINT "LoanRepayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE OR REPLACE VIEW "BeneficiaryWithAmounts" AS
SELECT 
  b.id,
  b.name,
  b.reason,
  b."totalAmount",
  b."createdAt",
  b."userId",
  COALESCE(SUM(p.amount), 0) AS "amountPaid",
  (COALESCE(b."totalAmount", 0) - COALESCE(SUM(p.amount), 0)) AS "amountRemain"
FROM "Beneficiary" b
LEFT JOIN "Payment" p ON p."beneficiaryId" = b.id
GROUP BY b.id;

CREATE OR REPLACE VIEW "LoanWithReturned" AS
SELECT 
  l.id,
  l.name,
  l.amount,
  l.date,
  l."userId",
  COALESCE(SUM(r.amount), 0) AS "amountReturned",
  (l.amount - COALESCE(SUM(r.amount), 0)) AS "amountRemain"
FROM "Loan" l
LEFT JOIN "LoanRepayment" r ON r."loanId" = l.id
GROUP BY l.id;