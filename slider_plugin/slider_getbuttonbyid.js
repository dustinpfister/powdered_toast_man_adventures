/*
    slider_getbuttonbyid.js

	This plug-in adds Scene.getButtonById to the Scene Class prototype and the necessary id property to the button class constructor.
	
*/


// slider_canvas plug-in
Slider.addPlugin({
		
		// Button Class properties and default values.
		buttonDefaults : {

			props : ['id'],
			values : ['']

		},

		// Scene Class prototype methods.
		scenePrototype : {
			
		    getButtonById : function(id){
					
				var i=0,len=this.buttons.length;
					
				while(i < len){
				
					
					if(this.buttons[i].id === id){
							
						return this.buttons[i];
							
					}
						
					i++;
				}
					
				return {};
					
			}
			
		}
		
});