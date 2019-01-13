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
(function(window,document,undefined){
	const MAX_REQUESTS=4;													//max number of concurent requests to explorer server
	const MAX_UNUSED=2;													//bip39 giveup point recomend 20
	const SEND_MIN=0.0007;													//minimum amount that can be sent to an address
	
	
/*     _  _____  ____  _   _   _____                            _   
      | |/ ____|/ __ \| \ | | |  __ \                          | |  
      | | (___ | |  | |  \| | | |__) |___  __ _ _   _  ___  ___| |_ 
  _   | |\___ \| |  | | . ` | |  _  // _ \/ _` | | | |/ _ \/ __| __|
 | |__| |____) | |__| | |\  | | | \ \  __/ (_| | |_| |  __/\__ \ |_ 
  \____/|_____/ \____/|_| \_| |_|  \_\___|\__, |\__,_|\___||___/\__|
                                             | |                    
                                             |_|   
Has been moved to xmr.js 
*/
	xmr.setMax(MAX_REQUESTS);
	var setServer=function() {
		xmr.setServer(document.getElementById('server').value);	
	}
	document.getElementById('server').addEventListener('change',setServer);
	setServer();

	
/*_          ___           _                  _____           _                 
 \ \        / (_)         | |                / ____|         | |                
  \ \  /\  / / _ _ __   __| | _____      __ | (___  _   _ ___| |_ ___ _ __ ___  
   \ \/  \/ / | | '_ \ / _` |/ _ \ \ /\ / /  \___ \| | | / __| __/ _ \ '_ ` _ \ 
    \  /\  /  | | | | | (_| | (_) \ V  V /   ____) | |_| \__ \ ||  __/ | | | | |
     \/  \/   |_|_| |_|\__,_|\___/ \_/\_/   |_____/ \__, |___/\__\___|_| |_| |_|
                                                     __/ |                      
                                                    |___/ 
*/
	var domShadow=document['getElementById']('shadow');
	var closeWindows=function(shadow) {
		var windows=document['getElementsByClassName']('window');				//get all windows
		for (var i=0; i<windows['length']; i++) {								//go through each window
			windows[i]['style']['display']='none';								//make window invisible
		}
		if (shadow===true) domShadow['style']['display']='none';				//close shadow if set
	}
	var openWindow=function(windowType) {
		closeWindows();															//close all windows
		document['getElementById']("window_"+windowType)['style']['display']='block';//open the window associated with button pressed
		domShadow['style']['display']='block';									//open shadow
	}
	var domClose=document.getElementsByClassName("close");				//get all dom items using class next
	for (var i=0; i<domClose.length; i++) {								//go through each dom element with class "next"
		domClose[i].addEventListener('click', function() {closeWindows(true)}, false);			//attach click listener to execute closeWindows function
	}
			
	
	
/*____             _         ___   _           _     ____        _   _              
 |  _ \           | |       / / \ | |         | |   |  _ \      | | | |             
 | |_) | __ _  ___| | __   / /|  \| | _____  _| |_  | |_) |_   _| |_| |_ ___  _ __  
 |  _ < / _` |/ __| |/ /  / / | . ` |/ _ \ \/ / __| |  _ <| | | | __| __/ _ \| '_ \ 
 | |_) | (_| | (__|   <  / /  | |\  |  __/>  <| |_  | |_) | |_| | |_| || (_) | | | |
 |____/ \__,_|\___|_|\_\/_/   |_| \_|\___/_/\_\\__| |____/ \__,_|\__|\__\___/|_| |_|
	 
	To use add clickable item to dom with 
		class="next"
		page="pages div id"
		val="optional string to send to function"
		
	Add a div with class="page" to represent the page data
	If you want code to be executed when the button is clicked add
	$PAGE["page_div_id"]={
		valid: function(val) {
			return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
				
			});
		}, 
		load: function(val) {
			//code goes here on page loaded by next button
		},
		reload: function(val) {
			//code goes here on page loaded by back button
		}
	}
	
	
 */
	var error=function(e) {
		openWindow('error');
		console.log(e);
		document.getElementById('errorMessage').innerHTML=e;
	}
		
	var domNext=document.getElementsByClassName("next");				//get all dom items using class next
	var domBack=document.getElementsByClassName("back");				//get all dom items using class next
	var domPage=document.getElementsByClassName("page");				//get all dom items using class page
	var $PAGE=[];														//make up an array for page functions
	var loadPage=function(page) {										//function to be executed when something with class "next" is clicked
		/* *********************
		*  1) Intitialisation  *
		********************* */
		var val,next=true,emptyFunc=function(){return new Promise(function(resolve,reject) {resolve()})};	//define default values if being called directly
		if (typeof page!="string") {									//if page is not a string then it is called by a link so get values
			page=this.getAttribute("page");								//get next page name
			val=this.getAttribute("val");								//get optional link value to pass to functions
			next=(this.getAttribute("class")=="next");					//see if moving forward or backwards
		}
		var pageCode=$PAGE[page]||{};									//get page code object if doesn't exist create an empty one
		
		/* **********************
		*  2) Validation        *
		********************** */
		var validate=function() {
			if (next) {														//see if moving to next page because we don't validate fields on back
				setTimeout(function(){
					(pageCode.valid||emptyFunc)(val).then(load,error);			//moving forward so run validation script if any
				},10);
			} else {
				load();														//moving backwards so skip to load
			}
		}
		
		/* **********************
		* 3) Custom Load Code   *
		********************** */
		var load=function() {
			setTimeout(function(){
				((next?pageCode.load:pageCode.reload)||emptyFunc)(val).then(show,error);//executes page code if exists
			},10);
		};
		
		/* **********************
		* 4) Show Page          *
		********************** */
		var show=function() {		//no delay because this won't take long
			for (var i=0; i<domPage.length; i++) 							//go through each element with class "page"
				domPage[i].style.display = 'none';						//hide them
			document.getElementById(page).style.display = 'block';		//make desired page visible
		}
		
		
		/* *********************
		* 0) Start             *
		********************* */
		validate();														//start process 
	};
	for (var i=0; i<domNext.length; i++) {								//go through each dom element with class "next"
		domNext[i].addEventListener('click', loadPage, false);			//attach click listener to execute loadPage function
	}
	for (var i=0; i<domBack.length; i++) {								//go through each dom element with class "back"
		domBack[i].addEventListener('click', loadPage, false);			//attach click listener to execute loadPage function
	}

	

	
	
	
	
	
	
	
	
	
	
/*_  __                _____                 
 | |/ /               |  __ \                
 | ' / ___ _   _ ___  | |__) |_ _  __ _  ___ 
 |  < / _ \ | | / __| |  ___/ _` |/ _` |/ _ \
 | . \  __/ |_| \__ \ | |  | (_| | (_| |  __/
 |_|\_\___|\__, |___/ |_|   \__,_|\__, |\___|
            __/ |                  __/ |     
           |___/                  |___/ 
*/

	var checkOldGoWallet=function(data) {
		return new Promise(function(resolve,reject) {					//return promise since execution is asyncronous
			//decode data and verify data
			var jsonData=JSON.parse(data);
			if (jsonData===null) return reject();

			//get keys from file
			openWindow("password");
			var tryPasswords=function() {
				var passwords=document.getElementById("passwords").value.split("\n");
				for (var pass of passwords) {
					try {
						var decoded=JSON.parse(sjcl.decrypt(pass, data));
						console.log(decoded);
						
						return resolve(decoded["xPrivKey"]);
						
					} catch(e) {
					}
				}
				openWindow("password");
			}
			document.getElementById("passwordTry").addEventListener('click',function() {
				openWindow("wait");
				setTimeout(tryPasswords,10);
			});
			document.getElementById("passwordFail").addEventListener('click',reject);			
		});
	}
	var checkOldWallet=function(data) {
		return new Promise(function(resolve,reject) {					//return promise since execution is asyncronous
			//check if old wallet
			var lines=data.split("\n");						//split file to lines
			var badLines=0;									//initialize bad lines variable
			var encoded='';									//initialize encoded variable
			for (var line of lines) {						//get each line of file
				line=line.trim();							//remove excess from line
				encoded+=line;								//save encoded data
				var l=line.length;							//get length of line
				if ((l!=76)&&(l!=0)) badLines++;			//if length is not 0 or 76 characters its a bad line
			}
			if (badLines>1) return reject();				//if more then 1 line that is wrong length then cancel
			if (lines.length<4) return reject();			//if file is to short cancel

			//get keys from file
			openWindow("password");
			var tryPasswords=function() {
				var passwords=document.getElementById("passwords").value.split("\n");
				for (var pass of passwords) {
					try {
						var data=GibberishAES.dec(encoded,pass.trim()).split("\n");//decode data
						var keys=[];								//initialize keys array
						for (var line of data) {					//go through each line of the data
							line=line.trim();						//remove white space
							if ((line.length>0) && (line[0]!='#')) {//only process lines with keys on it
								keys.push(line.split(" ")[0]);		//split out key
							}
						}
						resolve(keys);								//return keys
					} catch(e) {
					}
				}
				openWindow("password");
			}
			document.getElementById("passwordTry").addEventListener('click',function() {
				openWindow("wait");
				setTimeout(tryPasswords,10);
			});
			document.getElementById("passwordFail").addEventListener('click',reject);
		});
	}
	document.getElementById('keysFile').addEventListener('change',function(e) {
		var file=document.getElementById('keysFile').files[0];
		if (file) {
			var reader=new FileReader();
			reader.readAsText(file,"UTF-8");
			reader.onload=function(evt) {
				var data=evt.target.result;
				checkOldWallet(data).then(function(keys) {
					//returns array of keys
					document.getElementById("wif").value=keys.join(" ");
					loadPage("pageBalances");
					
				}, function() {
					checkOldGoWallet(data).then(function(xprv) {
						document.getElementById("wif").value=xprv;
						loadPage("pageBalances");
					}, function() {
						//see if contains plain text keysFile
						document.getElementById("wif").value=data;
						closeWindows(true);
					});
				});
			}
			reader.onerror = function() {
				error("Couldn't Load File");
			}			
		}		
	});
	
	
	
	

	
/*____        _                        _____                 
 |  _ \      | |                      |  __ \                
 | |_) | __ _| | __ _ _ __   ___ ___  | |__) |_ _  __ _  ___ 
 |  _ < / _` | |/ _` | '_ \ / __/ _ \ |  ___/ _` |/ _` |/ _ \
 | |_) | (_| | | (_| | | | | (_|  __/ | |  | (_| | (_| |  __/
 |____/ \__,_|_|\__,_|_| |_|\___\___| |_|   \__,_|\__, |\___|
                                                   __/ |     
                                                  |___/ 
*/	
	
	
	var exportKeys=function() {
		openWindow('wait');
		
		var txt='data:text/csv;charset=utf-8,';
		for (var address in accountData) {
			txt+=address+','+accountData[address].private+"\r\n";			
		}
		txt.slice(-2);
		
		document.getElementById('exportLink').setAttribute('href',encodeURI(txt));
		openWindow('export');
	}
	document.getElementById('export').addEventListener('click',exportKeys);
	var getDataFromXPrv=function(xprv) {
		return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
			/* ********************
			* 1) Show Wait Window *
			******************** */
			var showWait=function() {
				openWindow("wait");
				setTimeout(checkPath,10);			
			};
			
			/* ***********************************
			* 2) Start check of derivative paths *
			*********************************** */
			var tests=[];
			var checkPath=function() {
				for (var di=0;di<2;di++) {
					tests.push({
						"hdKey":	bip39.getHDKeyFromXPrv(xprv,"m/44'/0'/0'/"+di),
						"start":		"D",
						"max":			0,
						"giveUp":		MAX_UNUSED,
						"type":			(di==0?'input':'change')
					});
				}
				for (var testIndex in tests) {							//go through each app test one at a time
					for (var i=0;i<MAX_UNUSED;i++) add(testIndex);	//add first MAX_UNUSED addresses to buffer if it should
				}					
			};
			
			/* **********************
			* 3) Buffer Get        *
			********************** */
			var data={};
			var buffer=[];
			var active=0;
			var add=function(testIndex) {
				var test=tests[testIndex];
				var keyI=test.max++;
				var keyPair=test.hdKey.derive(keyI).keyPair;
				buffer.push({
					"test":testIndex,
					"index":keyI,
					"address":keyPair.getAddress(test.start),
					"private":keyPair.toWIF(keyI)
				});
				get();
			}
			var get=function() {
				if (active>=MAX_REQUESTS) return;						//don't start if already max active
				if (buffer.length==0) {
					if (active==0) return resolve(data); 				//found everything so resolve promise
					return;												//no room to get another so cancel
				}
				active++;												//set that one more request is active
				var curData=buffer.shift();								//remove first element from array				
				xmr.getJSON('addr/'+curData.address).then(function(reqData) {//make request
					active--;											//remove as active request
					var test=tests[curData.test];						//get app being tested
					if (reqData.txApperances!=0) {						//see if ay transactions done on address
						test.giveUp=MAX_UNUSED;							//if used then reset giveup counter
						data[curData.address]={							//store returned data
							"type":	test.type,
							"balance":reqData.balance,
							"private":curData.private
						};
					}
					get();												//start next buffer read
					if (--test.giveUp>0) add(curData.test);				//if we haven't failed enough times to giveup then add another attempt
				},reject);
			}
						
			/* *******************
			* 0) Start           *
			******************* */
			showWait();
			
		});
	}
	var getDataFromSeed=function(seedPhrase) {
		return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
				/*Resolve:
				{
					address: {
						type:	input/change,
						balance: dgb,
						private: private key
					},
					address2:...
				}
				
				Reject: string
				*/
			
			seedPhrase=seedPhrase.join(" ");							//recombine seed phrase into a string
			var keyData={};
				
			
			/* ************************
			* Check Seed Phrase       *
			************************ */
			var errorText=bip39.findPhraseErrors(seedPhrase);
			if (errorText!==false) {
				return reject(errorText);
			}
			
				
			/* ************************
			* 1) Show BIP39 Window    *
			************************ */
			var showBIP39=function() {
				openWindow("paths");
				var html='<div class="pathsRow"><div class="pathsHead">Derivative Path</div><div class="pathsHead">Status</div></div>';
				for (var i in appTests) {
					var testData=appTests[i];
					testData.scan=false;									//initailise scan flag to false
					html+='<div class="pathsRow"><div class="pathsCell">'+testData.name+' Input</div><div class="pathsCell" id="path'+i+'0">Testing</div></div>';
					html+='<div class="pathsRow"><div class="pathsCell">'+testData.name+' Change</div><div class="pathsCell" id="path'+i+'1">Testing</div></div>';
				}
				html+='<div class="pathsRow"><div class="pathsCell">Common DigiID Paths</div><div class="pathsCell" id="pathDigiID">Testing</div></div>';
				document.getElementById('pathsTable').innerHTML=html;
				setTimeout(quickCheck,10);
			}
			
			/* **************************
			* 2) Create quick app check *
			* scans first 2 incoming,   *
			* and 2 change addresses    *
			************************** */
			var active=1;													//initialise active count as 1 because DigiID requests are not done as part of normal buffer
			var updateCount=function(test,count) {
				test.dom.innerHTML='Found: '+count+(count>0?'<img class="bip39dots" src="dots.gif">':'<div class="bip39dots"></div>') ;
			}
			var tests=[];
			var hdKey;
			var quickCheck=function() {
				//generate requests for known apps
				var lastMaster='';
				var req=[];												//initialise reqeust list					
				for (var testIndex in appTests) {						//go through each app test one at a time
					var testData=appTests[testIndex];
					for (var di=0;di<2;di++) {							//check incoming/change
						if (testData.master!=lastMaster) {				//speed up processing by only reseting master when needed
							bip39.rebuild(testData.master);
							lastMaster=testData.master;
							hdKey=bip39.getHDKey(seedPhrase);
						}
						var test={
							"hdKey":	hdKey.derivePath(testData.derivation+'/'+di),
							"failed":		0,
							"start":		testData.start,
							"scanned":		0,
							"max":			0,
							"giveUp":		MAX_UNUSED,
							"type":			(di==0?'input':'change'),
							"dom":			document.getElementById('path'+testIndex+di)
						};
						for (var keyI=0;keyI<2;keyI++) {
							var address=test.hdKey.derive(keyI).keyPair.getAddress(test.start);//get address for test
							req.push('addr/'+address);					//get address for test and save request
						}
						tests.push(test);
					}
				}
				
				//generate requests for DigiByte core mobile DigiID
				var digiIDPKeys={};
				bip39.rebuild('DigiByte seed');
				for (var path of sitePaths) {
					var keyPair=bip39.getHDKey(seedPhrase).derivePath(path).keyPair;	//get key pair for specific site
					var address=keyPair.getAddress();					//get address for site
					digiIDPKeys[address]=keyPair.toWIF();				//store private key for address in case we need it
					req.push('addr/'+address);							//save request
				}
				
				//generate requests for all others DigiID
				bip39.rebuild('Bitcoin seed');
				for (var path of sitePaths) {
					var keyPair=bip39.getHDKey(seedPhrase).derivePath(path).keyPair;	//get key pair for specific site
					var address=keyPair.getAddress();					//get address for site
					digiIDPKeys[address]=keyPair.toWIF();				//store private key for address in case we need it
					req.push('addr/'+address);							//save request
				}
				
				//make requests and process results
				var found=false;
				var digiIDfound=0;
				var domDigiIDpath=document.getElementById("pathDigiID");
				xmr.getJSON(req,"",function(data,index,url) {			//make requests of server
					if (index/2>=tests.length) {
						//DigiID tests
						if(data["txApperances"]>0) {					//check if address was used
							updateCount({"dom":domDigiIDpath},++digiIDfound);		//update DigiID count found
							found=true;									//enable found
							keyData[data.addrStr]={						//store returned data
								"type":	"DigiID",
								"balance":data.balance,
								"private":digiIDPKeys[data.addrStr]
							};
						}
					} else {
						//app tests
						var testIndex=Math.floor(index/2);				//get index of test
						if(data["txApperances"]>0) {					//check if address was used
							tests[testIndex].failed=0;					//reset failed counter
							found=true;									//enable found
							updateCount(tests[testIndex],1);			//update table to show we found at least 1
							for (var i=0;i<MAX_UNUSED;i++) add(testIndex);	//add first MAX_UNUSED addresses to buffer if it should
						} else {
							tests[testIndex].failed--;					//mark test as failed
							if (tests[testIndex].failed==-2) {			//check if both tests for app failed.
								updateCount(tests[testIndex],0);		//update table to show we didn't find any
							}
						}
					}
				}).then(function(reqResponses) {						//execute once all requests have been processed
					if (!found) return reject("No transactions found for known apps");
					if (--active==0) return resolve(keyData); 			//found everything so resolve promise
				},reject);
			}
			
			/* *************************************************
			* 3) Full scan of all paths that have transactions *
			************************************************* */
			var buffer=[];
			var add=function(testIndex) {
				var test=tests[testIndex];
				var keyI=test.max++;
				var keyPair=test.hdKey.derive(keyI).keyPair;
				buffer.push({
					"test":testIndex,
					"index":keyI,
					"address":keyPair.getAddress(test.start),
					"private":keyPair.toWIF()
				});
				get();
			}
			var get=function() {
				if (active>=MAX_REQUESTS) return;						//don't start if already max active
				if (buffer.length==0) {
					if (active==0) return resolve(keyData); 			//found everything so resolve promise
					return;												//no room to get another so cancel
				}
				active++;												//set that one more request is active
				var curData=buffer.shift();								//remove first element from array				
				xmr.getJSON('addr/'+curData.address).then(function(reqData) {//make request
					active--;											//remove as active request
					var test=tests[curData.test];						//get app being tested
					if (reqData.txApperances!=0) {						//see if ay transactions done on address
						test.giveUp=MAX_UNUSED;							//if used then reset giveup counter
						updateCount(test,++test.scanned);				//update count scanned
						keyData[curData.address]={						//store returned data
							"type":	test.type,
							"balance":reqData.balance,
							"private":curData.private
						};
					}
					get();												//start next buffer read
					if (--test.giveUp>0) add(curData.test);				//if we haven't failed enough times to giveup then add another attempt
				},reject);
			}
	
			/* *********************************
			* 0) Start                         *
			********************************* */
			showBIP39();

		});
	}
	var getDataFromKeys=function(keys) {
		return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous							
			
			/* ************************
			* 1) Show getting balance *
			************************ */
			var showGetting=function() {
				openWindow("bal");
				document.getElementById("keyCount").innerHTML=keys.length;	//show how many keys there are to search
				setTimeout(getBalance,10);									//allow stuff to show before executing next section
			}
			
			/* ************************
			* 2) Get balance          *
			************************ */
			var getBalance=function() {
				/* *********************************
				* 2a) generate server request list *
				* computes the public key and makes*
				* request for data asociated with  *
				* public key.  Private keys do not *
				* leave your computer              *
				********************************* */
				var reqs=[];
				var data={};
				for (var key of keys) {								//go through each private key and look up its value
					var publicAddress=DigiByte.PrivateKey.toAddress(key);	//computepublic address
					reqs.push("addr/"+publicAddress);				//add request for data about public key
					data[publicAddress]={
						"private":key,								//temporarily store private key incase user wants to export to file.  Requires user request.
						"type":"input"								//manually entered private keys are always considered input	
					};
				}
				
				/* *********************************
				* 2b) execute all requests do 5 at *
				* a time to make fast but not so   *
				* fast server black lists us       *
				********************************* */
				xmr.getJSON(reqs).then(function(reqResponses) {					//request the value of each address
					for (var addressData of reqResponses) {					//go through each response and get the data
						var publicAddress=addressData["addrStr"];			//get the public address asociated with request
						data[publicAddress]["balance"]=addressData["balance"];//store balance
					}
					resolve(data);
				},reject);		
			}
			
			/* ***********************
			* 0) Start               *
			*********************** */
			showGetting();													//now that functions are defined start execution
		});		
	}
	
	
	
	var privateKeys;
	var isSeedPhrase;
	var isXPrv;
	var accountData={};													//initialise private key list(never leaves this page or stored)
	$PAGE["pageBalances"]={
		valid: function() {											//function executes to validate key inputs returns false if no errors.
			return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
				openWindow("wait");									//open generic wait screen so people know we are doing something				
						
				/* ******************
				* 1) Process Input  *
				****************** */
				privateKeys=document.getElementById("wif").value.trim();	//get what user typed into input box
				if (privateKeys=="") return reject("No Input Provided");	//check that something was entered
				privateKeys=privateKeys.replace(/\s/g,",");					//replace all white space with ,
				privateKeys=privateKeys.split(",").filter(function(e){return e});//split up into array of keys and remove duplicates
				
				/* **********************
				* 2) See if Seed Phrase *
				********************** */
				isSeedPhrase=false;											//initialise seed phrase check
				if ((privateKeys.length%3==0)&&(privateKeys.length>11)&&(privateKeys.length<25)) {	//find if 12,15,18,21,24
					if (privateKeys[0].length<20) {							//check if short word or long private key
						if (bip39.getHDKey(privateKeys.join(' '))!==false) {//check if valid seed phrase(will put any errors to console)
							isSeedPhrase=true;								//is likely seed phrase
							return resolve();								//mark as valid
						}
					}
				}
				isXPrv=false;
				if ((privateKeys.length==1)&&(privateKeys[0].substr(0,4)=="xprv")) {
					isXPrv=true;
					return resolve();
				}
				
				/* ****************************************************
				* 3) Check if valid private keys and decode encrypted *
				**************************************************** */
				var i=privateKeys.length;
				var testNext=function() {
					i--;
					if (privateKeys[i].substr(0,2)=="6P") {					//see if key is encrypted
						document.getElementById("password2_key").innerHTML=privateKeys[i];
						openWindow("password2");
						var tryPasswords=function() {
							var passwords=document.getElementById("passwords2").value.split("\n");
							var last=passwords.length-1;
							var passI=-1;
							function tryNextPass() {
								var pass=passwords[++passI];
								bip38decode(privateKeys[i],pass,function(percent) {
									var pdone=Math.round((100*passI+percent)/(passwords.length))+"%";
									document.getElementById("progress").innerHTML=pdone;
									
								}).then(function(pKey){
									privateKeys[i]=pKey;
									i++;
									testNext();
								},function() {
									console.log('Decode Failed');
									if (passI!=last) {
										tryNextPass();
									} else {
										openWindow("password2");
									}
								});
								
							}
							tryNextPass();
						}
						document.getElementById("passwordTry2").addEventListener('click',function() {
							openWindow("progress");
							setTimeout(tryPasswords,10);
						});
						document.getElementById("passwordFail2").addEventListener('click',reject);
						
					} else {
						if (!DigiByte.PrivateKey.isValid(privateKeys[i])) 		//looks to see if key is valid
							return reject("Invalid Private Key: "+privateKeys[i]);//if not valid then return error message(doesn't bother checking rest of keys)
						if (i==0) {
							resolve();
						} else {
							testNext();
						}
					}
				}
				testNext();
				
			});
		},
		load: function() {											//function executes when page is loaded by next button
			return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
				
				/* *****************************************
				* 1) Determine what type of keys inputed   *
				***************************************** */
				var decode=function() {
					if (isXPrv) {
						getDataFromXPrv(privateKeys[0]).then(finish,reject);						
					} else {
						(isSeedPhrase?getDataFromSeed:getDataFromKeys)(privateKeys).then(finish,reject);	//executes apropraite data collection helper
					}
				}
				
				/* *************************
				* 2) Process all addresses *
				************************* */				
				var finish=function(data) {
					/*
						data={
							address: {
								type:	input/change,
								balance: dgb,
								private: private key
							},
							address2:...
						}
					
					*/
					
					/* *********************
					* Save new keys        *
					********************* */
					for (var publicAddress in data) {
						accountData[publicAddress]=data[publicAddress];
					}
					
					/* *************************
					* Update balance page html *
					************************* */
					var fundsTotal=0;
					var html='<div class="balanceRow"><div class="balanceHead colType">Type</div><div class="balanceHead">Addresses</div><div class="balanceHead">Value</div></div>';
					for (var publiAddress in accountData) {
						var data=accountData[publiAddress];
						html+='<div class="balanceRow"><div class="balanceCellAddress colType">'+data.type+'</div><div class="balanceCellAddress">'+publiAddress+'</div><div class="balanceCellValue">'+data.balance.toFixed(8)+' DGB</div></div>';	//create table row
						fundsTotal+=data.balance;
					}
					document.getElementById("balanceTable").innerHTML=html;	//write html code to dom
					document.getElementById("balanceTotal").innerHTML=fundsTotal.toFixed(8);//write total balance found
					document.getElementById("recipientTotal").innerHTML=fundsTotal.toFixed(8);//write total balance found
					closeWindows(true);										//close any open windows and remove shadow
					resolve();												//resolve the promise(we are done)
					

				}
				
				/* **************
				* 0) Initialize *
				************** */
				decode();
			});
		}
	}
	
