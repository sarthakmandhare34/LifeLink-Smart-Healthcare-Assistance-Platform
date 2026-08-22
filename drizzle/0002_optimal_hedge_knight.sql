ALTER TABLE `patientPrescriptionItems` ADD CONSTRAINT `rx_item_prescription_fk` FOREIGN KEY (`prescriptionId`) REFERENCES `patientPrescriptions`(`id`) ON DELETE cascade ON UPDATE no action;
