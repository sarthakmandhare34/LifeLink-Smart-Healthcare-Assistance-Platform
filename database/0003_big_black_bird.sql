CREATE TABLE `patientProviderIdentities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` enum('google','apple') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patientProviderIdentities_id` PRIMARY KEY(`id`),
	CONSTRAINT `provider_subject_unique` UNIQUE(`provider`,`subject`)
);
--> statement-breakpoint
ALTER TABLE `patientProviderIdentities` ADD CONSTRAINT `patientProviderIdentities_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;