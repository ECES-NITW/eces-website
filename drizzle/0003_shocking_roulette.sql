-- SQLite can't add a NOT NULL column without a default. Rows from the email era get a unique placeholder so the new index holds.
ALTER TABLE `event_registrations` ADD `roll_number` text NOT NULL DEFAULT '';--> statement-breakpoint
UPDATE `event_registrations` SET `roll_number` = 'legacy-' || `id` WHERE `roll_number` = '';--> statement-breakpoint
CREATE UNIQUE INDEX `event_registrations_event_roll_number_unique` ON `event_registrations` (`event_slug`,`roll_number`);
