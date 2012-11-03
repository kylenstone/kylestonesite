window.optGlobalModFunc = window.optGlobalModFunc || {};
window.optGlobal = {"f":{}, "v":{}};
window.optg = window.optg || {};
optg.version = "1.25";
//contains the names of the modules
optg.modules = [];
//MODIFY - name of module array in universal module tag
window.optGlobalModules = optg.modules;
//settings object
optg.settings = optg.settings || {};
//global flag - set to false to stop all tests
optg.settings.run=true;
//MODIFY - variable client sets to identify the page
optg.settings.criteria = (typeof(omn_ss_pagetype) == "string") ? omn_ss_pagetype.toLowerCase() : "";
//MODIFY - location in console of global csi
optg.settings.crumb = "Samsung >> Global CSI >> Global CSI";
//variables object
optg.v = optg.v || {};
//functions object
optg.f = optg.f || {};
//experiments object - contains experiments
optg.experiments = {};

optg.f.setRun = function(){
	if(typeof(optimost) != "object"){
		optg.settings.run=false;
	}
	if(window.opGlobalRunning){
		optg.settings.run=false;
	}
	else{
		window.opGlobalRunning=true;
	}
	return optg.settings.run;
}
optg.f.setSettings = function(){
	//domain and path of content
	optg.settings.path = "http://by.optimost.com";
	if(document.location && document.location.protocol && document.location.protocol.toLowerCase().indexOf("https") > -1){
		optg.settings.path = "https://by.essl.optimost.com/by";
	}
	//contains the id of experiments currently running
	optg.settings.currentExperiments=[];
	
	//selector cookie - sets cookie if selector param exists
	optg.settings.selector = {
		"param":"opselect",
		"stage":"qa"
	}
	

	var param = optg.settings.selector.param;
	
	if(optimost.Q[param]){
		optimost.SC(param, optimost.Q[param], null, optimost.SLD());
	}
	var val = optimost.Q[param] || optimost.C[param] || "";
	if(optg.settings.selector.stage == val){
		optg.settings.selector.isStage = true;
	}

}
optg.f.setPageId=function(){
	var pId = optg.settings.criteria;
	var pth = document.location.pathname;

	if(pId == "product page"){
		pId = "product_detail";
	}
	else if(pId == "product marketplace" && pth.indexOf("-buy") > -1){
		pId="product_buy";
	}
	else if(!pId && pth.indexOf("-features") > -1){
		pId="product_features";
	}

	optg.settings.criteria=pId;
}
optg.f.addEvent=function(el,sEvent,fFunction,bBubble){if(sEvent == "load" && typeof(jQuery) != "undefined"){jQuery(document).ready(fFunction);}else{if(!el || typeof(fFunction) !="function") return false;bBubble = bBubble || false;var sEvtType = (window.attachEvent) ? "attach" : (window.addEventListener) ?  "add" : "none";if(sEvtType == "attach"){el.attachEvent("on"+sEvent, fFunction);}else if(sEvtType == "add"){el.addEventListener(sEvent, fFunction, bBubble);}}}
optg.f.addStyle=function(sStyle){var style1=document.createElement('style');style1.setAttribute('type','text/css');var txt1=document.createTextNode(sStyle);if(style1.styleSheet){style1.styleSheet.cssText = txt1.nodeValue;}else {style1.appendChild(txt1);}var h = document.getElementsByTagName("head")[0];if(h && h.appendChild){h.appendChild(style1);}};

