/*
    slider_upgradebutton.js

	needs : getButtonById
	
*/

// slider_canvas plug-in
Slider.addPlugin({
		
		buttonDefaults : {

				props : ['id','onTickUp','onTickDown'],
				values : ['none',function(){console.log('no onTick up method.');},function(){console.log('no onTick down method.');}]

		},

		// Scene Class prototype methods.
		buttonPrototype : {
			
	        event_upgrade : function(scene, x , y){
				
				console.log('okay');
				
				var tick;
				
				x = x - this.x;
				y = y - this.y;
				
				tick = y < this.h / 2 ? 'Up' : 'Down';
				
				this.onAction(scene, x, y);
				this['onTick'+tick](scene, x, y);
			}	    
			
		}
		
});