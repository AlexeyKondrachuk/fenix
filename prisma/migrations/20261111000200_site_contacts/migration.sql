CREATE TABLE "SiteContacts" (
    "id" INTEGER PRIMARY KEY CHECK ("id" = 1),
    "adultPhone" TEXT NOT NULL DEFAULT '',
    "childPhone" TEXT NOT NULL DEFAULT '',
    "max" TEXT NOT NULL DEFAULT '',
    "telegram" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "vk" TEXT NOT NULL DEFAULT ''
);
