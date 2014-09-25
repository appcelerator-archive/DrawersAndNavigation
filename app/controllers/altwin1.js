var args = arguments[0] || {};

$.control.init({
	windowname: "Aternate Window 1",
	buttons: {
		forward: {
			text: "Alt Win 2",
			code: "nav.advance(altwin2)",
			callback: function(e) {
				Alloy.Globals.navigation.advance(Alloy.createController("altwin2").getView());
			}
		}
	}
});
