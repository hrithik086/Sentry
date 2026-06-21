SELECT 'CREATE DATABASE Sentry'
    WHERE NOT EXISTS (
    SELECT FROM pg_database WHERE datname = 'Sentry'
)\gexec

\connect Sentry

CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
                                                       "MigrationId" character varying(150) NOT NULL,
                                                       "ProductVersion" character varying(32) NOT NULL,
                                                       CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
    BEGIN
        IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260531105937_InitialMigration') THEN
            CREATE TABLE "MasterKeys" (
                                          "UserId" uuid NOT NULL,
                                          "Hash" character varying(250) NOT NULL,
                                          "CreatedAt" timestamp with time zone NOT NULL,
                                          "CreatedBy" character varying(250) NOT NULL,
                                          "ModifiedAt" timestamp with time zone NOT NULL,
                                          "ModifiedBy" character varying(250) NOT NULL,
                                          CONSTRAINT "PK_MasterKeys" PRIMARY KEY ("UserId")
            );
        END IF;
    END $EF$;

DO $EF$
    BEGIN
        IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20260531105937_InitialMigration') THEN
            INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
            VALUES ('20260531105937_InitialMigration', '10.0.8');
        END IF;
    END $EF$;
COMMIT;