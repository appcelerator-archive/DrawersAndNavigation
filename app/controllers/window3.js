var args = arguments[0] || {};

//setTimeout(function(){$.label.fireEvent('click');},5000);

$.control.init({
	windowname: "Window 3",
	buttons: {
		forward: {
			text: "Window 4",
			callback: function(e) {
				Alloy.Globals.navigation.advance(Alloy.createController("window4").getView());
			}
		},
		back: {
			text: "Back",
			callback: function(e) {
				Alloy.Globals.navigation.retreat();
			}
		},
		top: {
			text: "Home",
			callback: function(e) {
				Alloy.Globals.navigation.home();
			}
		},
		altpath: {
			text: "Window 3a",
			callback: function(e) {
				Alloy.Globals.navigation.advance(Alloy.createController("window3a").getView());
			}
		},
		backto: {
			text: "Back to Home",
			callback: function(e) {
				Alloy.Globals.navigation.retreat(Alloy.Globals.window1);
			}
		}
	}
});
