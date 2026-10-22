CREATE TABLE `events` (
	`slug` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`theme` text DEFAULT '' NOT NULL,
	`short` text DEFAULT '' NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`date` text,
	`time` text,
	`venue` text,
	`registration_open` integer DEFAULT true NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
-- Seed the three original placeholder categories so existing registrations keep a matching event.
INSERT INTO `events` (`slug`, `title`, `theme`, `short`, `detail`, `sort_order`) VALUES
	('technical-workshops', 'Technical Workshops', 'Build', 'Hands-on sessions for building, testing, and learning together.', 'Practical sessions across electronics, embedded systems, and communication tools.', 1),
	('industry-research-talks', 'Industry & Research Talks', 'Connect', 'Perspectives from people working at the edge of the field.', 'Conversations with researchers and industry voices about ideas shaping the next generation of technology.', 2),
	('ece-society-events', 'ECE Society Events', 'Explore', 'Meet the community and take part in what comes next.', 'Society gatherings, technical challenges, and opportunities to explore ideas with peers.', 3);
