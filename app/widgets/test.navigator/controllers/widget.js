
var buttonProps = {
	backto: {
		svg: WPATH('arrow,upleft.svg').replace(/^\//,''),
	},
	back: {
		svg: WPATH('arrow,left.svg').replace(/^\//,''),
		style: "path {transform:scale(0.005)}",
		height: 40
	},
	forward: {
		svg: WPATH('arrow,right.svg').replace(/^\//,''),
		height: 40
	},
	top: {
		svg: WPATH('arrow,home.svg').replace(/^\//,''),
		height: 40,
		width: 45
	},
	altpath: {
		svg: WPATH('arrow,downright.svg').replace(/^\//,'')
	}
};


var init = function(opts) {
	opts.windowname && ($.windowname.text = opts.windowname);
	if(opts.buttons) {

		// each button is {text: "sometext", callback: fn}

		_.each(["backto", "back", "forward", "top", "altpath", "c13", "c22", "c31", "c32"], function(key) {

			var value = opts.buttons[key];

			if(value) {

				Ti.API.debug("setting button \"" + key + "\", value = " + JSON.stringify(value));
				Ti.API.log("vendor is " + Ti.Platform.getManufacturer());
				
				var code = value.code;
				if(Ti.Platform.getManufacturer() !== 'samsung') {
					code = code.replace('(', '(\u200b'); // add a zero-width space after open parenthesis
				}
	
				$[key].add(Widget.createController('button', _.extend(_.clone(buttonProps[key]), {
					text: value.text,
					visible: true,
					code: code 
				})).getView());
				
				$[key].applyProperties({
					title: value.text
				});
				
				$[key].addEventListener('click', value.callback);
	
				Ti.API.debug("button \"" + key + "\" set.");

			} else {
				
				$[key].add(Widget.createController('button').getView());

			}
		});
	}
	
};

var previousControlSize = -1;
var setControlSize = function() {
	
	if(Ti.Gesture.isLandscape()) {
		$.addClass($.windowname, 'hidden');
		$.removeClass($.windowname, 'nothidden');
	} else {
		$.removeClass($.windowname, 'hidden');
		$.addClass($.windowname, 'nothidden');
	}
	
	var ldf = OS_IOS ? 
			(Ti.Platform.displayCaps.density == 'high' ? 2 : 1) : 
			Ti.Platform.displayCaps.logicalDensityFactor;

	Ti.API.log("test.navigator::widget::setControlSize begin, ldf == " + Ti.Platform.displayCaps.density);

	// I want to set up a square grid with a 1px space between them
	
	var navigationRect = $.navigationParent.rect;
	var widthpx = Math.min(navigationRect.width, navigationRect.height) * ldf;
	
	// the resulting number may not be divisible by three, so to appease my OCD, I will distribute the extra pixels
	var mod3 = (widthpx-2) % 3;
	var div3 = Math.round((widthpx-2) / 3);
	var leftOffset = (mod3 == 2 ? 1 : 0) + Math.round( (navigationRect.width*ldf - widthpx) / 2 );
	var topOffset = (mod3 == 2 ? 1 : 0) + Math.round( (navigationRect.height*ldf - widthpx) / 2 );

	// middle and right columns or middle and bottom rows calculations
	var width2 = div3 + (mod3%2); // mod3%2 is equivalent to mod3==2?1:0
	var offset2 = div3 + 1;
	var offset3 = offset2 + width2 + 1;

	$.backto.applyProperties({
		top: topOffset.toString()+"px",
		left: leftOffset.toString()+"px",
		width: div3.toString()+"px",
		height: div3.toString()+"px"
	});
	
	$.back.applyProperties({
		top: (topOffset+offset2).toString()+"px",
		left: leftOffset.toString()+"px",
		width: div3.toString()+"px",
		height: width2.toString()+"px"  
	});

	$.forward.applyProperties({
		top: (topOffset+offset2).toString()+"px",
		left: (leftOffset+offset3).toString()+"px",
		width: div3.toString()+"px",
		height: width2.toString()+"px"  
	});

	$.top.applyProperties({
		top: topOffset.toString()+"px",
		left: (leftOffset+offset2).toString()+"px",
		width: width2.toString()+"px",
		height: div3.toString()+"px"  
	});

	$.altpath.applyProperties({
		top: (topOffset+offset3).toString()+"px",
		left: (leftOffset+offset3).toString()+"px",
		width: div3.toString()+"px",
		height: div3.toString()+"px"  
	});

	$.c13.applyProperties({
		top: topOffset.toString()+"px",
		left: (leftOffset+offset3).toString()+"px",
		width: div3.toString()+"px",
		height: div3.toString()+"px"
	});
	
	$.c22.applyProperties({
		top: (topOffset+offset2).toString()+"px",
		left: (leftOffset+offset2).toString()+"px",
		width: width2.toString()+"px",
		height: width2.toString()+"px"
	});
	
	$.c31.applyProperties({
		top: (topOffset+offset3).toString()+"px",
		left: leftOffset.toString()+"px",
		width: div3.toString()+"px",
		height: div3.toString()+"px"
	});
	
	$.c32.applyProperties({
		top: (topOffset+offset3).toString()+"px",
		left: (leftOffset+offset2).toString()+"px",
		width: width2.toString()+"px",
		height: div3.toString()+"px"
	});
	

	Ti.API.log("test.navigator::widget::setControlSize end");
};

$.widget.addEventListener('postlayout', setControlSize);
Ti.Gesture.addEventListener('orientationchange', setControlSize);


// prevent a memory leak due to a global event
$.widget.addEventListener('close', function() {
	Ti.Gesture.removeEventListener('orientationchange', setControlSize);
});

setControlSize();

exports = {
	init: init
};