function DoTween(pFPS, pCallback)
{
	if(arguments.callee.instance) return arguments.callee.instance;
    arguments.callee.instance = this;
    
	this.tween;
	this.listedAt;
	this.tweenListLength = 0;
	this.tweenList = [];
	this.addedList = {};
	this.callback = pCallback;
	
	DoTween.fps = 60;
	DoTween.sec = 1000;
	DoTween.ignore0 = "ease";
	DoTween.ignore1 = "delay";

	this.tweenObject = function(pObject, pTime, pPropertys, pPropertyID)
	{		
		this.init(pObject, pTime, pPropertys);
	}

	this.tweenObject.prototype.init = function(pObject, pTime, pPropertys, pPropertyID)
	{
		this.parseObject = pObject;
		this.parseTime = pTime;
		this.parsePropertys = pPropertys;

		
		this.tick = 0;
		this.delayTick = 0;
		this.time = 0;
		this.isComplete = false;
		
		this.ease = this.parsePropertys.ease;
		this.delay = this.parsePropertys.delay;
		
		this.property;
		this.propertyID = pPropertyID;	

		this.objectRef = {};
		this.propertyRef = {};
				
		this.cycles = Math.floor((this.parseTime * DoTween.sec) / DoTween.fps);
		
		
 		for(this.property in this.parsePropertys)
		{
			if(this.property != DoTween.ignore0 && this.property != DoTween.ignore1)
			{							
				this.objectRef[this.property] = pObject[this.property];
				this.propertyRef[this.property] = this.parsePropertys[this.property] - this.objectRef[this.property];
			}
		}
	}

	this.tweenObject.prototype.easeIntervalHandler = function()
	{	
		if(this.delay == undefined)
		{			
			for(this.property in this.parsePropertys)
			{				
				if(this.property != DoTween.ignore0 && this.property != DoTween.ignore1)
				{
					if(this.time <= this.parseTime)
					{
						this.time = this.tick / DoTween.fps;
						this.parseObject[this.property] = this.ease(this.time, this.objectRef[this.property], this.propertyRef[this.property], this.parseTime);
					}
					else
					{	
						this.parseObject[this.property] = this.parsePropertys[this.property];
						this.isComplete = true;
					}
				}
			}
				
			this.tick++;
		}
		else
		{			
			if(this.delayTick >= (this.delay * DoTween.fps) | 0)
			{
				this.init(this.parseObject, this.parseTime, this.parsePropertys);
				this.delay = undefined;
			}
			else
			{
				this.delayTick++;
			}	
		}
	}
	
	/*	
	var self = this;
	setInterval( function(){ self.intervalHandler(); }, DoTween.sec / DoTween.fps);
	*/
	
	var self = this;
	
    this.animationLoop = function()
    {
		requestAnimFrame(self.animationLoop);
		self.intervalHandler();
    }
    
   	this.animationLoop();
}

DoTween.prototype.to = function(pObject, pTime, pPropertyList)
{	
	this.listedAt = undefined;
	this.listObject;
	this.propertyID = "";

	for(this.property in pPropertyList)
		this.propertyID += String(this.property);

	for(var i = 0; i < this.tweenListLength; ++i)
	{
		this.listObject = this.tweenList[i];

		if(this.listObject.parseObject == pObject && this.listObject.propertyID == this.propertyID)
			this.listedAt = i;
	}
	
	if(this.listedAt == undefined)
	{
		this.tween = new this.tweenObject(pObject, pTime, pPropertyList, "");
		this.tween.propertyID = this.propertyID;
		
		this.tweenList.push(this.tween);
		this.tweenListLength = this.tweenList.length;
	}
	else
	{
		this.listObject = this.tweenList[this.listedAt];		
		this.listObject.init(pObject, pTime, pPropertyList, this.listObject.propertyID);
	}
}

DoTween.prototype.intervalHandler = function()
{
	for(var i = this.tweenListLength - 1; i > -1; --i)
	{
		this.tween = this.tweenList[i];			
			
	    if(this.tween.isComplete)
	    {
			this.tweenList.splice(i, 1);
			this.tweenListLength = this.tweenList.length;
	    }
		else
		    this.tween.easeIntervalHandler();
	}
	
	if(this.callback != undefined) this.callback();
}

window.requestAnimFrame = (function() 
{
	return window.requestAnimationFrame ||
		   window.webkitRequestAnimationFrame ||
		   window.mozRequestAnimationFrame ||
		   window.oRequestAnimationFrame ||
		   window.msRequestAnimationFrame ||
	       function(/* function */ callback, /* DOMElement */ element) 
	       {
	       		window.setTimeout(callback, 1000/60);
	       };
})();