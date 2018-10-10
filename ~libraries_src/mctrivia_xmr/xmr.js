/* _____                       _       _     _     ___   ___  __  ___  
  / ____|                     (_)     | |   | |   |__ \ / _ \/_ |/ _ \ 
 | |     ___  _ __  _   _ _ __ _  __ _| |__ | |_     ) | | | || | (_) |
 | |    / _ \| '_ \| | | | '__| |/ _` | '_ \| __|   / /| | | || |> _ < 
 | |___| (_) | |_) | |_| | |  | | (_| | | | | |_   / /_| |_| || | (_) |
  \_____\___/| .__/ \__, |_|  |_|\__, |_| |_|\__| |____|\___/ |_|\___/ 
             | |     __/ |        __/ |                                
             |_|    |___/        |___/  
Copyright 2018 Matthew Cornelisse.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in the
Software without restriction, including without limitation the rights to use, copy, 
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to do so, subject to the 
following conditions:

The above copyright notice and this permission notice shall be included in all copies 
or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* _____                _    _____ _       _           _  __      __        _       _     _           
  / ____|              (_)  / ____| |     | |         | | \ \    / /       (_)     | |   | |          
 | (___   ___ _ __ ___  _  | |  __| | ___ | |__   __ _| |  \ \  / /_ _ _ __ _  __ _| |__ | | ___  ___ 
  \___ \ / _ \ '_ ` _ \| | | | |_ | |/ _ \| '_ \ / _` | |   \ \/ / _` | '__| |/ _` | '_ \| |/ _ \/ __|
  ____) |  __/ | | | | | | | |__| | | (_) | |_) | (_| | |    \  / (_| | |  | | (_| | |_) | |  __/\__ \
 |_____/ \___|_| |_| |_|_|  \_____|_|\___/|_.__/ \__,_|_|     \/ \__,_|_|  |_|\__,_|_.__/|_|\___||___/
*/
	var buffer=[];														//buffer of waiting downloads
	var running=[];														//list of running jobs
	var maxRequests=5;													//max requests to download at once
	var requestID=0;													//request id number
	var urlSuffix='';
	
/*_____       _                        _   ______                _   _                 
 |_   _|     | |                      | | |  ____|              | | (_)                
   | |  _ __ | |_ ___ _ __ _ __   __ _| | | |__ _   _ _ __   ___| |_ _  ___  _ __  ___ 
   | | | '_ \| __/ _ \ '__| '_ \ / _` | | |  __| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
  _| |_| | | | ||  __/ |  | | | | (_| | | | |  | |_| | | | | (__| |_| | (_) | | | \__ \
 |_____|_| |_|\__\___|_|  |_| |_|\__,_|_| |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
*/
	var startBufferIfSpace=function() {								//function to start jobs when necisary
		(function(idNumber) {											//anonymous function to maintain id number
			if ((running["length"]<maxRequests)&&(buffer["length"]>0)) {	//check if room in buffer and pending request
				var next=buffer["shift"]();								//remove first item from buffer
				const RESOLVE=0,REJECT=1;
				var finish=function(type,data) {
					for (var promise of next.promise) {
						promise[type](data);
					}
				}
				next.id=idNumber;										//store request id number
				next.xmr=new XMLHttpRequest();							//setup http request
				next.xmr["open"](next.type, urlSuffix+next.url, true);	//set url of file to get
				if (next.type=="POST") {
					next.xmr['setRequestHeader']("Content-Type", "application/json");//show using json
				}
				next.xmr["onload"] = function() {						//run when data is returned
					for (var index in running) {						//go through each running request
						if (running[index].id==idNumber) running.splice(index,1);//if index of request matches current request then remove from list
					}
					if (next.xmr["status"] == 200) {					//make sure no error code wasn't returned
						finish(RESOLVE,next.xmr["response"]);			//decode returned string into json data
					} else {											//error code wasn't 200 so soething when wrong
						finish(REJECT,"Unxpected Error");				//reject promise and return error message
					}
					startBufferIfSpace();								//start buffer if space
					return;
				};
				next.xmr["onerror"] = function() {						//handle network errors that may result in data not being returned
					for (var index in running) {						//go through each running request
						if (running[index].id==idNumber) running.splice(index,1);//if index of request matches current request then remove from list
					}
					return finish(REJECT,"Network Error");				//return error message
				}
				next.xmr["onabort"] = function() {						//handle abort events
					for (var index in running) {						//go through each running request
						if (running[index].id==idNumber) running.splice(index,1);//if index of request matches current request then remove from list
					}
					return finish(REJECT,"Canceled");					//return error message
				}
				running["push"](next);									//add to running list
				next.xmr["send"]((typeof next.data=="object")?JSON.stringify(next.data):next.data);							//send request for data
				startBufferIfSpace();									//start another buffer if still space 
			}
		})(++requestID);											//call function with request id
	};
	var addRequest=function(url,name,type,data) {					//function to add request to buffer
		return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
			var added=false;											//set variable so we know when it is added
		
			//check if already in buffer or running
			if (type!="POST") {											//no caches for post requests so don't even look if already callinf
				for (var bufferItem of buffer) {						//go through each call in buffer
					if (bufferItem.url==url) {							//check if url matches current request
						bufferItem.promise["push"]([resolve,reject]);	//add promise function to the request
						added=true;										//mark that we already added request
						break;											//don't check rest of buffer
					}					
				}
				if (!added) {											//don't add if already added
					for (var runningItem of running) {					//go through each call in buffer
						if (runningItem.url==url) {						//check if url matches current request
							runningItem.promise["push"]([resolve,reject]);//add promise function to the request
							added=true;									//mark that we already added request
							break;										//don't check rest of buffer
						}					
					}
				}
			}
			
			//if not already added then add to end of request
			if (!added) {												//don't add if already added
				buffer["push"]({										//build request
					url:	url,										//add url
					name:	name||"",									//add name
					promise:[[resolve,reject]],							//add promise functions
					type:	type,										//add type value
					data:	data										//add data value
				});
			}
			startBufferIfSpace();										//start buffer if space 
		});
	};
	
	
	var addJSON=function(url,name,type,data) {						//function to deal with json data
		return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
			addRequest(url,name,type,data).then(function(data) {		//make request
				var decodedJSON=JSON["parse"](data);					//decode returned string into json data
				if (decodedJSON===null) {								//check if data was valid json data
					console["log"]("Invalid JSON",data);				//put invalid data to debug log
					reject("Invalid JSON");								//reject since not not valid json
				} else {												//data was valid
					resolve(decodedJSON);								//resolve the promise
				}
			},reject);													//continue reject if request failed
		});
	};
	
	
