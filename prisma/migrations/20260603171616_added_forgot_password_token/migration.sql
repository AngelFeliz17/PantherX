-- CreateTable
CREATE TABLE "ForgotPasswordToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForgotPasswordToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPasswordToken_userId_key" ON "ForgotPasswordToken"("userId");

-- AddForeignKey
ALTER TABLE "ForgotPasswordToken" ADD CONSTRAINT "ForgotPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
