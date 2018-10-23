import './../../../scss/pages/home/index.scss'
import $ from 'jquery'

let timerId = false
let timerPeriod = 10000

// Основные настройки ajax запросов
$.ajaxSetup({
    method: 'post',
    dataType: 'json'
})

// Обработчик ошибок ajax запросов
$(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
    console.log('Error!\n' + 'URL: ' + ajaxSettings.url)
})

getMarkets()

$('.order-start').click(function () {
    if (getSelectedCoin()) {
        testOrder()
    }
    else {
        alert('Выберите монету!')
    }
})

function testOrder() {
    getContractAddress()
}

$('.search-markets').keyup(function () {
    let query = $(this).val().toUpperCase()
    $('.markets tbody').find('tr').hide()
    $('.markets tbody > tr:contains(' + query + ')').show()
})

$('.markets').on('click', 'table > tbody > tr', function () {
    $('.markets').attr('data-selected-coin', $(this).attr('data-coin'))

    if (!timerId) {
        setCoinName(getSelectedCoin())
        getBalance()
        getOrderBook(getSelectedCoin())
        getOpenOrders(getSelectedCoin())
        getTradeHistory(getSelectedCoin())

        timerId = setInterval(startTimer, timerPeriod)
    }
})

$('.search-trade-history').keyup(function () {
    let query = $(this).val().toLowerCase()
    $('.trade-history tbody').find('tr').hide()
    $('.trade-history tbody > tr:contains(' + query + ')').show()
})

$('.content').on('change', '.user-list-address', function () {
    if ($(this).val() == 'not') {
        $('.user-address').val('')
    }
    else {
        $('.user-address').val($(this).val())
    }
})

function newOrder() {
    if (getAddress()) {
        let request = {
            tokenBuy: 'tokenBuy',
            amountBuy: 0.01,
            tokenSell: 'tokenSell',
            amountSell: 0.01,
            address: getAddress(),
            nonce: 0,
            expires: 100000,
            v: 28,
            r: '',
            s: ''
        }

        $.ajax({
            url: 'https://api.idex.market/order',
            data: JSON.stringify(request)
        }).done(function (data, textStatus, jqXHR) {
            console.log(data)
        })
    }
}

function cancelOrder() {
    if (getAddress()) {
        let request = {
            address: getAddress()
        }

        $.ajax({
            url: 'https://api.idex.market/cancel',
            data: JSON.stringify(request)
        }).done(function (data, textStatus, jqXHR) {
            console.log(data)
        })
    }
}

function getNextNonce(contractAddress) {
    $.ajax({
        url: 'https://api.idex.market/returnNextNonce'
    }).done(function (data, textStatus, jqXHR) {
        getCurrencies(contractAddress, data.nonce)
    })
}

function getContractAddress() {
    $.ajax({
        url: 'https://api.idex.market/returnContractAddress'
    }).done(function (data, textStatus, jqXHR) {
        getNextNonce(data.address)
    })
}

function getCompleteBalances() {
    if (getAddress()) {
        let request = {
            address: getAddress()
        }

        $.ajax({
            url: 'https://api.idex.market/returnCompleteBalances',
            data: JSON.stringify(request)
        }).done(function (data, textStatus, jqXHR) {
            console.log(data)
        })
    }
}

function getDepositsWithdrawals() {
    if (getAddress()) {
        let request = {
            address: getAddress()
        }

        $.ajax({
            url: 'https://api.idex.market/returnDepositsWithdrawals',
            data: JSON.stringify(request)
        }).done(function (data, textStatus, jqXHR) {
            console.log(data)
        })
    }
}

function getOrderTrades(orderHash) {
    let request = {
        orderHash: orderHash
    }

    $.ajax({
        url: 'https://api.idex.market/returnOrderTrades',
        data: JSON.stringify(request)
    }).done(function (data, textStatus, jqXHR) {
        console.log(data)
    })
}

function getBalance() {
    if (getAddress()) {
        let request = {
            address: getAddress()
        }

        $.ajax({
            url: 'https://api.idex.market/returnBalances',
            data: JSON.stringify(request)
        }).done(function (data, textStatus, jqXHR) {
            let html = ''

            $.each(data, function (i, v) {
                html +=
                    '<div class="balance__coin">' +
                    '    <span class="coin__name">' + i + ':</span>' +
                    '    <span class="coin__value">' + v + '</span>' +
                    '</div>'
            })

            $('.balance').html(html)
        })
    }
}

