var args = arguments[0] || {};


if(OS_IOS) {
	setTimeout(function() {
		Ti.API.info("LeftNavButtons: " + (Alloy.Globals.navigation?"nav":"undef nav"));
		Alloy.Globals.navigation && Ti.API.info("LeftNavButtons: " + (Alloy.Globals.navigation.widget?"widget":"undef widget"));
		Alloy.Globals.navigation.widget && Ti.API.info("LeftNavButtons: " + (Alloy.Globals.navigation.widget.window.leftNavButtons?"buttons":"undef buttons"));
		Alloy.Globals.navigation.widget.window.leftNavButtons && Ti.API.info("LeftNavButtons: " + (Alloy.Globals.navigation.widget.window.leftNavButtons.length));
	}, 500);

	setTimeout(function() {
		Ti.API.info("window2: " + ($.window2?"$window2":"undef $window2"));
		$.window2 && Ti.API.info("$nav: " + ($.window2.leftNavButton?"$button":"undef $button"));
	},1000);
}
