
function doClick(e) {

	var nav = Alloy.createWidget("com.capnajax.navigation");
	nav.init({
		drawerContent: Alloy.createController('drawer').getView()
	});

	nav.advance(Alloy.createController("window1").getView());

	Alloy.Globals.navigation = nav;
}

$.index.open();


setTimeout(function() {$.label.fireEvent("click",{});}, 200);
