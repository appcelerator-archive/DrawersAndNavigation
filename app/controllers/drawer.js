var args = arguments[0] || {};

$.getView().addEventListener('draweropen', function(e) {
	//Ti.API.trace("draweropen");
});
$.getView().addEventListener('drawerclosed', function(e) {
	//Ti.API.trace("drawerclosed " + JSON.stringify(_.pick(e, "immediate")));
});

$.mainPath.addEventListener('click', function(e) {
	Alloy.Globals.navigation.home(Alloy.createController("window1").getView());
});
$.altPath.addEventListener('click', function(e) {
	Alloy.Globals.navigation.home(Alloy.createController("altwin1").getView());
});
$.exit.addEventListener('click', function(e) {
	Alloy.Globals.navigation.close();
});
