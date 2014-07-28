var args = arguments[0] || {};

function doClick(e) {
	Alloy.Globals.navigation.advance(Alloy.createController("window2").getView());	
}

setTimeout(function(){$.label.fireEvent('click');},200);
