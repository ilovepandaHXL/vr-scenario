(function(){
	setPerc();
	setLoading();
})();

function setPerc(){
	setView();
	window.onresize = setView;
	function setView(){
		var view = document.getElementById("view");
		var main = document.getElementById("main");
		var height = view.clientHeight;
		var deg = 52.5;
		var R = Math.round(Math.tan(deg*Math.PI/180)*(height/2));
		view.style.perspective = view.style.WebkitPerspective = R + "px";
		css(main,"translateZ",R);
	};
}

document.addEventListener("touchstart",function(ev){
	ev.preventDefault();
});
//图片预加载进度
function setLoading(){
	var logoText = document.getElementsByClassName("logoText")[0];
	var data = [];
	var nub = 0;
	for( var attr in imgData ){
		for( var i = 0;i<imgData[attr].length;i++ ){
			data.push( imgData[attr][i] );
		}
	}
	for(var i = 0;i<data.length;i++){
		var img = new Image();
		img.src = data[i];
		img.onload = function(){
			nub++;
			logoText.innerHTML = "已加载: "+Math.floor(nub/data.length*100)+"%";
			if( nub == data.length ){//图片全部加载完成；
				anmt();
			}
		}
	}
}

//隐藏loading动画，让logo2开始显示出来
function anmt(){
	var view = document.getElementById("view");
	var logo1 = document.getElementById("logo1");
	var logo2 = document.createElement("div");
	var logo3 = document.createElement("div");
	var img = new Image();
	var img2 = new Image();
	img.src = imgData.logo[0];
	img2.src = imgData.logo[1];
	logo2.id = "logo2";
	logo2.className = "logoImg";
	logo2.appendChild(img);
	logo3.id = "logo3";
	logo3.className = "logoImg";
	logo3.appendChild(img2);
	css(logo2,"translateZ",-1000);
	css(logo3,"translateZ",-1000);
	css(logo2,"opacity",0);
	css(logo3,"opacity",0);
	view.appendChild(logo2);
	view.appendChild(logo3);
	MTween({
		el: logo1,
		target: {
			opacity: 0
		},
		time: 800,
		type: "easeOut",
		callBack: function(){
			view.removeChild(logo1);
			css(logo2,"opacity",100);
			MTween({
				el: logo2,
				target: {
					translateZ: 0
				},
				time: 300,
				type: "easeBoth",
				callBack: anmt2
			})
		}
	});
}

//隐藏logo2,开始显示logo3；
function anmt2(){
	var logo3 = document.getElementById("logo3");
	var view = document.getElementById("view");
	setTimeout(function(){
		MTween({
			el: logo2,
			target: {
				translateZ: -1000
			},
			time: 800,
			type: "linear",
			callBack: function(){
				setTimeout(function(){
					view.removeChild(logo2);
					css(logo3,"opacity",100);
					MTween({
						el: logo3,
						target: {
							translateZ: 0
						},
						time: 300,
						type: "easeBoth",
						callBack: anmt3
					})
				},300)
			}
		})
	},2000);
}

//隐藏logo3,显示爆炸效果
function anmt3(){
	var view = document.getElementById("view");
	var logo3 = document.getElementById("logo3");
	setTimeout(function(){
		MTween({
			el: logo3,
			target: {
				translateZ: -2000
			},
			time: 1500,
			type: "easeIn",
			callBack: function(){
				view.removeChild(logo3);
				anmt4();
			}
		})
	},1000)
}

//logo4的爆炸
function anmt4(){
	var view = document.getElementById("view");
	var logo4 = document.createElement("div");
	var logoIcos = document.createElement("div");
	var logo4Img = new Image();
	var iconsLength = 27;
	logo4.id = "logo4";
	logoIcos.id = "logoIcos";
	
	logo4Img.src = imgData.logo[2];
	logo4Img.id = "logo4Img";
	for( var i = 0;i<iconsLength;i++ ){
		var span = document.createElement("span");
		var xR = 50 + Math.round(Math.random()*200);
		var xdeg = Math.round((Math.random()-0.5)*360);
		var yR = 50 + Math.round(Math.random()*200);
		var ydeg = i*(360/iconsLength) + Math.round((Math.random()-0.5)*20);
		css(span,"rotateY",xdeg);
//		css(span,"translateZ",xR);
		css(span,"translateZ",xR);
		css(span,"rotateX",ydeg);
		css(span,"translateY",yR);
		span.style.backgroundImage = "url("+imgData.logoIco[i%imgData.logoIco.length]+")";
		logoIcos.appendChild(span);
	}
	css(logo4,"scale",0);
	logo4.appendChild(logoIcos);
	logo4.appendChild(logo4Img);
	view.appendChild(logo4);
	setTimeout(function(){
		MTween({
			el: logo4,
			target: {
				scale: 100
			},
			time: 800,
			type: "easeOutStrong",
			callBack: function(){
				setTimeout(function(){
					MTween({
						el: logo4,
						target: {
							translateZ: -1000,
							scale: 0
						},
						time: 2000,
						type: "easeOutStrong",
						callBack: function(){
							view.removeChild(logo4);
							anmt5();
						}
					})
				},2000);
			}
		})
	},1000);
}

