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
				<div class="title">Markets (Список монет)</div>
				<div class="markets" data-selected-coin=""></div>
			</div>
			<div class="subsection margin-left">
				<div class="title">Настройки</div>
			</div>
		</div>
		<div class="title">Все ордера</div>
		<div class="section order-book">
			<div class="subsection">
				<div class="title">ASKS (Продажа)</div>
				<div class="asks"></div>
			</div>
			<div class="subsection margin-left">
				<div class="title">BIDS (Покупка)</div>
				<div class="bids"></div>
			</div>
		</div>
		<div class="title">Мои открытые ордера</div>
		<div class="section open-orders">
			<div class="subsection">
				<div class="title">ASKS (Продажа)</div>
				<div class="asks"></div>
			</div>
			<div class="subsection margin-left">
				<div class="title">BIDS (Покупка)</div>
				<div class="bids"></div>
			</div>
		</div>
		<div class="title">История торговли</div>
		<div class="section trade-history">
		</div>
	</div>
	<div class="footer"></div>
	<script src="js/jquery.js"></script>
	<script src="js/datatables.js"></script>
	<script src="js/main.js<?= $conf['cache'] ?>"></script>
</body>
</html>