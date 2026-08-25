CREATE TABLE `doctorEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`doctorId` varchar(80) NOT NULL,
	`patientUserId` int NOT NULL,
	`type` enum('APPOINTMENT_UPDATED') NOT NULL,
	`entityId` varchar(80),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `doctorEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','doctor','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `doctorEvents` ADD CONSTRAINT `doctorEvents_patientUserId_users_id_fk` FOREIGN KEY (`patientUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;