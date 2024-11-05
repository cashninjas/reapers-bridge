-- CreateTable
CREATE TABLE "bridge" (
    "id" SERIAL NOT NULL,
    "timeburned" VARCHAR(40),
    "txidsmartbch" VARCHAR(80),
    "sbchoriginaddress" VARCHAR(80),
    "nftnumber" INTEGER NOT NULL,
    "timebridged" VARCHAR(40),
    "txidbch" VARCHAR(80),
    "destinationaddress" VARCHAR(80),
    "signatureproof" VARCHAR(140),

    CONSTRAINT "bridge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_nftnumber" ON "bridge"("nftnumber");
