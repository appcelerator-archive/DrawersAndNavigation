var args = arguments[0] || {};

//setTimeout(function(){$.label.fireEvent('click');},5000);

$.control.init({
	windowname: "Alternate Window 2",
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
		}
	}
});
