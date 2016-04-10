/*var scroll = (function($){
	scroll.fun = {	
		init : function() {
			
		}
	};
}(jQuery));
*/

function setScene(objTop, windowScroll){
	
}

jQuery(document).ready(function() {
	//scroll.fun.init();
	
	/*$('body').scroll(function(e){
		//setScene();
		e.preventDefault();
		e.stopPropagation();
		var top = {},
			scrollTop = $(this).scrollTop();
			
		$('.scene').each(function(i){
		  top['scene' + i] = $(this).height();
		});
		setScene(top, scrollTop);
	});*/
	
	var skroll = skrollr.init({
		forceHeight: false,
		smoothScrolling: false,
		render: function(data) {
            //Debugging - Log the current scroll position.
            console.log(data.curTop);
			
			if(data.curTop >= 990){

			}
        },
		constants: {
			//fill the box for a "duration" of 150% of the viewport (pause for 150%)
			//adjust for shorter/longer pause
			box: '150p'
		}
	});
});