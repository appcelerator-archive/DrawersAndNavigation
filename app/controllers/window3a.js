var args = arguments[0] || {};

//setTimeout(function(){$.label.fireEvent('click');},5000);

$.control.init({
	windowname: "Window 3a",
	buttons: {
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
			text: "Back two steps",
			callback: function(e) {
				Alloy.Globals.navigation.retreat(-2);
			}
		}
	}
});
