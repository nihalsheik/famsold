/*
SQLyog Community v12.12 (64 bit)
MySQL - 5.1.73-community : Database - ac
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`ac` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `ac`;

/*Table structure for table `ledger` */

DROP TABLE IF EXISTS `ledger`;

CREATE TABLE `ledger` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `obDebit` decimal(10,0) DEFAULT '0',
  `obCredit` decimal(10,0) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

/*Table structure for table `ledger_detail` */

DROP TABLE IF EXISTS `ledger_detail`;

CREATE TABLE `ledger_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ledgerId` int(11) DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Table structure for table `ledger_group` */

DROP TABLE IF EXISTS `ledger_group`;

CREATE TABLE `ledger_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL,
  `nature` tinyint(4) DEFAULT NULL,
  `level` tinyint(4) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=latin1;

/*Table structure for table `ledger_nature` */

DROP TABLE IF EXISTS `ledger_nature`;

CREATE TABLE `ledger_nature` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Table structure for table `narration` */

DROP TABLE IF EXISTS `narration`;

CREATE TABLE `narration` (
  `voucherItemId` bigint(20) DEFAULT NULL,
  `narration` varchar(255) DEFAULT NULL,
  KEY `voucher_item_narration_id` (`voucherItemId`),
  CONSTRAINT `voucher_item_narration_id` FOREIGN KEY (`voucherItemId`) REFERENCES `voucher_item` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `unit` */

DROP TABLE IF EXISTS `unit`;

CREATE TABLE `unit` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` longtext,
  `narration` longtext,
  `decimalPlaces` int(11) DEFAULT NULL,
  `formalName` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Table structure for table `voucher` */

DROP TABLE IF EXISTS `voucher`;

CREATE TABLE `voucher` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ref` varchar(20) DEFAULT NULL,
  `type` tinyint(4) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `narration` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

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
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=latin1;

/*Table structure for table `voucher_type` */

DROP TABLE IF EXISTS `voucher_type`;

CREATE TABLE `voucher_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `shortName` varchar(10) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
