'use strict'

let address = '0x8899af1aa48cdfdedbf394221ab5fb9b69f4ae7b';
let timerId = false;

// Основные настройки ajax запросов
$.ajaxSetup({
	method: 'post',
	dataType: 'json'
});

// Обработчик ошибок ajax запросов
$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
	alert('Error!\n' + 'URL: ' + ajaxSettings.url);
});

getMarkets();

$('.search-markets').keyup(function() {
	let query = $(this).val().toUpperCase();
	$('.markets tbody').find('tr').hide();
	$('.markets tbody > tr:contains(' + query + ')').show();
});

function getMarkets() {
	$.ajax({
		url: 'https://api.idex.market/returnTicker'
	})
	.done(function(data, textStatus, jqXHR) {
		let markets =
		'<table>' +
		'<thead>' +
		'    <tr>' +
		'        <th>Монета</th>' +
		'        <th>Цена</th>' +
		'        <th>Процент изменения</th>' +
		'        <th>Объём</th>' +
		'    </tr>' +
		'</thead>' +
		'<tbody>';

		$.each(data, function(i1, v1) {
			let marketCoin = substrCoin(i1);
			let marketPrice;
			let marketPercent;
			let marketVolume;

			$.each(v1, function(i2, v2) {
				if (i2 == 'last') {
					marketPrice = substrValueOrders(v2);
				}
				else if (i2 == 'percentChange') {
					marketPercent = substrPercent(v2);
				}
				else if (i2 == 'baseVolume') {
					marketVolume = substrBaseVolume(v2);
				}
			});

			markets +=
			'<tr data-coin="' + i1 + '">' +
			'    <td>' + marketCoin + '</td>' +
			'    <td>' + marketPrice + '</td>' +
			'    <td>' + marketPercent + '</td>' +
			'    <td>' + marketVolume + '</td>' +
			'</tr>';
		});

		markets += '</tbody>';
		markets += '</table>';

		$('.markets').html(markets);
		$('.markets').addClass('show');
	});
};

$('.markets').on('click', 'table > tbody > tr', function() {
	$('.markets').attr('data-selected-coin', $(this).attr('data-coin'));

	getOrderBook(getSelectedCoin());
	getOpenOrders(getSelectedCoin());
	getTradeHistory(getSelectedCoin());

	if (!timerId) {
		timerId = setInterval(startTimer, 10000);
	}
});

function startTimer() {
	getOrderBook(getSelectedCoin());
	getOpenOrders(getSelectedCoin());
	getTradeHistory(getSelectedCoin());
}

function getOrderBook(coin) {
	let request = {
		market: coin
	};

	$.ajax({
		url: 'https://api.idex.market/returnOrderBook',
		data: JSON.stringify(request)
	})
	.done(function(data, textStatus, jqXHR) {
		let ordersAsks =
		'<table>' +
		'<thead>' +
		'    <tr>' +
		'        <th>Цена</th>' +
		'        <th>Объём (' + substrCoin(coin) + ')</th>' +
		'        <th>ETH</th>' +
		'        <th>Пользователь</th>' +
		'    </tr>' +
		'</thead>' +
		'<tbody>';

		$.each(data.asks, function(i1, v1) {
			let orderPrice;
			let orderAmount;
			let orderTotal;
			let orderUser;

			let highlighting = '';

			$.each(v1, function(i2, v2) {
				if (i2 == 'price') {
					orderPrice = substrValueOrders(v2);
				}
				else if (i2 == 'amount') {
					orderAmount = substrValueOrders(v2);
				}
				else if (i2 == 'total') {
					orderTotal = substrValueOrders(v2);
				}
				else if (i2 == 'params') {
					$.each(v2, function(i3, v3) {
						if (i3 == 'user') {
							if (address == v3) {
								highlighting = ' class="highlighting-line"';
							}
							orderUser = v3;
						}
					});
				}
			});

			ordersAsks +=
			'<tr' + highlighting + '>' +
			'    <td>' + orderPrice + '</td>' +
			'    <td>' + orderAmount + '</td>' +
			'    <td>' + orderTotal + '</td>' +
			'    <td>' + orderUser + '</td>' +
			'</tr>';
		});

		ordersAsks += '</tbody>';
		ordersAsks += '</table>';

		let ordersBids =
		'<table>' +
		'<thead>' +
		'    <tr>' +
		'        <th>Цена</th>' +
		'        <th>Объём (' + substrCoin(coin) + ')</th>' +
		'        <th>ETH</th>' +
		'        <th>Пользователь</th>' +
		'    </tr>' +
		'</thead>' +
		'<tbody>';

		$.each(data.bids, function(i1, v1) {
			let orderPrice;
			let orderAmount;
			let orderTotal;
			let orderUser;

			let highlighting = '';

			$.each(v1, function(i2, v2) {
				if (i2 == 'price') {
					orderPrice = substrValueOrders(v2);
				}
				else if (i2 == 'amount') {
					orderAmount = substrValueOrders(v2);
				}
				else if (i2 == 'total') {
					orderTotal = substrValueOrders(v2);
				}
				else if (i2 == 'params') {
					$.each(v2, function(i3, v3) {
						if (i3 == 'user') {
							if (address == v3) {
								highlighting = ' class="highlighting-line"';
							}
							orderUser = v3;
						}
					});
				}
			});

			ordersBids +=
			'<tr' + highlighting + '>' +
			'    <td>' + orderPrice + '</td>' +
			'    <td>' + orderAmount + '</td>' +
			'    <td>' + orderTotal + '</td>' +
			'    <td>' + orderUser + '</td>' +
			'</tr>';
		});

		ordersBids += '</tbody>';
		ordersBids += '</table>';

		$('.order-book .asks').html(ordersAsks);
		$('.order-book .bids').html(ordersBids);
		$('.order-book').addClass('show');
	});
}

