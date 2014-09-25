
var drawerOpen = false;
var duration = 400;

var init = function(opts) {
	if(opts.drawerContent) {
		drawerContent = opts.drawerContent;
		if(!OS_IOS || Alloy.isTablet) {
			drawer.add(opts.drawerContent);
		}
	}
};


//
//	Set up the drawer
//
//	On iPhone the drawer has to be re-attached to windows with each navigation. 
//	On iPad the drawer is resident in the master view of the split window
//	On Android the drawer is resident in its own view
//

var drawer, drawerContent;
var detail = (OS_IOS && Alloy.isTablet) ? $.detailWindow : $.widget;

if(OS_IOS) {

	drawerContent = null;
	if(Alloy.isHandheld) {
		$.first.drawerpull.addEventListener('click', toggleDrawer);
	} else {
		$.widget.addEventListener('visible', function(e) {
			if(e.view==="detail") {
				$.first.getView('win').leftNavButton = e.button;
			}
		});
	}
} 
if(!OS_IOS || Alloy.isTablet) { // everything but the iPhone
	drawer = $.drawer;
}


if(OS_IOS) {

	//
	//	WidgetViews are used to track the current position in navigation on iOS. They are not necessary in the Android
	//	implementation.
	//
	
	var widgetViews = [];
	
	/**
	 * removes the widget of the view from the widgetViews list. This is fired onClose for iOS only, because we don't
	 * trigger all window closures, sometimes the 
	 */
	var removeWidgetView = function(e) {

		for(var i = widgetViews.length-1; i >= 0; i--) {
			if(widgetViews[i].window === e.source) {
				widgetViews.splice(i, 1);
				break;
			}
		}
		
		if(Alloy.isHandheld) {
			resetDrawer();
		}
	};
	
	/**
	 * ensure the drawer is linked to the correct window.  Function not necessary on iPad
	 */
	var resetDrawer = Alloy.isHandheld && _.debounce(function() {
		
		// set up the drawer
		var newCurrentWidget = widgetViews && (widgetViews.length > 0) && _.last(widgetViews).widget;
		if(newCurrentWidget) {
			drawer = newCurrentWidget.getView("drawer");
			
			if(drawerContent) {
				setTimeout(function() {
					// the setTimeout is to ensure that the operation doesn't occur before the closeDrawer has is complete.
					drawer.add(drawerContent);
				}, 0);
			}
		} else {
			drawer = null;
		}
		
	}, 20, true);
	

} else {
	
	/**
	 * Only used on android. Updates the action bar so the title matches the window and the top-left icon is sensitive
	 * to the scroll position -- opens the drawer if on the first page, goes back if not.
	 */
	var updateActionBar = function() {
		
		setTimeout(function() {
			var actionBar = detail.activity.actionBar;
			if(actionBar && $.navigation.views && $.navigation.views.length > 0) {
				var lastView = _.last($.navigation.views);
				actionBar.title = _.last($.navigation.views).title;
				
				if($.navigation.views.length == 1) {
					
					actionBar.icon = "/drawable-xxhdpi/com.capnajax.navigation/ic_action_overflow.png";
					actionBar.onHomeIconItemSelected = toggleDrawer;
					
				} else {
					
					actionBar.icon = "/drawable-xxhdpi/com.capnajax.navigation/ic_action_back.png";
					actionBar.onHomeIconItemSelected = function() {setTimeout(retreat, 0);};
					
				}
				
			}
		}, 10);
		
	};
	
}


/**
 *	The "drill-down" feature. This is how you navigate to the right, or deeper into the navigation tree.
 * 	view {Ti.UI.View} The view for the screen we are navigating into
 */
var advance = function(view) {

	drawer && closeDrawer(true);

	advanceImpl(view, false);
	
};


if(OS_IOS) {
	
	var advanceImpl = function(view) {

		setTimeout(function() {

			var pageWidget, win;
	
			if(widgetViews.length === 0) {
				// adding the root to the widgets. Because Alloy requires NavigationWindow to have at least one child,
				// the widget already exists, we just add our stuff to it
				pageWidget = $.first;
				win = $.first.getView();
	
			} else {
				pageWidget = Widget.createWidget('com.capnajax.navigation', 'page');
				win = pageWidget.getView();

			}
	
			widgetViews.push({window: win, widget: pageWidget, content:view});
			win.addEventListener("close", function() {closeDrawer(true);});
			win.addEventListener("close", removeWidgetView);
	
			// create window using the page widget
			pageWidget.content.add(view);
	
			win.title = view.title;
	
			Alloy.isHandheld && win.addEventListener('swipe', function(e) {
				if (e.direction === 'right' && !drawerOpen) {
					openDrawer();
				}
				if (e.direction === 'left' && drawerOpen) {
					closeDrawer();	
				}
			});
	
			// move drawer to the new window
			if(Alloy.isHandheld) {
				drawer = pageWidget.getView("drawer");
				drawerContent && drawer.add(drawerContent);
			}

			if (widgetViews.length > 1 ) {
				win.leftNavButton = undefined;
			}

			// advance animation
			if(widgetViews.length > 1) {
				detail.openWindow(win, {animated:true});
			}
			
		}, 0);

	};

} else {

	var advanceImpl = function(view, first) {
		detail.addEventListener('swipe', function(e) {
			if (e.direction === 'right' && !drawerOpen) {
				openDrawer();
			}
			if (e.direction === 'left' && drawerOpen) {
				closeDrawer();	
			}
		});
	
		if(first) {
			// place the view at the beginning of the list then immediately change to it
			$.navigation.views = [view].concat($.navigation.views);
			$.navigation.currentPage = 0;
		} else {
			// place it to the right of the screen then slide it in over top of the existing content
			$.navigation.addView(view);
			$.navigation.scrollToView(view);		
		}
		
		
		detail.title = _.last(detail.children).title;
		
		updateActionBar();
		
	};
	
}

