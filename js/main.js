'use strict'

let private_key = '0xfb9ff9d3ddd0e371bd1d32704cc21d834f3a932749324e3eb0a2d9558702071a';
let address = '0x8899af1aa48cdfdedbf394221ab5fb9b69f4ae7b';

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

function getMarkets() {
	$.ajax({
		url: 'https://api.idex.market/returnTicker'
	})
	.done(function(data, textStatus, jqXHR) {
		let html =
		'<table class="display compact cell-border" style="width: 100%">' +
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

			html +=
			'<tr data-coin="' + i1 + '">' +
			'    <td>' + marketCoin + '</td>' +
			'    <td>' + marketPrice + '</td>' +
			'    <td>' + marketPercent + '</td>' +
			'    <td>' + marketVolume + '</td>' +
			'</tr>';
		});

		html += '</tbody>';
		html += '</table>';

		$('.markets').html(html);
		$('.markets > table').DataTable({
			'order': [[0, 'asc']],
			'searching': true,
			'ordering': true,
			'scrollX': true,
			'scrollY': '300px',
			'scrollCollapse': true,
			'info': false,
			'paging': false,
			'language': {
				'url': 'conf/DataTables_RU.json'
			},
			'columnDefs': [
				{
					'targets': [0],
					'searchable': true
				},
				{
					'targets': [1],
					'searchable': false
				},
				{
					'targets': [2],
					'searchable': false
				},
				{
					'targets': [3],
					'searchable': false
				}
			]
		});
	});
};