function setCoinName(coin) {
    $('.coin-name').find('.coin__value').text(substrCoin(coin))
}

function getCurrencies(contractAddress, nonce) {
    $.ajax({
        url: 'https://api.idex.market/returnCurrencies'
    }).done(function (data, textStatus, jqXHR) {
        let address = data[substrCoin(getSelectedCoin())].address

        const { soliditySha3 } = require('web3-utils')
        const {
            hashPersonalMessage,
            bufferToHex,
            toBuffer,
            ecsign
        } = require('ethereumjs-util')
        const { mapValues } = require('lodash')
        const raw = soliditySha3({
            t: 'address',
            v: contractAddress
        }, {
                t: 'address',
                v: address
            }, {
                t: 'uint256',
                v: 0.01
            }, {
                t: 'address',
                v: data['ETH'].address
            }, {
                t: 'uint256',
                v: 0.01
            }, {
                t: 'uint256',
                v: 100000
            }, {
                t: 'uint256',
                v: nonce
            }, {
                t: 'address',
                v: address
            })
        const salted = hashPersonalMessage(toBuffer(raw))
        const {
            v,
            r,
            s
        } = mapValues(ecsign(salted, privateKeyBuffer), (value, key) => key === 'v' ? value : bufferToHex(value))
    })
}

function getMarkets() {
    $.ajax({
        url: 'https://api.idex.market/returnTicker'
    }).done(function (data, textStatus, jqXHR) {
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
            '<tbody>'

        $.each(data, function (i1, v1) {
            let marketCoin = substrCoin(i1)
            let marketPrice
            let marketPercent
            let marketVolume

            $.each(v1, function (i2, v2) {
                if (i2 == 'last') {
                    marketPrice = substrValueOrders(v2)
                }
                else if (i2 == 'percentChange') {
                    marketPercent = substrPercent(v2)
                }
                else if (i2 == 'baseVolume') {
                    marketVolume = substrBaseVolume(v2)
                }
            })

            markets +=
                '<tr data-coin="' + i1 + '">' +
                '    <td>' + marketCoin + '</td>' +
                '    <td>' + marketPrice + '</td>' +
                '    <td>' + marketPercent + '</td>' +
                '    <td>' + marketVolume + '</td>' +
                '</tr>'
        })

        markets += '</tbody>'
        markets += '</table>'

        $('.markets').html(markets)
        $('.markets').addClass('show')
    })
}

function startTimer() {
    setCoinName(getSelectedCoin())
    getBalance()
    getOrderBook(getSelectedCoin())
    getOpenOrders(getSelectedCoin())
    getTradeHistory(getSelectedCoin())
}

function getOrderBook(coin) {
    if (getAddress()) {
        let request = {
            market: coin,
            count: 100
        }

        $.ajax({
            url: 'https://api.idex.market/returnOrderBook',
            data: JSON.stringify(request)
        }).done(function (data, textStatus, jqXHR) {
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
                '<tbody>'

            $.each(data.asks, function (i1, v1) {
                let orderPrice
                let orderAmount
                let orderTotal
                let orderUser

                let highlighting = ''

                $.each(v1, function (i2, v2) {
                    if (i2 == 'price') {
                        orderPrice = substrValueOrders(v2)
                    }
                    else if (i2 == 'amount') {
                        orderAmount = substrValueOrders(v2)
                    }
                    else if (i2 == 'total') {
                        orderTotal = substrValueOrders(v2)
                    }
                    else if (i2 == 'params') {
                        $.each(v2, function (i3, v3) {
                            if (i3 == 'user') {
                                if (getAddress() == v3) {
                                    highlighting = ' class="highlighting-line"'
                                }
                                orderUser = v3
                            }
                        })
                    }
                })

                ordersAsks +=
                    '<tr' + highlighting + '>' +
                    '    <td>' + orderPrice + '</td>' +
                    '    <td>' + orderAmount + '</td>' +
                    '    <td>' + orderTotal + '</td>' +
                    '    <td>' + orderUser + '</td>' +
                    '</tr>'
            })

            ordersAsks += '</tbody>'
            ordersAsks += '</table>'

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
                '<tbody>'

            $.each(data.bids, function (i1, v1) {
                let orderPrice
                let orderAmount
                let orderTotal
                let orderUser

                let highlighting = ''

                $.each(v1, function (i2, v2) {
                    if (i2 == 'price') {
                        orderPrice = substrValueOrders(v2)
                    }
                    else if (i2 == 'amount') {
                        orderAmount = substrValueOrders(v2)
                    }
                    else if (i2 == 'total') {
                        orderTotal = substrValueOrders(v2)
                    }
                    else if (i2 == 'params') {
                        $.each(v2, function (i3, v3) {
                            if (i3 == 'user') {
                                if (getAddress() == v3) {
                                    highlighting = ' class="highlighting-line"'
                                }
                                orderUser = v3
                            }
                        })
                    }
                })

                ordersBids +=
                    '<tr' + highlighting + '>' +
                    '    <td>' + orderPrice + '</td>' +
                    '    <td>' + orderAmount + '</td>' +
                    '    <td>' + orderTotal + '</td>' +
                    '    <td>' + orderUser + '</td>' +
                    '</tr>'
            })

            ordersBids += '</tbody>'
            ordersBids += '</table>'

            $('.order-book .asks').html(ordersAsks)
            $('.order-book .bids').html(ordersBids)
            $('.order-book').addClass('show')
        })
    }
}