//主体入场动画
function anmt5(){
	var tZ = document.getElementById("tZ");
	css(tZ,"translateZ",-2000);
	anmt7();
	anmt6();
	createPano();
	MTween({
		el: tZ,
		target: {
			translateZ: -160
		},
		time: 3600,
		type: "easeBoth"	
	})
}

//生成主题背景圆柱体入场
function anmt6(){
	var panoBg = document.getElementById("panoBg");
	var width = 129;
	var deg = 360/imgData.bg.length;
	var R = parseInt(Math.tan(((180-deg)/2)*Math.PI/180)*(width/2))-1;
//	console.log(R);
	var startDeg = 180;
	css(panoBg,"rotateX",0);
	css(panoBg,"rotateY",-695);
	console.log(imgData.bg.length);
	for( var i = 0;i<imgData.bg.length;i++ ){
		var span = document.createElement("span");
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		span.style.backgroundImage = "url("+imgData.bg[i]+")";
		span.style.display = "none";
		panoBg.appendChild(span);
		startDeg -= deg;
	}
	var nub = 0;
	var timer = setInterval(function(){
		panoBg.children[nub].style.display = "block";
		nub ++;
		if( nub >= panoBg.children.length ){
			clearInterval(timer);
		}
	},3600/2/20);
	
	MTween({
		el: panoBg,
		target: {
			rotateY: 25
		},
		time: 3600,
		type: "linear",
		callBack: function(){
			setDrag();
			setSensors();
		}
	})
}

//生成云朵以及云朵入场
function anmt7(){
	var cloud = document.getElementById("cloud");
	css(cloud,"translateZ",-400);
	for(var i = 0;i<9;i++){
		var span = document.createElement("span");
		span.style.backgroundImage = "url("+imgData.clound[i%3]+")";
		var R = 200+Math.random()*150;
		var deg = (360/9)*i;
		var x = Math.sin(deg*Math.PI/180)*R;
		var z = Math.cos(deg*Math.PI/180)*R;
		var y = (Math.random()-0.5)*200; 
		css(span,"translateX",x);
		css(span,"translateY",y);
		css(span,"translateZ",z);
		span.style.display = "none";
		cloud.appendChild(span);
	}
	var nub = 0;
	var timer = setInterval(function(){
		cloud.children[nub].style.display = "block";
		nub++;
		if( nub >= cloud.children.length ){
			clearInterval(timer);
		}
	},50);
	MTween({
		el: cloud,
		target: {
			rotateY: 540
		},
		time: 3500,
		type: "easeBoth",
		callIn: function(){
			var deg = -css(cloud,"rotateY");
			for( var i = 0;i<cloud.children.length;i++ ){
				css( cloud.children[i],"rotateY",deg );
			}
		},
		callBack: function(){
			cloud.parentNode.removeChild(cloud);
			bgShow();
		}
	});
}

