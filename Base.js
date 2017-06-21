//前台调用
var $ = function(){
	return new Base();
}

//基础库
function Base(){	
	//创建一个数组，保存获取的结点和节点数组,公有化不安全
	this.elements = [];
}

//获取id 节点
Base.prototype.getId=function(id){
	this.elements.push(document.getElementById(id));
	return this;
};

//获取元素节点
Base.prototype.getTagName = function(tag){
	var tags = document.getElementsByTagName(tag);
	for(var i=0;i<tags.length;i++){
		this.elements.push(tags[i]);
	}	
	return this;
};

//获取class节点数组,idName就是用来表示分区div的id
Base.prototype.getClass = function(className,idName){
	var node = null;
	if(arguments.length==2){
		node = document.getElementById(idName);
	}else{
		node = document;
	}
	var all = node.getElementsByTagName('*');
	for(var i=0;i<all.length;i++){
		if(all[i].className==className){
			this.elements.push(all[i]);
		}
	}
	return this;
};


//获取某一个节点,有时候我们只需要获取其中的一个节点
Base.prototype.getElement = function(num){
	var element = this.elements[num];
	this.elements=[];
	this.elements[0]=element;
	return this;
};

//设置css
Base.prototype.css = function (attr,value){
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==1){
			return getStyle(this.elements[i],attr);
		}
		this.elements[i].style[attr]=value;
	}
	return this;
}


//添加class
Base.prototype.addClass=function(className){
	for(var i=0;i<this.elements.length;i++){
		if(!hasClass(this.elements[i],className)){
			this.elements[i].className += ' '+ className;
		}
		
	}
	return this;
};

//移除class
Base.prototype.removeClass = function(className){
	for(var i=0;i<this.elements.length;i++){
		if(hasClass(this.elements[i],className)){
			this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),'');	
		}
		
	}
	return this;
};

//添加link或style的css规则,要小心使用，不能破坏整个css的结构
Base.prototype.addRule = function(num,selectorText,cssText,position){
	var sheet = document.styleSheets[num];
	
	insertRule(sheet,selectorText,cssText,position);
	return this;
};

//移除link或style的css规则
Base.prototype.removeRule=function(num,index){
	var sheet = document.styleSheets[num];
	deleteRule(sheet,index);
	return this;
};

//设置innerHTML
Base.prototype.html = function(str){
	
	for(var i=0;i<this.elements.length;i++){
		if(arguments.length==0){
			return this.elements[i].innerHTML;
		}
		this.elements[i].innerHTML  =str;
	}
	return this;
}

//设置鼠标移入移除方法
Base.prototype.hover = function(over,out){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseover',over);
		addEvent(this.elements[i],'mouseout',out);
	}
	return this;
};

//设置显示
Base.prototype.show = function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = 'block';
	}
	return this;
};

//设置隐藏
Base.prototype.hide = function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = 'none';
	}
	return this;
};

//设置物体居中
Base.prototype.center=function(width,height){
	var top = (getInner().height-250)/2;
	var left = (getInner().width-350)/2;
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.top = top+'px';
		this.elements[i].style.left = left+'px';
	}
	return this;
};

//锁屏功能
Base.prototype.lock=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.width=getInner().width+'px';
		this.elements[i].style.height=getInner().height+'px';
		this.elements[i].style.display='block';
		document.documentElement.style.overflow="hidden";
		
	}
	return this;
};


//解锁功能
Base.prototype.unlock=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='none';
		document.documentElement.style.overflow="auto";
	}
	return this;
};

//触发点击事件
Base.prototype.click = function(fn){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].onclick=fn;
	}
	return this;
}

//触发浏览器窗口事件
Base.prototype.resize = function(fn){
	for(var i=0;i<this.elements.length;i++){
		var element = this.elements[i];
        addEvent(window,'resize',function(){
	              fn();
				if(element.offsetLeft>getInner.width-element.offsetWidth){
					element.style.left = getInner.width-element.offsetWidth+'px';
				}
				if(element.offsetTop>getInner.height-element.offsetHeight){
					element.style.top = getInner.height-element.offsetHeight+'px';
				}
         });
	}
	return this;
};


//拖拽功能
Base.prototype.drag=function(){
	for(var i=0;i<this.elements.length;i++){
		
			addEvent(this.elements[i],'mousedown',function(e){
					
			if(trim(this.innerHTML).length==0)  e.preventDefault();
			
			var _this = this;
			//得到实际的长度,offsetleft是整个物体到左边浏览器的距离
			var diffX = e.clientX-_this.offsetLeft;
			var diffY = e.clientY-_this.offsetTop;
			
			//光标只有在h2区域的时候才能拖拽
			if(e.target.tagName=='H2'){
				addEvent(document,'mousemove',move);
				addEvent(document,'mouseup',up);
			}else{
				removeEvent(document,'mousemove',move);
				removeEvent(document,'mouseup',up);
			}
			
				
		
		    function move(e){
				var left = e.clientX - diffX;
				var top = e.clientY  - diffY;
				//左边拖出浏览器了
				if(left<0){
					left=0;
				}else if(left>getInner().width-_this.offsetWidth){
					left=getInner().width-_this.offsetWidth;
				}
				
				if(top<0){
					top=0;
				}else if(top>getInner().height-_this.offsetHeight){
					top=getInner().height-_this.offsetHeight;
				}
				
				_this.style.left = left + 'px';
				_this.style.top = top + 'px';
				
				//为IE特别设计的
				if(typeof _this.setCapture!='undefined'){
					_this.setCapture();
				}
		    }
			
			function up(){
				removeEvent(document,'mousemove',move);
				removeEvent(document,'mouseup',up);
				this.onmousemove=null;
				this.onmouseup=null;
				//为IE设计的
				if(typeof _this.releaseCapture!= 'undefined'){
					_this.releaseCapture();
				}
			}
		});
	}
	return this;
};