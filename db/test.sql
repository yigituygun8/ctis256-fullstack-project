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
  `consumerID` int NOT NULL,
  `email` varchar(30) NOT NULL,
  `customerName` varchar(30) NOT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `city` varchar(30) NOT NULL,
  `district` varchar(30) NOT NULL
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
  `image` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Consumer`
--
ALTER TABLE `Consumer`
  ADD PRIMARY KEY (`consumerID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`marketID`,`itemID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Anamakine: mysql:3306
-- Üretim Zamanı: 23 Nis 2026, 16:55:56
-- Sunucu sürümü: 8.0.45
-- PHP Sürümü: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `test`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `Market`
--

CREATE TABLE `Market` (
  `marketID` int NOT NULL,
  `marketName` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `city` varchar(30) NOT NULL,
  `district` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `Market`
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
-- Tablo için tablo yapısı `ShoppingCart`
--

CREATE TABLE `ShoppingCart` (
  `itemID` int NOT NULL,
  `marketID` varchar(6) NOT NULL,
  `consumerID` varchar(6) NOT NULL,
  `quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Tablo döküm verisi `ShoppingCart`
--

INSERT INTO `ShoppingCart` (`itemID`, `marketID`, `consumerID`, `quantity`) VALUES
(5001, '101', '1001', 2),
(5003, '205', '1023', 1),
(5005, '317', '1107', 3),
(5007, '442', '1502', 1),
(5009, '578', '1250', 2),
(5011, '689', '1399', 1);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `Market`
--
ALTER TABLE `Market`
  ADD PRIMARY KEY (`marketID`),
  ADD UNIQUE KEY `email` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
