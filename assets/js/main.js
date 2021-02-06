/*
	Miniport by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

    const $window = $(window),
        $body = $('body'),
        $nav = $('#nav');

    // Breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: [null, '736px']
    });

    // Play initial animations on page load.
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload');
        }, 100);
    });

    $(document).ready(function () {

        $('#nav a, .scrolly').scrolly({
            speed: 1000,
            offset: function () {
                return $nav.height();
            }
        });

        $('.lazy').Lazy({
            // your configuration goes here
            scrollDirection: 'vertical',
            effect: 'fadeIn',
            visibleOnly: true,
            onError: function (element) {
                console.log('error loading ' + element.data('src'));
            }
        });

        $('.proj-box').each(function () {
            let element = $(this);
            let hidden_box = element.find('.proj-additional-content')
            element.find('.proj-expand').click(function () {
                hidden_box.toggleClass('visible');
                hidden_box.slideToggle(250);
                let lazy_elements = hidden_box.find('.lazy');
                if (lazy_elements.length > 0)
                {
                    lazy_elements.lazy();
                    lazy_elements.find('~ .spinner-container').remove();
                }
            });
        });

        $('.tags > li').click(function () {
            let filter_elem = $('#proj-filter > input');
            let filter_text = filter_elem.val();
            let tag_text = $(this).text();
            if (!filter_text.includes(tag_text)) {
                if (tag_text.indexOf(' ') >= 0)
                    tag_text = '"' + tag_text + '"';
                if (filter_text.length > 0)
                    tag_text = filter_text + ' ' + tag_text;
                filter_elem.val(tag_text);
                filter_elem.trigger('input');
            }
        });

        $('#proj-filter > input').on('input', function (e) {
            let filter_tags = $(this).val().match(/[^\s"]+|"([^"]*)"/gi);
            let boxes = $('#projects .proj-box');
            boxes.removeClass('hidden');

            if (!filter_tags || filter_tags.length === 0)
                return;

            filter_tags = filter_tags.map(function (value) {
                if (value[0] === '"' && value[value.length - 1] === '"')
                    value = value.substring(1, value.length - 1);
                return value.trim().toLowerCase();
            });

            boxes.filter(function () {
                let title = $(this).find('h3').text().toLowerCase();
                let tags = $(this).find('.tags > li').map(function () {
                    return $(this).text();
                }).get();

                for (let filter_tag of filter_tags) {
                    if (title.includes(filter_tag))
                        return false;

                    for (let tag of tags) {
                        // noinspection JSUnfilteredForInLoop
                        if (tag.toLowerCase().includes(filter_tag)) {
                            return false;
                        }
                    }
                }
                return true;
            }).addClass('hidden');
        });

    });

})(jQuery);
