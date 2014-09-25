var args = arguments[0] || {};

//setTimeout(function(){$.label.fireEvent('click');},5000);

$.control.init({
	windowname: "Window 5",
	buttons: {
		back: {
			text: "Back",
			code: "nav.retreat()",
			callback: function(e) {
				Alloy.Globals.navigation.retreat();
			}
		},
		top: {
			text: "Home",
			code: "nav.home()",
			callback: function(e) {
				Alloy.Globals.navigation.home();
			}
		},
		backto: {
			text: "Back to Window 2",
			code: "nav.retreat(2)",
			callback: function(e) {
				Alloy.Globals.navigation.retreat(2);
			}
		}
	}
});
