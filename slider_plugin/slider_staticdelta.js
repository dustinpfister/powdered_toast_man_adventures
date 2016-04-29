/*
    slider_staticdelta.js

	
	This slider plug-in allows me to define a starting x and y position that is then slided away from by a given delta x and y rate. This is a legacy 
	plug-in that replicates the behavior of the built in simple lateral behavior of the early versions of slider.js.

*/

// slider_staticdelta plug-in
Slider.addPlugin({
		
	// Button Class properties and default values.
	buttonDefaults : {

	    // add's dx, and dy which stands for deltaX and deltaY
		props : ['sx','sy','dx','dy'],
		values : [0,0,0,0]

	},

	// add the staticDelta update method
	buttonUpdateMethods : {
				
		staticDelta : function(scene){
					
			this.x = this.sx + this.dx * scene.frame;
			this.y = this.sy + this.dy * scene.frame;
					
		}
								
	}

});