function getOpenOrders(coin) {
    if (getAddress()) {
        let request = {
            address: getAddress()
        }

        $.ajax({
            url: 'https://api.idex.market/returnOpenOrders',
            data: JSON.stringify(request)
        }).done(function (data, textStatus, jqXHR) {
            let ordersAsks =
                '<table>' +
                '<thead>' +
                '    <tr>' +
                '        <th>Тип</th>' +
                '        <th>Монета (покупка)</th>' +
                '        <th>Монета (продажа)</th>' +
                '        <th>Цена</th>' +
                '        <th>Объём</th>' +
                '        <th>ETH</th>' +
                '    </tr>' +
                '</thead>' +
                '<tbody>'

            $.each(data, function (i1, v1) {
                let orderPrice
                let orderAmount
                let orderTotal
                let coinNameBuy
                let coinNameSell
                let typeTransaction

                $.each(v1, function (i2, v2) {
                    if (i2 == 'price') {
                        orderPrice = substrValueOrders(v2)
                    }
                    else if (i2 == 'amount') {
                        orderAmount = substrValueOrders(v2)
                    }
                    else if (i2 == 'total') {
                        orderTotal = substrValueOrders(v2)
                    }
                    else if (i2 == 'params') {
                        $.each(v2, function (i3, v3) {
                            if (i3 == 'buySymbol') {
                                coinNameBuy = v3
                            }
                            else if (i3 == 'sellSymbol') {
                                coinNameSell = v3
                            }
                        })
                    }
                    else if (i2 == 'type') {
                        typeTransaction = formatTypeTrade(v2)
                    }
                })

                ordersAsks +=
                    '<tr>' +
                    '    <td>' + typeTransaction + '</td>' +
                    '    <td>' + coinNameBuy + '</td>' +
                    '    <td>' + coinNameSell + '</td>' +
                    '    <td>' + orderPrice + '</td>' +
                    '    <td>' + orderAmount + '</td>' +
                    '    <td>' + orderTotal + '</td>' +
                    '</tr>'
            })

            ordersAsks += '</tbody>'
            ordersAsks += '</table>'

            $('.open-orders .asks').html(ordersAsks)
            $('.open-orders').addClass('show')
        })
    }
}

