
var args = arguments[0] || {};

Ti.API.debug("com.capnajax.vectorimage::widget:: args = " + JSON.stringify(args));

function init(obj) {
	$.widget.applyProperties(_.omit(obj, ["svg", "style"]));
	draw(obj.svg, obj.style, obj.width, obj.height, obj.backgroundColor);
}


/**
 *	Normalizes a source, that can be expressed as filename, raw text, or a Ti.FileSystem.File, return the raw
 *  svg source.  If source is a String, this method will use heuristics to determine if the string is a raw source 
 *	or a filename.
 *	@param source {Ti.FileSystem.File|String} the source image.
 */
function sourceText(source) {
	var result;
	if(_.isObject(source)) {
		if(source.apiName == Ti.Filesystem.File) {
			// read the file and return it
			result = source.read().text;
			Ti.API.debug("com.capnajax.vectorimage::sourceText:: source file read as :\n" + result);
		} else {
			throw new Error("com.capnajax.vectorimage::widget::sourceText invalid object, apiName " + source.apiName);
		}
	} else if(_.isString(source)) {
		if(/[\<\{]/.test(source)) { // TODO style sheets won't start with a <
			// this is the raw source
			Ti.API.debug("com.capnajax.vectorimage::sourceText:: raw source:\n" + source);
			result = source;
		} else {
			// this is probably a filename
			var path = source;
			if(!(/^\//.test(source))) {
				source = Ti.Filesystem.resourcesDirectory + '/' + source;
			}
			Ti.API.debug("com.capnajax.vectorimage::sourceText:: file = \"" + source + "\"");
			result = Ti.Filesystem.getFile(source).read().text;
		}
		
	} else {
		throw new Error("com.capnajax.vectorimage::widget::sourceText invalid param of type " + (typeof source));
	}

	Ti.API.debug("com.capnajax.vectorimage::sourceText:: returning:\n = \"" + result + "\"");
	return result;
}

function draw(svg, style, width, height, backgroundColor, callback) {
	
	// get the text of the svg and style
	var svgString = svg && sourceText(svg);
	var styleString = style && sourceText(style);			
	
	// TODO test if the svg is already in the database
	//var svgmd5 = svgString && Ti.Utils.md5HexDigest(svgString);
	//var stylemd5 = styleString && Ti.Utils.md5HexDigest(styleString);
	// use these md5sums to check if the svg exists in the db

	Ti.API.debug("com.capnajax.vectorimage::widget::draw svgString == " + svgString);
	Ti.API.debug("com.capnajax.vectorimage::widget::draw styleString == " + styleString);

	$.widget.removeAllChildren();

	$.widget.add(drawWebView(svgString, styleString, width, height, backgroundColor, callback));
}

function drawWebView(svg, style, width, height, backgroundColor, callback) {
	
	var svgStyled = svg;

	if(style) {
		
		Ti.API.debug("styled, /(\<svg[^\>]*\>)/.test(svg) == " + /(\<svg[^\>]*\>)/.test(svg));
		
		// first check the type of stylesheet, we're support CSS and XML stylesheets
		// We'll just assume that if it starts with <, it's an XML style sheet
		var styletype = /^\</.test(style) ? "application/xml" : "text/css";

		// we're going to add the stylesheet as a style element of the svg document
		svgStyled = svg.replace(/(\<svg[^\>]*\>)/, "$1<defs><style type=\""+styletype+"\"><![CDATA["+style+"]]></style></defs>");			
	}

	// add the svg to an HTML to ensure there is no border padding
	var html = '<html><head><title></title><head><body style="margin:0;padding:0">' + svgStyled + '</body></html>';

	Ti.API.debug('com.capnajax.vectorimage::widget::drawWebView html == ' + html);

	var view = Ti.UI.createWebView({
		width: width,
		height: height,
		html: html,
		backgroundColor: backgroundColor,
		showScrollbars: false,
		touchEnabled: false,
		overScrollMode: OS_ANDROID ? Ti.UI.Android.OVER_SCROLL_NEVER : null,
		opacity: 1
	});

	callback && view.addEventListener('load', callback);

	return view;
}

function drawImage(png, callback) {
	


}

init(args);