/**
 * Goes back in the progression of screens.
 * @param {number|Ti.UI.View} how far back to go. If omitted, this will go back one screen. If negative, it'll go
 * 	back n screens. If positive, it'll go back to the nth screen. If the index is actually a view, it'l go back to
 * 	that view.
 */
var retreat = function(index) {
	
	var viewsArray = OS_IOS ? widgetViews : $.navigation.views;
	
	// determine how many screens I need to retreat
	var steps = 0;
	if(undefined === index) {
		steps = 1;
		
	} else if(typeof index === 'object') {
		
		for(i = viewsArray.length-1; i >= 0; i--) {
			if(index === (OS_IOS ? viewsArray[i].content : viewsArray[i])) {
				steps = viewsArray.length - i - 1;
				break;
			}
		}
		
	} else if(index < 0) {
		steps = -index;
		
	} else if(index > 0) {
		steps = viewsArray.length - index;
		
	}
	
	if(steps <= 0) {
		// zero or invalid input
		// do nothing;
		return;
	}
	
	if(steps >= viewsArray.length) {
		// ensure I am not going back beyond the beginning
		steps = viewsArray.length - 1;
		
	}
	
	drawer && closeDrawer(true);

	if(OS_IOS) {

		// remove the drawer from the about-to-be-closed window (iPhone-only)
		Alloy.isHandheld && _.last(widgetViews).widget.getView("drawer").removeAllChildren();

		// close all the windows that are no longer needed, the current window must be closed last.
		windowsToClose = _.last(widgetViews, steps);
		_.each(windowsToClose, function(element) {
			// the setTimeout is to ensure that the operation doesn't occur before the closeDrawer has is complete.
			setTimeout(function() {
				detail.closeWindow(element.window);
			}, 0);
		});

	} else {

		$.navigation.scrollToView(_.first(_.last($.navigation.views, steps+1)));
		setTimeout(function() {
			for(var i = 0; i < steps; i++) {
				$.navigation.removeView(_.last($.navigation.views));
			}
		}, 0);

		updateActionBar();

	}

};

/**
 * 	Returns to the root of the navigation tree, or moves to a new root navigation.
 * 	@param newHome {Ti.UI.View} if starting a new navigation tree, this is the root screen.
 */
var home = function(newHome) {

	if(newHome) {
		
		closeDrawer();
		
		if(OS_IOS) {
			
			for(var i = 1; i < widgetViews.length; i++) {
				detail.closeWindow(widgetViews[i].window);
			}

			var oldContent = widgetViews[0].content;

			widgetViews = [];

			advance(newHome);
			
			$.first.content.remove(oldContent);
						
	
		} else {

			advanceImpl(newHome, true);
			$.navigation.views = [newHome];

		}

	} else {

		if(OS_IOS) {
			
			retreat(1);
			
		} else {

			home($.navigation.views[0]);
			
		}

	}
	
};


/**
 * Open drawer.
 */
var openDrawer = function() {

	if(!OS_IOS || Alloy.isHandheld) { // everything but iPad

		// animate drawer openning -- both the drawer and the drawer pull, but the pull can lag slightly behind the drawer
	
		// the time for the animation, so that the drawer is moving at about the same speed no matter where the animation
		// starts from
		var animationDuration = duration * -drawer.rect.x / drawer.rect.width;
	
		drawer.visible = true;
		drawerOpen = true;
		
		drawerContent.fireEvent("draweropen");
		
		drawer.animate({left: 0, duration: animationDuration});

	} else { // iPad
		
		drawerOpen = true;
		
	}
};

/**
 * Close the drawer. 
 * @param now set to true if the drawer is to close immediately without waiting for animation.
 */
var closeDrawer = function(now) {
	
	if(drawer && (!OS_IOS || Alloy.isHandheld)) { // everything but iPad
	
		if(now) {
			drawer.left = -drawer.rect.width;
			drawer.visible = false;
			drawerOpen = false;	
			drawerContent.fireEvent("drawerclosed", {immediate: true});
		} else {
			drawer.animate({left: -drawer.rect.width, duration: duration}, function() {
				drawer.visible = false;
				drawerOpen = false;	
				drawerContent.fireEvent("drawerclosed", {immediate: false});
			});
		}
		
	} else { // iPad
		
		drawerOpen = false;
		
	}
};

/**
 * if the drawer is closed, open it, if open, close it
 */
function toggleDrawer() {

	drawerOpen ? closeDrawer() : openDrawer();	

};

if(OS_IOS && Alloy.isTablet) {

	var orientationEvent = function(e) {
		if(Ti.Gesture.isLandscape() && drawerOpen == false) {
			drawerContent.fireEvent("draweropen");
		}
		if(Ti.Gesture.isPortrait() && drawerOpen == false) {
			drawerContent.fireEvent("drawerclosed", {immediate: true});
		}
	};
	Ti.Gesture.addEventListener('orientationchange', orientationEvent);
	$.widget.addEventListener('close', function() {
		Ti.Gesture.removeEventListener('orientationchange', orientationEvent);
	});

}

if(OS_ANDROID) {

	var back = function(e) {
		if($.navigation.views.length > 1) {
			retreat();
			e.cancelBubble = true;
		} else {
			detail.close();
		}
	};

	detail.addEventListener('androidback', back);
	
}

_.extend($, {
	init: init,
	advance: advance,
	retreat: retreat,
	home: home
});