//主体圆柱区添加滑屏滚动
function setDrag(){
	var panoBg = document.getElementById("panoBg");
	var pano = document.getElementById("pano");
	
	var tZ = document.getElementById("tZ");
	var startPoint = {x:0,y:0};
	var panoBgDeg = {x:0,y:0};
	var scale = {x:129/18,y:1170/30};
	var startZ = css(tZ,"translateZ");
	var lastDeg = {x:0,y:0};
	var lastDis = {x:0,y:0};  
	var isMove = false;
	document.addEventListener("touchstart",function(ev){
		window.isTouch = true;
		clearInterval(tZ.timer);
		clearInterval(panoBg.timer);
		clearInterval(pano.timer);
		startPoint.x = ev.changedTouches[0].pageX;
		startPoint.y = ev.changedTouches[0].pageY;
		
		panoBgDeg.x = css(panoBg,"rotateY");
		panoBgDeg.y = css(panoBg,"rotateX");
		
		lastDeg.x = css(panoBg,"rotateY");
		console.log(panoBgDeg);
	});
	document.addEventListener("touchmove",function(ev){
		isMove = true;
		var nowDeg = {};
		var nowDeg2 = {};
		var nowPoint = {};
		
		nowPoint.x = ev.changedTouches[0].pageX;
		nowPoint.y = ev.changedTouches[0].pageY;
		var dis = {};
//		console.log(dis);
		dis.x = nowPoint.x - startPoint.x;
		dis.y = nowPoint.y - startPoint.y;
		var disDeg = {};
			
		disDeg.x = -dis.x/scale.x;
		disDeg.y = dis.y/scale.y;
		
		nowDeg.y = panoBgDeg.y + disDeg.y;
		nowDeg.x = panoBgDeg.x + disDeg.x;
		nowDeg2.y = panoBgDeg.y + disDeg.y*0.75;
		nowDeg2.x = panoBgDeg.x + disDeg.x*0.75;
		
		if( nowDeg.y>40 ){
			nowDeg.y = 40;
		}else if( nowDeg.y<-40 ){
			nowDeg.y = -40;
		}
		
		lastDis.x = nowDeg.x - lastDeg.x;
		lastDeg.x = nowDeg.x; 
		
		css(panoBg,"rotateY",nowDeg.x); 
		css(panoBg,"rotateX",nowDeg.y);
		css(pano,"rotateX",nowDeg2.y);
		css(pano,"rotateY",nowDeg2.x); 
		
		var disZ = Math.max(Math.abs(dis.x),Math.abs(dis.y));
		if( disZ>300 ){
			disZ = 300;
		}
		css(tZ,"translateZ",startZ - disZ);
	});
	document.addEventListener("touchend",function(){
		if(isMove == false){
			return;
		}
		isMove = false;
		console.log(lastDis.x);
		var nowDeg = css(panoBg,"rotateY");
		var disDeg = (lastDis.x)*15;
		if(!disDeg){
			return;
		}
		MTween({
			el: tZ, 
			target: {
				translateZ: startZ
			},
			time: 800,
			type: "easeOut"
		});
		MTween({
			el: panoBg,
			target: {
				rotateY: nowDeg+disDeg,
			},
			time: 800,
			type: "easeOut"
		});
		MTween({
			el: pano,
			target: {
				rotateY: nowDeg+disDeg,
			},
			time: 800,
			type: "easeOut",
			callBack: function(){
				window.isTouch = false;
				window.isStart = false;
			}
		})
	});
}
//手机陀螺仪设置；
function setSensors(){
	var panoBg = document.getElementById("panoBg");
	var pano = document.getElementById("pano");
	var tZ = document.getElementById("tZ");
	var last = {x:0,y:0};
	var start = {};
	var now = {};
	var startEl = {};
	var lastTime = Date.now();
	var scale = 129/18;
	var startZ = -160;
	var dir = window.orientation;
	window.isTouch = false;
	window.isStart = false;
	window.addEventListener("orientationchange",function(ev){
		dir = window.orientation;
	});
	window.addEventListener('deviceorientation', function(e) {
		if(window.isTouch){
			return;
		}
		switch(dir){
			case 0:
				var x = Math.round(e.beta);
				var y = Math.round(e.gamma);
				break;
			case 180:
				var x = -Math.round(e.beta);
				var y = -Math.round(e.gamma);
				break;
			case 90:
				var y = Math.round(e.beta);
				var x = Math.round(e.gamma);
			case -90:
				var y = -Math.round(e.beta);
				var x = -Math.round(e.gamma);
		}
		var nowTime = Date.now();
		if( nowTime - lastTime<30 ){
			return;
		};
		lastTime = nowTime;
		if(!isStart){
			isStart = true;
			start.x = x;
			start.y = y;
			startEl.x = css(panoBg,"rotateX");
			startEl.y = css(panoBg,"rotateY");
			
		}else{
			now.x = x;
			now.y = y;
			var dis = {};
			dis.x = now.x - start.x;
			dis.y = now.y - start.y;
			var deg = {};
			deg.x = startEl.x + dis.x;
			deg.y = startEl.y + dis.y;
			
			if( deg.x>40 ){
				deg.x = 40;
			}else if(deg.x<-40){
				deg.x = -40;
			}
			var disYZ = Math.abs(Math.round((deg.y - css(pano,"rotateY"))*scale));
			var disXZ = Math.abs(Math.round((deg.x - css(pano,"rotateX"))*scale));
			var disZ = Math.max(disYZ,disXZ);
			if( disZ>300 ){
				disZ = 300;
			}
			MTween({
				el: tZ,
				target:{
					translateZ: startZ - disZ
				},
				time: 300,
				type: "easeOut",
				callBack: function(){
					MTween({
						el: tZ,
						target:{
							translateZ: -160
						},
						time: 400,
						type: "easeOut",
					});
				}
			});
			MTween({
				el: pano,
				target: {
					rotateX: deg.x,
					rotateY: deg.y
				},
				time: 800,
				type: "easeOut"
			});
			MTween({
				el: panoBg,
				target: {
					rotateX: deg.x,
					rotateY: deg.y
				},
				time: 800,
				type: "easeOut"
			});
		}
	});
}
//背景显示
function bgShow(){
	var pageBg = document.getElementById("pageBg");
	console.log(pageBg);
	MTween({
		el: pageBg,
		target: {
			opacity: 100
		},
		time: 1000,
		type: "easeBoth"
	});
}