//output to firebug console
optg.f.log = function(s){
	if(typeof(console) == "object" && console.log){
		console.log(s);
	}
}
optg.f.executeExperiment=function(objExperiment, id){
	if(!objExperiment || !objExperiment.unique)return;
	
	if(typeof(objExperiment.attribs) == "function"){
		objExperiment.attribs();
	}

	objExperiment.unique = (objExperiment.unique && objExperiment.unique.indexOf("http") == -1) ? optg.settings.path  +  objExperiment.unique : objExperiment.unique;
	
	if(objExperiment.modules){
		if(typeof(objExperiment.modules) == "string"){
			optg.modules.push(objExperiment.modules);
		}
		else{
			for(var i=0; i<objExperiment.modules.length; ++i){
				optg.modules.push(objExperiment.modules[i]);
			}
		}
	}
	
	(function(){
		var _o=optimost;_o.U=objExperiment.unique;
		_o.ST="script";_o.SA={"type":"text/javascript"};_o.B();
		
		if(objExperiment.unique.indexOf(".js") > -1){
			var throttle = objExperiment.throttle || 1000;
			var gum = objExperiment.gum || null;
			var domain = (objExperiment.domain) ? objExperiment.domain : (throttle < 1000) ? optimost.SLD() : null;
			var expire = objExperiment.expire || null;
			_o.R(throttle,  gum,  domain,  expire);
		}
		else{
			var img = new Image();
			img.src = _o.S();
			optg.v.imgArray = optg.v.imgArray || [];
			optg.v.imgArray.push(img);
		}
	})();
	
	optg.settings.currentExperiments.push(id);
	if(optg.settings.selector.isStage){
		optg.f.log(id);
	}
}