function getOpenOrders(coin) {
	let request = {
		market: coin,
		address: address
	};

	$.ajax({
		url: 'https://api.idex.market/returnOrderBook',
		data: JSON.stringify(request)
	})
	.done(function(data, textStatus, jqXHR) {
		let ordersAsks =
		'<table>' +
		'<thead>' +
		'    <tr>' +
		'        <th>Цена</th>' +
		'        <th>Объём (' + substrCoin(coin) + ')</th>' +
		'        <th>ETH</th>' +
		'    </tr>' +
		'</thead>' +
		'<tbody>';

		$.each(data.asks, function(i1, v1) {
			let orderPrice;
			let orderAmount;
			let orderTotal;

			$.each(v1, function(i2, v2) {
				if (i2 == 'price') {
					orderPrice = substrValueOrders(v2);
				}
				else if (i2 == 'amount') {
					orderAmount = substrValueOrders(v2);
				}
				else if (i2 == 'total') {
					orderTotal = substrValueOrders(v2);
				}
			});

			ordersAsks +=
			'<tr>' +
			'    <td>' + orderPrice + '</td>' +
			'    <td>' + orderAmount + '</td>' +
			'    <td>' + orderTotal + '</td>' +
			'</tr>';
		});

		ordersAsks += '</tbody>';
		ordersAsks += '</table>';

		let ordersBids =
		'<table>' +
		'<thead>' +
		'    <tr>' +
		'        <th>Цена</th>' +
		'        <th>Объём (' + substrCoin(coin) + ')</th>' +
		'        <th>ETH</th>' +
		'    </tr>' +
		'</thead>' +
		'<tbody>';

		$.each(data.bids, function(i1, v1) {
			let orderPrice;
			let orderAmount;
			let orderTotal;

			$.each(v1, function(i2, v2) {
				if (i2 == 'price') {
					orderPrice = substrValueOrders(v2);
				}
				else if (i2 == 'amount') {
					orderAmount = substrValueOrders(v2);
				}
				else if (i2 == 'total') {
					orderTotal = substrValueOrders(v2);
				}
			});

			ordersBids +=
			'<tr>' +
			'    <td>' + orderPrice + '</td>' +
			'    <td>' + orderAmount + '</td>' +
			'    <td>' + orderTotal + '</td>' +
			'</tr>';
		});

		ordersBids += '</tbody>';
		ordersBids += '</table>';

		$('.open-orders .asks').html(ordersAsks);
		$('.open-orders .bids').html(ordersBids);
		$('.open-orders').addClass('show');
	});
}

$('.search-trade-history').keyup(function() {
	let query = $(this).val().toLowerCase();
	$('.trade-history tbody').find('tr').hide();
	$('.trade-history tbody > tr:contains(' + query + ')').show();
});

