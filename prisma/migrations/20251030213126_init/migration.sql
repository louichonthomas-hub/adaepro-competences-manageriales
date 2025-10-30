-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "company" TEXT,
    "department" TEXT,
    "position" TEXT,
    "hasPaid" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" TEXT,
    "paymentId" TEXT,
    "paymentAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestProgress" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "currentSection" INTEGER NOT NULL DEFAULT 1,
    "currentQuestion" INTEGER NOT NULL DEFAULT 0,
    "answers" JSONB NOT NULL DEFAULT '{}',
    "managementStylesAnswers" JSONB,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "section1Score" DOUBLE PRECISION NOT NULL,
    "section2Score" DOUBLE PRECISION NOT NULL,
    "section3Score" DOUBLE PRECISION NOT NULL,
    "section4Score" DOUBLE PRECISION NOT NULL,
    "section5Score" DOUBLE PRECISION NOT NULL,
    "section6Score" DOUBLE PRECISION NOT NULL,
    "section7Score" DOUBLE PRECISION NOT NULL,
    "section8Score" DOUBLE PRECISION NOT NULL,
    "section9Score" DOUBLE PRECISION NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "percentageScore" DOUBLE PRECISION NOT NULL,
    "managementStyles" JSONB,
    "radarData" JSONB NOT NULL,
    "narrativeReport" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "candidateEmail" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "provider" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- CreateIndex
CREATE INDEX "Candidate_email_idx" ON "Candidate"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TestProgress_candidateId_key" ON "TestProgress"("candidateId");

-- CreateIndex
CREATE INDEX "TestProgress_candidateId_idx" ON "TestProgress"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "TestResult_candidateId_key" ON "TestResult"("candidateId");

-- CreateIndex
CREATE INDEX "TestResult_candidateId_idx" ON "TestResult"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_transactionId_key" ON "PaymentTransaction"("transactionId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_candidateEmail_idx" ON "PaymentTransaction"("candidateEmail");

-- CreateIndex
CREATE INDEX "PaymentTransaction_transactionId_idx" ON "PaymentTransaction"("transactionId");

-- AddForeignKey
ALTER TABLE "TestProgress" ADD CONSTRAINT "TestProgress_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
