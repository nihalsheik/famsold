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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

/*Data for the table `ledger` */

insert  into `ledger`(`id`,`voucherId`,`groupId`,`groupNature`,`name`,`debit`,`credit`,`createdAt`,`updatedAt`) values (1,0,37,1,'Cash A/c','0','0','2016-01-20 21:57:41',NULL),(2,0,11,2,'Sheik\'s Capital','0','0','2016-01-20 21:57:42',NULL),(3,0,37,1,'Petty Cash','0','0','2016-01-20 21:57:42',NULL),(4,0,8,3,'Food Expense','0','0','2016-01-20 21:57:42',NULL),(5,0,14,1,'Table & Chair','0','0','2016-01-20 21:57:42',NULL),(6,0,20,4,'Sales','0','0','2016-01-20 21:57:42',NULL),(7,0,21,3,'Purchase','0','0','2016-01-20 21:57:42',NULL),(8,0,5,4,'Salary','0','0','2016-01-20 21:57:42',NULL),(9,0,6,3,'Travel Expense','0','0','2016-01-20 21:57:42',NULL),(10,0,36,1,'Aman','0','0','2016-01-20 21:57:42',NULL),(11,0,16,1,'Shares','0','0','2016-01-20 21:57:42',NULL),(12,0,38,1,'Union Bank','0','0','2016-01-20 21:57:42',NULL),(13,0,32,2,'Kumar','0','0','2016-01-20 21:57:42',NULL),(14,0,27,1,'TMB OD','100','0','2016-01-20 21:57:42',NULL);

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;

/*Data for the table `ledger_group` */