/* _____ _           _         _____                            _       
  / ____| |         (_)       |  __ \                          | |      
 | |    | |__   __ _ _ _ __   | |__) |___  __ _ _   _  ___  ___| |_ ___ 
 | |    | '_ \ / _` | | '_ \  |  _  // _ \/ _` | | | |/ _ \/ __| __/ __|
 | |____| | | | (_| | | | | | | | \ \  __/ (_| | |_| |  __/\__ \ |_\__ \
  \_____|_| |_|\__,_|_|_| |_| |_|  \_\___|\__, |\__,_|\___||___/\__|___/
                                             | |                        
                                             |_|     
*/
	var chain=function(command,url,name,perFunction,type,data) {
		if (typeof url=="string") return command(url,name,type,data);	//if only requesting 1 function then just return commands promise
		return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
			var left=1;													//create a counter of how many to wait for.  start at 1 incase functions execute syncronously
			var results=Array.isArray(url)?[]:{};						//create same type as url to store results
			var done=function() {										//internal function to check if we are done and store results
				if (--left==0) return resolve(results);					//if done then resolve promise
			}			
			for (var index in url) {									//go through each url in array/promise
				left++;													//mark that we are waiting for 1 more command
				(function(index,url) {									//anonymous function to keep the index and current url values when command returns
					command(url,name,type,data).then(function(data) {	//execute command
						results[index]=data;							//store resutls
						(perFunction||function(){})(data,index,url,name);//fire per function if exists
						done();											//check if done
					},reject);											//if anything whent wrong then reject the entire promise
				})(index,url[index]);									//provide index and url to anonymous function
			}
			done();														//just incase everything ran syncronously check again
		});
	}
	
	
/*______      _                        _   ______                _   _                 
 |  ____|    | |                      | | |  ____|              | | (_)                
 | |__  __  _| |_ ___ _ __ _ __   __ _| | | |__ _   _ _ __   ___| |_ _  ___  _ __  ___ 
 |  __| \ \/ / __/ _ \ '__| '_ \ / _` | | |  __| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 | |____ >  <| ||  __/ |  | | | | (_| | | | |  | |_| | | | | (__| |_| | (_) | | | \__ \
 |______/_/\_\\__\___|_|  |_| |_|\__,_|_| |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
*/
	var setMax=function(max) {										//function to set max simultanious requests
		maxRequests=max;												//set max requests
		startBufferIfSpace();											//start buffer if space 
	};
	var cancelRequest=function(name) {								//function to cancel request from buffer
		var i=buffer["length"];											//set index of buffer length
		var rejects=[];													//make list of reject functions we need to execute
		while (i-->0) {													//go through each item in buffer in reverse
			if (buffer[i].name==name) {									//check if buffer entry should be removed
				rejects["push"](buffer[i].reject);						//make note of reject functions for force quit requests
				buffer["splice"](i,1);									//remove entry
			}
		}
		for (var curRunnning of running) {								//go through each item in running 
			if (curRunnning.name==name) {								//check if buffer entry should be removed
				curRunnning.xmr["abort"]();								//cancel file download will execute 
			}
		}
		for (var reject of rejects) reject("Canceled");					//run all the rejects for deleted functions
		startBufferIfSpace();											//start buffer if space 
	};
	var addGetJSON=function(url,name,perFunction) { 				//wrapper function to add a get request that returns processes JSON data
		return chain(addJSON,url,name,perFunction,"GET");				//run through chain function incase user gave array or object for url
	};
	var addGet=function(url,name,perFunction) {						//wrapper function to add a get request
		return chain(addRequest,url,name,perFunction,"GET");			//run through chain function incase user gave array or object for url
	};
	var addPostJSON=function(url,data,name,perFunction) {			//wrapper function to add a post request that returns processes JSON data
		return chain(addJSON,url,name,perFunction,"POST",data);			//run through chain function incase user gave array or object for url
	};
	var addPost=function(url,data,name,perFunction) {				//wrapper function to add a post request
		return chain(addRequest,url,name,perFunction,"POST",data);		//run through chain function incase user gave array or object for url
	};
	var setSuffix=function(suffix) {
		urlSuffix=suffix||"";
	}
	
	window["xmr"]={
		"setMax":	setMax,
		"setSuffix":setSuffix,
		"setServer":setSuffix,
		"getJSON":	addGetJSON,
		"getJson":	addGetJSON,
		"get":		addGet,
		"postJSON":	addPostJSON,
		"postJson":	addPostJSON,
		"post":		addPost,
		"cancel":	cancelRequest
	};
