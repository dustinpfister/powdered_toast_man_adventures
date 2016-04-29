/*
    slider_movedistance.js

	
*/

// slider_movedistance plug-in
Slider.addPlugin({
		
	// Button Class properties and default values.
	buttonDefaults : {

		props : ['sx','sy','distanceX','distanceY'],
		values : [0,0,0,0]

	},

	// add the staticDelta update method
	buttonUpdateMethods : {
				
		moveDistance : function(scene){
							
			this.x = this.sx + this.distanceX / scene.maxFrames * scene.frame;
			this.y = this.sy + this.distanceY / scene.maxFrames * scene.frame;
			
		}
								
	}

});