//漂浮层
function createPano(){
	var pano = document.getElementById("pano");
	console.log(pano);
	var deg = 18;
	var R = 406;
	var startDeg = 180;
	var nub = 0;
	css(pano,"rotateX",0);
	css(pano,"rotateY",-180);
	css(pano,"scale",0);
	
	var pano1 = document.createElement("div");
	pano1.className = "pano";
	css(pano1,"translateX",1.564);
	css(pano1,"translateZ",-9.877);
	for( var i = 0;i<2;i++ ){
		var span = document.createElement("span");
		span.style.cssText = "height: 344px;margin-top: -172px";
		span.style.backgroundImage = "url("+imgData.pano[nub]+")";
		css(span,"translateY",-163);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		pano1.appendChild(span);
		startDeg -= deg;
	}
	pano.appendChild(pano1);
	
	var pano2 = document.createElement("div");
	pano2.className = "pano";
	css(pano2,"translateX",20.225);
	css(pano2,"translateZ",-14.695);
	for( var i = 0;i<3;i++ ){
		var span = document.createElement("span");
		span.style.cssText = "height: 344px;margin-top: -172px";
		span.style.backgroundImage = "url("+imgData.pano[nub]+")";
		css(span,"translateY",278);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		pano2.appendChild(span);
		startDeg -= deg;
	}
	pano.appendChild(pano2);
	
	var pano3 = document.createElement("div");
	css(pano3,"translateX",22.275);
	css(pano3,"translateZ",-11.35);
	pano3.className = "pano";
	for( var i = 0;i<4;i++ ){
		var span = document.createElement("span");
		span.style.cssText = "height: 195px;margin-top: -97.5px";
		span.style.backgroundImage = "url("+imgData.pano[nub]+")";
		css(span,"translateY",192.5);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		pano3.appendChild(span);
		startDeg -= deg;
	}
	pano.appendChild(pano3);
	
	var pano4 = document.createElement("div");
	startDeg = 90;
	css(pano4,"translateX",20.225);
	css(pano4,"translateZ",14.695);
	pano4.className = "pano";
	for( var i = 0;i<5;i++ ){
		var span = document.createElement("span");
		span.style.cssText = "height: 468px;margin-top: -234px";
		span.style.backgroundImage = "url("+imgData.pano[nub]+")";
		css(span,"translateY",129);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		pano4.appendChild(span);
		startDeg -= deg;
	}
	pano.appendChild(pano4);
	
	var pano5 = document.createElement("div");
	startDeg = 18;
	css(pano5,"translateX",-11.35);
	css(pano5,"translateZ",22.275);
	pano5.className = "pano";
	for( var i = 0;i<6;i++ ){
		var span = document.createElement("span");
		span.style.cssText = "height: 582px;margin-top: -291px";
		span.style.backgroundImage = "url("+imgData.pano[nub]+")";
		css(span,"translateY",256);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-(R-1));
		nub++;
		pano5.appendChild(span);
		startDeg -= deg;
	}
	pano.appendChild(pano5);
	
	var pano6 = document.createElement("div");
	startDeg = 18;
	css(pano6,"translateX",-4.54);
	css(pano6,"translateZ",8.91);
	pano6.className = "pano";
	for( var i = 0;i<6;i++ ){
		var span = document.createElement("span");
		span.style.cssText = "height: 444px;margin-top: -222px";
		span.style.backgroundImage = "url("+imgData.pano[nub]+")";
		css(span,"translateY",13);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-(R-1));
		nub++;
		pano6.appendChild(span);
		startDeg -= deg;
	}
	pano.appendChild(pano6);
	
	setTimeout(function(){
		var time = 200;
		MTween({
			el: pano,
			target: {
				rotateY: 25,
				scale: 100
			},
			time: 1200,
			type: "easeBoth",
		});
	},2800);
}
