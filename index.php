<?php
require 'conf/main.php';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<title>API Idex-Market</title>
	<link rel="stylesheet" href="css/styles.css<?= $conf['cache'] ?>">
</head>
<body>
	<div class="header">
		<a href="/projects/idex-market/" class="logo">
			<img src="images/logo-idex.svg" alt="Logo">
		</a>
	</div>
	<div class="container">
		<button data-fn="returnTickerAll">Ticker: All</button>
		<button data-fn="return24Volume">Ticker: 24 hour</button>
		<button data-fn="returnOrderBook" data-market="ETH_PAL">OrderBook: ETH_PAL</button>
		<button data-fn="returnOrderBookAndry" data-market="ETH_PAL" data-address="0x8899af1aa48cdfdedbf394221ab5fb9b69f4ae7b">OrderBook: ETH_PAL Andry</button>
		<div class="result"></div>
	</div>
	<script src="js/jquery.js"></script>
	<script src="js/main.js<?= $conf['cache'] ?>"></script>
</body>
</html>