function getTradeHistory(coin) {
	let date_start = String(Date.now() - (1000 * 60 * 60 * 24 * 7)).substr(0, 10);

	let request = {
		market: coin,
		start: date_start
	};

	$.ajax({
		url: 'https://api.idex.market/returnTradeHistory',
		data: JSON.stringify(request)
	})
	.done(function(data, textStatus, jqXHR) {
		let trades =
		'<table>' +
		'<thead>' +
		'    <tr>' +
		'        <th>Дата</th>' +
		'        <th>Тип</th>' +
		'        <th>Цена</th>' +
		'        <th>Объём</th>' +
		'        <th>Продавец</th>' +
		'        <th>Покупатель</th>' +
		'    </tr>' +
		'</thead>' +
		'<tbody>';

		$.each(data, function(i1, v1) {
			let tradeDate;
			let tradeType;
			let tradePrice;
			let tradeAmount;
			let tradeMaker;
			let tradeTaker;

			$.each(v1, function(i2, v2) {
				if (i2 == 'date') {
					tradeDate = v2;
				}
				else if (i2 == 'type') {
					tradeType = formatTypeTrade(v2);
				}
				else if (i2 == 'price') {
					tradePrice = substrValueOrders(v2);
				}
				else if (i2 == 'amount') {
					tradeAmount = substrValueOrders(v2);
				}
				else if (i2 == 'maker') {
					tradeMaker = v2;
				}
				else if (i2 == 'taker') {
					tradeTaker = v2;
				}
			});

			let highlighting = '';

			if (address == tradeMaker || address == tradeTaker) {
				highlighting = ' class="highlighting-line"';
			}

			trades +=
			'<tr' + highlighting + '>' +
			'    <td>' + tradeDate + '</td>' +
			'    <td>' + tradeType + '</td>' +
			'    <td>' + tradePrice + '</td>' +
			'    <td>' + tradeAmount + '</td>' +
			'    <td>' + tradeMaker + '</td>' +
			'    <td>' + tradeTaker + '</td>' +
			'</tr>';
		});

		trades += '</tbody>';
		trades += '</table>';

		$('.trade-history').html(trades);
		$('.trade-history').addClass('show');
	});
}

function substrCoin(coin) {
	return coin.substr(4);
}

function substrPercent(percent) {
	let result      = '';
	let indexHyphen = percent.indexOf('-');
	let indexDot    = percent.indexOf('.');

	// Если найден дефис и не найдена точка
	if (indexHyphen !== -1 && indexDot == -1) {
		result = '<span class="color-red">' + percent.substr(0, 3) + '%</span>';
	}
	// Если не найден дефис и найдена точка
	else if (indexHyphen == -1 && indexDot !== -1) {
		result = '<span class="color-green">+' + percent.substr(0, indexDot + 3) + '%</span>';
	}
	// Если найден дефис и точка
	else if (indexHyphen !== -1 && indexDot !== -1) {
		result = '<span class="color-red">' + percent.substr(0, indexDot + 3) + '%</span>';
	}
	// Если не найден дефис и точка
	else if (indexHyphen !== -1 && indexDot !== -1) {
		result = '<span class="color-green">+' + percent.substr(0, 2) + '%</span>';
	}
	else if (percent == 0) {
		result = percent + '%';
	}

	return result;
}

function substrBaseVolume(volume) {
	let result      = '';
	let indexDot    = volume.indexOf('.');

	// Если не найдена точка
	if (indexDot == -1) {
		result = volume;
	}
	// Если найдена точка
	else if (indexDot !== -1) {
		result = volume.substr(0, indexDot + 3);
	}
	// Если значение равно 0
	else if (volume == 0) {
		result = volume;
	}

	return result;
}

function substrValueOrders(val) {
	let result      = '';
	let indexDot    = val.indexOf('.');

	// Если не найдена точка
	if (indexDot == -1) {
		result = val.substr(0, 8);
	}
	// Если найдена точка
	else if (indexDot !== -1) {
		result = val.substr(0, indexDot + 9);
	}

	return result;
}

function formatTypeTrade(type) {
	let result = '';

	if (type == 'sell') {
		result = '<span class="color-red">Sell</span>';
	}
	else if (type == 'buy') {
		result = '<span class="color-green">Buy</span>';
	}

	return result;
}

function getSelectedCoin() {
	let coin = $('.markets').attr('data-selected-coin');

	if (coin == '') {
		coin = false;
	}

	return coin;
}