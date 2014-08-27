var args = arguments[0] || {};

$.control.init({
	windowname: "Window 1",
	buttons: {
		forward: {
			text: "Window 2",
			callback: function(e) {
				Alloy.Globals.navigation.advance(Alloy.createController("window2").getView());
			}
		}
	}
});

