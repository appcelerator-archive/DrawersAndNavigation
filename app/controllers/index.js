
function login(e) {

	var nav = Alloy.createWidget("com.capnajax.navigation");
	nav.init({
		drawerContent: Alloy.createController('drawer').getView()
	});

	var firstController = Alloy.createController("window1");
	nav.advance(firstController.getView());
	nav.getView().open();

	Alloy.Globals.navigation = nav;
	
	// this line is not necessary for the widget, I'm saving a reference to window1 it for use in a test case.
	Alloy.Globals.window1 = firstController.getView();
}

if (OS_ANDROID) {
	$.index.addEventListener('open', function() {
		$.index.activity.actionBar.hide();
	});
	
	$.index.addEventListener('close', function() {
		Titanium.Android.currentActivity.finish();
	});
}

$.index.open();

Alloy.Globals.loginWindow = $.index;
