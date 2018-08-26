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
				<input type="text" placeholder="Поиск..." class="search-markets">
				<div class="markets" data-selected-coin=""></div>
			</div>
			<div class="subsection margin-left">
				<div class="title">Покупка</div>
				<div class="balance-eth">
					<span class="balance__title">Баланс ETH:</span>
					<span class="balance__value">0</span>
				</div>
				<div class="balance-coin">
					<span class="balance__title"></span>
					<span class="balance__value"></span>
				</div>
				<div class="coin-name">
					<span class="coin__title">Монета:</span>
					<span class="coin__value"></span>
				</div>
				<div class="volume-order">
					<span class="volume__title">Объём сделки:</span>
					<input type="text" placeholder="Объём..." class="volume__value">
					<button class="volume__set-max">макс</button>
				</div>
				<div class="price-threshold">
					<span class="threshold__title">Порог цены:</span>
					<input type="text" class="threshold__value" placeholder="Порог...">
				</div>
				<button class="order-start">СТАРТ</button>
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
		<input type="text" placeholder="Поиск..." class="search-trade-history">
		<div class="section trade-history"></div>
	</div>
	<div class="footer"></div>
	<script src="js/jquery.js"></script>
	<script src="js/main.js<?= $conf['cache'] ?>"></script>
</body>
</html>