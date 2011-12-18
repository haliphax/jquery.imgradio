/* *****************************************************************************

Script:		Image Radio (jQuery Extension)
Version:	1.0.2
Author:		Todd Boyd
Created:	2011/6/16

Description:
	This extension replaces standard HTML checkboxes and radio buttons with
	an image-based alternative. The images are inserted as background:url()
	CSS directives for <span /> elements. The standard HTML elements behind
	the scenes are still used for the form inputs, so nothing special needs
	to be done in order to capture the information when the form is
	submitted.

Options:
	rating:	Set this to 1 or true if the radio button list / checkbox list is
			to be used as a "rating" system (i.e., checking the 4th radio button
			will cause the previous 3 to be lit up, as well).

Usage:
	The extension acts upon jQuery selector objects. You may either pass through
	the rating parameter to use a "rating" system, or pass nothing in order to
	use standard radio button list / check box behavior.
	
Examples:
	$('.my_radio_buttons').imgradio(); // standard behavior
	$('.my_rating_stars').imgradio(1); // "rating" system
	
***************************************************************************** */
(function($) {
	// extend jQuery object
	$.fn.imgradio = function(ratings)
	{
		// affect all objects in the selector array
		this.each(function() {
			// get IDs
			var radioid = $(this).attr("id");
			var imgid = radioid + "_img";
			// hide the original inputs
			$(this).css("display", "none");
			// hide the label (if any)
			$("label[for=\"" + radioid + "\"]").css("display", "none");
			// inject the <span /> for our image replacement
			var html = "<span class=\"radio_img"
				+ ($(this).is(":checked") ? " checked" : "")
				+ "\" id=\"" + imgid + "\" data-imgradiogroup=\""
				+ $(this).attr("name") + "\"></span>";
			$(html).insertAfter($("#" + radioid));
			$("#" + imgid)
				// remember underlying element
				.data("imgradio_el", radioid)
				// handle clicks (check/uncheck)
				.click(function()
				{
					var el = $("#" + $(this).data("imgradio_el"));
					
					// unchecking
					if($(el).is(":checked"))
					{
						$(el).removeAttr("checked");
						var form = $(el).parents("form:first");
						if(! form) form = $(document);
						
						// ratings system
						if(typeof ratings != "undefined")
						{
							// uncheck all others in our group in the form
							form
								.find("[data-imgradiogroup=\""
									+ $(this).attr("data-imgradiogroup")
									+ "\"]")
								.removeClass("checked");
						}
						else
							$(this).removeClass("checked");
					}
					else
					// checking
					{
						// checkbox lists don"t uncheck each other, only radios
						if($(el).attr("type") != "checkbox")
						{
							var that = this;
							var form = $(el).parents("form:first");
							if(! form) form = $(document);
							// first uncheck all others in the list
							form
								.find("[name=\"" + $(el).attr("name") + "\"]")
								.removeAttr("checked");
							var radiogroup =
								form.find("[data-imgradiogroup=\""
									+ $(this).attr("data-imgradiogroup")
									+ "\"]");
							radiogroup.removeClass("checked");
							
							// ratings system
							if(typeof ratings != "undefined")
							{
								var stop = false;
								
								// check previous elements
								radiogroup.each(function()
								{
									if(this === that || stop)
									{
										stop = true;
										return;
									}
									
									$(this).addClass("checked");
								});
							}
						}
						
						// check this element
						$(el).attr("checked", "checked");
						$(this).addClass("checked");
					}
				});
		});
	}
})(jQuery);