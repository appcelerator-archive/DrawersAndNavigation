
var drawerOpen = false;
var drawerPeekBasis = 0;
var duration = 400;

var windowStack = OS_IOS ? null : [];

var init = function(opts) {
	opts.drawerContent && (OS_IOS ? drawerContent = opts.drawerContent : drawer.add(opts.drawerContent));
};

var drawer, drawerpull;

// on iOS we have to set the drawer and drawerpull with each navigation, on others we can set the content once
if(OS_IOS) {
	var drawerContent = null;
} else {
	drawer = $.drawer;
	drawerpull = $.drawerpull;
}

var advance = function(view) {

	Ti.API.trace("com.capnajax.navigation::widget::retreat - advance");
	
	drawer && closeDrawer(true);

	if(OS_IOS) {

		var pageWidget;

		drawer && drawerpull && removeDrawerEvents();

		if(null == windowStack) {
			// adding the root to the widgets. Because Alloy requires NavigationWindow to have at least one child,
			// the widget already exists, we just add our stuff to it
			pageWidget = $.first;
			windowStack = [];
		} else {
			pageWidget = Widget.createWidget('com.capnajax.navigation', 'page');
		}
		windowStack.push(pageWidget);

		// create window using the page widget
		pageWidget.content.add(view);

		// advance animation
		$.widget.openWindow(pageWidget.getView(), {animated:true});
		
		// move drawer to the new window
		drawer = pageWidget.getView("drawer");
		drawerpull = pageWidget.getView("drawerpull");

		// set up events
		pageWidget.getView("win").addEventListener("close", retreat);

		drawerContent && drawer.add(drawerContent);
		setupDrawerEvents();
		
	} else {

		// place it to the right of the screen then slide it in over top of the existing content
		$.navigation.add(view);
		windowStack.push(view);
		$.navigation.scrollToView(view);		
		
		$.widget.title = _.last(windowStack).title;
	}
	
};

var retreat = function() {

	Ti.API.trace("com.capnajax.navigation::widget::retreat - called");
	
	closeDrawer(true);
	
	if(windowStack.length > 1) {
		if(OS_IOS) {
			
			removeDrawerEvents();
			
			// adjust the window Stack
			windowStack.pop();

			// move drawer to the previous window
			drawer = _.last(windowStack).getView("drawer");
			drawerContent && drawer.add(drawerContent);
			
			drawerpull = _.last(windowStack).getView("drawerpull");
			
			setTimeout(setupDrawerEvents, 0);
			
		} else {
			
			// fade the old window out
			$.navigation.remove(windowStack.pop());
			$.widget.title = _.last(windowStack).title;
			
		}
	}
	
};

/**
 * Open drawer.
 */
var openDrawer = function() {

	Ti.API.trace("com.capnajax.navigation::widget::openDrawer - called");

	// animate drawer openning -- both the drawer and the drawer pull, but the pull can lag slightly behind the drawer

	// the time for the animation, so that the drawer is moving at about the same speed no matter where the animation
	// starts from
	var animationDuration = duration * -drawer.rect.x / drawer.rect.width;

	drawer.visible = true;
	drawerOpen = true;
	
	drawer.animate({left: 0, duration: animationDuration});
	drawerpull.animate({left: drawer.rect.width, duration: animationDuration});
};

/**
 * Close the drawer
 * @param now set to true if the drawer is to close immediately without waiting for animation.
 */
var closeDrawer = function(now) {
	
	Ti.API.trace("com.capnajax.navigation::widget::closeDrawer - called");

	// the drawerpull.rect.x < 20 is to ensure that a touchend that is really teh result of a click doens't mess with
	// the animation on click
	if(now || drawerpull.rect.x < 20) {
		drawerpull.left = 0;
		drawer.left = -drawer.rect.width;		
		drawerOpen = false;
	} else {
		// animate the drawer closing -- both the drawer and the drawer pull, but the drawer can lag slightly behind the
		// pull
		// the time for the animation, so that the drawer is moving at about the same speed no matter where the
		// animation starts from
		var animationDuration = duration * drawerpull.rect.x / drawer.rect.width;
		drawerpull.animate({left: 0, duration: animationDuration});
		drawer.animate({left: -drawer.rect.width, duration: animationDuration}, function() {
			drawer.visible = false;
			drawerOpen = false;	
		});
	}
};

/**
 * Opens drawer to the specific x coordinate up to the width of the drawer. Even though the drawer is event partially 
 * visible, it's considered "open"
 * @param {Object} the event object that prompted the peek.
 */
var peekInDrawer = function(e) {
	
	Ti.API.trace("com.capnajax.navigation::widget::peekInDrawer - called, e.x = ", e.x);

	var x = e.x + drawerpull.rect.x - drawerPeekBasis; // x is relative to the left side of the screen
	
	if(x < 0) {
		drawerOpen = false;
		drawer.left = -drawer.rect.width;
		drawer.visible = false;
		drawerpull.left = 0;
		return;
	}
	
	if(false == drawerOpen) {
		drawer.visible = true;
	}
	
	if(x > 0) {
		drawerOpen = true;
	}
	x = Math.min(x, drawer.rect.width);
	
	drawer.left = x-drawer.rect.width;
	drawerpull.left = x;

	// move the drawer and the drawer pull
};

/**
 * Determine the location of the finger in the drawerpull to ensure that it doesn't jump under the finger
 */
var drawerPeekStart = function(e) {
	drawerPeekBasis = e.x;
};

/**
 * Determines if the drawer should be opened completely after peeking inside. If it's opened half way, it'll be allowed
 * to open the rest of the way
 */
var drawerPeekEnd = function(e) {

	Ti.API.trace("com.capnajax.navigation::widget::drawerPeekEnd - called");

	if(drawerpull.rect.x > drawer.rect.width/2) {
		openDrawer();
	} else {
		closeDrawer();
	}
};

/**
 * if the drawer is closed, open it, if open, close it
 */
var toggleDrawer = function() {

	Ti.API.trace("com.capnajax.navigation::widget::toggleDrawer - called");

	drawerOpen ? closeDrawer() : openDrawer();
};

var setupDrawerEvents = function() {

	Ti.API.trace("com.capnajax.navigation::widget::setupDrawerEvents - called");

	if(OS_IOS) {
		drawerpull.addEventListener("touchstart", drawerPeekStart);
		drawerpull.addEventListener("touchend", drawerPeekEnd);
		drawerpull.addEventListener("touchmove", _.throttle(peekInDrawer, 50));
	}

	drawerpull.addEventListener("click", toggleDrawer);	
};

var removeDrawerEvents = function() {

	Ti.API.trace("com.capnajax.navigation::widget::removeDrawerEvents - called");

	if(OS_IOS) {
		drawerpull.removeEventListener("touchstart", drawerPeekStart);
		drawerpull.removeEventListener("touchend", drawerPeekEnd);
		drawerpull.removeEventListener("touchmove", _.throttle(peekInDrawer, 50));
	}

	drawerpull.removeEventListener("click", toggleDrawer);	

};

if(OS_ANDROID) {

	var back = function(e) {
		if(windowStack.length > 1) {
			retreat();
			e.cancelBubble = true;
		} else {
			$.widget.close();
		}
	};

	$.widget.addEventListener('androidback', back);

}
if(!OS_IOS) {

	setupDrawerEvents();	

}

_.extend($, {
	init: init,
	advance: advance,
	retreat: retreat
});

$.widget.open();

Ti.API.trace("com.capnajax.navigation::widget:: - started");
