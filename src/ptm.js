/*
 *    ptm.js
 *
 *    needs: api.js, map.js, toaster.js, user_action.js
 *
 *
 *
 *
 *
 */

var ptm = (function () {

	/*    Inside the ptm closer place any method, variable, ect that:
	 *
	 *    1) Does not need to be public to anything outside of ptm
	 *    2) Is private to ptm, and is used my more than one flightMode, or FlightState (place stuff in the proper closer)
	 *    2) Does not need to be shared to any other module, if so it should be moved to api.js
	 *
	 */

	// ALERT! everything that has to do with the box class should be moved to map.js.
	var boxArray = [],
	boxIndex = {},
	
	// ALERT! if you can used this anywhere else you know where to put it, also can you make a smarter one that involves pattern matching?
    // count up all numbers in nested objects
	count = function(obj){
		
		var key, used =0;
		
		for(key in obj){
			
			if(typeof obj[key] === 'number'){
			   
			   used += obj[key];
			
			}
			
			if(typeof obj[key] === 'object'){
				
				// recursive! yeeeee ha! recursive stuff is fun.
				used += count(obj[key]);
				
			}
			
		}
		
		return used;
		
	},
	
	// The Box Class:
	// The box class itself can be private for now, but a method that returns a certain box by id should be public so that it can be used in a renderer.
	Box = function (aurgObj) {

		api.setUpConstructor(this, aurgObj,

			'id,x,y,dx,dy,w,h,heading,facing'.split(','),
			['NO_ID!', 0, 0, 0, 0, 32, 32, 0, 0]);

		boxIndex[this.id] = boxArray.length;

		
	};

	// ALERT! so far box prototype is unused, is that a problem?
	/*
	Box.prototype = {

		step : function () {

			this.x += this.dx;
			this.y += this.dy;

		}

	};
	*/

	// this is what will be returned to the ptm global variable, thus it will be public
	// ALERT! there is a great amount of stuff that is being returned to the global that should be in the main closure instead.
	return {

		flightMode : 'basic', // The current flight mode that determines ptms behavior
		// flightMode : 'raisinBreath',
		flightState : 'ready', // ptms flight states are: 'ready, bardrag, launch, flying, freefall, win, lost';

		tempX : 0,
		tempY : 0, // temp x and y is sometimes needed
		
		
		
		
		// THESE VALUES WILL NEED TO BE STORED IN A GAME STATE
		logs : 50, // What rolls downstairs, alone or in pairs?
		upgrades : {}, // what are the logs invested in?
        waves : {}, // what wave has the player got to in each level?
		xp:0,  // ptm's experience points
		level: 1, // I guess we will have to store level so we know if we should give a log or not
		// OKAY THATS IT...I THINK.
		
		
		remainingLogs:0,
		playWave:1, // the actual wave to play currently
		
		
		flightPower : 0, // flight power determines how long ptm can stay in the air under power before free falling.
		flightPowerRange : [],
		viewCentered : true, // indacates if powdered toast man is attached to the center of the view port, or independent from it
		win : false,

		// ALERT! do i need the display object? should I just have fmConfig?
		// display is an object that contains stuff for a renderer, it's contents depend on the current flight mode and state
		fmDisplay : {},
		fmConfig : {},

		
		// what to do on each frame tick for ptm
		update : function () {

			var ptmBox = this.getBoxById('ptm');

			//this.onState[this.flightState].call(this);

			// call current flightMode's current flightState
			this.onMode[this.flightMode][this.flightState].tick.call(this);

			// call current flightMode's always function
			this.onMode[this.flightMode].always.call(this);

			// map bounderies hit?
			// !ALERT does this code always need to be called on each frame tick? If not make it a method that is called in appropriate flightStates.
			if (ptmBox.x >= -ptmBox.w) {

				ptmBox.x = -ptmBox.w;

			}
			if (ptmBox.x <= -map.width) {

				ptmBox.x = -map.width;

			}

			if (ptmBox.y >= map.horizon - ptmBox.h) {

				ptmBox.y = map.horizon - ptmBox.h;
			}
			if (ptmBox.y <= -map.height) {

				ptmBox.y = -map.height;
			}

			// center viewport?
			if (this.viewCentered) {
				viewPort.moveViewPort(ptmBox.x + 5, ptmBox.y + 5);
			}

		},
		
		// this method is called externally by user_action.js
		userAction : function (x, y) {

			this.onMode[this.flightMode][this.flightState].userAction.call(this, x, y);

		},

		// return a certain box by an id such as 'ptm', or 'house'. This will be very handy for anything that needs access to such info such as a renderer.
		getBoxById : function (id) {

			return boxArray[boxIndex[id]];

		},

		// get all box class instances
		getBoxArray : function () {

			return boxArray;

		},

		// call to step play wave to max onlocked wave
		waveUp : function(){
			
			
			// if less than highest unlocked wave step up
			if(this.playWave < this.waves[this.flightMode]){
				
				this.playWave++;
				
			}
			if(this.waves[this.flightMode] > 30){
				
				this.playWave = 30;
				
			}
			
		},
		
		// call to step play wave to max unlocked wave
		waveDown : function(){
			
			// if greater than or equal to 2 step down to a min of 1
			if(this.playWave >= 2){
				
				this.playWave--;
				
			}
			
		},
		
		// call to set play wave to max unlocked wave
		waveMax : function(){
			
			// set play wave to max
			this.playWave = this.waves[this.flightMode];
			
			console.log('wave max: '+ this.waves[this.flightMode]);
			
			if(this.waves[this.flightMode] > 30){
				
				this.playWave = 30;
				
			}
			
		},
		
		findRemainingLogs : function(){
			
			this.remainingLogs = this.logs - count(this.upgrades);
			
		},
		
		// reset upgrades
		resetUpgrades:function(){
			
			//var fm = 0, fmLen = this.onMode.length;
			
			this.upgrades = {
				
				flightpower : 0
				
			};
			
			// find current remaining logs
			this.findRemainingLogs();
			
		},
		
		// check upgrades and set ptm.remainingLogs
		stepUpgrade : function(what, amount){
			
			
			// step upgrade if you can
			if(amount < 0){
			
                if(this.upgrades[what] + amount >= 0){
				
				    this.upgrades[what] += amount;
				
			    }			
				
				
			}
			
			if(amount > 0){
			
                if(amount <= this.remainingLogs  ){
				
				    this.upgrades[what] += amount;
				
			    }			
				
				
			}
			
			// find current remaining logs
			//this.remainingLogs = this.logs - count(this.upgrades);
			this.findRemainingLogs();
		    
			
		},
		
		findLevel : function(){
			
			var levelUp = 0,
			nextLevel = this.level * 5000 + Math.pow(1.15, this.level);
			
			
			console.log('next level at: ' + nextLevel);
			
			while(nextLevel < this.xp){
			    
				
			    this.level++;
				this.logs++;
				levelUp++;
			
			    nextLevel = this.level * 5000 + Math.pow(1.2, this.level);
			}
			
			if(levelUp > 0){
				
				console.log('you leveled up!');
				console.log('you are now level: ' + this.level);
				
			}
			
			
			/*
			var level = Math.log(this.xp) / Math.log(1.2), logs;

			
			var nextLevel = this.level * 1000 + Math.pow(1.2, this.level);
			
			console.log('find level: ');
			console.log(this.xp);
            console.log(level);

            if(level > this.level){
				
				logs = Math.floor(level) - this.level;
				
				this.logs += logs;
				
				console.log('PTM leveled up!');
				console.log('you won ' + logs + ' logs.');
				
			}

            */			
			
		},
		
		// set up a new save state
		newSave : function(){
			
			// start with zero logs :(
			this.logs = 0;
			
			// reset upgrades object
			this.resetUpgrades();
			
			this.waves = {};
			
			// set up this.waves for each flight mode as well.
		    for(var mode in this.onMode){
				
				this.waves[mode] = 1;
			}
			
			
		},
		
		
		// what should be done each time a new game is started
		newGame : function () {

		    //var wave = 1;
		
			console.log('setting up new Game.');

			toastBar.started = false;
			this.win = false; // assure that the win flag has been set to false

			// the display object should be reset to an empty object each time a new game starts
			// it's content's depend on the current flightMode
			this.fmDisplay = {};
			
			// fmConfig is similar to ptm.display but stores values that config the behavior of the flight-mode
			this.fmConfig = {};
			
			// wave will determine difficultly for the current game mode, and I think it should be set here.
			// ALERT! this.fmConfig.wave is redundant, all i need is this.playWave which should always be the same thing.
			this.fmConfig.wave = this.playWave;
			
			
			// set flightPowerRange based on wave and upgrade settings
			this.flightPowerRange = [
			
			    10 + 1 * this.upgrades.flightpower,
				100 + 10 * this.upgrades.flightpower
			
			];
			
			this.onMode[this.flightMode].newGame.call(this);

		},

		// what should always happen when the player wins a game regardless of flightMode
		onWin : function () {

		    // ALERT! XP is something that should be awarded in a flightMode specific way, maybe have onWin states for each flight mode than?
			//ptm.xp += 1000 * this.playWave
			
			// call onWin function for current flightMode
			this.onMode[this.flightMode].onWin.call(this);
		    this.findLevel();
		
		
			// if ptm.playWave is the highest unlocked wave, and the highest unlocked is less then or equal to 30, unlock next wave
			if(this.playWave === this.waves[this.flightMode] && this.waves[this.flightMode] <= 30){

                this.logs++;			
			
			    this.waves[this.flightMode] += 1;
		        this.waveMax(); // set play wave to new max
			
			}
			
			// if ptm.playWave is less than highest unlocked advanced to next wave
			if(this.playWave < this.waves[this.flightMode]){
				
				this.playWave++;
				
				// ALERT! should this check only be preformed in one location? (this is also done in ptm.maxWave)
				if(this.playWave > 30){
					
					this.playWave = 30;
					
				}
				
			}
			
			this.win = true;

		},

		// change ptm's pitch
		// ALERT! change ptms pitch? more like set an events x, and y value to tempX, and tempY. This needs to be reviewed
		pitch : function (x, y) {

			if (userAction.getState().active) {

				this.tempX = x;
				this.tempY = y;

			}

		},

		// step ptms position based on his current heading
		stepPos : function () {

			var ptmBox = this.getBoxById('ptm');

			// find current delta x and y based on heading
			ptmBox.dx = Math.cos(ptmBox.radian - Math.PI) * 5;
			ptmBox.dy = Math.sin(ptmBox.radian - Math.PI) * 5;

			// apply delta x, and y
			ptmBox.x += ptmBox.dx;
			ptmBox.y += ptmBox.dy;

		},

		// change ptms heading
		changeHeading : function () {

			var ptmBox = this.getBoxById('ptm');

			if (userAction.getState().active) {

			    var pos = viewPort.getVPRelative(ptmBox.x, ptmBox.y);
				
			    if(api.distance(this.tempX,this.tempY,pos.x+ptmBox.w/2,pos.y+ptmBox.h/2) <= 150){
				
				ptmBox.heading = Math.atan2(pos.y + 32 - this.tempY, pos.x + 32 - this.tempX);

				if (ptmBox.heading > 0.78) {

					ptmBox.heading = 0.78;

				}

				if (ptmBox.heading < -0.78) {

					ptmBox.heading = -0.78;

				}

				// direction of sprite should be same as the direction of heading for this method at least
				ptmBox.radian = ptmBox.heading;

				}
				
			}

		},

		// Flight Modes:
		onMode : (function () {
			
			var levelOutFrames = 25,
				loFrame;
			
			return {

			// basic flightMode:
			basic : (function () {

			    
			
				// basic flightMode winLostCheck method is called in the flying, and freefall states
				var winLostCheck = function () {

					var house = this.getBoxById('house'),
					ptmBox = this.getBoxById('ptm');

					// if collision with target then win
					if (api.boundingBox(ptmBox.x, ptmBox.y, ptmBox.w, ptmBox.h, house.x, house.y, house.w, house.h)) {
						
						this.onWin();
						this.flightState = 'over';
						return;

					}

					// if the ground is hit then the player has lost
					if (ptmBox.y >= map.horizon - ptmBox.h) {

						this.flightState = 'over';

					}

				};

				return {

					// this will set up the ptm object to work with a new basic flight mode game
					newGame : function () {

						console.log('setting up new \"basic\" mode game.');

						dial.findHeading();

						//var theX = Math.floor(Math.random() * (-2500 * (ptm.fmConfig.wave/29)) - 500);

						
						var theX = -500 - 2500 * ( ptm.fmConfig.wave / 30 );
						
						// set up box class instances
						boxArray = [];
						boxIndex = {};

						boxArray.push(new Box({
								id : 'ptm',
								w : 64,
								h : 64,
								heading: Math.PI * 2 / 4 * 3,
								x : -130,
								y: map.horizon - 64
							}));

						// the house ptm needs to get to
						boxArray.push(new Box({
								id : 'house',
								x : theX,
								y : map.horizon - 75,
								w : 75,
								h : 75
							}));

						toastBar.started = false;
						this.viewCentered = true;
						this.flightState = 'ready';

						// set up the flying state interface
						this.fmDisplay.flying = {

							// the radius of the interface will start at 0, then expand to max during the levelout state
							radius : 0,
							radiusMax : 150

						};
						
						// set current level out frame to zero
						loFrame = 0;
					},

					onWin : function(){
						
						var xp = 1000 + 100 * this.playWave + Math.pow(1.05, this.playWave);
						
						this.xp += xp;
						
						console.log('you won basic flight mode! ');
						console.log('wave won: ' + this.playWave);
						console.log('xp won: ' + xp);
						console.log('total xp: ' + this.xp);
                                                 
					},
					
					always : function () {},

					ready : {

						// during ready state the player can use the dial, and toastbar
						userAction : function (x, y) {

							dial.onPoint(x, y);
							toastBar.onDrag(x, y);

						},

						tick : function () {

							var ptmBox = this.getBoxById('ptm');

							ptmBox.heading = Math.PI * 2 / 4 * 3;
							ptmBox.radian = ptmBox.heading;
							
							this.tempX = ptmBox.x;
							this.tempY = ptmBox.y;

							//this.flightPower = 330 * dial.setting;
							this.flightPower = (this.flightPowerRange[1] - this.flightPowerRange[0]) * dial.setting + this.flightPowerRange[0];

							if (toastBar.setting > 0) {
								this.flightState = 'bardrag';
							}

							// slide in the toast bar to the home position if it has not been done yet
							toastBar.slideIn();
							dial.slideIn();
						}
					},

					// what to do when the player is dragging the toaster leaver
					bardrag : {

						userAction : function (x, y) {

							toastBar.onDrag(x, y);

						},

						tick : function () {

							var ptmBox = this.getBoxById('ptm');

							ptmBox.heading =  - (Math.PI * toastBar.setting);
							ptmBox.radian = Math.PI / 2 * 3 - Math.PI * toastBar.setting;
							ptmBox.x = Math.cos(ptmBox.heading) * 120 + this.tempX - 120;
							ptmBox.y = Math.sin(ptmBox.heading) * 120 + this.tempY;

							if (toastBar.setting === 0) {
								this.flightState = 'ready';
							}

							if (toastBar.started) {

								// ues tempY to store target starting altitude
								this.tempY = map.height * dial.setting * -1;
								this.flightState = 'launch';

							}
						}

					},

					// what to do when ptm launches out of the toaster
					launch : {

						userAction : function (x, y) {},

						tick : function () {

							var ptmBox = this.getBoxById('ptm');

							//toastBar.started = false;

							// find current deltaY based on current height
							if (ptmBox.y > this.tempY) {

								ptmBox.dy = ((15 * (this.tempY - ptmBox.y)) / this.tempY + 1) * -1;

							} else {

								ptmBox.dy = 0;

							}

							// apply delta y but not x
							ptmBox.y += ptmBox.dy;

							// check if flight state should change to levelout
							if (ptmBox.dy >= 0) {
								this.flightState = 'levelout';

							}
						}
					},

					levelout : { 
					
							userAction : function (x, y) {},

							tick : function () {

								var ptmBox = this.getBoxById('ptm');

								// step current level out frame
								loFrame++;
								
								// set the flying interface radius
								this.fmDisplay.flying.radius = this.fmDisplay.flying.radiusMax / levelOutFrames * loFrame
								
								// slide out the toaster interface as it is no loner needed
								toastBar.slideOut();
								dial.slideOut();

								// half the number that divide pi with will become the number of frames
								//ptmBox.radian -= Math.PI / 50;
                                ptmBox.radian -= Math.PI / (levelOutFrames * 2);
								
								if (ptmBox.radian <= 0) {
									ptmBox.heading = 0;
									ptmBox.radian = 0;
									this.flightState = 'flying';

								}
							}

					},

					// what to do while ptm is in the air, and has flight power available
					flying : {

						userAction : function (x, y) {

							this.pitch(x, y);
                            this.changeHeading();
						},

						tick : function () {

							var ptmBox = this.getBoxById('ptm');

							// find current delta x and y based on heading
							ptmBox.dx = Math.cos(ptmBox.radian - Math.PI) * 5;
							ptmBox.dy = Math.sin(ptmBox.radian - Math.PI) * 5;

							// apply delta x, and y
							ptmBox.x += ptmBox.dx;
							ptmBox.y += ptmBox.dy;

							// win lost check during flying and dead states
							winLostCheck.call(this);

							this.flightPower -= 1;

							// if there is flightPower left changes can be made based on user pitch
							if (this.flightPower <= 0) {

							    this.flightPower = 0;
								this.flightState = 'freefall';
							}

						}
					},

					// what hapends when ptm runs out of flight power but is still in there air.
					freefall : {

						userAction : function (x, y) {},

						tick : function () {

							var ptmBox = this.getBoxById('ptm');

							// win lost check during flying and dead states
							winLostCheck.call(this);

							// gravity in effect
							if (ptmBox.heading > -0.78) {

								ptmBox.heading -= 0.025;

							} else {

								ptmBox.heading = -0.78;

							}
							ptmBox.radian = ptmBox.heading;

							ptmBox.dx = Math.cos(ptmBox.radian - Math.PI) * 5;
							ptmBox.dy = Math.sin(ptmBox.radian - Math.PI) * 5;

							ptmBox.x += ptmBox.dx;
							ptmBox.y += ptmBox.dy;
							
							// flight interface goes by by
							if(loFrame > 0){
							    
								loFrame--;
								
							    // set the flying interface radius
							    this.fmDisplay.flying.radius = this.fmDisplay.flying.radiusMax / levelOutFrames * loFrame
							}
						}
					},

					// ALERT! do we really even need an over state? maybe this just needs to be a boolean.
					over : {

						userAction : function (x, y) {},

						tick : function () {}
					}

				};

			}
				()),

			// raisinBreath flightMode:
			raisinBreath : (function () {

				/*    Place any code that you repeat across different flight states for rasinBreath that is specific to rasinBreath here
				 *    in the form of helper functions
				 */

				// move plane function is used in flying, stance, and shotFired flightStates
				var movePlane = function () {

					var plane = this.getBoxById('plane');

					// move the plane by the current delta rate
					plane.x += plane.dx;

					// if the plane reaches the beginning of the map the flight is over
					if (plane.x >= 0) {

						this.flightState = 'over';

					}

				},
				moveTruck = function () {

					var truck = this.getBoxById('truck');

					truck.x += truck.dx;
				},
				
				pitchTo = 0.784;
				

				return {

					// what should be called once for rasinBreath mode at the beginning of a new game
					newGame : function () {

						console.log('setting up new \"rasinBreath" mode game.');

						// set up Box Class Instances
						boxArray = [];
						boxIndex = {};

						// plane
						boxArray.push(new Box({
								id : 'plane',
								x : -3100,
								y : -900,
								//w : 32,
								//h : 32,
								w : 64,
								h : 64,
								dx : 1,
								dy : 0,
								heading : 0
							}));

						// the truck
						boxArray.push(new Box({
								id : 'truck',
								x : 0,
								//y : map.horizon - 32,
								//w : 32,
								//h : 32,
								y : map.horizon - 64,
								w: 128,
								h: 64,
								size : 32,
								dx : -1
							}));

						// the raisin breath shot
						boxArray.push(new Box({
								id : 'shot',
								w : 10,
								h : 10
							}));
						// powdered toast man
						boxArray.push(new Box({
								id : 'ptm',
								w : 64,
								h : 64
							}));

						
						pitchTo = 0.784;
						
						this.viewCentered = true;
						this.flightState = 'ready';
                        
						// Uncomment if you want to go direct to hit state
						//this.viewCentered = false;
						//this.flightState = 'hit';
						
						// set up the flying state interface
						this.fmDisplay.flying = {

							// the radius of the interface will start at 0, then expand to max during the levelout state
							radius : 0,
							radiusMax : 150

						};
						
						// the planes pitch restriction 0 - 89
						//this.fmDisplay.pitchRestrict = 80;
					
					    this.fmConfig.pitchRestrict = (this.fmConfig.wave-1) / 29 * 80;
					
					    // set current level out frame to 0
                        loFrame = 0;
					
					},

					// what should ALWAYS be called on each frame tick for flightMode raisinBreath
					always : function () {

						var plane = this.getBoxById('plane'),
						truck = this.getBoxById('truck');

						if(plane.x < truck.x + truck.w){
						
						    this.fmDisplay.betweenDistance = Math.abs(plane.x - truck.x);

						// if the distance between them is zero than the game is over
						}else{
							
							
							this.fmDisplay.betweenDistance = 0;
							this.flightState = 'over';
							
						}
					},

					onWin : function(){
						
						var xp = 10000 + 1000 * this.playWave + Math.pow(1.10, this.playWave);
						
						this.xp += xp;
						
						console.log('you won raisinBreath flight mode! ');
						console.log('wave won: ' + this.playWave);
						console.log('xp won: ' + xp);
						console.log('total xp: ' + this.xp);
						
					},
					
					// what to do on ready flightState for raisinBreath flight mode
					ready : {

						userAction : function (x, y) {

							dial.onPoint(x, y);
							toastBar.onDrag(x, y);

						},

						tick : function () {

							// same as basic mode
							ptm.onMode.basic.ready.tick.call(this);

						}
					},
					// what to do when the player is dragging the toaster leaver
					bardrag : {

						userAction : function (x, y) {

							// at this time only the toast bar should update
							toastBar.onDrag(x, y);

						},

						tick : function () {

							// same as basic mode
							ptm.onMode.basic.bardrag.tick.call(this);

						}
					},

					// what to do when ptm launches out of the toaster
					launch : {

						// nothing is done with user interaction at this time
						userAction : function (x, y) {},

						tick : function () {

							// same as basic mode
							ptm.onMode.basic.launch.tick.call(this);

						}
					},

					levelout : {

						// nothing is done with user interaction at this time
						userAction : function (x, y) {},

						tick : function () {

							// same as basic mode
							ptm.onMode.basic.levelout.tick.call(this);
						}
					},

					// what to do while ptm is in the air, and has flight power available
					flying : {

						// nothing is done with user interaction at this time
						userAction : function (x, y) {

							// if "enter stance"" button is pressed
							if (api.boundingBox(x, y, 1, 1, 0, 380, 100, 100)) {

								console.log('This looks like a job for my projectial raisan breath!');
								this.flightState = 'stance';

							} else {

								// change heading
								ptm.pitch(x, y);
								this.changeHeading();

							}
						},

						tick : function () {

						    if(this.flightPower > 0){
							// step position
							this.stepPos();

							// plan will move now
							movePlane.call(this);

							// so will the truck
							moveTruck.call(this);
							
							this.flightPower -= 1;

					
							// if there is flightPower left changes can be made based on user pitch
							}else{

							    this.flightPower = 0;
						        this.flightState = 'stance';
							}

						}

					},

					stance : {

						// nothing is done with user interaction at this time
						userAction : function (x, y) {

							var ptmBox = this.getBoxById('ptm');

							console.log('stance mode shot fired!');

							// change back to flight mode if button is pressed
							if (api.boundingBox(x, y, 1, 1, 0, 380, 100, 100)) {

								console.log('or maybe not, humm.');
								this.flightState = 'flying';
								
							} else {

							
								//var pos = viewPort.getVPRelative(ptmBox.x, ptmBox.y);
								var pos = viewPort.getVPRelative(ptmBox.x + ptmBox.w/2, ptmBox.y+ ptmBox.h/2);
								
								if(api.distance(x,y,pos.x + ptmBox.w/2,pos.y + ptmBox.h/2) <= 150){
								
								var angle = api.getAngles({
										x : pos.x,
										y : pos.y,
										heading : ptmBox.heading
									}, {
										x : x,
										y : y
									}).angle;

								var shot = this.getBoxById('shot');
								//shot.x = ptmBox.x;
								//shot.y = ptmBox.y;
								// so 5 should be half the width of the shot
								shot.x = ptmBox.x + ptmBox.w/2 - 5;
								shot.y = ptmBox.y + ptmBox.h/2 - 5;
								shot.dx = Math.cos(angle) * 5;
								shot.dy = Math.sin(angle) * 5;

								this.viewCentered = false;
								this.flightState = 'shotFired';
								
								}
								
							}

						},

						tick : function () {

							// plan will continue moving during stance
							movePlane.call(this);

							// so will the truck
							moveTruck.call(this);
						}
					},

					shotFired : {

						// nothing is done with user interaction at this time
						userAction : function (x, y) {
							console.log('shot fired mode');

						},

						tick : function () {

							var plane = this.getBoxById('plane'),
							shot = this.getBoxById('shot');

							// plan will continue moving during while the shot is moving
							movePlane.call(this);

							// so will the truck
							moveTruck.call(this);

							// the shot will move
							shot.x += shot.dx;
							shot.y += shot.dy;

							// ALERT! whats with the +5, you should keep notes in the comments as to why a literal is the way it is
							viewPort.moveViewPort(shot.x + 5, shot.y + 5);

							// what happens when ptm hits the target with the shot
							if (api.boundingBox(shot.x, shot.y, 10, 10, plane.x, plane.y, plane.w, plane.h)) {
								console.log('a hit! a very powerful hit!');

								this.flightState = 'hit';

							}

							// go back to stance mode if ptm missed the target
							if (shot.x <= -map.width || shot.x >= 0 || shot.y <= -map.height || shot.y >= 0) {

								this.viewCentered = true;
								this.flightState = 'stance';

							}

						}
					},

					hit : {

						userAction : function (x, y) {

						    var plane = this.getBoxById('plane'),
						
						    pos = viewPort.getVPRelative(plane.x, plane.y),
							
							angle = Math.atan2(pos.y + plane.h/2 - y, pos.x + plane.w/2 - x) + Math.PI,
							
							deg = Math.PI/180;
						
						    //if(angle < Math.PI-deg*20 && angle > deg*20){
						
						    // minimum pitch of 20 degrees?
							// pitchRestrict min: 0, max 90
							//var pitchRestrict = 35;
						    //if(angle < Math.PI / 2 - deg * 20 && angle > deg * 20){
								
								
						    //if(angle < Math.PI / 2 - deg * (this.fmDisplay.pitchRestrict/2) && angle > deg * (this.fmDisplay.pitchRestrict/2)){
						    if(angle < Math.PI / 2 - deg * (this.fmConfig.pitchRestrict/2) && angle > deg * (this.fmConfig.pitchRestrict/2)){
    							pitchTo = angle;
						
							}


						},

						tick : function () {

							var plane = this.getBoxById('plane'),
							truck = this.getBoxById('truck');

							// ALERT! whats with the +5, you should keep notes in the comments as to why a literal is the way it is
							viewPort.moveViewPort(plane.x + 5, plane.y + 5);

							// the plane will fall, and hit the ground
							if (plane.y < map.horizon - plane.h) {

								
								if(plane.heading > pitchTo){
		
									// 10 is just a number that I am dividing the difference by
									plane.heading -= (plane.heading - pitchTo) / 10;
									
								}
								
								if(plane.heading < pitchTo){
					
									// 10 is just a number that I am dividing the difference by
									plane.heading += (pitchTo - plane.heading) / 10;
									
								}
								
							    // 5 is just a delta value that can be something else
							    plane.dx = Math.cos(plane.heading) * 5;
							    plane.dy = Math.sin(plane.heading) * 5;
							
								// the plane will fall
								plane.x += plane.dx;
								plane.y += plane.dy;

							// else the plane hit the ground
							} else {

								// plane.y will be at a minimum
								plane.y = map.horizon - plane.h;

								// this will mean that you missed the truck which means game over (in a bad way).
								this.flightState = 'over';

								

							}

							// and the truck will still move
							moveTruck.call(this);

							// did the truck hit the plane?
							if (api.boundingBox(truck.x, truck.y, truck.w, truck.h, plane.x, plane.y, plane.w, plane.h)) {

							    // this will means game over (in a good way).
								this.flightState = 'truckHit';

							}

							// if the truck reaches the end of the map, the game is over (in a bad way)
							if (truck.x <= -map.width) {
								
								this.flightState = 'over';

							}
						}

					},

					truckHit : {

						userAction : function (x, y) {

							console.log('you won');

						},

						tick : function () {

							console.log('you won!');

							this.onWin(); // call master onWin method
							this.flightState = 'over';
						}

					},

					over : {

						userAction : function (x, y) {

							console.log('game is over.');

						},

						tick : function () {

							console.log('over state');
						}

					}

				};

			}
				())

			};
		}())
	};

}
	());