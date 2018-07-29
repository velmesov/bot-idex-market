'use strict'

let private_key = '0xfb9ff9d3ddd0e371bd1d32704cc21d834f3a932749324e3eb0a2d9558702071a';

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

function returnTickerAll(e) {
	$.ajax({
		url: 'https://api.idex.market/returnTicker'
	})
	.done(function(data, textStatus, jqXHR) {
		let html = '';

		$.each(data, function(i1, v1) {
			html += '<b>' + i1 + '</b><br>';

			$.each(v1, function(i2, v2) {
				html += i2 + ': ' + v2 + '<br>';
			});

			html += '<hr>';
		});

		$('.result').html(html);
	});
}

function return24Volume(e) {
	$.ajax({
		url: 'https://api.idex.market/return24Volume',
	})
	.done(function(data, textStatus, jqXHR) {
		let html = '';

		$.each(data, function(i1, v1) {
			if (i1 == 'totalETH') {
				html += '<b>' + i1 + '</b>: ' + v1 + '<hr>';
				return false;
			}
		});

		$.each(data, function(i1, v1) {
			if (i1 !== 'totalETH') {
				html += '<b>' + i1 + '</b><br>';

				$.each(v1, function(i2, v2) {
					html += '&nbsp;&nbsp;&nbsp;' + i2 + ': ' + v2 + '<br>';
				});
			}
		});

		$('.result').html(html);
	});
}

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