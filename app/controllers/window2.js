var args = arguments[0] || {};

//setTimeout(function(){$.label.fireEvent('click');},5000);

$.control.init({
	windowname: "Window 2",
	buttons: {
		forward: {
			text: "Window 3",
			callback: function(e) {
				Alloy.Globals.navigation.advance(Alloy.createController("window3").getView());
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
		}
	}
});
