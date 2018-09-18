import $ from 'jquery'

/**
 * Инициализация табов
 */
function initTabs() {
    $('body').on('click', '.tabs span', function () {
        let content_for = $(this).attr('data-for')

        // Переключения вкладок табов
        $(this).parent().children('span').removeClass('active')
        $(this).toggleClass('active')

        // Переключение содержимого табов
        $(this).parent().parent().children('.tabs__content').children('div').hide()
        $(this).parent().parent().children('.tabs__content').children('div[data-tab="' + content_for + '"]').fadeIn(300)
    })
}

export { initTabs }