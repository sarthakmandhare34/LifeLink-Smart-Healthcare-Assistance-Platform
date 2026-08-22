CREATE TABLE `patientAppointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`doctorId` varchar(80) NOT NULL,
	`scheduledAt` timestamp NOT NULL,
	`status` enum('Requested','Pending','Confirmed','Completed','Cancelled') NOT NULL DEFAULT 'Requested',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patientAppointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patientCredentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(512) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patientCredentials_id` PRIMARY KEY(`id`),
	CONSTRAINT `patientCredentials_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `patientCredentials_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `patientEmergencyContacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`relationship` varchar(80) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patientEmergencyContacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patientEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('PROFILE_UPDATED','APPOINTMENT_UPDATED','PRESCRIPTION_CREATED','ASSESSMENT_COMPLETED','MEDICINE_UPDATED') NOT NULL,
	`entityId` varchar(80),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `patientEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patientMedicines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`dosage` varchar(120) NOT NULL,
	`frequency` varchar(120) NOT NULL,
	`schedule` varchar(120) NOT NULL,
	`startDate` varchar(10),
	`endDate` varchar(10),
	`quantity` int,
	`expiry` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patientMedicines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patientPrescriptionItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`prescriptionId` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`dosage` varchar(120) NOT NULL,
	`instructions` text NOT NULL,
	CONSTRAINT `patientPrescriptionItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patientPrescriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`doctorId` varchar(80) NOT NULL,
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	`status` enum('UNSIGNED / DEMO','SIGNED — DEMO STATE') NOT NULL DEFAULT 'UNSIGNED / DEMO',
	`clinicalNotes` text,
	`integrityReference` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patientPrescriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patientProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bloodGroup` varchar(12),
	`phone` varchar(32),
	`allergiesJson` text NOT NULL,
	`conditionsJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patientProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `patientProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `patientAppointments` ADD CONSTRAINT `patientAppointments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patientCredentials` ADD CONSTRAINT `patientCredentials_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patientEmergencyContacts` ADD CONSTRAINT `patientEmergencyContacts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patientEvents` ADD CONSTRAINT `patientEvents_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patientMedicines` ADD CONSTRAINT `patientMedicines_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patientPrescriptionItems` ADD CONSTRAINT `rx_item_prescription_fk` FOREIGN KEY (`prescriptionId`) REFERENCES `patientPrescriptions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patientPrescriptions` ADD CONSTRAINT `patientPrescriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patientProfiles` ADD CONSTRAINT `patientProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
