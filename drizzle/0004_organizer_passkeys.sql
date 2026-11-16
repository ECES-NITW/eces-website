CREATE TABLE `organizer_challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`challenge` text NOT NULL,
	`invite_hash` text,
	`user_handle` text,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `organizer_challenges_expires` ON `organizer_challenges` (`expires_at`);--> statement-breakpoint
CREATE TABLE `organizer_invites` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `organizer_passkeys` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`user_handle` text NOT NULL,
	`public_key` text NOT NULL,
	`counter` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `organizer_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`passkey_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`passkey_id`) REFERENCES `organizer_passkeys`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `organizer_sessions_expires` ON `organizer_sessions` (`expires_at`);
--> statement-breakpoint
-- Leave the original placeholder categories visible, with sign-ups closed until an organizer opens them.
UPDATE events SET registration_open = 0
WHERE created_at = updated_at AND date IS NULL AND venue IS NULL
  AND (slug, title) IN (
    ('technical-workshops', 'Technical Workshops'),
    ('industry-research-talks', 'Industry & Research Talks'),
    ('ece-society-events', 'ECE Society Events')
  );
