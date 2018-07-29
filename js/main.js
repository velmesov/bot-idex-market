'use strict'

let private_key = '0xfb9ff9d3ddd0e371bd1d32704cc21d834f3a932749324e3eb0a2d9558702071a';

returnTickerAll();

$('button').click(function () {
	window[$(this).attr('data-fn')]($(this));
});

$.ajaxSetup({
	method: 'post',
	dataType: 'json'
});

$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
	alert('Error!\n' + 'URL: ' + ajaxSettings.url);
});

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

function returnTickerAll() {	
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
		'        <th>High</th>' +
		'        <th>Low</th>' +
		'        <th>Lowest Ask</th>' +
		'        <th>Highest Bid</th>' +
		'        <th>Процент изменения</th>' +
		'        <th>Объём</th>' +
		'        <th>Quote Volume</th>' +
		'    </tr>' +
		'</thead>' +
		'<tbody>';

		$.each(data, function(i1, v1) {
			html += '<tr data-coin="' + i1 + '">'
			html += '    <td>' + substrCoin(i1) + '</td>';

			$.each(v1, function(i2, v2) {
				if (i2 == 'percentChange') {
					html += '<td>' + substrPercent(v2) + '</td>';
				}
				else if (i2 == 'baseVolume') {
					html += '<td>' + substrBaseVolume(v2) + '</td>';
				}
				else {
					html += '<td>' + v2 + '</td>';
				}
			});

			html += '</tr>';
		});

		html +=
		'</tbody>' +
		'</table>';

		$('.TickerAll > .list').html(html);
		$('.TickerAll > .list > table').DataTable({
			'order': [[0, 'asc']],
			'searching': true,
			'ordering': true,
			'scrollX': true,
			'scrollY': '300px',
			'scrollCollapse': true,
			'info': false,
			'paging': false,
			/* 'fixedColumns': {
				'leftColumns': 1
			}, */
			'language': {
				'url': 'conf/DataTables_RU.json'
			},
			'columnDefs': [
				{
					'targets': [0],
					'visible': true,
					'searchable': true
				},
				{
					'targets': [1],
					'visible': true,
					'searchable': false
				},
				{
					'targets': [2],
					'visible': false,
					'searchable': false
				},
				{
					'targets': [3],
					'visible': false,
					'searchable': false
				},
				{
					'targets': [4],
					'visible': false,
					'searchable': false
				},
				{
					'targets': [5],
					'visible': false,
					'searchable': false
				},
				{
					'targets': [6],
					'visible': true,
					'searchable': false
				},
				{
					'targets': [7],
					'visible': true,
					'searchable': false
				},
				{
					'targets': [8],
					'visible': false,
					'searchable': false
				},
			]
		});
	});
};

$('.TickerAll > .list').on('click', '.dataTables_wrapper > .dataTables_scroll > .dataTables_scrollBody > table > tbody > tr', function() {
	alert($(this).attr('data-coin'));
});

function returnOrderBook(e) {
	let request = {
		market: e.attr('data-market')
	};

	$.ajax({
		url: 'https://api.idex.market/returnOrderBook',
		data: JSON.stringify(request)
	})
	.done(function(data, textStatus, jqXHR) {
		let html = '';

		html += '<b>ASKS</b><br>';

		$.each(data.asks, function(i1, v1) {
			$.each(v1, function(i2, v2) {
				if (i2 == 'params') {
					html += '&nbsp;&nbsp;&nbsp;<b>params:</b><br>';
					$.each(v2, function(i3, v3) {
						html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + i3 + ': ' + v3 + '<br>';
					});
				}
				else {
					html += '&nbsp;&nbsp;&nbsp;' + i2 + ':' + v2 + '<br>';
				}
			});
			html += '<hr>';
		});

		html += '<b>BIDS</b><br>';

		$.each(data.bids, function(i1, v1) {
			$.each(v1, function(i2, v2) {
				if (i2 == 'params') {
					html += '&nbsp;&nbsp;&nbsp;<b>params:</b><br>';
					$.each(v2, function(i3, v3) {
						html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + i3 + ': ' + v3 + '<br>';
					});
				}
				else {
					html += '&nbsp;&nbsp;&nbsp;' + i2 + ':' + v2 + '<br>';
				}
			});
			html += '<hr>';
		});

		$('.result').html(html);
	});
}

function returnOrderBookAndry(e) {
	let request = {
		market: e.attr('data-market'),
		address: e.attr('data-address')
	};

	$.ajax({
		url: 'https://api.idex.market/returnOrderBook',
		data: JSON.stringify(request)
	})
	.done(function(data, textStatus, jqXHR) {
		let html = '';

		html += '<b>ASKS</b><br>';

		$.each(data.asks, function(i1, v1) {
			$.each(v1, function(i2, v2) {
				if (i2 == 'params') {
					html += '&nbsp;&nbsp;&nbsp;<b>params:</b><br>';
					$.each(v2, function(i3, v3) {
						html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + i3 + ': ' + v3 + '<br>';
					});
				}
				else {
					html += '&nbsp;&nbsp;&nbsp;' + i2 + ':' + v2 + '<br>';
				}
			});
			html += '<hr>';
		});

		html += '<b>BIDS</b><br>';

		$.each(data.bids, function(i1, v1) {
			$.each(v1, function(i2, v2) {
				if (i2 == 'params') {
					html += '&nbsp;&nbsp;&nbsp;<b>params:</b><br>';
					$.each(v2, function(i3, v3) {
						html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + i3 + ': ' + v3 + '<br>';
					});
				}
				else {
					html += '&nbsp;&nbsp;&nbsp;' + i2 + ':' + v2 + '<br>';
				}
			});
			html += '<hr>';
		});

		$('.result').html(html);
	});
}