/*_____           _       _            _         _____                 
 |  __ \         (_)     (_)          | |       |  __ \                
 | |__) |___  ___ _ _ __  _  ___ _ __ | |_ ___  | |__) |_ _  __ _  ___ 
 |  _  // _ \/ __| | '_ \| |/ _ \ '_ \| __/ __| |  ___/ _` |/ _` |/ _ \
 | | \ \  __/ (__| | |_) | |  __/ | | | |_\__ \ | |  | (_| | (_| |  __/
 |_|  \_\___|\___|_| .__/|_|\___|_| |_|\__|___/ |_|   \__,_|\__, |\___|
                   | |                                       __/ |     
                   |_|                                      |___/
*/
	var transaction=new DigiByte.Transaction();
	transaction.setChange('DMw9wz6KHsvbvXsmo1Q8BajWcohYwjqwoq');//dgb1qcqf4lmecxg5ucptzgzzzfch4wztqrlhmqjqqvg');
					
	$PAGE["pageRecipients"]={
		load: function(){
			return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
				var unspendable=0;
				
				/* ***********************************************
				* 1) Show getting utxo window                    *
				*********************************************** */
				var showGettingUTXOs=function() {
					openWindow('utxos');
					setTimeout(getUTXOs,10);
				}
				
				/* ***********************************************
				* 2) Get all UTXO for address with non 0 balance *
				*********************************************** */
				var getUTXOs=function() {
					var req={};											//create object to store requests
					for (var address in accountData) {					
						if (accountData[address].balance>0) 
							req[address]="addr/"+address+"/utxo";
					}
					xmr.getJSON(req,"",function(data,address){
						for (var utxo of data) {
							if (utxo["confirmationsFromCache"]) {
								transaction.addIn(utxo,accountData[address].private);
							} else {
								unspendable+=utxo["amount"];
								accountData[address].balance-=utxo["amount"];		//reduce funds if any utxo where unspendable
							}
						}
						
					}).then(finish,reject);
				}
				

				/* ***********************************************
				* 3) All done geting utxos so continue program	 *
				*********************************************** */
				var finish=function(reqResponses) {
					closeWindows(true);
					if (unspendable>0) {
						openWindow("unspendable");
						document.getElementById("unspendableQuantity").innerHTML=unspendable;
					}
					resolve();											//were finished
				}
				
				/* ***********************************************
				* 0) Start UTXO download process 				*
				*********************************************** */
				showGettingUTXOs();
			});
		}
	
	}
	var txFee;															//initialise txFee variable
	var recipients={};													//initialise recipients list
	var estimateFee=function() {									//function to estimate fees
		txFee=transaction.getFee()/100000000;				//round up to nearest kilobyte and multiply by fee rate
		(document.getElementById("recipientsAmount_fee")||{"innerHTML":""}).innerHTML=txFee.toFixed(8);
		return txFee;
	}
	var updateRemainder=function(skip) {							//function to get remaining unspent amount and update remainder line on dom
		var remainder=0;												//initialise remainder 
		for (var i in accountData) remainder+=accountData[i].balance;	//add up all funds again since we aren't storing seperately		
		for (var address in recipients) {								//go through list of recipients one by one and get there address
			remainder-=recipients[address];								//keep track of the remiander
		}
		estimateFee();													//estimate fees
		remainder-=txFee;												//subtract out tx fee	
		if (skip!==true) {												//if dom skip set true then skip over dom changes
			var domRemainder=document.getElementById("recipientsAmount_donate");//get remainder dom item
			domRemainder.innerHTML=remainder.toFixed(8);				//update change
			domRemainder.style.backgroundColor='rgba(255,0,0,'+(remainder>=0?'0':'1')+')';//make red if invalid value.  clear otherwise
		}
		return remainder;												//return remainder
	}
	var recipientsUpdate=function() {
		var value=parseFloat(this.value);								//get the new value
		if (isNaN(value)) return false;									//check if numeric value before changing
		recipients[this.getAttribute("address")]=value;					//change value
		this.style.backgroundColor='rgba(255,0,0,'+(value<SEND_MIN&&value!=0?'1':'0')+')';//make red if invalid value.  clear otherwise
		updateRemainder();												//update the donate value
	}
	document.getElementById("recipientsAdd").addEventListener('click', function() {
		
		/* **********************************
		* 1) Validate Address               *
		********************************** */
		var domNew=document.getElementById("recipientsNew");			//get the input box
		var newAddress=domNew.value.trim();								//get the new address to add
		if (newAddress=="") return error("Address Empty");				//bomb out if empty

		if (!DigiByte.Address.isValid(newAddress)) return error("Invalid Address");	//bomb out if invalid input
				
		/* **********************************
		* 2) Handle donation recomendation  *
		********************************** */
		if (Object.keys(recipients).length==0) {						//see if first recipient
			var remainder=updateRemainder(true);						//get the amount of DigiByte that is usable
			recipients[newAddress]=Math.max(remainder*0.99,Math.floor(remainder));	//set default donate to 1% or change which ever is less(logic reverse from commented because actually setting amount)
		} else {
			recipients[newAddress]=recipients[newAddress]||0;			//add recipient to list if not already on list with value of 0
		}
		
		/* **********************************
		* 3) Rebuld recipient HTML          *
		********************************** */
		domNew.value='';												//clear the input box
		var html='<div class="recipientsRow"><div class="recipientsHead">Address</div><div class="recipientsHead">Amount</div></div>';	//initialize table html variable with header
		for (var address in recipients) {								//go through list of recipients one by one and get there address
			html+='<div class="recipientsRow"><div class="recipientsCellAddress">'+address+'</div><input type="number" address="'+address+'" class="recipientsCellAmount" value="'+recipients[address].toFixed(8)+'"></div>';
		}
		html+='<div class="recipientsRow"><div class="recipientsCellAddress">DigiByte.Rocks Donate(Optional but consider supporting us with your change)</div><div id="recipientsAmount_donate" class="recipientsCellAmount"></div></div>';
		html+='<div class="recipientsRow"><div class="recipientsCellAddress">TX Fee</div><div id="recipientsAmount_fee" class="recipientsCellAmount"></div></div>';
		document.getElementById("recipientsTable").innerHTML=html;		//update table html
		
		/* **********************************
		* 4) Update Remainder               *
		********************************** */
		updateRemainder();												//update the donate value
		
		/* **********************************
		* 5) Re add listeners               *
		********************************** */
		var domAmount=document.getElementsByClassName("recipientsCellAmount");//get all dom items using class recipientsCellAmount
		for (var i=0; i<domAmount.length; i++) {						//go through each dom element with class "recipientsCellAmount"
			domAmount[i].addEventListener('change',recipientsUpdate,false);//listen for change events
		}
		
		/* **********************************
		* 6) Allow next button              *
		********************************** */
		document.getElementById('pageRecipientsNext').disabled=false;	//make next button available
	}, false);


