/*


Acetate.setStack(
    {
        defaults:{
            container: 'game_container',
	        x:0,
	        y:0,
	        w:640,
	        h:480
		
        },


        sheets: [
            {sheetID: 'background'},
	        {sheetID: 'foreground'}
        ]

    }	
);

// XXX is it a good idea to draw here? it is only once.
Acetate.draw('background', function(sheet, ctx){
		
		    
    ctx.fillStyle='#2a2a2a';
	ctx.fillRect(0,0,640,480);

});
		
Acetate.appendAll();



*/


var Acetate = (function(){

    var sheets = [],
	
	sheetIndex = {},

    Sheet = function(sheetID, container,x,y,w,h){
	    var i,len,untitled,sv,svLen;
	
	    // make canvas element, and get it's context
	    this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		
		// set basic style
		this.canvas.width = w;
		this.canvas.height = h;
		this.canvas.style.position = 'absolute';
		this.canvas.style.left = x + 'px';
		this.canvas.style.top = y + 'px';
		
		// assign container element
		if(container){
		
		    this.container = document.getElementById(container);
			
		}else{
		
		    this.container = document.body;
		
		}
		
		// assign sheet id
		if(!sheetID){
		
		    i=0, len = sheets.length, untitled=1;
		    while(i < len){
		   
		        if(sheets[i].sheetID.match(/^untitled\d*/g )){
		   
		            untitled++;
		   
		        }
		   
		   
		        i++;
		   
		    }
		
		    this.sheetID = 'untitled' + untitled;
			
		}else{
		
		    this.sheetID = sheetID;
		
		}
		
		// update index
	
	    sheetIndex[this.sheetID] = sheets.length;
	};
	
	Sheet.prototype = {
	
	    append:function(){
		
		    // return out if all ready appended
		    if(!!this.canvas.parentElement || !!this.canvas.parentNode){			
			    return;			
			}
		
		    //console.log(this.container)
		    this.container.appendChild(this.canvas);
		
		},
		
		cls:function(){
		
		    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
		
		}
	
	}


	return {
	
	    // setStack
		setStack : function(aurgs){
		
		    var defaults = 'container,x,y,w,h'.split(','),
			values = [document.body,0,0,320,220],i,len;
		    
			// arguments must be given
			if(!aurgs){
			
			   return;
			
			}
			
		    if(!aurgs.defaults){			
			    aurgs.defaults = {};			
			}
			
			
			// set hard coded defaults for any ungiven defaults
		    i=0,len=defaults.length;
			while(i<len){
			
			    if(!(defaults[i] in aurgs.defaults)){
				
				    aurgs.defaults[defaults[i]] = values[i];
				}
				
			    i++;
				
			}
		
			
			// set up sheets with given values, or defaults
			i=0, len = aurgs.sheets.length;
			
			while(i<len){
			
			    
				var sheetAurgs = {};
				
				sv=0,
				svLen = defaults.length;
				
				while(sv<svLen){
				
				    if(defaults[sv] in aurgs.sheets[i]){
					
					    //console.log(defaults[sv]);
						
						sheetAurgs[ defaults[sv] ] = aurgs.sheets[i][defaults[sv]];
					
					}else{
					
					    sheetAurgs[ defaults[sv] ] = aurgs.defaults[defaults[sv]];
					
					}
					
					sv++;
				
				}
				
			
			
			    if('sheetID' in aurgs.sheets[i]){
				
				    sheetAurgs.sheetID = aurgs.sheets[i].sheetID;
				}
			    
				
			    sheets.push(new Sheet(
				    sheetAurgs.sheetID, 
					sheetAurgs.container, 
					sheetAurgs.x, 
					sheetAurgs.y, 
					sheetAurgs.w, 
					sheetAurgs.	h
			    ));	
			
			    i++;
			}
		
		
		   
		
		},
	
	    // simple addSheet function
	    addSheet : function(sheetID, container, x, y, w, h){
		
		    sheets.push(new Sheet(sheetID, container, x, y, w, h));
		
		},
		
		// run threw all sheets and append all sheets to there containers
		appendAll : function(){
		
		    var i=0, len = sheets.length;
			
			while(i<len){
			
			    sheets[i].append();
			
			    i++;
			}
		
		},
		
		getSheets : function(){
		
		    return sheets;
		
		},
		
		draw : function(sheetID, draw){
		
		
		    // return out if sheetID is not an index or title
		    if(typeof sheetID !== 'number' && typeof sheetID !== 'string'){
		
		        return;
		
		    }
			
			
			// if sheetID is a string get it's index in sheets variable via sheetIndex
			if(typeof sheetID === 'string'){
			
				sheetID = sheetIndex[sheetID]
			
			}
			
			
			
			// draw now, assuming that I now have a valid index for sheets
			draw(sheets[sheetID], sheets[sheetID].context);
			
		}
	
	};

}()); 