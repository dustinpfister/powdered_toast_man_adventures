/*
    slider_linearbackground.js

	This slider.js plug-in allows for a simple moving linear (x only) background that repeats.
	
*/

// slider_movedistance plug-in
Slider.addPlugin({
		
	// Button Class properties and default values.
	buttonDefaults : {

		// props : 'groupID,groupPart,viewX,viewY,viewWidth,viewHeight'.split(','),
		// values : ['ungroubedBackground',0,0,0,320,240]
		props : ['groupID','groupPart','reset','sx','sy','dx'],
		values : ['none','none',true,10,10,1]
		

	},

	// add the staticDelta update method
	buttonUpdateMethods : {
				
	    linearBackground : (function(){
			
	    	groups = {
			
		    	image : function(scene){
				
				    var source = scene.findPart(this.groupID, 'source'); 
				
				    // ALERT! move this property to the scene class where it belongs
				    if(this.reset){
						
						console.log('just once');
					
                        source.x = 0;//this.x;
					    source.y = source.sy;//this.y;
					    			
						this.reset = false;
						
					}
				
				    this.type='dummy';
				
				    // x and y will only need to be used if we are talking about a tile sheet
				    this.x = 0;
					this.y = 0;
					
					// width and height should be soft coded
					
		    	},
				
				source : function(scene){
			
        			var image = scene.findPart(this.groupID, 'image');
					
					this.type='dummy';
					
					// apply delta x to source button
					this.x += this.dx;
					
					if(this.x >= image.w){
						
						this.x = this.x - image.w;
					    	
					}
					
				},
				
				sourcePartA : function(scene){
			
			        var source = scene.findPart(this.groupID, 'source'),
					image = scene.findPart(this.groupID, 'image');
			
			        this.type='dummy';
			
                    if (source.x >= image.w - source.w) {
					
					    this.x = source.x;
						this.y = source.y;
						this.w = image.w - source.x;
						this.h = source.h;
					
					// else sourcePartA is the same as the source button
					}else{
										
						this.x = source.x;
						this.y = source.y;
						this.w = source.w;
						this.h = source.h;
					
					}
			
				},
				
				sourcePartB : function(scene){
					
					var source = scene.findPart(this.groupID, 'source'),
					image = scene.findPart(this.groupID, 'image');
			
                    this.type='dummy';			
					
					if (source.x >= image.w - source.w) {
					
					    this.x = image.x;
						this.y = image.y;
						this.w = source.w - (image.w - source.x)
						this.h = source.h;
					
					// else sourcePartB is not needed
					}else{
										
						this.x = 0;
						this.y = 0;
						this.w = 0;
						this.h = 0;
					
					}
				},
				
				destination : function(scene){
					
					this.x = this.sx;
					this.y = this.sy;
					
				}
			
		    };
			
			return function(scene){
			
			    groups[this.groupPart].call(this,scene);
			
			};
			
		}())
									
	},
	
	scenePrototype : {
		
		// find a button in an scene that has a given groupID, and groupPart
	    findPart : function(groupID, groupPart){
				
			var b = 0, bLen = this.buttons.length;
				
			while(b < bLen){
					
				if(this.buttons[b].groupID === groupID && this.buttons[b].groupPart === groupPart){
						
					return this.buttons[b];
						
				}
					
				b++;
				
			}
				
			// return undefined
				
		}
		
	}

});