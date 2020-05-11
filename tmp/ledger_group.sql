/*
SQLyog Community v12.12 (64 bit)
MySQL - 5.1.73-community 
*********************************************************************
*/
/*!40101 SET NAMES utf8 */;

create table `ledger_group` (
	`id` int (11),
	`name` varchar (300),
	`parentId` int (11),
	`nature` tinyint (4),
	`level` tinyint (4),
	`createdAt` datetime ,
	`updatedAt` timestamp 
); 
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('1','Asset','0','1','1','2015-12-31 16:30:38','2015-12-31 16:31:35');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('2','Liabilities','0','2','1','2015-12-31 16:30:38','2015-12-31 16:31:35');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('3','Expense','0','3','1','2015-12-31 16:30:38','2015-12-31 16:31:35');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('4','Income','0','4','1','2015-12-31 16:30:38','2015-12-31 16:31:35');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('5','Capital Account','2','2','2',NULL,'2015-12-31 16:42:32');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('6','Loans (Liability)','2','2','2',NULL,'2015-12-31 16:42:32');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('7','Current Liabilities','2','2','2',NULL,'2015-12-31 16:42:32');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('8','Fixed Assets','1','1','2',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('9','Investments','1','1','2',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('10','Current Assets','1','1','2',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('11','Branch /Divisions','1','1','2',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('12','Misc.Expenses (ASSET)','1','1','2',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('13','Suspense A/C','2','2','2',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('14','Sales Account','4','4','2',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('15','Purchase Account','3','3','2',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('16','Direct Income','4','4','2',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('17','Direct Expenses','3','3','2',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('18','Indirect Income','4','4','2',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('19','Indirect Expenses','3','3','2',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('20','Reservers &Surplus','5','1','3',NULL,'2015-12-31 16:44:26');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('21','Bank OD A/C','6','1','3',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('22','Secured Loans','6','1','3',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('23','UnSecured Loans','6','1','3',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('24','Duties& Taxes','7','3','3',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('25','Provisions','7','2','3',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('26','Sundry Creditors','7','2','3',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('27','Stock-in-Hand','10','8','3',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('28','Deposits(Assets)','10','8','3',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('29','Loans & Advances(Asset)','10','8','3',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('30','Sundry Debtors','10','8','3',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('31','Cash-in Hand','10','8','3',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('32','Bank Account','10','8','3',NULL,'2015-12-31 16:42:33');
insert into `ledger_group` (`id`, `name`, `parentId`, `nature`, `level`, `createdAt`, `updatedAt`) values('33','Service Account','16','8','3',NULL,'2015-12-31 16:42:33');
