
(function(args) {

	Ti.API.debug("test.navigator::button:: start, args == " + JSON.stringify(args));

	if(args.visible) {

		$.buttonFace.backgroundColor="red";
		
		$.buttonFace.add(Alloy.createWidget("com.capnajax.vectorimage", {
			svg: args.svg,
			style: args.style,
			borderColor: 'transparent',
			width: args.width || 50,
			height: args.height || 50,
			backgroundColor: "red"
		}).getView());
	
		Ti.API.debug("test.navigator::button:: after createWidget");

		$.textContainer.visible = true;
	
		$.textLabel.text = args.text;
	
		if(Alloy.isTablet) {
			$.codeLabel.text = args.code;
		}

	} else {

		$.buttonFace.applyProperties({
			borderWidth: '1px',
			borderColor: 'red'
		});

	}

})(arguments[0] || {});
