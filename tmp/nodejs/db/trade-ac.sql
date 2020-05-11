/*
SQLyog Community v12.12 (64 bit)
MySQL - 5.1.73-community : Database - ac
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`ac` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `ac`;

/*Table structure for table `daily_stats` */

DROP TABLE IF EXISTS `daily_stats`;

CREATE TABLE `daily_stats` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `openingStock` decimal(10,0) DEFAULT NULL,
  `closingStock` decimal(10,0) DEFAULT NULL,
  `income` decimal(10,0) DEFAULT NULL,
  `expense` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `daily_stats` */

insert  into `daily_stats`(`id`,`date`,`openingStock`,`closingStock`,`income`,`expense`) values (1,NULL,'100','100','60','100');

/*Table structure for table `inventory_item` */

DROP TABLE IF EXISTS `inventory_item`;

CREATE TABLE `inventory_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `unitId` int(11) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Data for the table `inventory_item` */

insert  into `inventory_item`(`id`,`name`,`unitId`,`description`) values (2,'Lux Soap2-updated',3,'desc'),(3,'Lux Soap3-updated',4,'desc'),(4,'Lux Soap4-updated',4,'desc'),(5,'Lux Soap5-updated',2,'desc');

/*Table structure for table `ledger` */

DROP TABLE IF EXISTS `ledger`;

CREATE TABLE `ledger` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `voucherId` bigint(20) DEFAULT '0',
  `groupId` int(11) DEFAULT NULL,
  `groupNature` tinyint(4) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `debit` decimal(10,0) DEFAULT '0',
  `credit` decimal(10,0) DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

/*Data for the table `ledger` */

insert  into `ledger`(`id`,`voucherId`,`groupId`,`groupNature`,`name`,`debit`,`credit`,`createdAt`,`updatedAt`) values (1,0,37,1,'Cash A/c','0','0','2016-01-28 18:09:07',NULL),(2,0,11,2,'Sheik\'s Capital','0','0','2016-01-28 18:09:07',NULL),(3,0,37,1,'Petty Cash','0','0','2016-01-28 18:09:07',NULL),(4,0,8,4,'Food Expense','0','0','2016-01-28 18:09:07',NULL),(5,0,14,1,'Table & Chair','0','0','2016-01-28 18:09:07',NULL),(6,0,20,3,'Sales','0','0','2016-01-28 18:09:07',NULL),(7,0,21,4,'Purchase','0','0','2016-01-28 18:09:07',NULL),(8,0,5,3,'Salary','0','0','2016-01-28 18:09:07',NULL),(9,0,6,4,'Travel Expense','0','0','2016-01-28 18:09:08',NULL),(10,0,36,1,'Aman','0','0','2016-01-28 18:09:08',NULL),(11,0,16,1,'Shares','0','0','2016-01-28 18:09:08',NULL),(12,0,38,1,'Union Bank','0','0','2016-01-28 18:09:08',NULL),(13,0,32,2,'Kumar','0','0','2016-01-28 18:09:08',NULL);

/*Table structure for table `ledger_detail` */

DROP TABLE IF EXISTS `ledger_detail`;

CREATE TABLE `ledger_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ledgerId` int(11) DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=latin1;

/*Data for the table `ledger_detail` */

insert  into `ledger_detail`(`id`,`ledgerId`,`address`) values (92,93,'12345'),(93,94,'12345'),(94,95,'12345'),(95,96,'12345'),(96,97,'12345'),(97,98,'12345'),(98,99,'12345'),(99,100,'12345'),(100,101,'12345'),(101,102,'12345'),(102,103,'12345'),(103,104,'12345'),(104,105,'12345'),(105,106,'12345'),(106,107,'12345'),(107,108,'12345');

/*Table structure for table `ledger_group` */

DROP TABLE IF EXISTS `ledger_group`;

CREATE TABLE `ledger_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL,
  `nature` tinyint(4) DEFAULT NULL,
  `level` tinyint(4) DEFAULT NULL,
  `index` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;

/*Data for the table `ledger_group` */

