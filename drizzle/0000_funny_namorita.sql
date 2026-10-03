CREATE TABLE `event_registrations` (
	`id` text PRIMARY KEY NOT NULL,
	`event_slug` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`year` text,
	`branch` text,
	`section` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `event_registrations_event_email_unique` ON `event_registrations` (`event_slug`,`email`);