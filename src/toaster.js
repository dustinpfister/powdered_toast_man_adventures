/*    
 *    toaster.js
 *
 *    needs: api.js, user_action.js
 *
 *
 *
 *
 *
 */

var toastBar = {
	
	
    x : 650,
    y : 190,
	
	homeX: 550,       // the x position that toaster bar should be at when it is going to be used.    
	restX: 650,       // the x position the toaster bar should go to when it is not needed.
	
	width : 60,
    height : 150,
    setting: 0,       // a value from 0 to 1 where 0 is off, 1 is on, and any value between is approching off/on
    started: false,
    
	// what should be done on each frame tick
    update : function(){
    
	    // drag back the toast bar when the user is not grabing it, or it has started.
        if( (!userAction.active && this.setting > 0) || this.started ){
			
            this.setting -= 0.05;
			
        }
        
		// make sure the toast bar setting does not drop below zero.
        if(this.setting < 0){ this.setting=0;}
    },
    
	slideIn : function(){
		
		if(this.x > this.homeX){
			
			// subtract over ten frames : (restX - homeX) / 10
			this.x -= 10;
			
		}
		
	},
	
	slideOut : function(){
		
		if(this.x < this.restX){
			
			// add over ten frames : (restX - homeX) / 10
			this.x += 10;
			
		}
		
	},
	
    getLeaverPos : function(){
    
        var x,y;
        
        x = this.x + 10;
        // y = this.y + 10 + ( ( this.height - 20 ) * this.setting  );
        
        y = this.y + 10 + ( ( this.height - 40 ) * this.setting  );
        
        return {
            x: x,
            y: y,
            w: 40,
            h: 20
        
        };
        
    },
    
    // what to do when the user drags over the toaster bar
    onDrag : function(x,y){
        
		
        var leaver, 
            ly = y - this.y - 20;
        
        if(userAction.getState().active && !this.started && api.boundingBox(x,y,1,1,this.x,this.y,this.width,this.height)){
        
            
		
            leaver = this.getLeaverPos();
            
            this.setting = ly / (this.height - 40);
            
            if(this.setting < 0){
                this.setting = 0;
            }
            if(this.setting >= 1){
                this.setting = 1;
                this.started = true;
            }
        
		
        }
        
    }
},

// the toaster dial
dial = {
    
    x : 700,          // center x of dial
    y : 430,          // center y of dial
	
	homeX: 580,
	restX: 700,
	
    radius : 50,      // the radius of the dial
    setting : 0.25,   // a value from 0 to 1 that repersents a setiing between a min and max
    heading : 0,      // the curent radian value that should line up with current setting
    //press : false,  // is the user clicking / touching?

    // set heading from setting
    findHeading : function () {
		
        this.heading = Math.PI * .8 + (Math.PI * 1.4 * this.setting);

    },

	slideIn : function(){
		
		if(this.x > this.homeX){
			
			// subtract over ten frames : (restX - homeX) / 10
			this.x -= 12;
			
		}
		
	},
	
	slideOut : function(){
		
		if(this.x < this.restX){
			
			// subtract over ten frames : (restX - homeX) / 10
			this.x += 12;
			
		}
		
	},
	
    // set heading based on dirrection
    onPoint : function (x, y) {

        var angles;
        
        // if the user is pressing and they are pointing inside the dial...
        if (!toastBar.started && userAction.getState().active && api.distance(x, y, this.x, this.y) <= this.radius + 10) {

            // get the angle we need to know
            angles = api.getAngles(this, {
                    x : x,
                    y : y
                });
            
            // if the angle is in the proper range just simply set the heading
            if (angles.angle > Math.PI * .80 || angles.angle < Math.PI * 0.2) {
                
                this.heading = angles.angle;
                
            // else set to min 0 or max 1 depedning on how close the user is pointing to.    
            } else {
                
                // set the heading to min or max
                if (angles.angle > Math.PI * .5) {
                    
                    this.heading = Math.PI * 0.8;
                    
                } else {
                    
                    this.heading = Math.PI * 0.2;
                    
                }
                
            }

            // ajust setting based on heading
            if (this.heading >= Math.PI * 0.8) {
                
                this.setting = (this.heading - Math.PI * 0.8) / (Math.PI * 1.4);
                
            } else {
                
                this.setting = (this.heading + Math.PI * 1.2) / (Math.PI * 1.4);

            }

        }
        
    }
};