BEGIN;

LOCK TABLE "ReviewMedia" IN ACCESS EXCLUSIVE MODE;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "ReviewMedia" WHERE octet_length("bytes") > 0) THEN
        RAISE EXCEPTION 'Export review attachments with scripts/export-review-media.cjs before applying this migration';
    END IF;
END $$;

ALTER TABLE "ReviewMedia" DROP COLUMN "bytes";

COMMIT;
