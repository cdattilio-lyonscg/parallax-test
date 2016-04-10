//Global Skrollr var to store Skrollr obj later.
var skrollObj;	

/*----------------------------------*/
//Builder functions
/*----------------------------------*/
function buildImages(options){	
	//Loop for lazy loading images.	
	for(var i = 1; i <= options.totalImages; i++){
		var filename =  options.fileObj.filePath + '' + i + '.' + options.fileObj.fileExt,//Path to images
			img = new Image, //New img obj for lazy loading images
			dataStr = '', //placeholder for datapoints to show images
			opacity = 0,
			k = 1, //Loop counter for nested loop.
			loopIteratorTwo = (i == options.totalImages ? 2 : 3);//Figure out second loop iterator. 
			
		img.src = filename;//Set image path
		
		//If we are on the first image, set its opacity to 1, otherwise it will be 0 by default.
		if(i === 1){
			opacity = 1;
		}
		
		//Build the first data point.  Will be 0 for all point except the first image.
		dataStr = 'data-' + options.startPoint + 'p="opacity: ' + opacity + ';"';
		
		for(var j = (i - 1); k <= loopIteratorTwo; j++){			
			opacity = 0;//Reset opacity to zero.
			
			//If we are on the current image that needs to be shown on the data point
			if(j === i){
				opacity = 1;
			}
			
			//Build 3 other data point for the frames to be shown and hidden.
			dataStr = dataStr + 'data-' + ((options.frameInterval * j) + options.startPoint) + 'p="opacity: ' + opacity + ';"';
			
			k++;//Increment loop counter.
		}
		
		//Build image tag with data points and add to var to to added to DOM later.
		options.lazyImage = options.lazyImage + '<img src="' + img.src + '" ' + dataStr + '/>';		
	}
	
	return options.lazyImage;
	
}

function buildMenu(options){

}

/*----------------------------------*/
//Constructor functions
/*----------------------------------*/
function initWater(){
	var waterObj = {
		totalImages 	: 5,
		lazyImage 		: '',
		frameInterval 	: 25,
		startPoint 		: 600,
		fileObj : {
			filePath	: 'res/img/BG/water-',
			fileExt		: 'jpg'
		}
	};
	
	var imageString = buildImages(waterObj);
	
	$('#slide-3').append(imageString).end().refresh();
}

function initMenu(){
	var menuObj = {
		breakType : "precent",
		menuBreaks : {
			breakOne : {
				title : "The Story",
				start : 130,
				end : 500				
			},
			breakTwo : {
				title : "The Science",
				start : 140,
				end : 900
			},
			breakThree : {
				title : "The End",
				start : 150,
				end : 1050
			}
		}
	};
}

jQuery(document).ready(function() {
	skrollObj = skrollr.init({
		render: function(data) {
            //Debugging - Log the current scroll position.
            console.log(data.curTop);
			/*if($('#canvas').hasClass('skrollable-between')){
				drawCanvas(data.direction)
			}*/
        }
	});	
	
	initWater();

});

//Extend jQuery to refresh skrollr when new content is added via lazy load.
jQuery.fn.refresh = function() {
	skrollObj.refresh();	
	return this;
};