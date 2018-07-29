<?php
require 'conf/main.php';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<meta name="author" content="Yuri Gubsky">
	<meta name="keywords" content="bot, бот, idex.market">
	<meta name="description" content="bot, бот">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Idex.Market - Бот</title>
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
				<div class="title">Список монет</div>
				<div class="ticker" data-selected-coin=""></div>
			</div>
			<div class="subsection margin-left">
				<div>
					<div class="title">Настройки</div>
					<button class="btn-order-book">Список всех ордеров</button>
				    <button class="btn-open-orders" data-address="0x8899af1aa48cdfdedbf394221ab5fb9b69f4ae7b">Список открытых ордеров</button>
				</div>
			</div>
		</div>
		<div class="section">
			<div class="subsection">
				<div class="title">Продажа</div>
				<div class="orders-asks"></div>
			</div>
			<div class="subsection margin-left">
				<div class="title">Покупка</div>
				<div class="orders-bids"></div>
			</div>
		</div>
	</div>
	<div class="footer"></div>
	<script src="js/jquery.js"></script>
	<script src="js/datatables.js"></script>
	<script src="js/main.js<?= $conf['cache'] ?>"></script>
</body>
</html>