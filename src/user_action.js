/*
 *    user_action.js
 *
 *    needs:
 *       * main.js       works closly with main.js and the state machine
 *       * api.js        Makes use of bounding box collishon detection function in api
 *       * ptm.js        chnages the state of the ptm object
 *       * map.js        dependancy of ptm.js
 *       * toaster.js    dependancy of ptm.js
 *
 *
 *
 *
 *
 */

var userAction = (function () {

	var state = {
		x : -1,
		y : -1,
		active : false, // true if mouse button is down, or finger is on screen.

		// call this from event handlers
		onEvent : function (e) {

			var domBox = e.target.getBoundingClientRect(),
			w = e.target.width,
			h = e.target.height,
			currentState = Main.getConfig().currentState;

			// if user active boolean is true
			if (this.active) {

				this.x = -1;
				this.y = -1;

				// if touch event
				if (e.touches) {

					// if there is one or more touch objects set x, any y to first touch object
					if (e.touches.length > 0) {
						this.x = e.touches[0].clientX - domBox.left,
						this.y = e.touches[0].clientY - domBox.top;
					}

					// if zero touch objects default -1, -1 position will remain.

					// if not touch event, assume mouse event
				} else {

					this.x = e.clientX - domBox.left,
					this.y = e.clientY - domBox.top;

				}

				// bounderies
				if (this.x !== -1 && this.y !== -1) {

					if (this.x > w) {
						this.x = w;
						this.active = false;
					}
					if (this.y > h) {
						this.y = h;
						this.active = false;
					}
					if (this.x < 0) {
						this.x = 0;
						this.active = false;
					}
					if (this.y < 0) {
						this.y = 0;
						this.active = false;
					}
				}

				// round off any fraction
				this.x = Math.round(this.x);
				this.y = Math.round(this.y);

				this['onState_' + currentState](e);

			}

		},

		// no user action should be needed durring start, and load states
		// these empty functions are just here to prevent errors.
		onState_start : function (e) {},
		onState_load : function (e) {},

		onState_title : function (e) {

			Slider.getSceneById('title').user_action(e, this.x, this.y);

		},

		onState_gameMenu : function (e) {

			Slider.getSceneById('gameMenu').user_action(e, this.x, this.y);

		},

		
		onState_levelMenu : function (e) {

			Slider.getSceneById('levelmenu').user_action(e, this.x, this.y);

		},
		
		onState_upgrades : function (e) {

			Slider.getSceneById('upgrades').user_action(e, this.x, this.y);

		},

		onState_game : function (e) {

			ptm.userAction(this.x, this.y);

			Slider.getSceneById('game').user_action(e, this.x, this.y);

		},

		onState_gameOver : function (e) {

			Slider.getSceneById('gameOver').user_action(e, this.x, this.y);

		},
		
		onState_gamePaused : function (e) {

			Slider.getSceneById('gamePaused').user_action(e, this.x, this.y);

		}

	};

	// Attach event handlers to the given canvas element
	return {

		attachToCanvas : function (canvas) {

			// ALERT! is it okay to just always attach all events like this? Maybe find a way to detect what is availabule then attach?

			// Mouse events
			canvas.addEventListener('mouseout', function (e) {
				state.active = false;
			});
			canvas.addEventListener('mousedown', function (e) {
				state.active = true;
				e.preventDefault();
				state.onEvent(e);
			});
			canvas.addEventListener('mousemove', function (e) {
				e.preventDefault();
				state.onEvent(e);
			});
			canvas.addEventListener('mouseup', function (e) {
				state.active = false;
			});

			// Touch Events
			canvas.addEventListener('touchstart', function (e) {
				state.active = true;
				e.preventDefault();
				state.onEvent(e);
			});
			canvas.addEventListener('touchmove', function (e) {
				e.preventDefault();
				state.onEvent(e);
			});
			canvas.addEventListener('touchend', function (e) {
				state.active = false;
			});

		},

		getState : function () {

			return state;
		}

	};

}
	());