//determines if the page identifer matches the experiment page id
optg.f.findMatch=function(criteria, type){
	var isMatch = false;
	if(typeof(criteria) == "string"){
		if(criteria == "*"){
			isMatch = true;
		}
		else if(type == "url"){
			if(document.location.href.indexOf(criteria) > -1){
				isMatch = true;
			}
		}
		else if(type == "path"){
			if(document.location.pathname.indexOf(criteria) > -1){
				isMatch = true;
			}
		}
		else{
			if(criteria == optg.settings.criteria){
				isMatch = true;
			}			
		}
		
	}
	else if(typeof(criteria) == "function"){
		isMatch = criteria();
	}
	else if(typeof(criteria) == "object" && criteria.length){
		for(var i=0; i<criteria.length; ++i){
			isMatch = optg.f.findMatch(criteria[i], type);
			if(isMatch){
				break;
			}
		}
	}
	return isMatch;
}

	
optg.f.setExperiments = function()
{
	//BEGIN Counters
	optg.experiments["c cat"]={
		"crumb":"Counter: Samsung Category Page",
		"unique":"/counter/665/-/3/event.js",
		"criteria":["category", "category subtype"]
	};

	optg.experiments["c product detail"]={
		"crumb":"Counter: Product Detail",
		"unique":"/counter/665/-/16/event.js",
		"criteria":"product_detail"
	};

	optg.experiments["c product feature"]={
		"crumb":"Counter: Product Features",
		"unique":"/counter/665/-/15/event.js",
		"criteria":"product_features"
	};
	
	optg.experiments["c product buy"]={
		"crumb":"Counter: Product Buy",
		"unique":"/counter/665/-/17/event.js",
		"criteria":"product_buy"
	};

	optg.experiments["c compare shop"]={
		"crumb":"Counter: Samsung Category - Clickthru",
		"unique":"/counter/665/-/5/",
		"criteria":function(){
			var run=false;
			if(document.location.pathname.indexOf("/compare") > -1){
				var ar_path = document.location.pathname.split("/")
				if(ar_path && ar_path.length && ar_path[ar_path.length-1] == "compare"){	
					run=true;
				}
			}
			return run;
		},
		"exec":function(){
			//Related to Samsung.com >> Category Pages 
			//add onclick event to search buttons
			optg.f.addEvent(window, "load", function(){
				var ar_li = document.getElementsByTagName("li");
				for(var i=0; i<ar_li.length; ++i){
					if(ar_li[i].className && ar_li[i].className.indexOf("shop-cta") > -1){
						var ar_a = ar_li[i].getElementsByTagName("a");
						for(var b=0; b<ar_a.length; ++b){
							if(ar_a[b].innerHTML.indexOf("Shop") > -1){
								var a_shop = ar_a[b];
								optg.f.addEvent(a_shop, "mousedown", function(){
									window.optrial = window.optrial || {};
									optrial.oplink = "Shop";
									
									optg.f.executeExperiment(optg.experiments["c compare shop"], "c compare shop");
								});
							}
						}
					}
				}
			});
		}
	};

	optg.experiments["c zip search"]={
		"crumb":"Counter: Zip Search",
		"unique":"/counter/665/-/18/",
		"criteria":"product_buy",
		"exec":function(){
			var that=this;
			//add onclick event to store search button
			optg.f.eventClickStore = function(objExp, id){
				return function(){
					optg.f.executeExperiment(objExp, id);
				}
			}
			optg.f.addEvent(window, "load", function(){
				var d_container = document.getElementById("container") || document;
				var ar_a = d_container.getElementsByTagName("a");
				for(var i=0; i<ar_a.length; ++i){
					if(ar_a[i].className == "ps_ProductLocalSellersLocationButtonStyle"){
						optg.f.addEvent(ar_a[i], "mousedown", optg.f.eventClickStore(that, "c search store"));
						break;
					}
				}
			});
		}
	};
	
	optg.experiments["c compare"]={
		"crumb":"Counter: Compare",
		"unique":"/counter/665/-/8/event.js",
		"criteria":function(){
			var run=false;
			if(document.location.pathname.indexOf("/compare") > -1)
			{
				var ar_path = document.location.pathname.split("/")
				if(ar_path && ar_path.length && ar_path[ar_path.length-1] == "compare")
				{	
					run=true;
				}
			}
			return run;
		}
	};
	//END Counters
	
	//BEGIN Experiments
	optg.experiments["product pages"]={
		"crumb":"Samsung.com >> Product Pages",
		"unique":"/trial/665/p/productpages.011/13/content.js",
		"criteria":function(){
			var run=false;
			var pth = document.location.pathname;
			var prod = "";
			if(pth.indexOf("-accessories") > -1){
				run = true;
				prod = "accessories";
			}
			else if(pth.indexOf("/topic/") > -1){
				run = true;
				var arSplit = pth.split("/");
				prod = arSplit[arSplit.length-1];
			}
			else if(pth.indexOf("/video/") > -1){
				run = true;
				prod = "video";
			}
			else if(pth.indexOf("/mobile/") > -1){
				run = true;
				prod = "mobile";
			}
			else if(pth.indexOf("/photography/") > -1){
				run = true;
				prod = "photography";
			}
			else if(pth.indexOf("/computer/") > -1){
				run = true;
				prod = "computer";
			}
			window.optrial = window.optrial || {};
			optrial.opProdTypeAttrib = prod;
			return run;			
		},
		"modules":"product"
	};
	//END Experiments
}

optg.f.setRun();
if(optg.settings.run){
	optg.f.setSettings();
	optg.f.setPageId();
	optg.f.setExperiments();
	for(var id in optg.experiments){
		if(!optg.experiments[id].off){
			if(optg.experiments[id].below){
				if(optg.experiments[id].below.style_show){
					optg.f.addEvent(window, "load", function(style){return function(){
						optg.f.addStyle(style)
					}}(optg.experiments[id].below.style_show));
				}
				if(optg.experiments[id].below.style_hide){
					optg.f.addStyle(optg.experiments[id].below.style_hide);
				}
				var mod = "bottom_execute_" + id;
				optg.modules.push(mod);
				optimost.addModule(mod, function(exp, eid){return function(){
					if(optg.f.findMatch(exp.criteria, exp.type)){
						optg.f.executeExperiment(exp, eid);
					}
				}}(optg.experiments[id], id));
			}
			else{
				if(optg.f.findMatch(optg.experiments[id].criteria, optg.experiments[id].type)){
					if(optg.experiments[id].exec){
						optg.experiments[id].exec();
					}
					else{
						optg.f.executeExperiment(optg.experiments[id], id);
					}
				}
			}
		}
	}
}