CREATE TABLE `addresses` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`address` varchar(256) NOT NULL,
	`zipCode` varchar(256) NOT NULL,
	`countryCode` varchar(10) NOT NULL,
	`countryName` varchar(256) NOT NULL,
	`city` varchar(256) NOT NULL,
	`userId` bigint NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`userId` bigint NOT NULL,
	`phone` varchar(256) NOT NULL,
	`birthday` date NOT NULL,
	`rating` decimal(1),
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `provider_categories` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`providerId` bigint,
	`categoryName` enum('elderly_help','babysitting','pet_walking','handyperson') NOT NULL,
	`description` varchar(256) NOT NULL,
	`fee` decimal(2) NOT NULL,
	`schedule` json,
	`skills` json DEFAULT ('[]'),
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `provider_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `provider_id_category_name_unique_idx` UNIQUE(`providerId`,`categoryName`)
);
--> statement-breakpoint
CREATE TABLE `providers` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`userId` bigint NOT NULL,
	`phone` varchar(256) NOT NULL,
	`birthday` date NOT NULL,
	`bio` text,
	`educationLevel` varchar(50),
	`photos` json,
	`rating` decimal(1),
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `providers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`email` varchar(256) NOT NULL,
	`password` varchar(256) NOT NULL,
	`role` enum('customer','provider') NOT NULL,
	`firstName` varchar(256) NOT NULL,
	`lastName` varchar(256) NOT NULL,
	`refreshToken` varchar(1024) NOT NULL,
	`profileImg` varchar(50),
	`identificationType` enum('passport','residence','citizenId'),
	`languages` json DEFAULT ('[]'),
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_unique_email` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `providers` ADD CONSTRAINT `providers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;