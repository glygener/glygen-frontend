function faqMain() {
	jQuery(document).ready(function ($) {
		//update these values if you change these breakpoints in the style.css file (or _layout.scss if you use SASS)
		var MqM = 768,
			// MqMid = 1408,	// "browser width when navbar changes" added by Gaurav on 06/14/2018
			MqL = 1024;

		var faqsSections = $('.cd-faq-group'),
			faqTrigger = $('.cd-faq-trigger'),
			faqsContainer = $('.cd-faq-items'),
			faqsCategoriesContainer = $('.cd-faq-categories'),
			faqsCategories = faqsCategoriesContainer.find('a'),
			closeFaqsContainer = $('.cd-close-panel');

		// added by Gaurav on Aug 1st, 2018 - bottom margin for the container.
		// It helps keep the last element of side bar highlighted
		// and also avoids too much space between the footer and the last content box.
		if ($(window).width() > MqM) {
			var marginBottom = $(window).height() - $('#search_disease').height() - 80;

			marginBottom = (marginBottom < 0) ? 0 : marginBottom;
			$('.container').css({
				'marginBottom': marginBottom,
			});
		}

		//select a faq section 
		faqsCategories.on('click', function (event) {
			event.preventDefault();
			var selectedHref = $(this).attr('href'),
				target = $(selectedHref);
			if ($(window).width() < MqM) {
				faqsContainer.scrollTop(0).addClass('slide-in').children('ul').removeClass('selected').end().children(selectedHref).addClass('selected');
				closeFaqsContainer.addClass('move-left');
				$('body').addClass('cd-overlay');
			} else {
				$('body,html').animate({ 'scrollTop': target.offset().top - 19 }, 200);
			}
		});

		//close faq lateral panel - mobile only
		$('body').bind('click touchstart', function (event) {
			if ($(event.target).is('body.cd-overlay') || $(event.target).is('.cd-close-panel')) {
				closePanel(event);
			}
		});
		faqsContainer.on('swiperight', function (event) {
			closePanel(event);
		});

		//show faq content clicking on faqTrigger
		faqTrigger.on('click', function (event) {
			event.preventDefault();
			$(this).next('.cd-faq-content').slideToggle(200).end().parent('li').toggleClass('content-visible');
		});

		// properly alligns sidebar on docuement ready.
		sidebarUpdate();

		//update category sidebar while scrolling
		$(window).on('scroll', function () {
			sidebarUpdate();
		});

		/**
		 * Updates the sidebar when resizing the browser
		 * @author Gaurav Agarwal
		 * @since 06/14/2018
		 */
		$(window).on('resize', function () {
			sidebarUpdate();
		});

		/**
		 * This code is being used at several places in this file,
		 * so I created a function for the same.
		 * @author Gaurav Agarwal
		 */
		function sidebarUpdate() {
			if ($(window).width() >= MqL) {
				(!window.requestAnimationFrame) ? updateCategory() : window.requestAnimationFrame(updateCategory);
			}
		}
		function closePanel(e) {
			e.preventDefault();
			faqsContainer.removeClass('slide-in').find('li').show();
			closeFaqsContainer.removeClass('move-left');
			$('body').removeClass('cd-overlay');
		}

		function updateCategory() {
			updateCategoryPosition();
			updateSelectedCategory();
		}

		function updateCategoryPosition() {
			var top = $('.cd-faq').offset().top,
				height = jQuery('.cd-faq').height() - jQuery('.cd-faq-categories').height(),
				margin = 20,
				navbarVal = parseInt($('.navbar').css('height')) + parseInt($('.navbar').offset().top);
			if (navbarVal <= $(window).scrollTop()) {
				var leftValue = 0, //faqsCategoriesContainer.offset().left,
					widthValue = faqsCategoriesContainer.width();
				faqsCategoriesContainer.addClass('is-fixed').css({
					'left': leftValue,
					'top': 0,
					'-moz-transform': 'translateZ(0)',
					'-webkit-transform': 'translateZ(0)',
					'-ms-transform': 'translateZ(0)',
					'-o-transform': 'translateZ(0)',
					'transform': 'translateZ(0)',
				});
			} else {
				navbarVal = navbarVal - $(window).scrollTop();
				faqsCategoriesContainer.css({	//removeClass('is-fixed')
					'left': 0,
					'top': navbarVal + 'px',	//'100px',	/*7rem*/
				});
			}
		}

		function updateSelectedCategory() {
			faqsSections.each(function () {
				var actual = $(this),
					margin = parseInt($('.cd-faq-title').eq(1).css('marginTop').replace('px', '')),
					activeCategory = $('.cd-faq-categories a[href="#' + actual.attr('id') + '"]'),
					topSection = (activeCategory.parent('li').is(':first-child')) ? 0 : Math.round(actual.offset().top);

				// Gaurav: changed -20 to -30 below because the highlighting of sidebar was overlapping.
				if ((topSection - 30 <= $(window).scrollTop()) && (Math.round(actual.offset().top) + actual.height() + margin - 30 > $(window).scrollTop())) {
					activeCategory.addClass('selected');
				} else {
					activeCategory.removeClass('selected');
				}
			});
		}
	});
}