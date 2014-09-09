
var r90 = Ti.UI.create2DMatrix({rotate:90});
var r45 = Ti.UI.create2DMatrix({rotate:45});

var init = function(opts) {
	opts.windowname && ($.windowname.text = opts.windowname);
	if(opts.buttons) {
		// each button is {text: "sometext", callback: fn}
		_.each(_.pick(opts.buttons, "backto", "back", "forward", "top", "altpath"), function(value, key) {
			Ti.API.log("setting button " + key);
			$[key].applyProperties({
				visible: true,
				title: value.text
			});
			$[key].addEventListener('click', value.callback);
		});
	}
};

var previousControlSize = -1;
var setControlSize = function() {

	Ti.API.log("test.navigator::widget::setControlSize begin");

	var rect = $.widget.rect;
	var wide = rect.width > rect.height;

	var controlSize = wide ? rect.height-20 : rect.width;
	if(previousControlSize === controlSize) {
		// no change, let's not recalculate
		return;
	}
	previousControlSize = controlSize;

	$.widget.opacity = 0;
	
	$.navigationParent.applyProperties({
		width: controlSize,
		height: controlSize,
		top: wide ? 20 : (rect.height + 20 - controlSize) / 2,
		left: wide ? (rect.width - controlSize) / 2 : 0
	});
	$.windowname.applyProperties({
		top: wide ? 0 : (rect.height - 20 - controlSize) / 2
	});

	$.navigationParent.applyProperties({
		borderRadius: controlSize/2
	});

	if(OS_ANDROID) {
		// iOS rotates around the center, Android rotates around the top left corner
		r90.translate($.widget.rect.x * .3, $.widget.rect.y * .1);
		r45.translate($.widget.rect.x * .0707, -$.widget.rect.y * .0707);
	}

	$.backto.transform = r45;
	$.top.transform = r90;
	$.altpath.transform = r90;
	
	$.widget.opacity = 1;
};

$.widget.addEventListener('postlayout', setControlSize);
$.navigationParent.addEventListener('postlayout', function() {
	$.hubInner.applyProperties({
		borderRadius: ($.hubInner.rect.width/2)
	});
	$.hub.applyProperties({
		borderRadius: ($.hub.rect.width/2)
	});
});

setControlSize();

exports = {
	init: init
};