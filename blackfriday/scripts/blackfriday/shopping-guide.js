(function($, global){
  var doc;
  var app; //app reference

  doc = global.document;  // caching because the reference is used frequently

	if (typeof blackFriday === 'undefined') blackFriday = {};

	//Loading the easing library seems to break the global navigation,
	//so extending the easing object here.
	jQuery.easing.easeInOutCubic = function(x, t, b, c, d) {
	  if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	};


	blackFriday.shoppingGuide = function() {
		productNavContain = $('.product-navigation-container');
		var productNav = productNavContain.find('.product-navigation'),
		productNavLinks = productNav.find('li a'),
		productNavHeight = productNav.height();

		// Sets container at same height to reduce jump when nav gets fixed
		productNavContain.height(productNavHeight);

		productNavLinks.on('click', function(e) {
			e.preventDefault();
			
			var linkRef = $(this).attr('href');
			var productArea = $(''+linkRef);
			productAreaPosition = productArea.offset();
			var scrollToPosition = productAreaPosition.top - productNavHeight;

			$("html:not(:animated),body:not(:animated)").stop(true).animate({'scrollTop': scrollToPosition+'px'},{duration: 1000, easing: 'easeInOutCubic'});

		});
	};

	$(doc).ready(function () {
		blackFriday.shoppingGuide();
	});

}(jQuery, this));