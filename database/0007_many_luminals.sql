CREATE TABLE `syntheticDoctorCredentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`doctorId` varchar(80) NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(512) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `syntheticDoctorCredentials_id` PRIMARY KEY(`id`),
	CONSTRAINT `syntheticDoctorCredentials_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `syntheticDoctorCredentials_doctorId_unique` UNIQUE(`doctorId`),
	CONSTRAINT `syntheticDoctorCredentials_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `syntheticDoctorCredentials` ADD CONSTRAINT `syntheticDoctorCredentials_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;