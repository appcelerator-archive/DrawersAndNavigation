var args = arguments[0] || {};

$.getView().addEventListener('draweropen', function(e) {
	//Ti.API.trace("draweropen");
});
$.getView().addEventListener('drawerclosed', function(e) {
	//Ti.API.trace("drawerclosed " + JSON.stringify(_.pick(e, "immediate")));
});

$.mainPath.addEventListener('click', function(e) {
	$.removeClass($.switch1on, 'off');
	$.addClass($.switch1off, 'off');
	$.addClass($.switch2on, 'off');
	$.removeClass($.switch2off, 'off');
	Alloy.Globals.navigation.home(Alloy.createController("window1").getView());
});
$.altPath.addEventListener('click', function(e) {
	$.addClass($.switch1on, 'off');
	$.removeClass($.switch1off, 'off');
	$.removeClass($.switch2on, 'off');
	$.addClass($.switch2off, 'off');
	Alloy.Globals.navigation.home(Alloy.createController("altwin1").getView());
});

$.exit.addEventListener('click', function(e) {
	var nav = Alloy.Globals.navigation;
	delete Alloy.Globals.navigation;
	nav.getView('widget').close();
});