insert  into `ledger_group`(`id`,`name`,`parentId`,`nature`,`level`,`index`,`createdAt`,`updatedAt`) values (1,'Asset',0,1,1,1,'2015-12-31 16:30:38','2015-12-31 16:31:35'),(2,'Liabilities',0,2,1,2,'2015-12-31 16:30:38','2015-12-31 16:31:35'),(3,'Income',0,3,1,3,'2015-12-31 16:30:38','2015-12-31 16:31:35'),(4,'Expense',0,4,1,4,'2015-12-31 16:30:38','2015-12-31 16:31:35'),(5,'Direct Income',3,3,2,5,NULL,'2015-12-31 16:42:33'),(6,'Direct Expenses',4,4,2,6,NULL,'2015-12-31 16:42:33'),(7,'Indirect Income',3,3,2,7,NULL,'2015-12-31 16:42:33'),(8,'Indirect Expenses',4,4,2,8,NULL,'2015-12-31 16:42:33'),(11,'Capital Account',2,2,2,NULL,NULL,'2015-12-31 16:42:32'),(12,'Loans (Liability)',2,2,2,NULL,NULL,'2015-12-31 16:42:32'),(13,'Current Liabilities',2,2,2,NULL,NULL,'2015-12-31 16:42:32'),(14,'Fixed Assets',1,1,2,NULL,NULL,'2015-12-31 16:42:33'),(15,'Investments',1,1,2,NULL,NULL,'2015-12-31 16:42:33'),(16,'Current Assets',1,1,2,NULL,NULL,'2015-12-31 16:42:33'),(17,'Branch /Divisions',1,1,2,NULL,NULL,'2015-12-31 16:42:33'),(18,'Misc.Expenses (ASSET)',1,1,2,NULL,NULL,'2015-12-31 16:42:33'),(19,'Suspense A/C',2,2,2,NULL,NULL,'2015-12-31 16:42:33'),(20,'Sales Account',5,3,3,NULL,NULL,'2015-12-31 16:42:33'),(21,'Purchase Account',6,4,3,NULL,NULL,'2015-12-31 16:42:33'),(26,'Reservers &Surplus',11,1,3,NULL,NULL,'2015-12-31 16:44:26'),(27,'Bank OD A/C',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(28,'Secured Loans',12,1,3,NULL,NULL,'2015-12-31 16:42:33'),(29,'UnSecured Loans',12,1,3,NULL,NULL,'2015-12-31 16:42:33'),(30,'Duties& Taxes',13,3,3,NULL,NULL,'2015-12-31 16:42:33'),(31,'Provisions',13,2,3,NULL,NULL,'2015-12-31 16:42:33'),(32,'Sundry Creditors',13,2,3,NULL,NULL,'2015-12-31 16:42:33'),(33,'Stock-in-Hand',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(34,'Deposits(Assets)',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(35,'Loans & Advances(Asset)',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(36,'Sundry Debtors',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(37,'Cash-in Hand',16,1,3,NULL,NULL,'2015-12-31 16:42:33'),(38,'Bank Account',16,1,3,NULL,NULL,'2015-12-31 16:42:33');

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

/*Table structure for table `unit` */

DROP TABLE IF EXISTS `unit`;

CREATE TABLE `unit` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` longtext,
  `narration` longtext,
  `decimalPlaces` int(11) DEFAULT NULL,
  `formalName` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

/*Data for the table `unit` */

insert  into `unit`(`id`,`name`,`narration`,`decimalPlaces`,`formalName`) values (1,'test','',0,'NA'),(2,'test',NULL,NULL,NULL),(3,'test',NULL,NULL,NULL),(6,'test',NULL,NULL,NULL),(7,'test',NULL,NULL,NULL),(8,'aa',NULL,NULL,NULL),(9,'kg','s1',NULL,NULL),(10,'Ltr','s2',NULL,NULL),(11,'kg','s1',NULL,NULL),(12,'Ltr','s2',NULL,NULL),(13,'kg','s1',NULL,NULL),(14,'Ltr','s2',NULL,NULL);

/*Table structure for table `voucher` */

DROP TABLE IF EXISTS `voucher`;

CREATE TABLE `voucher` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ref` varchar(20) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `narration` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2770 DEFAULT CHARSET=latin1;

/*Data for the table `voucher` */

insert  into `voucher`(`id`,`ref`,`type`,`createdAt`,`updatedAt`,`narration`) values (2642,'ob',1,NULL,'2016-01-20 21:57:42',NULL),(2643,'1',3,NULL,'2016-01-20 21:57:42','Captial amount received'),(2644,'1',2,NULL,'2016-01-20 21:57:42','Cash move to petty cash'),(2645,'1',2,NULL,'2016-01-20 21:57:42','Deposit to union bank'),(2646,'1',2,NULL,'2016-01-20 21:57:42','Debit to Aman'),(2647,'1',2,NULL,'2016-01-20 21:57:42','Table and chair purchased'),(2648,'1',2,NULL,'2016-01-20 21:57:55','test'),(2649,'1',2,NULL,'2016-01-20 21:57:56','test'),(2650,'1',2,NULL,'2016-01-20 21:57:57','test'),(2651,'1',2,NULL,'2016-01-20 21:57:58','test'),(2652,'1',5,NULL,'2016-01-20 21:57:59','test'),(2653,'1',2,NULL,'2016-01-20 21:58:00','test'),(2654,'1',2,NULL,'2016-01-20 21:58:01','test'),(2655,'1',6,NULL,'2016-01-20 21:58:02','test'),(2656,'1',6,NULL,'2016-01-20 21:58:03','test'),(2657,'1',3,NULL,'2016-01-20 21:58:04','test'),(2658,'1',2,NULL,'2016-01-20 21:58:06','test'),(2659,'1',2,NULL,'2016-01-20 21:58:07','test'),(2660,'1',2,NULL,'2016-01-20 21:58:08','test'),(2661,'1',5,NULL,'2016-01-20 21:58:09','test'),(2662,'1',2,NULL,'2016-01-20 21:58:10','test'),(2663,'1',3,NULL,'2016-01-20 21:58:11','test'),(2664,'1',2,NULL,'2016-01-20 21:58:12','test'),(2665,'1',3,NULL,'2016-01-20 21:58:13','test'),(2666,'1',2,NULL,'2016-01-20 21:58:14','test'),(2667,'1',5,NULL,'2016-01-20 21:58:15','test'),(2668,'1',2,NULL,'2016-01-20 21:58:16','test'),(2669,'1',5,NULL,'2016-01-20 21:58:17','test'),(2670,'1',2,NULL,'2016-01-20 21:58:18','test'),(2671,'1',2,NULL,'2016-01-20 21:58:20','test'),(2672,'1',2,NULL,'2016-01-20 21:58:21','test'),(2673,'1',3,NULL,'2016-01-20 21:58:22','test'),(2674,'1',2,NULL,'2016-01-20 21:58:23','test'),(2675,'1',5,NULL,'2016-01-20 21:58:24','test'),(2676,'1',2,NULL,'2016-01-20 21:58:25','test'),(2677,'1',2,NULL,'2016-01-20 21:58:26','test'),(2678,'1',2,NULL,'2016-01-20 21:58:27','test'),(2679,'1',2,NULL,'2016-01-20 21:58:28','test'),(2680,'1',2,NULL,'2016-01-20 21:58:29','test'),(2681,'1',2,NULL,'2016-01-20 21:58:30','test'),(2682,'1',2,NULL,'2016-01-20 21:58:31','test'),(2683,'1',2,NULL,'2016-01-20 21:58:33','test'),(2684,'1',2,NULL,'2016-01-20 21:58:34','test'),(2685,'1',2,NULL,'2016-01-20 21:58:35','test'),(2686,'1',2,NULL,'2016-01-20 21:58:36','test'),(2687,'1',2,NULL,'2016-01-20 21:58:37','test'),(2688,'1',2,NULL,'2016-01-20 21:58:38','test'),(2689,'1',6,NULL,'2016-01-20 21:58:39','test'),(2690,'1',2,NULL,'2016-01-20 21:58:40','test'),(2691,'1',3,NULL,'2016-01-20 21:58:41','test'),(2692,'1',2,NULL,'2016-01-20 21:58:42','test'),(2693,'1',6,NULL,'2016-01-20 21:58:43','test'),(2694,'1',2,NULL,'2016-01-20 21:58:45','test'),(2695,'1',2,NULL,'2016-01-20 21:58:46','test'),(2696,'1',6,NULL,'2016-01-20 21:58:47','test'),(2697,'1',2,NULL,'2016-01-20 21:58:48','test'),(2698,'1',6,NULL,'2016-01-20 21:58:49','test'),(2699,'1',2,NULL,'2016-01-20 21:58:50','test'),(2700,'1',2,NULL,'2016-01-20 21:58:51','test'),(2701,'1',2,NULL,'2016-01-20 21:58:52','test'),(2702,'1',2,NULL,'2016-01-20 21:58:53','test'),(2703,'1',2,NULL,'2016-01-20 21:58:54','test'),(2704,'1',2,NULL,'2016-01-20 21:58:55','test'),(2705,'1',6,NULL,'2016-01-20 21:58:56','test'),(2706,'1',6,NULL,'2016-01-20 21:58:58','test'),(2707,'1',5,NULL,'2016-01-20 21:58:59','test'),(2708,'1',5,NULL,'2016-01-20 21:59:00','test'),(2709,'1',6,NULL,'2016-01-21 16:56:20','test'),(2710,'1',2,NULL,'2016-01-21 16:56:21','test'),(2711,'1',5,NULL,'2016-01-21 16:56:22','test'),(2712,'1',5,NULL,'2016-01-21 16:56:23','test'),(2713,'1',2,NULL,'2016-01-21 16:56:24','test'),(2714,'1',6,NULL,'2016-01-21 16:56:25','test'),(2715,'1',2,NULL,'2016-01-21 16:56:26','test'),(2716,'1',2,NULL,'2016-01-21 16:56:27','test'),(2717,'1',6,NULL,'2016-01-21 16:56:28','test'),(2718,'1',2,NULL,'2016-01-21 16:56:29','test'),(2719,'1',5,NULL,'2016-01-21 16:56:31','test'),(2720,'1',5,NULL,'2016-01-21 16:56:32','test'),(2721,'1',2,NULL,'2016-01-21 16:56:33','test'),(2722,'1',5,NULL,'2016-01-21 16:56:34','test'),(2723,'1',6,NULL,'2016-01-21 16:56:35','test'),(2724,'1',6,NULL,'2016-01-21 16:56:36','test'),(2725,'1',6,NULL,'2016-01-21 16:56:37','test'),(2726,'1',2,NULL,'2016-01-21 16:56:38','test'),(2727,'1',2,NULL,'2016-01-21 16:56:39','test'),(2728,'1',6,NULL,'2016-01-21 16:56:40','test'),(2729,'1',6,NULL,'2016-01-21 16:56:41','test'),(2730,'1',2,NULL,'2016-01-21 16:56:42','test'),(2731,'1',2,NULL,'2016-01-21 16:56:44','test'),(2732,'1',6,NULL,'2016-01-21 16:56:45','test'),(2733,'1',2,NULL,'2016-01-21 16:56:46','test'),(2734,'1',2,NULL,'2016-01-21 16:56:47','test'),(2735,'1',2,NULL,'2016-01-21 16:56:48','test'),(2736,'1',5,NULL,'2016-01-21 16:56:49','test'),(2737,'1',6,NULL,'2016-01-21 16:56:50','test'),(2738,'1',5,NULL,'2016-01-21 16:56:51','test'),(2739,'1',2,NULL,'2016-01-21 16:56:52','test'),(2740,'1',2,NULL,'2016-01-21 16:56:53','test'),(2741,'1',2,NULL,'2016-01-21 16:56:55','test'),(2742,'1',2,NULL,'2016-01-21 16:56:56','test'),(2743,'1',3,NULL,'2016-01-21 16:56:57','test'),(2744,'1',2,NULL,'2016-01-21 16:56:58','test'),(2745,'1',5,NULL,'2016-01-21 16:56:59','test'),(2746,'1',2,NULL,'2016-01-21 16:57:00','test'),(2747,'1',6,NULL,'2016-01-21 16:57:01','test'),(2748,'1',2,NULL,'2016-01-21 16:57:02','test'),(2749,'1',2,NULL,'2016-01-21 16:57:03','test'),(2750,'1',2,NULL,'2016-01-21 16:57:04','test'),(2751,'1',6,NULL,'2016-01-21 16:57:05','test'),(2752,'1',3,NULL,'2016-01-21 16:57:06','test'),(2753,'1',3,NULL,'2016-01-21 16:57:07','test'),(2754,'1',2,NULL,'2016-01-21 16:57:09','test'),(2755,'1',2,NULL,'2016-01-21 16:57:10','test'),(2756,'1',2,NULL,'2016-01-21 16:57:11','test'),(2757,'1',3,NULL,'2016-01-21 16:57:12','test'),(2758,'1',6,NULL,'2016-01-21 16:57:13','test'),(2759,'1',5,NULL,'2016-01-21 16:57:14','test'),(2760,'1',2,NULL,'2016-01-21 16:57:15','test'),(2761,'1',5,NULL,'2016-01-21 16:57:16','test'),(2762,'1',5,NULL,'2016-01-21 16:57:17','test'),(2763,'1',6,NULL,'2016-01-21 16:57:18','test'),(2764,'1',5,NULL,'2016-01-21 16:57:19','test'),(2765,'1',2,NULL,'2016-01-21 16:57:20','test'),(2766,'1',2,NULL,'2016-01-21 16:57:22','test'),(2767,'1',3,NULL,'2016-01-21 16:57:23','test'),(2768,'1',2,NULL,'2016-01-21 16:57:24','test'),(2769,'1',2,NULL,'2016-01-21 16:57:25','test');

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
  PRIMARY KEY (`id`),
  KEY `voucher_voucher_item_vid` (`voucherId`),
  CONSTRAINT `voucher_voucher_item_vid` FOREIGN KEY (`voucherId`) REFERENCES `voucher` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5409 DEFAULT CHARSET=latin1;

/*Data for the table `voucher_item` */

insert  into `voucher_item`(`id`,`voucherId`,`ledgerId`,`againstLedgerId`,`debit`,`credit`,`narration`) values (5154,2642,14,NULL,'100','0',''),(5155,2643,1,NULL,'100000','0',''),(5156,2643,2,NULL,'0','100000',''),(5157,2644,3,NULL,'10000','0',''),(5158,2644,1,NULL,'0','10000',''),(5159,2645,12,NULL,'5000','0',''),(5160,2645,1,NULL,'0','5000',''),(5161,2646,10,NULL,'3000','0',''),(5162,2646,1,NULL,'0','3000',''),(5163,2647,5,NULL,'2500','0',''),(5164,2647,1,NULL,'0','2500',''),(5165,2648,12,NULL,'168','0',''),(5166,2648,1,NULL,'0','168',''),(5167,2649,1,NULL,'568','0',''),(5168,2649,8,NULL,'0','568',''),(5169,2650,5,NULL,'431','0',''),(5170,2650,1,NULL,'0','431',''),(5171,2651,4,NULL,'39','0',''),(5172,2651,1,NULL,'0','39',''),(5173,2652,1,NULL,'50000','0',''),(5174,2652,6,NULL,'0','50000',''),(5175,2653,1,NULL,'140','0',''),(5176,2653,8,NULL,'0','140',''),(5177,2654,9,NULL,'338','0',''),(5178,2654,1,NULL,'0','338',''),(5179,2655,7,NULL,'827','0',''),(5180,2655,1,NULL,'0','827',''),(5181,2656,7,NULL,'81','0',''),(5182,2656,1,NULL,'0','81',''),(5183,2657,1,NULL,'529','0',''),(5184,2657,13,NULL,'0','529',''),(5185,2658,5,NULL,'540','0',''),(5186,2658,1,NULL,'0','540',''),(5187,2659,4,NULL,'171','0',''),(5188,2659,1,NULL,'0','171',''),(5189,2660,12,NULL,'538','0',''),(5190,2660,1,NULL,'0','538',''),(5191,2661,1,NULL,'50000','0',''),(5192,2661,6,NULL,'0','50000',''),(5193,2662,12,NULL,'775','0',''),(5194,2662,1,NULL,'0','775',''),(5195,2663,1,NULL,'641','0',''),(5196,2663,13,NULL,'0','641',''),(5197,2664,12,NULL,'768','0',''),(5198,2664,1,NULL,'0','768',''),(5199,2665,1,NULL,'524','0',''),(5200,2665,13,NULL,'0','524',''),(5201,2666,4,NULL,'979','0',''),(5202,2666,1,NULL,'0','979',''),(5203,2667,1,NULL,'605','0',''),(5204,2667,6,NULL,'0','605',''),(5205,2668,11,NULL,'833','0',''),(5206,2668,1,NULL,'0','833',''),(5207,2669,1,NULL,'388','0',''),(5208,2669,6,NULL,'0','388',''),(5209,2670,5,NULL,'85','0',''),(5210,2670,1,NULL,'0','85',''),(5211,2671,4,NULL,'263','0',''),(5212,2671,1,NULL,'0','263',''),(5213,2672,9,NULL,'497','0',''),(5214,2672,1,NULL,'0','497',''),(5215,2673,1,NULL,'139','0',''),(5216,2673,13,NULL,'0','139',''),(5217,2674,4,NULL,'61','0',''),(5218,2674,1,NULL,'0','61',''),(5219,2675,1,NULL,'421','0',''),(5220,2675,6,NULL,'0','421',''),(5221,2676,11,NULL,'232','0',''),(5222,2676,1,NULL,'0','232',''),(5223,2677,10,NULL,'8','0',''),(5224,2677,1,NULL,'0','8',''),(5225,2678,9,NULL,'773','0',''),(5226,2678,1,NULL,'0','773',''),(5227,2679,5,NULL,'900','0',''),(5228,2679,1,NULL,'0','900',''),(5229,2680,4,NULL,'469','0',''),(5230,2680,1,NULL,'0','469',''),(5231,2681,12,NULL,'303','0',''),(5232,2681,1,NULL,'0','303',''),(5233,2682,5,NULL,'995','0',''),(5234,2682,1,NULL,'0','995',''),(5235,2683,5,NULL,'392','0',''),(5236,2683,1,NULL,'0','392',''),(5237,2684,5,NULL,'597','0',''),(5238,2684,1,NULL,'0','597',''),(5239,2685,10,NULL,'540','0',''),(5240,2685,1,NULL,'0','540',''),(5241,2686,4,NULL,'117','0',''),(5242,2686,1,NULL,'0','117',''),(5243,2687,9,NULL,'810','0',''),(5244,2687,1,NULL,'0','810',''),(5245,2688,5,NULL,'137','0',''),(5246,2688,1,NULL,'0','137',''),(5247,2689,7,NULL,'819','0',''),(5248,2689,1,NULL,'0','819',''),(5249,2690,1,NULL,'515','0',''),(5250,2690,8,NULL,'0','515',''),(5251,2691,1,NULL,'780','0',''),(5252,2691,13,NULL,'0','780',''),(5253,2692,10,NULL,'866','0',''),(5254,2692,1,NULL,'0','866',''),(5255,2693,7,NULL,'139','0',''),(5256,2693,1,NULL,'0','139',''),(5257,2694,9,NULL,'736','0',''),(5258,2694,1,NULL,'0','736',''),(5259,2695,9,NULL,'53','0',''),(5260,2695,1,NULL,'0','53',''),(5261,2696,7,NULL,'37','0',''),(5262,2696,1,NULL,'0','37',''),(5263,2697,11,NULL,'230','0',''),(5264,2697,1,NULL,'0','230',''),(5265,2698,7,NULL,'9','0',''),(5266,2698,1,NULL,'0','9',''),(5267,2699,5,NULL,'985','0',''),(5268,2699,1,NULL,'0','985',''),(5269,2700,9,NULL,'353','0',''),(5270,2700,1,NULL,'0','353',''),(5271,2701,5,NULL,'766','0',''),(5272,2701,1,NULL,'0','766',''),(5273,2702,9,NULL,'342','0',''),(5274,2702,1,NULL,'0','342',''),(5275,2703,9,NULL,'855','0',''),(5276,2703,1,NULL,'0','855',''),(5277,2704,12,NULL,'243','0',''),(5278,2704,1,NULL,'0','243',''),(5279,2705,7,NULL,'446','0',''),(5280,2705,1,NULL,'0','446',''),(5281,2706,7,NULL,'501','0',''),(5282,2706,1,NULL,'0','501',''),(5283,2707,1,NULL,'704','0',''),(5284,2707,6,NULL,'0','704',''),(5285,2708,1,NULL,'50000','0',''),(5286,2708,6,NULL,'0','50000',''),(5287,2709,7,NULL,'111','0',''),(5288,2709,1,NULL,'0','111',''),(5289,2710,1,NULL,'202','0',''),(5290,2710,8,NULL,'0','202',''),(5291,2711,1,NULL,'417','0',''),(5292,2711,6,NULL,'0','417',''),(5293,2712,1,NULL,'876','0',''),(5294,2712,6,NULL,'0','876',''),(5295,2713,11,NULL,'809','0',''),(5296,2713,1,NULL,'0','809',''),(5297,2714,7,NULL,'604','0',''),(5298,2714,1,NULL,'0','604',''),(5299,2715,5,NULL,'840','0',''),(5300,2715,1,NULL,'0','840',''),(5301,2716,9,NULL,'767','0',''),(5302,2716,1,NULL,'0','767',''),(5303,2717,7,NULL,'81','0',''),(5304,2717,1,NULL,'0','81',''),(5305,2718,1,NULL,'703','0',''),(5306,2718,8,NULL,'0','703',''),(5307,2719,1,NULL,'91','0',''),(5308,2719,6,NULL,'0','91',''),(5309,2720,1,NULL,'918','0',''),(5310,2720,6,NULL,'0','918',''),(5311,2721,10,NULL,'768','0',''),(5312,2721,1,NULL,'0','768',''),(5313,2722,1,NULL,'826','0',''),(5314,2722,6,NULL,'0','826',''),(5315,2723,7,NULL,'589','0',''),(5316,2723,1,NULL,'0','589',''),(5317,2724,7,NULL,'906','0',''),(5318,2724,1,NULL,'0','906',''),(5319,2725,7,NULL,'44','0',''),(5320,2725,1,NULL,'0','44',''),(5321,2726,4,NULL,'735','0',''),(5322,2726,1,NULL,'0','735',''),(5323,2727,9,NULL,'951','0',''),(5324,2727,1,NULL,'0','951',''),(5325,2728,7,NULL,'670','0',''),(5326,2728,1,NULL,'0','670',''),(5327,2729,7,NULL,'834','0',''),(5328,2729,1,NULL,'0','834',''),(5329,2730,4,NULL,'784','0',''),(5330,2730,1,NULL,'0','784',''),(5331,2731,4,NULL,'681','0',''),(5332,2731,1,NULL,'0','681',''),(5333,2732,7,NULL,'240','0',''),(5334,2732,1,NULL,'0','240',''),(5335,2733,11,NULL,'374','0',''),(5336,2733,1,NULL,'0','374',''),(5337,2734,4,NULL,'375','0',''),(5338,2734,1,NULL,'0','375',''),(5339,2735,10,NULL,'941','0',''),(5340,2735,1,NULL,'0','941',''),(5341,2736,1,NULL,'245','0',''),(5342,2736,6,NULL,'0','245',''),(5343,2737,7,NULL,'705','0',''),(5344,2737,1,NULL,'0','705',''),(5345,2738,1,NULL,'50000','0',''),(5346,2738,6,NULL,'0','50000',''),(5347,2739,9,NULL,'297','0',''),(5348,2739,1,NULL,'0','297',''),(5349,2740,11,NULL,'930','0',''),(5350,2740,1,NULL,'0','930',''),(5351,2741,10,NULL,'687','0',''),(5352,2741,1,NULL,'0','687',''),(5353,2742,9,NULL,'478','0',''),(5354,2742,1,NULL,'0','478',''),(5355,2743,1,NULL,'74','0',''),(5356,2743,13,NULL,'0','74',''),(5357,2744,11,NULL,'557','0',''),(5358,2744,1,NULL,'0','557',''),(5359,2745,1,NULL,'50000','0',''),(5360,2745,6,NULL,'0','50000',''),(5361,2746,10,NULL,'319','0',''),(5362,2746,1,NULL,'0','319',''),(5363,2747,7,NULL,'589','0',''),(5364,2747,1,NULL,'0','589',''),(5365,2748,11,NULL,'348','0',''),(5366,2748,1,NULL,'0','348',''),(5367,2749,10,NULL,'886','0',''),(5368,2749,1,NULL,'0','886',''),(5369,2750,1,NULL,'211','0',''),(5370,2750,8,NULL,'0','211',''),(5371,2751,7,NULL,'120','0',''),(5372,2751,1,NULL,'0','120',''),(5373,2752,1,NULL,'844','0',''),(5374,2752,13,NULL,'0','844',''),(5375,2753,1,NULL,'589','0',''),(5376,2753,13,NULL,'0','589',''),(5377,2754,1,NULL,'735','0',''),(5378,2754,8,NULL,'0','735',''),(5379,2755,9,NULL,'808','0',''),(5380,2755,1,NULL,'0','808',''),(5381,2756,5,NULL,'924','0',''),(5382,2756,1,NULL,'0','924',''),(5383,2757,1,NULL,'247','0',''),(5384,2757,13,NULL,'0','247',''),(5385,2758,7,NULL,'662','0',''),(5386,2758,1,NULL,'0','662',''),(5387,2759,1,NULL,'818','0',''),(5388,2759,6,NULL,'0','818',''),(5389,2760,1,NULL,'545','0',''),(5390,2760,8,NULL,'0','545',''),(5391,2761,1,NULL,'50000','0',''),(5392,2761,6,NULL,'0','50000',''),(5393,2762,1,NULL,'50000','0',''),(5394,2762,6,NULL,'0','50000',''),(5395,2763,7,NULL,'356','0',''),(5396,2763,1,NULL,'0','356',''),(5397,2764,1,NULL,'797','0',''),(5398,2764,6,NULL,'0','797',''),(5399,2765,9,NULL,'169','0',''),(5400,2765,1,NULL,'0','169',''),(5401,2766,9,NULL,'494','0',''),(5402,2766,1,NULL,'0','494',''),(5403,2767,1,NULL,'7','0',''),(5404,2767,13,NULL,'0','7',''),(5405,2768,10,NULL,'265','0',''),(5406,2768,1,NULL,'0','265',''),(5407,2769,10,NULL,'808','0',''),(5408,2769,1,NULL,'0','808','');

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