insert  into `ledger_group`(`id`,`name`,`parentId`,`nature`,`level`,`index`,`createdAt`,`updatedAt`) values (1,'Asset',0,1,1,1,'2015-12-31 16:30:38','2015-12-31 16:31:35'),(2,'Liabilities',0,2,1,2,'2015-12-31 16:30:38','2015-12-31 16:31:35'),(3,'Income',0,3,1,3,'2015-12-31 16:30:38','2015-12-31 16:31:35'),(4,'Expense',0,4,1,4,'2015-12-31 16:30:38','2015-12-31 16:31:35'),(5,'Direct Income',3,3,2,5,NULL,'2015-12-31 16:42:33'),(6,'Direct Expenses',4,4,2,6,NULL,'2015-12-31 16:42:33'),(7,'Indirect Income',3,3,2,7,NULL,'2015-12-31 16:42:33'),(8,'Indirect Expenses',4,4,2,8,NULL,'2015-12-31 16:42:33'),(11,'Capital Account',2,2,2,NULL,NULL,'2015-12-31 16:42:32'),(12,'Loans (Liability)',2,2,2,NULL,NULL,'2015-12-31 16:42:32'),(13,'Current Liabilities',2,2,2,NULL,NULL,'2015-12-31 16:42:32'),(14,'Fixed Assets',1,1,2,NULL,NULL,'2015-12-31 16:42:33'),(15,'Investments',1,1,2,NULL,NULL,'2015-12-31 16:42:33'),(16,'Current Assets',1,1,2,NULL,NULL,'2015-12-31 16:42:33'),(17,'Branch /Divisions',1,1,2,NULL,NULL,'2015-12-31 16:42:33'),(18,'Misc.Expenses (ASSET)',1,1,2,NULL,NULL,'2015-12-31 16:42:33'),(19,'Suspense A/C',2,2,2,NULL,NULL,'2015-12-31 16:42:33'),(20,'Sales Account',5,3,3,NULL,NULL,'2015-12-31 16:42:33'),(21,'Purchase Account',6,4,3,NULL,NULL,'2015-12-31 16:42:33'),(26,'Reservers &Surplus',11,1,3,NULL,NULL,'2015-12-31 16:44:26'),(27,'Bank OD A/C',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(28,'Secured Loans',12,1,3,NULL,NULL,'2015-12-31 16:42:33'),(29,'UnSecured Loans',12,1,3,NULL,NULL,'2015-12-31 16:42:33'),(30,'Duties& Taxes',13,3,3,NULL,NULL,'2015-12-31 16:42:33'),(31,'Provisions',13,2,3,NULL,NULL,'2015-12-31 16:42:33'),(32,'Sundry Creditors',13,2,3,NULL,NULL,'2015-12-31 16:42:33'),(33,'Stock-in-Hand',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(34,'Deposits(Assets)',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(35,'Loans & Advances(Asset)',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(36,'Sundry Debtors',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(37,'Cash-in Hand',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(38,'Bank Account',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(40,'Test',5,3,3,NULL,'2016-02-01 17:47:47','2016-02-01 17:47:47'),(43,'Test2',5,3,3,NULL,'2016-02-01 17:50:32','2016-02-01 17:50:32'),(45,'Test22',5,3,3,NULL,'2016-02-01 17:51:15','2016-02-01 17:51:15'),(49,'one-updated',6,4,3,NULL,NULL,'2016-02-12 16:44:23');

/*Table structure for table `purchase` */

DROP TABLE IF EXISTS `purchase`;

CREATE TABLE `purchase` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `voucherId` bigint(20) DEFAULT NULL,
  `partyLedgerId` bigint(20) DEFAULT NULL,
  `ledgerId` bigint(20) DEFAULT NULL,
  `billNo` varchar(20) DEFAULT NULL,
  `totalAmount` decimal(10,0) DEFAULT NULL,
  `discount` decimal(10,0) DEFAULT NULL,
  `netAmount` decimal(10,0) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`updatedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `purchase` */

/*Table structure for table `purchase_return` */

DROP TABLE IF EXISTS `purchase_return`;

CREATE TABLE `purchase_return` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `voucherId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `purchase_return` */

/*Table structure for table `sales` */

DROP TABLE IF EXISTS `sales`;

CREATE TABLE `sales` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `bill` varchar(50) DEFAULT NULL,
  `voucherId` bigint(20) DEFAULT NULL,
  `ledgerId` bigint(20) DEFAULT NULL,
  `amount` decimal(10,0) DEFAULT NULL,
  `discount` decimal(10,0) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `sales` */

/*Table structure for table `sales_return` */

DROP TABLE IF EXISTS `sales_return`;

CREATE TABLE `sales_return` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `voucherId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `sales_return` */

/*Table structure for table `unit` */

DROP TABLE IF EXISTS `unit`;

CREATE TABLE `unit` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `decimalPlaces` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Data for the table `unit` */

insert  into `unit`(`id`,`name`,`description`,`decimalPlaces`) values (2,'Kg2-updated','Kilo Grams',2),(3,'Kg3-updated','Kilo Grams',2),(4,'Kg4-updated','Kilo Grams',2),(5,'Kg5-updated','Kilo Grams',2);

/*Table structure for table `voucher` */

DROP TABLE IF EXISTS `voucher`;

CREATE TABLE `voucher` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ref` varchar(20) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `narration` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `voucher_voucher_item` FOREIGN KEY (`id`) REFERENCES `voucher_item` (`voucherId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `voucher` */

/*Table structure for table `voucher_inventory` */

DROP TABLE IF EXISTS `voucher_inventory`;

CREATE TABLE `voucher_inventory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `voucherId` bigint(20) DEFAULT NULL,
  `voucherItemId` bigint(20) DEFAULT NULL,
  `inQuantity` decimal(10,0) DEFAULT NULL,
  `outQuantity` decimal(10,0) DEFAULT NULL,
  `rate` decimal(10,0) DEFAULT NULL,
  `amount` decimal(10,0) DEFAULT NULL,
  `discount` decimal(10,0) DEFAULT NULL,
  `netAmount` decimal(10,0) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `voucher_inventory` */

/*Table structure for table `voucher_item` */

DROP TABLE IF EXISTS `voucher_item`;

CREATE TABLE `voucher_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `voucherId` bigint(20) DEFAULT NULL,
  `ledgerId` int(11) DEFAULT NULL,
  `againstLedgerId` int(11) DEFAULT NULL,
  `debit` decimal(10,0) DEFAULT '0',
  `credit` decimal(10,0) DEFAULT '0',
  `narration` varchar(250) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `voucher_voucher_item_vid` (`voucherId`),
  CONSTRAINT `voucher_voucher_item_vid` FOREIGN KEY (`voucherId`) REFERENCES `voucher` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `voucher_item` */

/*Table structure for table `voucher_type` */

DROP TABLE IF EXISTS `voucher_type`;

CREATE TABLE `voucher_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `shortName` varchar(10) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

/*Data for the table `voucher_type` */

insert  into `voucher_type`(`id`,`name`,`shortName`,`createdAt`,`updatedAt`) values (1,'Opening Balance','OBAL',NULL,NULL),(2,'Contra','CONT',NULL,NULL),(3,'Payment','PAYM',NULL,NULL),(4,'Receipt','RECP',NULL,NULL),(5,'Journal','JOUR',NULL,NULL),(6,'Sales','SALE',NULL,NULL),(7,'Purchase','PURC',NULL,NULL),(8,'Credit Note','CRNO',NULL,NULL),(9,'Debit Note','DBNO',NULL,NULL),(10,'Reverse Journal','REVJ',NULL,NULL),(11,'Memo','MEMO',NULL,NULL),(12,'Purchase Order','PORD',NULL,NULL),(13,'Sales Order','SORD',NULL,NULL),(14,'Receipt Note','RECN',NULL,NULL),(15,'Deliery Note','DELN',NULL,NULL),(16,'Rejection Out','REJO',NULL,NULL),(17,'Rejection In','REJI',NULL,NULL),(18,'Stock Journal','STKJ',NULL,NULL),(19,'Physical Stock','PHYS',NULL,NULL);

/*Table structure for table `view_voucher` */

DROP TABLE IF EXISTS `view_voucher`;

/*!50001 DROP VIEW IF EXISTS `view_voucher` */;
/*!50001 DROP TABLE IF EXISTS `view_voucher` */;

/*!50001 CREATE TABLE  `view_voucher`(
 `id` bigint(20) ,
 `type` tinyint(4) ,
 `createdAt` datetime ,
 `voucherId` bigint(20) ,
 `ledgerId` int(11) ,
 `groupId` int(11) ,
 `groupNature` tinyint(4) ,
 `againstLedgerId` int(11) ,
 `debit` decimal(10,0) ,
 `credit` decimal(10,0) ,
 `narration` varchar(250) 
)*/;

/*View structure for view view_voucher */

/*!50001 DROP TABLE IF EXISTS `view_voucher` */;
/*!50001 DROP VIEW IF EXISTS `view_voucher` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_voucher` AS (select `v`.`id` AS `id`,`v`.`type` AS `type`,`v`.`createdAt` AS `createdAt`,`vi`.`voucherId` AS `voucherId`,`vi`.`ledgerId` AS `ledgerId`,`led`.`groupId` AS `groupId`,`led`.`groupNature` AS `groupNature`,`vi`.`againstLedgerId` AS `againstLedgerId`,`vi`.`debit` AS `debit`,`vi`.`credit` AS `credit`,`vi`.`narration` AS `narration` from ((`voucher_item` `vi` left join `voucher` `v` on((`vi`.`voucherId` = `v`.`id`))) left join `ledger` `led` on((`vi`.`ledgerId` = `led`.`id`)))) */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
