/*
  Warnings:

  - Changed the type of `provider` on the `user_oauth_accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "user_oauth_accounts" DROP COLUMN "provider",
ADD COLUMN     "provider" "AuthProvider" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_oauth_accounts_provider_provider_user_id_key" ON "user_oauth_accounts"("provider", "provider_user_id");
