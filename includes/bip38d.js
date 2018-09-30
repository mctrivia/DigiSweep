//[pass,pkey]




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

"use strict";
(function(window,undefined){
	window["bip38decode"]=function(privateKey,pass,func) {
		func=func||function(){};
		return new Promise(function(resolve,reject) {					//return promise since execution is asyncronous
			var worker = new Worker('bip38d_worker.js');		//create worker to download and decode json
			worker.addEventListener('message',function(e) {	//wait for workers response
				var data=e.data;
				if (typeof data=="number") {
					func(data);
				} else if (data===false) {
					reject("Bad Password");
				} else {
					resolve(data);
				}
			});
			worker.postMessage([privateKey,pass]);			//start worker working
		
		});
	}

})(window);
