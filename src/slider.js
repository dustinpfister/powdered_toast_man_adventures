/*

slider.js

needs: api.js
 */

// Slider Module
var Slider = (function () {

	// appendProps helper function is used in the addPlugin public method
	// ALERT! if you find that the addPlugin method is something you might use in other modules, you might be able to move this to api.js
	
	var appendProps = function (modDefaults, plugDefaults) {
	
	    var plugI = 0,
		    plugLen = plugDefaults.props.length,
		    modString = modDefaults.props.join();
			
	    // check if plug-in property is all ready in the module
	    while (plugI < plugLen) {
	        
			if( modString.match(new RegExp('(^|,)'+plugDefaults.props[plugI]+'(,|$)','gi')) ){
			    	
				plugI++;
                continue;
				
			}
			
			// if you make it this far it should be fine to append
	        modDefaults.props.push(plugDefaults.props[plugI]);
		    modDefaults.values.push(plugDefaults.values[plugI]);
	    
		    plugI++;
			
		}
	},
	
	tempX=0, // these are used to store an x and y positon to be later given to an onEnd callback.
	tempY=0,
	
	// this will contain the Button Class constructor function defined later
	Button,

	// these are the hard coded module level Button Class properties, and default values for them. This object can be appended to by plug-in's
	buttonDefaults = {

		props : 'type,updateMethod,w,h,forFrame,onAction,onEnd'.split(','),
		values : ['menu', 'forFrame', 100, 50,
			function () {
				console.log('define a forFrame method, or use a plugin')
			},
			function () {
				console.log('No onAction callback set for button!')
			},
			function () {
				console.log('No onEnd callback set for button!')
			}
		]

	},

	// this will contain the Scene class Constructor function that is defined later in this module
	Scene,

	// this array will store all Scenes used in your application
	scenes = [],

	// these are the hard coded module level Scene Class properties, and default values for them. This object can be appended to by plug-in's
	sceneDefaults = {

		props : 'id,maxFrames'.split(','),
		values : ['none', 20]

	},

	sceneIndex = {},

	Button = function (aurgs) {

		api.setUpConstructor(
			this,
			aurgs,
			buttonDefaults.props,
			buttonDefaults.values);

		this.active = false;

	};

	Button.prototype = {

		event_dummy : function (scene, x, y) {

			// dummy buttons dont do anything

		},

		event_action : function (scene, x, y) {

			// action buttons just call the onAction callback, then do nothing.
			this.onAction();

		},

		event_menu : function (scene, x, y) {

			// menu buttons only call the onAction button once if they are not active
			if (!this.active) {

				// once active the slide out animation will begin, once the animation completes it's onEnd callback will fire
				this.active = true;
				this.onAction();

			}

		}

	};

	// The Scene Class
	Scene = function (aurgs, buttonData) {
		var i,
		len;

		api.setUpConstructor(this, aurgs,

			sceneDefaults.props,
			sceneDefaults.values);

		// slide in/out animation data
		this.slideIn = true;
		this.slideOver = false;
		this.frame = 0;

		// set up buttons
		this.buttons = [];
		i = 0,
		len = buttonData.length;
		while (i < len) {

			this.buttons.push(new Button(buttonData[i]));
			i++;

		}

	};

	Scene.prototype = {

		// button update methods
		buttonUpdateMethods : {

			// forFrame is great for writing something new from scratch
			forFrame : function (scene) {

				if (this.forFrame) {

					this.forFrame(scene);

				}

			}

		},

		update : function () {

			var i = 0,
			len = this.buttons.length,
			delta,
			pos,
			b;

			// update buttons
			while (i < len) {

				b = this.buttons[i];

				// always default button x, and y to 0,0
				//b.x = 0;
				//b.y = 0;

				// update the button with it's update method
				this.buttonUpdateMethods[b.updateMethod].call(b, this);

				// check the buttons active flag
				if (this.buttons[i].active) {

					this.slideOver = false;
					this.slideIn = false;

					if (this.frame === 0) {

						this.buttons[i].onEnd(this,tempX,tempY);
						this.buttons[i].active = false;
						this.slideOver = true;

					}

				}

				i++;

			}

			// update frames
			if (!this.slideOver) {

				if (this.slideIn) {

					this.frame++;

					if (this.frame >= this.maxFrames) {

						this.frame = this.maxFrames;
						this.slideIn = false;
						this.slideOver = true;

					}

				} else {

					this.frame--;

					if (this.frame <= 0) {

						this.frame = 0;
						this.slideIn = true;
						this.slideOver = true;

					}

				}

				// else if slide is over
			} else {

				// this is needed to set up the scene for next time
				if (this.frame === 0) {

					this.slideOver = false;

				}

			}

		},

		// check a user action
		user_action : function (e, x, y) {

			var i = 0,
			len = this.buttons.length,
			curButton;

			if (e.type === 'mousedown' || e.type === 'touchstart') {
				
				
				while (i < len) {

					// get current button
					curButton = this.buttons[i];

					// if x,y position of user event overlaps a button then call it's types event method.
					if (api.boundingBox(x, y, 1, 1, curButton.x, curButton.y, curButton.w, curButton.h)) {

					    //then store the x and y position 
				        tempX = x;
				        tempY = y;
				
					
						// call the event method of the button
						curButton['event_' + curButton.type](this, x, y);
						
						//return true

					}

					i++;

				}

			}

			return false;
		}

	};

	// return the public API to the Slider global variable
	return {

		// add a scene
		addScene : function (aurgs, buttons, dispObjs) {

			var index = scenes.length;

			scenes[index] = new Scene(aurgs, buttons, dispObjs);
			sceneIndex[scenes[index].id] = index;

		},

		// quickly get a scene by id
		getSceneById : function (id) {

			return scenes[sceneIndex[id]];

		},

		addPlugin : function (plugin) {

		
            var plugProp, key;
		
            // ALERT! nice try but you are using eval, and yeah it looks like I might just have to rethink the plug-in and module design		
			for(plugProp in plugin){
				
				
				for(key in plugin[plugProp]){
					
					if(plugin[plugProp][key].constructor.name === 'Array' ){
						
						appendProps(eval(plugProp), plugin[plugProp]);
						
					}else{
						
						
					}
					
					
				}
				
				
				
			}
		
	/*
		
			// append to button class defaults
			if ('buttonDefaults' in plugin) {

				appendProps(buttonDefaults, plugin.buttonDefaults);

			}

			// append to scene class defaults
			if ('sceneDefaults' in plugin) {

				appendProps(sceneDefaults, plugin.sceneDefaults);

			}
*/
			// append any button update methods to Scene.buttonUpdateMethods
			if ('buttonUpdateMethods' in plugin) {

				for (var prop in plugin.buttonUpdateMethods) {

					Scene.prototype.buttonUpdateMethods[prop] = plugin.buttonUpdateMethods[prop];

				}

			}

			// append to scene prototype
			if ('scenePrototype' in plugin) {

				for (var prop in plugin.scenePrototype) {

					Scene.prototype[prop] = plugin.scenePrototype[prop];

				}

			}
			
			// append to scene prototype
			if ('buttonPrototype' in plugin) {
				
				for (var prop in plugin.buttonPrototype) {

					Button.prototype[prop] = plugin.buttonPrototype[prop];

				}

			}
           
		}
	};

}
	());
