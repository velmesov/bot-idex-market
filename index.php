<?php
require 'conf/main.php';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<title>API Idex-Market</title>
	<link rel="stylesheet" href="css/styles.css<?= $conf['cache'] ?>">
	<link rel="stylesheet" href="css/datatables.css">
</head>
<body>
	<div class="header">
		<a href="/projects/idex-market/" class="logo">
			<img src="images/logo-idex.svg" alt="Logo">
		</a>
	</div>
	<div class="content">
		<div class="section">
			<div class="subsection">
				<button data-fn="returnOrderBook" data-market="ETH_PAL">OrderBook: ETH_PAL</button>
				<button data-fn="returnOrderBookAndry" data-market="ETH_PAL" data-address="0x8899af1aa48cdfdedbf394221ab5fb9b69f4ae7b">OrderBook: ETH_PAL Andry</button>
				<div class="TickerAll">
					<div class="title">Список монет</div>
					<div class="list"></div>
				</div>
			</div>
			<div class="subsection margin-left">
				<div>
					<div class="title">Настройки</div>
				</div>
			</div>
		</div>
		<div class="section">
			<div class="subsection">
				<div class="result"></div>
			</div>
			<div class="subsection margin-left"></div>
		</div>
	</div>
	<div class="footer"></div>
	<script src="js/jquery.js"></script>
	<script src="js/datatables.js"></script>
	<script src="js/main.js<?= $conf['cache'] ?>"></script>
</body>
</html>