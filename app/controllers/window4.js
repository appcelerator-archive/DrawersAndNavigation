var args = arguments[0] || {};

//setTimeout(function(){$.label.fireEvent('click');},5000);

$.control.init({
	windowname: "Window 4",
	buttons: {
		forward: {
			text: "Window 5",
			callback: function(e) {
				Alloy.Globals.navigation.advance(Alloy.createController("window5").getView());
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
		backto: {
			text: "Back a step",
			callback: function(e) {
				Alloy.Globals.navigation.retreat(-1);
			}
		}
	}
});
