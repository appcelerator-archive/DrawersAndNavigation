
function doClick(e) {

	var nav = Alloy.createWidget("com.capnajax.navigation");
	nav.init({
		drawerContent: Alloy.createController('drawer').getView()
	});

	var firstController = Alloy.createController("window1");
	nav.advance(firstController.getView());

	Alloy.Globals.navigation = nav;

	// this line is not necessary for the widget, only saving it for use in a test case.
	Alloy.Globals.window1 = firstController.getView();
}

$.loginWindow.addEventListener('open', function() {
	if (OS_ANDROID) {
		$.loginWindow.activity.actionBar.hide();
	}
});

$.loginWindow.open();

setTimeout(function() {
	$.label.fireEvent("click");
}, 200);



