


// slider_canvas plug-in
Slider.addPlugin(
    
	(function () {

	    // because the plug-ins Class methods are referenced to, rather than copied, you can do stuff with closures if you want to.

		// return the plug-in object
		return {
		
			// Button Class properties and default values.
			buttonDefaults : {

				props : ['render', 'globalRender'],
				values : [function () {
						//console.log('no button level render function found!')
					}, true]

			},

			// Scene Class properties and default values.
			sceneDefaults : {

				props : ['render'],
				values : [function () {
						//console.log('no scene level render function found!')
					}
				]

			},

			// Scene Class prototype methods.
			scenePrototype : {

			    // render just a single button
			    renderButton : function(index, ctx){
	
                    // if the buttons globalRender boolean is true call that one first
						if (this.buttons[index].globalRender) {
							this.render.call(this.buttons[index], ctx);
						}

						// call buttons rendering function
						this.buttons[index].render(ctx, this);
	
					
				},
			
			    // call all button class instances render functions for the given context
				renderAll : function (ctx) {

					var i = 0,
					len = this.buttons.length;
					while (i < len) {

					    this.renderButton(i,ctx);
					
					/*
						// if the buttons globalRender boolean is true call that one first
						if (this.buttons[i].globalRender) {
							this.render.call(this.buttons[i], ctx);
						}

						// call buttons rendering function
						this.buttons[i].render(ctx, this);
*/
						i++

					}

				}

			}

		};
	
	}())

);