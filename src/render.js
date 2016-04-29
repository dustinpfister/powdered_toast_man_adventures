/*

render.js

needs: acetate.js

description:

 * renders the current state of the game
 * functions as an image repository

 */

var Render = (function () {

	var img = [],
	//imageURL = '../../asset/img/',
	imageURL = './', // By default look for images at current base URL
	imgTotal = 13,
	imgLoaded = [],

	loadCheck = function () {

		var i = 0,
		loadCount = 0;
		while (i < imgTotal) {

			if (imgLoaded[i]) {

				loadCount++;

			}
			i++;

		}

		return loadCount / imgTotal;

	},

	draw = {

		start : function () {},

		load : function () {},

		title : (function () {

			return function () {

				Acetate.draw('display', function (sheet, ctx) {

					sheet.cls();
					Slider.getSceneById('background').renderAll(ctx);
					Slider.getSceneById('title').renderAll(ctx);

				});

				// ALERT! do I even need the layer?
				Acetate.draw('background', function (sheet, ctx) {

					sheet.cls();
					ctx.fillStyle = '#006a6a';
					ctx.fillRect(0, 0, 640, 480);

				});

			};

		}
			()),

		gameMenu : function () {

			Acetate.draw('display', function (sheet, ctx) {

				sheet.cls();

				Slider.getSceneById('background').renderAll(ctx);
				Slider.getSceneById('gameMenu').renderAll(ctx);

			});

			Acetate.draw('background', function (sheet, ctx) {

				sheet.cls();
				ctx.fillStyle = '#006a6a';
				ctx.fillRect(0, 0, 640, 480);

			});

		},
		
		levelMenu : function () {

			Acetate.draw('display', function (sheet, ctx) {

				sheet.cls();

				Slider.getSceneById('background').renderAll(ctx);
				Slider.getSceneById('levelmenu').renderAll(ctx);

			});

			Acetate.draw('background', function (sheet, ctx) {

				sheet.cls();
				ctx.fillStyle = '#006a6a';
				ctx.fillRect(0, 0, 640, 480);

			});

		},

		upgrades : function () {

			Acetate.draw('display', function (sheet, ctx) {

				sheet.cls();
				Slider.getSceneById('background').renderAll(ctx);
				Slider.getSceneById('upgrades').renderAll(ctx);


			});

			Acetate.draw('background', function (sheet, ctx) {

				sheet.cls();
				ctx.fillStyle = '#006a6a';
				ctx.fillRect(0, 0, 640, 480);

			});

		},

		game : (function () {


			var drawTragetPointer = function (fromBoxID, targetBoxID, ctx) {

				var fromBox = ptm.getBoxById(fromBoxID),
				target = ptm.getBoxById(targetBoxID),
				pos = viewPort.getVPRelative(fromBox.x, fromBox.y),
				angles = api.getAngles(fromBox, target);

				ctx.fillStyle = '#ff0000';
				ctx.save();
				ctx.translate(pos.x + fromBox.w / 2, pos.y + fromBox.h / 2);
				ctx.rotate(angles.angle);
				ctx.fillRect(100, -5, 50, 10);
				ctx.restore();

			},

			drawFlightInterface = function (ctx) {

				var ptmDisp = ptm.getBoxById('ptm'),
				//pos = {
				//	x: 320,
				//	y: 220
				//};
				pos = viewPort.getVPRelative(ptmDisp.x + ptmDisp.w / 2, ptmDisp.y + ptmDisp.h / 2);

				//ctx.fillText(ptm.fmDisplay.flying.radius, 10, 50);

				ctx.lineWidth = 3;
				ctx.strokeStyle = '#ffffff';
				ctx.beginPath();
				ctx.arc(pos.x, pos.y, ptm.fmDisplay.flying.radius, 0, Math.PI * 2);
				ctx.stroke();

			},

			drawFlightPowerBar = function (ctx) {

				var ptmDisp = ptm.getBoxById('ptm'),
				pos = viewPort.getVPRelative(ptmDisp.x + ptmDisp.w / 2, ptmDisp.y + ptmDisp.h / 2);

				ctx.lineWidth = 8;
				ctx.strokeStyle = '#000000';
				ctx.beginPath();
				ctx.arc(pos.x, pos.y, ptm.fmDisplay.flying.radius, 0, Math.PI / 2);
				ctx.stroke();
				ctx.strokeStyle = '#00ff00';
				ctx.beginPath();
				//ctx.arc(pos.x, pos.y, ptm.fmDisplay.flying.radius, 0, Math.PI / 2 * (ptm.flightPower / 330));
				ctx.arc(pos.x, pos.y, ptm.fmDisplay.flying.radius, 0, Math.PI / 2 * (ptm.flightPower / ptm.flightPowerRange[1]));
				ctx.stroke();

			};

			// ALERT! okay so when it comes to improving your rendering for starters I think I will need
			// separate draw functions for each flight state, withing each flight mode.
			drawModes = {

				basic : (function () {

					return {

						always : function (ctx) {

							var target = ptm.getBoxById('house'),
							ptmDisp = ptm.getBoxById('ptm'),
							pos = viewPort.getVPRelative(target.x, target.y);

							ctx.fillStyle = '#ff00ff';
							ctx.fillRect(pos.x, pos.y, target.w, target.h);

							ctx.textAlign = 'left';
							ctx.font = '15px courier';
							ctx.fillStyle = '#ffff00';

							ctx.fillText('distance: ' + api.distance(ptmDisp.x, ptmDisp.y, target.x, target.y).toFixed(2), 10, 10);
							ctx.fillText('flight Power! : ' + Math.floor(ptm.flightPower), 10, 25);
							ctx.fillText('wave: ' + ptm.playWave, 10, 40);
							
							
							ctx.fillText('logs : ' + Math.floor(ptm.logs), 10, 450);
							

						},

						ready : function (ctx) {},

						bardrag : function (ctx) {},

						launch : function (ctx) {

							//ctx.fillText(ptm.fmDisplay.flying.radius, 10, 50);

						},

						levelout : function (ctx) {

							drawFlightInterface(ctx);
							drawFlightPowerBar(ctx);
							//drawTragetPointer(ptm.getBoxById('house'), ctx);
							drawTragetPointer('ptm', 'house', ctx);
						},

						flying : function (ctx) {

							drawFlightInterface(ctx);
							drawFlightPowerBar(ctx);
							//drawTragetPointer(ptm.getBoxById('house'), ctx);
							drawTragetPointer('ptm', 'house', ctx);
						},

						freefall : function (ctx) {

							drawFlightInterface(ctx);
							//drawTragetPointer(ptm.getBoxById('house'), ctx);
							drawTragetPointer('ptm', 'house', ctx);
						},

						over : function (ctx) {}
					};

				}
					()),

				raisinBreath : {

					always : function (ctx) {

						var plane = ptm.getBoxById('plane'),
						truck = ptm.getBoxById('truck'),
						pos;

						// draw distance between text
						ctx.fillStyle = 'yellow';
						ctx.textAlign = 'center';
						ctx.fillText(ptm.fmDisplay.betweenDistance, 320, 20);

						
						// wave
						ctx.textAlign = 'left';
						ctx.fillText('wave: ' +ptm.fmConfig.wave, 10,10);
						
						// logs
						ctx.textAlign = 'left';
						ctx.fillText('logs: ' +ptm.logs, 10,30);
						
						
						// truck
						pos = viewPort.getVPRelative(truck.x, truck.y);
						//ctx.fillStyle = '#008f00';
						//ctx.fillRect(pos.x, pos.y, truck.w, truck.h);
						ctx.drawImage(img[11], 128, 29, 128, 64, pos.x, pos.y, truck.w, truck.h);

						// plane
						pos = viewPort.getVPRelative(plane.x, plane.y);
						//ctx.fillStyle = '#ff00ff';
						//ctx.fillRect(pos.x, pos.y, plane.w, plane.h);

						//ctx.drawImage(img[11],0,0,128,128,pos.x,pos.y,plane.w,plane.h)

						ctx.save();
						ctx.translate(pos.x + 32, pos.y + 32);
						ctx.rotate(plane.heading);
						ctx.drawImage(img[11], 0, 0, 128, 128, -32, -32, 64, 64);
						ctx.restore();
					},

					ready : function (ctx) {},

					bardrag : function (ctx) {},

					launch : function (ctx) {

						ctx.fillText(ptm.fmDisplay.flying.radius, 10, 50);

					},

					levelout : function (ctx) {

						drawFlightInterface(ctx);
						drawFlightPowerBar(ctx);
						//drawTragetPointer(ptm.getBoxById('plane'), ctx);
						drawTragetPointer('ptm', 'plane', ctx);
					},

					flying : function (ctx) {

						drawFlightInterface(ctx);
						drawFlightPowerBar(ctx);
						//drawTragetPointer(ptm.getBoxById('plane'), ctx);
						drawTragetPointer('ptm', 'plane', ctx);
					},

					stance : function (ctx) {

						drawTragetPointer('ptm', 'plane', ctx);
					},

					shotFired : function (ctx) {

						var shot = ptm.getBoxById('shot'),
						pos = viewPort.getVPRelative(shot.x, shot.y);

						// render the shot
						ctx.fillStyle = '#806000';
						ctx.fillRect(pos.x, pos.y, shot.w, shot.h);

						drawTragetPointer('shot', 'plane', ctx);
					},

					hit : function (ctx) {

						var plane = ptm.getBoxById('plane'),
						pos = viewPort.getVPRelative(plane.x + plane.w / 2, plane.y + plane.h / 2);

						// ptm.fmDisplay.pitchRestrict/2 * (Math.PI/180)
						//var radian = ptm.fmDisplay.pitchRestrict / 2 * (Math.PI / 180);
						var radian = ptm.fmConfig.pitchRestrict / 2 * (Math.PI / 180);
						var x = Math.cos(radian) * 150 + pos.x;
						var y = Math.sin(radian) * 150 + pos.y;

						//ctx.fillRect(10,10,50,50);

						// draw pitch range
						ctx.strokeStyle = 'rgba(255,255,255,0.5)';
						ctx.lineWidth = 3;
						ctx.beginPath();
						ctx.moveTo(pos.x, pos.y);
						ctx.lineTo(x, y);
						ctx.arc(pos.x, pos.y, 150, radian, 1.57 - radian);
						ctx.moveTo(pos.x, pos.y);

						x = Math.cos(Math.PI / 2 - radian) * 150 + pos.x;
						y = Math.sin(Math.PI / 2 - radian) * 150 + pos.y;

						ctx.lineTo(x, y);
						ctx.stroke();

						// draw current plane heading pointer

						x = Math.cos(plane.heading) * 150 + pos.x;
						y = Math.sin(plane.heading) * 150 + pos.y;
						ctx.fillStyle = '#000000';
						ctx.fillRect(x - 7, y - 7, 14, 14);
						ctx.fillStyle = '#ffff00';
						ctx.fillRect(x - 5, y - 5, 10, 10);

						// draw pointer from plane to truck
						//drawTragetPointer(ptm.getBoxById('truck'), ctx);
						drawTragetPointer('plane', 'truck', ctx);
					},

					truckHit : function (ctx) {}

				}

			};

			// return the actual function that will be called each frame tick
			return function () {

				Acetate.draw('game', function (sheet, ctx) {

					var pos,
					leaver,
					angles,
					target,
					truck,
					shot,
					ptmDisp = ptm.getBoxById('ptm');

					// draw sky
					startY = Math.abs(viewPort.y) % 50,
					startX = Math.abs(viewPort.x) % 50,
					startBlue = 255 - Math.floor(Math.abs(viewPort.y) / 50) * 12,
					i = 0,
					i2 = 0;

					ctx.lineWidth = 1;
					ctx.fillRect(0, 0, 640, startY); // ALERT! is this line of code event needed at all?
					while (i < 11) {

						startBlue += 12;
						ctx.fillStyle = 'rgb(0,' + startBlue + ',' + startBlue + ')';
						ctx.fillStyle = 'rgb(0,' + startBlue + ',' + startBlue + ')';
						ctx.fillRect(0, (startY - 50) + 50 * i, 640, 50);

						ctx.strokeStyle = 'rgba(255,255,255,0.5)';
						i2 = 0;
						while (i2 < 14) {
							ctx.strokeRect(startX - 50 + 50 * i2, startY - 50 + 50 * i, 50, 50);
							i2++;
						}
						i++;
					}

					// draw horizon
					pos = viewPort.getVPRelative(0, map.horizon);
					ctx.fillStyle = '#00af00';
					ctx.fillRect(0, pos.y, viewPort.width, viewPort.width - pos.y);

					// draw ptm
					pos = viewPort.getVPRelative(ptmDisp.x, ptmDisp.y);

					ctx.save();
					ctx.translate(pos.x + ptmDisp.w / 2, pos.y + ptmDisp.h / 2);
					ctx.rotate(ptmDisp.radian);
					ctx.drawImage(img[0], -32, -16, 64, 32);
					ctx.restore();

					// call always function for current flightMode
					drawModes[ptm.flightMode].always(ctx);

					// call rendering function for current flightMode and flightState
					drawModes[ptm.flightMode][ptm.flightState](ctx);

					// draw dial
					ctx.drawImage(img[5], dial.x - 50, dial.y - 50, 100, 100);

					// draw setting marker
					ctx.drawImage(img[4], Math.floor(dial.setting * 26) * 100, 0, 100, 100, dial.x - 50, dial.y - 50, 100, 100);

					// draw setting
					ctx.fillStyle = '#000000';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'top';
					ctx.font = '15px arial';
					ctx.fillText(Math.floor(dial.setting * 100), dial.x, dial.y + 30);

					// draw toastbar
					leaver = toastBar.getLeaverPos();
					ctx.drawImage(img[3], 0, 0, toastBar.width, toastBar.height, toastBar.x, toastBar.y, toastBar.width, toastBar.height); // backdrop
					ctx.drawImage(img[3], toastBar.width, 0, leaver.w, leaver.h, leaver.x, leaver.y, leaver.w, leaver.h);

				});

				Acetate.draw('display', function (sheet, ctx) {

					sheet.cls();

					Slider.getSceneById('game').renderAll(ctx);

				});

			};

		}
			()),

		gameOver : function () {

			Acetate.draw('display', function (sheet, ctx) {

				sheet.cls();

				Slider.getSceneById('gameOver').renderAll(ctx);
			

			});

		},

		gamePaused : function () {

			Acetate.draw('display', function (sheet, ctx) {

				sheet.cls();

				Slider.getSceneById('gamePaused').renderAll(ctx);
				
			});

		}

	};

	return {

		setup : function () {

			var i,
			currentImage;

			Acetate.setStack({

				defaults : {
					container : 'game_container',
					x : 0,
					y : 0,
					w : 640,
					h : 480

				},

				sheets : [{
						sheetID : 'background'
					}, {
						sheetID : 'game'
					}, {
						sheetID : 'display'
					}
				]

			});
			Acetate.appendAll();

			// append event handlers to top sheet
			userAction.attachToCanvas(Acetate.getSheets()[2].canvas);

			i = 0;
			while (i < imgTotal) {

				currentImg = new Image();

				imgLoaded[i] = false;

				(function () {

					var index = i;

					currentImg.addEventListener('load', function (e) {

						imgLoaded[index] = true;

					});

					currentImg.src = imageURL + i + '.png';

				}
					());

				img.push(currentImg);

				i++;

			}

			// ALERT! this should be another plugin yes?
			var setRenderFunctions = function (sceneId, renderFunctions) {

				var scene = Slider.getSceneById(sceneId),
				props;

				for (props in renderFunctions) {

					scene.getButtonById(props).render = renderFunctions[props];

					i++;
				}

			};

			// set slider render functions for

			setRenderFunctions('background', {

				background : function (ctx, scene) {

					var source = scene.findPart(this.groupID, 'source'),
					sourceA = scene.findPart(this.groupID, 'sourcePartA'),
					sourceB = scene.findPart(this.groupID, 'sourcePartB'),
					image = scene.findPart(this.groupID, 'image'),

					wPer = this.w / source.w,
					hPer = this.h / source.h;

					// draw partA
					ctx.drawImage(img[7], sourceA.x, sourceA.y, sourceA.w, sourceA.h, this.x, this.y, sourceA.w * wPer, sourceA.h * hPer);

					// draw partB
					ctx.drawImage(img[7], sourceB.x, sourceB.y, sourceB.w, sourceB.h, this.x + sourceA.w * wPer, this.y + sourceA.y * hPer, sourceB.w * wPer, sourceB.h * hPer);

					// draw frame?
					ctx.strokeStyle = '#ffffff';
					ctx.strokeRect(this.x, this.y, this.w, this.h);

				}
			});

			setRenderFunctions('title', {

				title : function (ctx, scene) {

					ctx.drawImage(img[8], this.x, this.y);

				},

				ptm : function (ctx, scene) {

					ctx.drawImage(img[2], this.x, this.y);

				},

				button_gameMenu : function (ctx, scene) {

					ctx.drawImage(img[6], 0, 50, 150, 51, this.x, this.y, 150, 50);

				}
			});

			
			setRenderFunctions('gameMenu', {

				level1 : function (ctx, scene) {

					ctx.drawImage(img[9], 0,0,150,150,this.x, this.y,150,150);

				},
				/*
				level1_upgrade : function (ctx, scene) {

					//ctx.drawImage(img[9], 0,0,150,150,this.x, this.y,150,150);

					ctx.textBaseline = 'top';
					ctx.fillStyle = '#000000';
					ctx.textAlign = 'center';
					ctx.font = '20px arial';
					ctx.fillText('wave: ' + ptm.playWave, this.x + this.w/2,this.y+this.h/2-10);
					
				},
				*/
				level2 : function (ctx, scene) {

					ctx.drawImage(img[9], 150,0,150,150,this.x, this.y,150,150);

				},
				level3 : function (ctx, scene) {

					ctx.drawImage(img[9], 300,0,150,150,this.x, this.y,150,150);

				},
				back : function (ctx, scene) {

					ctx.drawImage(img[6], 0,200,150,50,this.x, this.y,150,50);

				},
				upgrades : function (ctx, scene) {

					ctx.drawImage(img[6], 0,250,150,50,this.x, this.y,150,50);

				}
				
			});
			
			setRenderFunctions('upgrades', {
				
				logCount : function(ctx, scene){
					
					
					ctx.fillStyle='#000000';
					ctx.textBaseline = 'top';
					ctx.textAlign = 'center';
					ctx.font = '20px arial';
					ctx.fillText('logs:' + ptm.remainingLogs + '/'+ptm.logs, this.x + this.w / 2, this.y + this.h / 2 - 10 );
					
				},
				
				flightpower : function(ctx, scene){
					
					ctx.fillStyle='#000000';
					ctx.textBaseline = 'top';
					ctx.textAlign = 'center';
					ctx.font = '20px arial';
					ctx.fillText('flightpower: ', this.x + this.w/2, this.y+20);
					ctx.fillText(ptm.upgrades.flightpower,this.x+this.w/2,this.y+this.h / 2 - 10);
					
					
				}
				
			});
			
			setRenderFunctions('levelmenu', {

				levelicon : function (ctx, scene) {

				    // ALERT! I need a non name way to know the current flightmode
				
				    if(ptm.flightMode === 'raisinBreath'){
						
						ctx.drawImage(img[9], 150,0,150,150,this.x, this.y,150,150);
						
					}else{
					ctx.drawImage(img[9], 0,0,150,150,this.x, this.y,150,150);

					}
				},
				waveselect : function (ctx, scene) {

					//ctx.drawImage(img[9], 0,0,150,150,this.x, this.y,150,150);

					ctx.textBaseline = 'top';
					ctx.fillStyle = '#000000';
					ctx.textAlign = 'center';
					ctx.font = '20px arial';
					ctx.fillText('wave: ' + ptm.playWave, this.x + this.w/2,this.y+this.h/2-10);
					
				}
			});
			
			
			setRenderFunctions('gameOver', {
				
				toast : function(ctx){
					
					ctx.drawImage(img[1],0,0,440,440,this.x,this.y,this.w,this.h);
					
				},
				
				message : function(ctx){
					
					console.log();
					
					ctx.drawImage(img[12],0,200 * (1-Number(ptm.win)),400,200,this.x,this.y,this.w,this.h);
					
				},
				
				tryagain : function(ctx){
					
					//ctx.strokeStyle = '#00ff00';
					//ctx.strokeRect(this.x,this.y,this.w,this.h);
				    ctx.drawImage(img[10], 100,0,100,100,this.x,this.y,this.w,this.h);
				},
				
				menu : function(ctx){
					
					//ctx.strokeStyle = '#00ff00';
					//ctx.strokeRect(this.x,this.y,this.w,this.h);
					ctx.drawImage(img[10], 0,0,100,100,this.x,this.y,this.w,this.h);
				}
				
			});
			
			setRenderFunctions('gamePaused', {
				
				toast : function(ctx){
					
					ctx.drawImage(img[1],0,0,440,440,this.x,this.y,this.w,this.h);
					
				},
				
				message : function(ctx){
					
					//ctx.strokeStyle = '#00ff00';
					//ctx.strokeRect(this.x,this.y,this.w,this.h);
					
					ctx.fillStyle='#ffffff';
					ctx.textBaseline = 'top';
					ctx.textAlign = 'center';
					ctx.font = '70px arial';
					ctx.fillText('PAUSED', this.x + this.w/2, this.y + this.h/2 - 35);
					
				},
				
				menu : function(ctx){
					
					//ctx.strokeStyle = '#00ff00';
					//ctx.strokeRect(this.x,this.y,this.w,this.h);
					
					ctx.drawImage(img[10], 0,0,100,100,this.x,this.y,this.w,this.h);
					
				},
				
				continuegame : function(ctx){
					
					//ctx.strokeStyle = '#00ff00';
					//ctx.strokeRect(this.x,this.y,this.w,this.h);
					ctx.drawImage(img[10], 100,0,100,100,this.x,this.y,this.w,this.h);
					
					
				}
				
				
			});
			
		},

		loadCheck : function () {

			return loadCheck();

		},

		draw : function (appState) {

			draw[appState]();

		},

		setURL : function (url) {

			imageURL = url;

		},

		clearLayer : function (layer) {

			Acetate.draw(layer, function (sheet, ctx) {

				sheet.cls();

			});

		}

	};

}
	());
