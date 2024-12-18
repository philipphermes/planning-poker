CREATE TABLE `cards` (
	`id` text PRIMARY KEY NOT NULL,
	`time` integer NOT NULL,
	`room_id` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE no action
);