function getTradeHistory(coin) {
    let date_start = String(Date.now() - (1000 * 60 * 60 * 24 * 7)).substr(0, 10)

    let request = {
        market: coin,
        start: date_start,
        count: 100
    }

    $.ajax({
        url: 'https://api.idex.market/returnTradeHistory',
        data: JSON.stringify(request)
    }).done(function (data, textStatus, jqXHR) {
        let trades =
            '<table>' +
            '<thead>' +
            '    <tr>' +
            '        <th>Дата</th>' +
            '        <th>Тип</th>' +
            '        <th>Цена</th>' +
            '        <th>Всего (ETH)</th>' +
            '        <th>Объём</th>' +
            '        <th>Покупатель</th>' +
            '        <th>Продавец</th>' +
            '    </tr>' +
            '</thead>' +
            '<tbody>'

        $.each(data, function (i1, v1) {
            let tradeDate
            let tradeType
            let tradePrice
            let tradeTotal
            let tradeAmount
            let tradeTaker
            let tradeMaker

            $.each(v1, function (i2, v2) {
                if (i2 == 'date') {
                    tradeDate = v2
                }
                else if (i2 == 'type') {
                    tradeType = formatTypeTrade(v2)
                }
                else if (i2 == 'price') {
                    tradePrice = substrValueOrders(v2)
                }
                else if (i2 == 'total') {
                    tradeTotal = substrValueOrders(v2)
                }
                else if (i2 == 'amount') {
                    tradeAmount = substrValueOrders(v2)
                }
                else if (i2 == 'taker') {
                    tradeTaker = v2
                }
                else if (i2 == 'maker') {
                    tradeMaker = v2
                }
            })

            let highlighting = ''

            if (getAddress() == tradeTaker || getAddress() == tradeMaker) {
                highlighting = ' class="highlighting-line"'
            }

            trades +=
                '<tr' + highlighting + '>' +
                '    <td>' + tradeDate + '</td>' +
                '    <td>' + tradeType + '</td>' +
                '    <td>' + tradePrice + '</td>' +
                '    <td>' + tradeTotal + '</td>' +
                '    <td>' + tradeAmount + '</td>' +
                '    <td>' + tradeTaker + '</td>' +
                '    <td>' + tradeMaker + '</td>' +
                '</tr>'
        })

        trades += '</tbody>'
        trades += '</table>'

        $('.trade-history').html(trades)
        $('.trade-history').addClass('show')
    })
}

function substrCoin(coin) {
    return coin.substr(4)
}

function substrPercent(percent) {
    let result = ''
    let indexHyphen = percent.indexOf('-')
    let indexDot = percent.indexOf('.')

    // Если найден дефис и не найдена точка
    if (indexHyphen !== -1 && indexDot == -1) {
        result = '<span class="color-red">' + percent.substr(0, 3) + '%</span>'
    }
    // Если не найден дефис и найдена точка
    else if (indexHyphen == -1 && indexDot !== -1) {
        result = '<span class="color-green">+' + percent.substr(0, indexDot + 3) + '%</span>'
    }
    // Если найден дефис и точка
    else if (indexHyphen !== -1 && indexDot !== -1) {
        result = '<span class="color-red">' + percent.substr(0, indexDot + 3) + '%</span>'
    }
    // Если не найден дефис и точка
    else if (indexHyphen !== -1 && indexDot !== -1) {
        result = '<span class="color-green">+' + percent.substr(0, 2) + '%</span>'
    }
    else if (percent == 0) {
        result = percent + '%'
    }

    return result
}

function substrBaseVolume(volume) {
    let result = ''
    let indexDot = volume.indexOf('.')

    // Если не найдена точка
    if (indexDot == -1) {
        result = volume
    }
    // Если найдена точка
    else if (indexDot !== -1) {
        result = volume.substr(0, indexDot + 3)
    }
    // Если значение равно 0
    else if (volume == 0) {
        result = volume
    }

    return result
}

function substrValueOrders(val) {
    let result = ''
    let indexDot = val.indexOf('.')

    // Если не найдена точка
    if (indexDot == -1) {
        result = val.substr(0, 8)
    }
    // Если найдена точка
    else if (indexDot !== -1) {
        result = val.substr(0, indexDot + 9)
    }

    return result
}

function formatTypeTrade(type) {
    let result = ''

    if (type == 'sell') {
        result = '<span class="color-red">Sell</span>'
    }
    else if (type == 'buy') {
        result = '<span class="color-green">Buy</span>'
    }

    return result
}

function getSelectedCoin() {
    let coin = $('.markets').attr('data-selected-coin')

    if (coin == '') {
        coin = false
    }

    return coin
}

function getAddress() {
    let address = $('.user-address')
    let result = false

    if (address.val() == '') {
        address.css('border', '2px solid rgb(255,0,0)')
    }
    else {
        address.css('border', '1px solid rgb(200,200,200)')
        result = address.val()
    }

    return result
}