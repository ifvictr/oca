DROP TABLE IF EXISTS `records`;
CREATE TABLE `records` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(2083) NOT NULL,
    `clicks` INT UNSIGNED NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `aliases`;
CREATE TABLE `aliases` (
    `name` VARCHAR(15) NOT NULL,
    `id` INT REFERENCES `records`(`id`),
    PRIMARY KEY (`name`)
);