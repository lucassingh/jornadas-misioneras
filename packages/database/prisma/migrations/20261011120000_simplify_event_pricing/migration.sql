-- Simplifica EventPricing a una sola modalidad: dos montos según cuándo se paga
-- (2 meses antes / 1 mes antes del inicio del evento). Las fechas límite ya no se
-- guardan, se derivan de Event.startDate.
--
-- Migración con backfill: los eventos con precio cargado bajo el sistema viejo
-- conservan un precio equivalente (total mínimo -> "2 meses antes", total máximo
-- -> "1 mes antes") en vez de perder la información.

-- 1. Nuevas columnas (nullable primero para poder rellenarlas)
ALTER TABLE "EventPricing"
  ADD COLUMN "priceTwoMonthsBefore" DECIMAL(10,2),
  ADD COLUMN "priceOneMonthBefore"  DECIMAL(10,2);

-- 2. Backfill desde los campos legacy
--    SYSTEM_ONE: inscripción + (anticipado | en jornada)  => min = early+early, max = late+atEvent
--    SYSTEM_TWO: inscripción + cuota 1 + cuota 2          => min = early+c1+c2, max = late+c1+c2
UPDATE "EventPricing" SET
  "priceTwoMonthsBefore" = COALESCE(
    "totalAmount",
    "registrationEarlyAmount"
      + COALESCE("eventPaymentEarlyAmount", 0)
      + COALESCE("installment1Amount", 0)
      + COALESCE("installment2Amount", 0)
  ),
  "priceOneMonthBefore" =
    "registrationLateAmount"
      + COALESCE("eventPaymentAtEventAmount", 0)
      + COALESCE("installment1Amount", 0)
      + COALESCE("installment2Amount", 0);

-- Invariante del nuevo modelo: "2 meses antes" <= "1 mes antes"
UPDATE "EventPricing"
SET "priceOneMonthBefore" = "priceTwoMonthsBefore"
WHERE "priceOneMonthBefore" < "priceTwoMonthsBefore";

-- 3. Ahora sí, obligatorias
ALTER TABLE "EventPricing"
  ALTER COLUMN "priceTwoMonthsBefore" SET NOT NULL,
  ALTER COLUMN "priceOneMonthBefore"  SET NOT NULL;

-- 4. Eliminar el modelo viejo
ALTER TABLE "EventPricing"
  DROP COLUMN "paymentSystem",
  DROP COLUMN "registrationEarlyDeadline",
  DROP COLUMN "registrationEarlyAmount",
  DROP COLUMN "registrationLateDeadline",
  DROP COLUMN "registrationLateAmount",
  DROP COLUMN "eventPaymentDeadline",
  DROP COLUMN "eventPaymentEarlyAmount",
  DROP COLUMN "eventPaymentAtEventAmount",
  DROP COLUMN "installment1Deadline",
  DROP COLUMN "installment1Amount",
  DROP COLUMN "installment2Amount",
  DROP COLUMN "totalAmount";

-- DropEnum
DROP TYPE "PaymentSystemType";
