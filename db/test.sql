-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Apr 23, 2026 at 04:23 PM
-- Server version: 8.0.46
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `Consumer`
--

CREATE TABLE `Consumer` (
  `consumerID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(30) NOT NULL,
  `customerName` varchar(30) NOT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `city` varchar(30) NOT NULL,
  `district` varchar(30) NOT NULL,
  PRIMARY KEY (`consumerID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Market`
--

CREATE TABLE `Market` (
  `marketID` int NOT NULL AUTO_INCREMENT,
  `marketName` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `city` varchar(30) NOT NULL,
  `district` varchar(30) NOT NULL,
  PRIMARY KEY (`marketID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ShoppingCart`
--

CREATE TABLE `ShoppingCart` (
  `itemID` int NOT NULL,
  `marketID` int NOT NULL,
  `consumerID` int NOT NULL,
  `quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `marketID` int NOT NULL,
  `itemID` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `expirationDate` date NOT NULL,
  `image` text,
  `basePrice` float NOT NULL,
  `discountPrice` float NOT NULL,
  `stock` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Seed data for table `Consumer`
--

INSERT INTO `Consumer` (`consumerID`, `email`, `customerName`, `password`, `city`, `district`) VALUES
(1001, 'osman.yigitu@gmail.com', 'Osman Yiğit Uygun', 'osman123', 'Ankara', 'Bilkent'),
(1023, 'arda.planali@gmail.com', 'Arda Planalı', 'arda123', 'Istanbul', 'Kadikoy'),
(1107, 'artun.konyali@gmail.com', 'Artun Konyalı', 'artun123', 'Izmir', 'Bornova'),
(1502, 'goskin.ozdinc@gmail.com', 'Gökşin Özdinç', 'goskin123', 'Bursa', 'Nilufer');

-- --------------------------------------------------------

--
-- Seed data for table `Market`
--

INSERT INTO `Market` (`marketID`, `marketName`, `email`, `password`, `city`, `district`) VALUES
(101, 'Tok Market', 'tokmarket@gmail.com', 'a8F#k29LmQ!', 'Ankara', 'Bilkent'),
(205, 'FreshLife Market', 'freshlife@gmail.com', 'Zx91@pL0qRs', 'Istanbul', 'Kadikoy'),
(317, 'Green Basket', 'greenbasket@gmail.com', '7Klm$Pq2Xy!', 'Izmir', 'Bornova'),
(442, 'EcoMart', 'ecomart@gmail.com', 'Qw3!Rt8#YuP', 'Ankara', 'Etimesgut'),
(578, 'NatureShop', 'natureshop@gmail.com', 'Wq2@Lm8#AsD', 'Bursa', 'Nilufer'),
(689, 'DailyFresh', 'dailyfresh@gmail.com', '9Xc!Pq4#RtY', 'Antalya', 'Muratpasa');

-- --------------------------------------------------------

--
-- Seed data for table `ShoppingCart`
--

INSERT INTO `ShoppingCart` (`itemID`, `marketID`, `consumerID`, `quantity`) VALUES
(5001, '101', '1001', 2),
(5003, '205', '1023', 1),
(5005, '317', '1107', 3),
(5007, '442', '1502', 1);

-- --------------------------------------------------------

--
-- Seed data for table `product`
--

INSERT INTO `product` (`marketID`, `itemID`, `name`, `expirationDate`, `image`, `basePrice`, `discountPrice`, `stock`) VALUES
(101, 5001, 'Milk', '2026-05-12', 'milk.jpg', 45.00, 34.90, 18),
(205, 5003, 'Banana Bundle', '2026-05-08', 'banana.jpg', 30.00, 22.50, 24),
(317, 5005, 'Apple Pack', '2026-05-15', 'apple.jpg', 25.00, 19.90, 30),
(442, 5007, 'Cheddar Cheese', '2026-05-06', 'cheddar.jpg', 120.00, 89.90, 12),
(578, 5009, 'Yogurt', '2026-05-18', 'yogurt.jpg', 40.00, 29.90, 20),
(689, 5011, 'Orange Juice', '2026-05-20', 'orangejuice.jpg', 60.00, 44.90, 16),
(101, 5013, 'Butter', '2026-04-15', 'butter.jpg', 55.00, 39.90, 8),
(442, 5015, 'Magnum Ice Cream', '2026-04-30', 'magnum.jpg', 35.00, 27.50, 5),
(205, 5017, 'Cake Slice', '2026-05-22', 'cake.jpg', 28.00, 21.90, 14),
(317, 5018, 'Egg Carton', '2026-05-25', 'egg.jpg', 32.00, 24.90, 22),
(578, 5019, 'Nutmeg Spice', '2026-06-01', 'nutmegspice.jpg', 18.00, 13.50, 40),
(689, 5020, 'Toblerone Bar', '2026-05-29', 'toblerone.jpg', 75.00, 59.90, 11);

-- --------------------------------------------------------
--
-- Indexes for table `ShoppingCart`
--
ALTER TABLE `ShoppingCart`
  ADD PRIMARY KEY (`consumerID`, `marketID`, `itemID`),
  ADD KEY `itemID` (`itemID`),
  ADD KEY `marketID` (`marketID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`marketID`,`itemID`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