/*
   _____            _     _____                 
  / ____|          | |   |  __ \                
 | (___   ___ _ __ | |_  | |__) |_ _  __ _  ___ 
  \___ \ / _ \ '_ \| __| |  ___/ _` |/ _` |/ _ \
  ____) |  __/ | | | |_  | |  | (_| | (_| |  __/
 |_____/ \___|_| |_|\__| |_|   \__,_|\__, |\___|
                                      __/ |     
                                     |___/ 
*/									 
	$PAGE["pageSent"]={
		valid: function() {											//function executes to validate inputs
			return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
			
				var rCount=0;
				for (var address in recipients) {							//go through each recipient
					var amount=recipients[address];							//get amount to send to them
					if (amount!=0) {										//if amount is 0 ignore it
						rCount++;											//keep traqck of number of real recipients
						if (amount<SEND_MIN) return reject("Can't send amounts less then "+SEND_MIN);	//if we find an amount that is to small to send bomb out(was already red so they should have known better)
					}
				}
				if (rCount==0) return reject("No recipients.  If intentionally trying to donate entire amount send to DMw9wz6KHsvbvXsmo1Q8BajWcohYwjqwoq");		//if user has not put in any recipients bomb to protect against accidental next double click
				if (updateRemainder(true)<0) return reject("Can't send more then you have");//user trying to send to much so bomb out
				resolve();												//no errors found so return false
			});
		},
		load: function() {											//function executes when page is loaded by next button
			return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
				openWindow('sending');
				setTimeout(function() {										//micro delay to 
					//create transactions
					for (var address in recipients) {
						var satoshi=Math.round(recipients[address]*100000000);
						transaction.addOut(address,satoshi);
					}
					var txs=transaction.toHex();													//initialise message variable	
					console.log(txs);
				//	throw "die so we can see if it worked without sending";		
					
					
					if (txs===false) return reject("Error Forming Request");
					var txids=[];
					var waiting=txs.length;
					var tryDone=function(returnedData) {
						txids.push(returnedData['txid']);
						if (--waiting==0) {
							document.getElementById("sentTXID").innerHTML=txids.join("<br>txid: ");	//show the txid of the message
							closeWindows(true);
							resolve();
						}
					}
					for (var tx of txs) {
						xmr.postJSON('tx/send',{										//post data to server to be distributed to network
							"rawtx": tx												//get data needed to send to network
						}).then(tryDone,reject);
					}
				},10);
			});
		}
	}

	loadPage("pageIntro");												//show first page
})(window,document);