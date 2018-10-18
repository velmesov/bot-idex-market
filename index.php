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
	<link rel="stylesheet" href="public/css/home.css<?= $conf['cache'] ?>">
</head>
<body>
	<div class="header">
		<a href="/projects/idex-market/" class="logo">
			<img src="public/images/logo-idex.svg" alt="Logo">
		</a>
	</div>
	<div class="content">
		<div class="section">
			<div class="subsection">
				<div class="title">Markets (Список монет)</div>
				<input type="text" placeholder="Поиск..." class="search-markets">
				<select class="user-list-address">
					<option value="not">- - - - - -</option>
					<option value="0x8899af1aa48cdfdedbf394221ab5fb9b69f4ae7b">Андрей</option>
					<option value="0x82ff9e428ad69f54f4c0251d13607af7da8bd91e">Даниил</option>
					<option value="0x6b83615950444469c81e863c2a09d8405998d0a2">Кит</option>
				</select>
				<input type="text" placeholder="Введите адрес..." class="user-address">
				<div class="markets" data-selected-coin=""></div>
			</div>
			<div class="subsection margin-left">
				<div class="title">Баланс</div>
				<div class="balance"></div>
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
		<div class="title">Все открытые ордера по монете</div>
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
		<div class="title">Мои все открытые ордера по всем монетам</div>
		<div class="section open-orders">
			<div class="asks"></div>
		</div>
		<div class="title">История торговли</div>
		<input type="text" placeholder="Поиск..." class="search-trade-history">
		<div class="section trade-history"></div>
	</div>
	<div class="footer"></div>
	<script src="public/js/home.js<?= $conf['cache'] ?>"></script>
</body>
</html>