$('.markets').on('click', '.dataTables_wrapper > .dataTables_scroll > .dataTables_scrollBody > table > tbody > tr', function() {
	$('.markets').attr('data-selected-coin', $(this).attr('data-coin'));

	getOrderBook(getSelectedCoin());
	getOpenOrders(getSelectedCoin());
	getTradeHistory(getSelectedCoin());
});

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
		'<table class="display compact cell-border nowrap" style="width: 100%">' +
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
			ordersAsks += '<tr>';

			$.each(v1, function(i2, v2) {
				if (i2 == 'price') {
					ordersAsks += '<td>' + substrValueOrders(v2) + '</td>';
				}
				else if (i2 == 'amount') {
					ordersAsks += '<td>' + substrValueOrders(v2) + '</td>';
				}
				else if (i2 == 'total') {
					ordersAsks += '<td>' + substrValueOrders(v2) + '</td>';
				}
				else if (i2 == 'params') {
					$.each(v2, function(i3, v3) {
						if (i3 == 'user') {
							if (address == v3) {
								ordersAsks += '<td><span class="color-green">' + v3 + '</span></td>';
							}
							else {
								ordersAsks += '<td>' + v3 + '</td>';
							}
						}
					});
				}
			});

			ordersAsks += '</tr>';
		});

		ordersAsks += '</tbody>';
		ordersAsks += '</table>';

		$('.order-book .asks').html(ordersAsks);
		$('.order-book .asks > table').DataTable({
			'order': [[0, 'asc']],
			'searching': false,
			'ordering': false,
			'scrollX': true,
			'scrollY': '300px',
			'scrollCollapse': true,
			'info': false,
			'paging': false,
			'language': {
				'url': 'conf/DataTables_RU.json'
			}
		});

		let ordersBids =
		'<table class="display compact cell-border nowrap" style="width: 100%">' +
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
			ordersBids += '<tr>';

			$.each(v1, function(i2, v2) {
				if (i2 == 'price') {
					ordersBids += '<td>' + substrValueOrders(v2) + '</td>';
				}
				else if (i2 == 'amount') {
					ordersBids += '<td>' + substrValueOrders(v2) + '</td>';
				}
				else if (i2 == 'total') {
					ordersBids += '<td>' + substrValueOrders(v2) + '</td>';
				}
				else if (i2 == 'params') {
					$.each(v2, function(i3, v3) {
						if (i3 == 'user') {
							if (address == v3) {
								ordersBids += '<td><span class="color-green">' + v3 + '</span></td>';
							}
							else {
								ordersBids += '<td>' + v3 + '</td>';
							}
						}
					});
				}
			});

			ordersBids += '</tr>';
		});

		ordersBids += '</tbody>';
		ordersBids += '</table>';

		$('.order-book .bids').html(ordersBids);
		$('.order-book .bids > table').DataTable({
			'order': [[0, 'asc']],
			'searching': false,
			'ordering': false,
			'scrollX': true,
			'scrollY': '300px',
			'scrollCollapse': true,
			'info': false,
			'paging': false,
			'language': {
				'url': 'conf/DataTables_RU.json'
			}
		});

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
		'<table class="display compact cell-border nowrap" style="width: 100%">' +
		'<thead>' +
		'    <tr>' +
		'        <th>Цена</th>' +
		'        <th>Объём (' + substrCoin(coin) + ')</th>' +
		'        <th>ETH</th>' +
		'    </tr>' +
		'</thead>' +
		'<tbody>';

		$.each(data.asks, function(i1, v1) {
			ordersAsks += '<tr>';

			$.each(v1, function(i2, v2) {
				if (i2 == 'price') {
					ordersAsks += '<td>' + v2 + '</td>';
				}
				else if (i2 == 'amount') {
					ordersAsks += '<td>' + v2 + '</td>';
				}
				else if (i2 == 'total') {
					ordersAsks += '<td>' + v2 + '</td>';
				}
				else if (i2 == 'params') {
					/* ordersAsks += '&nbsp;&nbsp;&nbsp;<b>params:</b><br>';
					$.each(v2, function(i3, v3) {
						ordersAsks += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + i3 + ': ' + v3 + '<br>';
					}); */
				}
			});

			ordersAsks += '</tr>';
		});

		ordersAsks += '</tbody>';
		ordersAsks += '</table>';

		$('.open-orders .asks').html(ordersAsks);
		$('.open-orders .asks > table').DataTable({
			'order': [[0, 'asc']],
			'searching': false,
			'ordering': false,
			'scrollX': true,
			'scrollY': '300px',
			'scrollCollapse': true,
			'info': false,
			'paging': false,
			'language': {
				'url': 'conf/DataTables_RU.json'
			}
		});

		let ordersBids =
		'<table class="display compact cell-border nowrap" style="width: 100%">' +
		'<thead>' +
		'    <tr>' +
		'        <th>Цена</th>' +
		'        <th>Объём (' + substrCoin(coin) + ')</th>' +
		'        <th>ETH</th>' +
		'    </tr>' +
		'</thead>' +
		'<tbody>';

		$.each(data.bids, function(i1, v1) {
			ordersBids += '<tr>';

			$.each(v1, function(i2, v2) {
				if (i2 == 'price') {
					ordersBids += '<td>' + v2 + '</td>';
				}
				else if (i2 == 'amount') {
					ordersBids += '<td>' + v2 + '</td>';
				}
				else if (i2 == 'total') {
					ordersBids += '<td>' + v2 + '</td>';
				}
				else if (i2 == 'params') {
					/* ordersBids += '&nbsp;&nbsp;&nbsp;<b>params:</b><br>';
					$.each(v2, function(i3, v3) {
						ordersBids += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + i3 + ': ' + v3 + '<br>';
					}); */
				}
			});

			ordersBids += '</tr>';
		});

		ordersBids += '</tbody>';
		ordersBids += '</table>';

		$('.open-orders .bids').html(ordersBids);
		$('.open-orders .bids > table').DataTable({
			'order': [[0, 'asc']],
			'searching': false,
			'ordering': false,
			'scrollX': true,
			'scrollY': '300px',
			'scrollCollapse': true,
			'info': false,
			'paging': false,
			'language': {
				'url': 'conf/DataTables_RU.json'
			}
		});

		$('.open-orders').addClass('show');
	});
}

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
		'<table class="display compact cell-border nowrap" style="width: 100%">' +
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

			let highlightRow;

			if (address == tradeMaker || address == tradeTaker) {
				highlightRow = ' style="background-color: rgb(210,230,210);"';
			}
			else {
				highlightRow = '';
			}

			trades +=
			'<tr' + highlightRow + '>' +
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
		$('.trade-history > table').DataTable({
			'order': [[0, 'desc']],
			'searching': true,
			'ordering': true,
			'scrollX': true,
			'scrollY': '400px',
			'scrollCollapse': true,
			'info': false,
			'paging': false,
			'language': {
				'url': 'conf/DataTables_RU.json'
			}
		});

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