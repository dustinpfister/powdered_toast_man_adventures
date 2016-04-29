


var Main = (function () {

	var config = {

		currentState : 'start'

	},

	state = {

		// START STATE
		start : function () {

			Render.setURL('asset/img/');
			Render.setup();

			config.currentState = 'load';
		},

		// LOAD STATE
		load : function () {

			console.log('loading: ' + Render.loadCheck());

			if (Render.loadCheck() === 1) {

			    
			
			    //ptm.newSave();
			    //config.currentState = 'upgrades';
			
				config.currentState = 'title';

				// comment out config.currentState = 'title' and uncomment the following to jump directly to game
				//ptm.flightMode = 'raisinBreath';
				//ptm.newSave();
				//ptm.newGame();
				//config.currentState = 'game';

			}

		},

		title : (function () {

			Slider.addScene({
				id : 'background',
				render : function (ctx, scene) {}
			},
				[{
						updateMethod : 'linearBackground',
						groupID : 'bg',
						groupPart : 'image',
						w : 1500,
						h : 480,
						globalRender : false,
						render : function (ctx) {}

					}, {
						updateMethod : 'linearBackground',
						groupID : 'bg',
						groupPart : 'source',
						sy : 0,
						dx : 5,
						w : 640,
						h : 480,
						globalRender : false,
						render : function (ctx) {}

					}, {
						updateMethod : 'linearBackground',
						groupID : 'bg',
						groupPart : 'sourcePartA',
						globalRender : false,
						render : function (ctx) {}

					}, {
						updateMethod : 'linearBackground',
						groupID : 'bg',
						groupPart : 'sourcePartB',
						globalRender : false,
						render : function (ctx) {}

					}, {
						id : 'background',
						type : 'dummy',
						updateMethod : 'linearBackground',
						groupID : 'bg',
						groupPart : 'destination',
						sx : 20,
						sy : 20,
						w : 600,
						h : 440,
						globalRender : false

					}

				]);

			Slider.addScene({

				id : 'title',
				render : function (ctx, scene) {}

			},
				[
					// to game menu button
					{
						id : 'button_gameMenu',
						updateMethod : 'moveDistance',
						sx : -200,
						sy : 200,
						w : 150,
						//dx: 31,
						distanceX : 660,

						onEnd : function (scene) {

							console.log('to game menu!');
							ptm.newSave();
							config.currentState = 'gameMenu';
						},
						render : function (ctx, scene) {}
					}, { // powdered toast man
						id : 'ptm',
						type : 'dummy',
						updateMethod : 'staticDelta',
						sx : 650,
						sy : 113,
						w : 439,
						h : 367,
						dx : -32.5

					}, { // title
						id : 'title',
						type : 'dummy',
						updateMethod : 'staticDelta',
						sx : 253,
						sy : 500,
						w : 134,
						h : 120,
						dy : -24,

					}

				]);

			// what to do on each frame tick
			return function () {

				Slider.getSceneById('background').update();
				Slider.getSceneById('title').update();
				//Slider.getBackground().update();
			}

		}
			()),

		gameMenu : (function () {

			Slider.addScene({

				id : 'gameMenu',
				render : function (ctx, scene) {

					ctx.fillStyle = '#ffffff';
					ctx.fillRect(this.x, this.y, this.w, this.h);

				}

			},
				[{ // start level one button
						id : 'level1',
						
						updateMethod : 'moveDistance',
						sx : 40,
						sy: -200,
						w:150,
						h:150,
						distanceY: 320,
						
						onEnd : function () {

							console.log('More powdered toast anyone?');
							
							// setup new game
							ptm.flightMode = 'basic';
							ptm.waveMax();
							config.currentState = 'levelMenu';
							
						}
					}, 
					
					
					{ // start level two button
						//type: 'action',
						id : 'level2',
						updateMethod : 'staticDelta',
						sx : 245,
						sy : -200,
						w : 150,
						h : 150,
						dx : 0,
						dy : 16,
						onAction : function () {
							console.log('coming soon.')
						},
						onEnd : function () {

							console.log('Save the kitten!');

							ptm.flightMode = 'raisinBreath';
							//ptm.newGame();
							//config.currentState = 'game';
							ptm.waveMax();
							config.currentState = 'levelMenu';
						}
					}, {
						id : 'level3',
						type : 'action',
						updateMethod : 'staticDelta',
						sx : 450,
						sy : -200,
						w : 150,
						h : 150,
						dx : 0,
						dy : 16,
						onAction : function () {
							console.log('coming soon.')
						},
						onEnd : function () {

							console.log('Cling Tenaciously!');

						}
					}, { // back to title
						id : 'back',
						updateMethod : 'staticDelta',
						sx : 40,
						sy : -100,
						w : 150,
						dx : 0,
						dy : 24,
						onEnd : function () {

							console.log('back to title!');
							config.currentState = 'title';
						}
					}, { // to upgrades
						id : 'upgrades',
						updateMethod : 'staticDelta',
						sx : 245,
						sy : -100,
						w : 150,
						dx : 0,
						dy : 24,
						onEnd : function () {

							console.log('upgrades!');
							ptm.findRemainingLogs();
							config.currentState = 'upgrades';
						}
					},

				]);

			return function () {

				Slider.getSceneById('background').update();
				Slider.getSceneById('gameMenu').update();
				//Slider.getBackground().update();

			};

		}
			()),
			

			
		levelMenu : (function(){
			
			Slider.addScene({

				id : 'levelmenu',
				render : function (ctx, scene) {

					ctx.fillStyle = '#ffffff';
					ctx.fillRect(this.x, this.y, this.w, this.h);

				}

			    },
			    [
			
			        // level icon 
			        {
						id : 'levelicon',
						//type : 'dummy',
						updateMethod: 'moveDistance',
						sx : 20,
						sy: -200,
						w:150, h:150,
						distanceY:220,
						onEnd : function(){
							
							ptm.newGame();
							config.currentState = 'game';
							
							
						}
						
						
					},
					
					{ // wave select
						id : 'waveselect',
						type: 'upgrade',
						updateMethod: 'moveDistance',
						sx : 20,
						sy: -200,
						w:150,
						h:100,
						distanceY: 390,
						
						onTickUp : function(){
							
							console.log('up');
							ptm.waveUp();
							
						},
						
						onTickDown : function(){
							
							console.log('down');
							ptm.waveDown();
							
						}
						
						
					},
					
					// back to game menu
					{
						id: 'back',
						updateMethod: 'moveDistance',
						sx : 20,
						sy: -200,
						w:150,
						h:100,
						distanceY: 510,
						onEnd : function(){
							
							config.currentState = 'gameMenu';
							
						}
						
						
						
					},
					
					// level description
					{
						id: 'desc',
						type: 'dummy',
						updateMethod: 'moveDistance',
						sx: 190,
						sy: -450,
						w:430,
						h:440,
						distanceY : 470
						
						
					}
			
			    ]
			);
			
			return function(){
				
				Slider.getSceneById('background').update();
				Slider.getSceneById('levelmenu').update();
				
			};
			
		}()),
		
		
		upgrades : (function () {

			Slider.addScene({

				id : 'upgrades',
				render : function (ctx, scene) {

					ctx.fillStyle = '#ffffff';
					ctx.fillRect(this.x, this.y, this.w, this.h);

				}

			},
				[
				
				    {
						id: 'logCount',
						type: 'dummy',
						updateMethod: 'moveDistance',
						sx: 40,
						sy: 500,
						w:150,
						h:50,
						distanceY:-460
						
					},
				
				    { // upgrade 1
					    id: 'flightpower',
						type : 'upgrade',
						updateMethod : 'staticDelta',
						sx : 40,
						sy : 500,
						w : 150,
						h : 150,
						dx : 0,
						dy : -20,
						onAction : function () {

						},
						onTickUp : function(){
							
							ptm.stepUpgrade(this.id,1);
							
						},
						onTickDown : function(){
							
							ptm.stepUpgrade(this.id,-1);
							
						}
						
					}, 
					
					{ // back to game menu
						updateMethod : 'staticDelta',
						sx : 40,
						sy : 580,
						w : 150,
						dx : 0,
						dy : -10,
						onEnd : function () {

							console.log('back to game menu!');
							config.currentState = 'gameMenu';
						}
					}, { // reset upgrades.
						type : 'action',
						updateMethod : 'staticDelta',
						sx : 245,
						sy : 580,
						w : 150,
						dx : 0,
						dy : -10,
						onAction : function () {

						    ptm.resetUpgrades();
						
							console.log('reset logs!');

						}
					}

				]);

			return function () {

				Slider.getSceneById('background').update();
				Slider.getSceneById('upgrades').update();
				//Slider.getBackground().update();

			};

		}
			()),

		game : (function () {

			Slider.addScene({

				id : 'game',
				render : function (ctx, scene) {

					ctx.fillStyle = '#ffffff';
					ctx.fillRect(this.x, this.y, this.w, this.h);

				}

			},
				[{ // pause button
						type : 'action',
						updateMethod : 'staticDelta',
						sx : -100,
						sy : 0,
						w : 64,
						h : 64,
						dx : 33.8,
						dy : 0,
						onAction : function () {

							console.log('pause button');
							config.currentState = 'gamePaused';

						}
					}

				]);

			return function () {

				ptm.update();
				toastBar.update();

				if (ptm.flightState === 'over') {

					config.currentState = 'gameOver';

				}

				Slider.getSceneById('game').update();

			}

		}
			()),

		gameOver : (function () {

			Slider.addScene({

				id : 'gameOver',
				render : function (ctx, scene) {

				}

			},
				[
				    {
						id : 'toast',
						type : 'dummy',
						updateMethod : 'staticDelta',
						sx : 120,
						sy : 500,
						w : 400,
						h : 400,
						dx : 0,
						dy : -23
						
					},
					
					{
						id : 'message',
						type : 'dummy',
						updateMethod : 'staticDelta',
						sx : 120,
						sy : -250,
						w : 400,
						h : 200,
						dx : 0,
						dy : 16
						
					},
				    { // to game menu
				        id: 'menu',
						updateMethod : 'staticDelta',
						sx : -200,
						sy : 300,
						w : 100,
						h : 100,
						dx : 18,
						dy : 0,
						onEnd : function () {

							console.log('back to game menu!');

							Render.clearLayer('game');

							config.currentState = 'gameMenu';

						}
					}, { // try again / next (wave, level, ect)
					    id: 'tryagain',
						updateMethod : 'staticDelta',
						sx : 740,
						sy : 300,
						w : 100,
						h : 100,
						dx : -18,
						dy : 0,
						onEnd : function () {

							console.log('try again, or next!');

							Render.clearLayer('game');

							ptm.newGame();

							config.currentState = 'game';

						}
					}
					
					
				]
				);

			return function () {

				//console.log('yippiee!!!');

				Slider.getSceneById('gameOver').update();

			};

		}
			()),

		gamePaused : (function () {

			Slider.addScene({

				id : 'gamePaused',
				render : function (ctx, scene) {

				}

			},
				[
				    { // toast!
					    id: 'toast',
						type: 'action',
						updateMethod : 'staticDelta',
						sx : 120,
						sy : 500,
						w : 400,
						h : 400,
						dx : 0,
						dy : -23,
						onAction : function(){
							
							
							console.log('toast dummy');
							
						}

					}, 
					
					{ // paused message!
                        id: 'message',
						type: 'action',
						updateMethod : 'staticDelta',
						sx : 120,
						sy : -250,
						w : 400,
						h : 200,
						dx : 0,
						dy : 16,
						onAction : function(){
							
							
							console.log('paused dummy');
							
						}

					},
				
				    { // to game menu
				        id: 'menu',
						updateMethod : 'staticDelta',
						sx : -200,
						sy : 280,
						w : 100,
						h : 100,
						dx : 19,
						dy : 0,
						onAction : function(){
							
							
							console.log('wtf');
							
						},
						onEnd : function () {

							console.log('back to game menu!');

							Render.clearLayer('game');

							config.currentState = 'gameMenu';

						}
					}, { // continue game
					    id: 'continuegame',
						updateMethod : 'staticDelta',
						sx : 740,
						sy : 280,
						w : 100,
						h : 100,
						dx : -19,
						dy : 0,
						onAction : function(){
							
							
							console.log('wtf');
							
						},
						onEnd : function () {

							console.log('back to the game!');
							//config.currentState = 'gamePaused';
							config.currentState = 'game';

						}
					}

				]
			);

			// what to do on each frame tick for game paused state
			return function () {

				Slider.getSceneById('gamePaused').update();

			}

		}
			())

	},

	thread = function () {

		setTimeout(thread, 33);

		state[config.currentState]();
		Render.draw(config.currentState);

		document.getElementById('out').innerHTML = ''+
		    'applaction state: ' + config.currentState + '<br>'+
			'ptm flight mode: ' + ptm.flightMode + '<br>'+
			'ptm flight state: ' + ptm.flightState + '<br>'+
			'ptm play wave : ' + ptm.playWave + '<br>'+
			'ptm logs : ' + ptm.logs + '<br>'+
			'ptm flightpower : ' + ptm.flightPower + '<br>'+
			'ptm flightpower Range : ' + JSON.stringify(ptm.flightPowerRange) + '<br>'+
			'ptm waves : ' + JSON.stringify(ptm.waves) + '<br>'+
			'ptm upgrades : ' + JSON.stringify(ptm.upgrades) + '<br>'+
			'ptm XP points : ' + Math.floor(ptm.xp) + '<br>'+
			'ptm level : ' + Math.floor(ptm.level) + '<br>';

	};

	thread();

	
	return {

		getConfig : function () {

			return config;

		}
	}

}
	());
