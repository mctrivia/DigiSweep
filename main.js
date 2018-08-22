"use strict";
(function(window,document,undefined){
	var MAX_REQUESTS=4;														//max number of concurent requests to explorer server
	var MAX_UNUSED=20;
	var TX_FEE_KB=0.0002;													//fee amount per kb
	var SEND_MIN=0.0007;													//minimum amount that can be sent to an address
	var digibyte=require('digibyte');										//load digibyte object.  should check digibyte.min.js has not been edited since last confirmation of good standing
	digibyte.Transaction.FEE_PER_KB=TX_FEE_KB*100000000;

	
	
/*     _  _____  ____  _   _   _____                            _   
      | |/ ____|/ __ \| \ | | |  __ \                          | |  
      | | (___ | |  | |  \| | | |__) |___  __ _ _   _  ___  ___| |_ 
  _   | |\___ \| |  | | . ` | |  _  // _ \/ _` | | | |/ _ \/ __| __|
 | |__| |____) | |__| | |\  | | | \ \  __/ (_| | |_| |  __/\__ \ |_ 
  \____/|_____/ \____/|_| \_| |_|  \_\___|\__, |\__,_|\___||___/\__|
                                             | |                    
                                             |_|   
This is most dangerous part of script because it is the only part of code that connects to the internet.
Things to look for to make sure code is legit:
1) Make sure no other function accesses the internet.  Search code for XML and $. should not be anywhere else in code
2) Make sure url portion listed after req['open'] points to trust worthy server and uses https(digiexplorer.info is official digibyte server)
3) Make sure no part of code trys to send or save the private keys(signing message and calculating public address with them is ok)
*/

	var postJSON=function(url,data) {
		return new Promise(function(resolve,reject) {					//return promise since execution is asyncronous
			var server=document.getElementById('server').value;
			var req = new XMLHttpRequest();								//setup http request
			req['open']('POST', server+url,true);	//set url of file to get
			req['setRequestHeader']("Content-Type", "application/json");//show using json
			req['onload'] = function() {								//run when data is returned
				if (req['status'] == 200) {								//make sure no error code wasn't returned
					var data=JSON['parse'](req['response']);			//decode returned string into json data
					if (data===null) {									//check if data was valid json data
						reject(req['response']);
					} else {											//data was valid
						resolve(data);									//resolve the promise
					}
				} else {												//error code wasn't 200 so soething when wrong
					reject("Unexpected Error");
				}
			}
			req['onerror'] = function() {								//handle network errors that may result in data not being returned
				reject("Network Error");
			};
			req['send'](JSON.stringify(data));							//convert data to string and send to server
		});
	}

	var getJSON=function(urlORurls) {
		return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
			var server=document.getElementById('server').value;
			
			if (typeof urlORurls=="string") {							//if received string then return the promise for just this request
				var req = new XMLHttpRequest();							//setup http request
				
				req['open']('GET', server+urlORurls);	//set url of file to get
				req['onload'] = function() {							//run when data is returned
					if (req['status'] == 200) {							//make sure no error code wasn't returned
						var data=JSON['parse'](req['response']);		//decode returned string into json data
						if (data===null) {								//check if data was valid json data
							reject(req['response']);
						} else {										//data was valid
							resolve(data);								//resolve the promise
						}
					} else {											//error code wasn't 200 so soething when wrong
						reject("Unexpected Error");
					}
				};
				req['onerror'] = function() {							//handle network errors that may result in data not being returned
					reject("Network Error");
				};
				req['send']();											//send request for data
			} else {
				var responses={};										//keep track of responses
				var responsCount=0;
				var index=0;											//keep track of current request
				var getNext=function(i) {
					if (i<urlORurls.length) {							//make sure there are still requests left to process
						getJSON(urlORurls[i]).then(function(responseData){//make request
							responsCount++;
							responses[urlORurls[i]]=responseData;		//store response
							getNext(index++);							//request the next next index and update value
						},reject);										//if request failed then fail entire series
					}
					if (responsCount==urlORurls.length) {			//check if we have as many responses as requests
						resolve(responses);								//resolve the promise and return the responses
					}
				}
				for (var i=0;i<MAX_REQUESTS;i++) {						//start up to MAX_REQUEST concurrent requests
					getNext(index++);									//request the next next index and update value
				}
			}
		});			
	}

	
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
						console.log(encoded,pass);
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
					//see if contains plain text keysFile
					document.getElementById("wif").value=data;
					closeWindows(true);
					
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
				
				
			/* ************************
			* App Configuration       *
			************************ */
			var appTests=[
				{
					"name":"Core Mobile",
					"master":"DigiByte seed",
					"derivation":"m/0'",
					"start":"D"
				},
				{
					"name":"DigiByte Go",
					"master":"Bitcoin seed",
					"derivation":"m/44'/0'/0'",
					"start":"D"
				},
				{
					"name":"BIP44 Wallets",
					"master":"Bitcoin seed",
					"derivation":"m/44'/20'/0'",
					"start":"D"
				},
				/*
				{
					"name":"BIP84 Wallets",
					"master":"Bitcoin seed",
					"derivation":"m/84'/20'/0'",
					"start":"dgb"
				},
				{
					"name":"BIP49 Wallets",
					"master":"Bitcoin seed",
					"derivation":"m/49'/20'/0'",
					"start":"S"
				}
				*/
			];
			
			
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
				document.getElementById('pathsTable').innerHTML=html;
				setTimeout(quickCheck,10);
			}
			
			/* **************************
			* 2) Create quick app check *
			* scans first 2 incoming,   *
			* and 2 change addresses    *
			************************** */
			var updateCount=function(test,count) {
				test.dom.innerHTML='Found: '+count+(count>0?'<img class="bip39dots" src="dots.gif">':'<div class="bip39dots"></div>') ;
			}
			var tests=[];
			var quickCheck=function() {
				var lastMaster='';
				var req=[];													//initialise reqeust list					
				for (var testIndex in appTests) {							//go through each app test one at a time
					var testData=appTests[testIndex];
					for (var di=0;di<2;di++) {									//check incoming/change
						if (testData.master!=lastMaster) {					//speed up processing by only reseting master when needed
							bip39.rebuild(testData.master);
							lastMaster=testData.master;
						}
						var test={
							"extendedKeys":	bip39.getHDKey(seedPhrase,"",testData.derivation+'/'+di),
							"scan":			false,
							"start":		testData.start,
							"scanned":		0,
							"max":			0,
							"giveUp":		MAX_UNUSED,
							"type":			(di==0?'input':'change'),
							"dom":			document.getElementById('path'+testIndex+di)
						};
						for (var keyI=0;keyI<2;keyI++) {
							req.push('addr/'+bip39.getAddress(test.extendedKeys,keyI,test.start));//get address for test and save request
						}
						tests.push(test);
					}
				}
				getJSON(req).then(function(reqResponses) {					//request the value of each address
					var found=false;
					for (var url in reqResponses) {							//go through each response and get the url requested
						var addressData=reqResponses[url];					//get the particular urls response
						var publicAddress=addressData["addrStr"];			//get the public address asociated with request
						if(addressData["txApperances"]>0) {					//check if address was used
							found=true;
							tests[Math.floor(req.indexOf('addr/'+publicAddress)/2)].scan=true; //set particular app path to true
						}
					}
					if (!found) return reject("No transactions found for known apps");
					for (var test of tests) {								//go through each app test one at a time
						updateCount(test,test.scan?1:0);
					}
					setTimeout(fullScan,10);
				},reject);
			}
			
			/* *************************************************
			* 3) Full scan of all paths that have transactions *
			************************************************* */
			var fullScan=function() {
				var data={};
				
				/* **********************
				* 3a) Start 2 threads            *
				********************** */
				var fullScanInit=function() {
					for (var testIndex in tests) {							//go through each app test one at a time
						if (tests[testIndex].scan) 							//see if test should be scanned
							for (var i=0;i<MAX_UNUSED;i++) add(testIndex);	//add first MAX_UNUSED addresses to buffer if it should
					}
				}
				
				/* **********************
				* 3b) Buffer Get        *
				********************** */
				var buffer=[];
				var active=0;
				var add=function(testIndex) {
					var test=tests[testIndex];
					var keyI=test.max++;
					buffer.push({
						"test":testIndex,
						"index":keyI,
						"address":bip39.getAddress(test.extendedKeys,keyI,test.start),
						"private":bip39.getPrivate(test.extendedKeys,keyI)
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
					getJSON('addr/'+curData.address).then(function(reqData) {//make request
						active--;											//remove as active request
						var test=tests[curData.test];						//get app being tested
						if (reqData.txApperances!=0) {						//see if ay transactions done on address
							test.giveUp=MAX_UNUSED;							//if used then reset giveup counter
							updateCount(test,++test.scanned);				//update count scanned
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
				
				/* ************************
				* 3x) Start               *
				************************ */
				fullScanInit();
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
					var publicAddress=digibyte.PrivateKey.fromString(key).toAddress().toString();	//computepublic address
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
				getJSON(reqs).then(function(reqResponses) {					//request the value of each address
					for (var url in reqResponses) {							//go through each response and get the url requested
						var addressData=reqResponses[url];					//get the particular urls response
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
	var accountData={};													//initialise private key list(never leaves this page or stored)
	$PAGE["pageBalances"]={
		valid: function() {											//function executes to validate key inputs returns false if no errors.
			return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
				openWindow("wait");									//open generic wait screen so people know we are doing something				
						
				/* ******************
				* 1) Process Input  *
				****************** */
				privateKeys=document.getElementById("wif").value;			//get what user typed into input box
				privateKeys=privateKeys.replace(/\s/g,",");					//replace all white space with ,
				privateKeys=privateKeys.split(",").filter(function(e){return e});//split up into array of keys and remove duplicates
				
				/* **********************
				* 2) See if Seed Phrase *
				********************** */
				isSeedPhrase=false;											//initialise seed phrase check
				if ((privateKeys.length%6==0)&&(privateKeys.length>11)) {	//find if 12,18,24,...
					if (privateKeys[0].length<20) {							//check if short word or long private key
						isSeedPhrase=true;									//is likely seed phrase
						return resolve();										//mark as valid because don't have validity check yet
					}
				}
				
				/* *******************************
				* 3) Check if valid private keys *
				******************************* */
				for (var key of privateKeys) {								//go through list of keys and see if they are all valid
					if (!digibyte.PrivateKey.isValid(key)) 					//looks to see if key is valid
						return reject("Invalid Private Key: "+key);					//if not valid then return error message(doesn't bother checking rest of keys)
				}
				resolve();												//no errors found so return false
			});
		},
		load: function() {											//function executes when page is loaded by next button
			return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
				(isSeedPhrase?getDataFromSeed:getDataFromKeys)(privateKeys).then(function(data) {;	//executes apropraite data collection helper
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
					
				},reject);
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
	var utxos=[];
	$PAGE["pageRecipients"]={
		load: function(){
			return new Promise(function(resolve, reject) {					//return promise since execution is asyncronous
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
					var reqs=[];
					for (var address in accountData) {
						if (accountData[address].balance>0) reqs.push("addr/"+address+"/utxo");//add all non 0 balance addresses to utxo request list
					}
					getJSON(reqs).then(process,reject);
				}
				

				/* ***********************************************
				* 3) Process all utxos in to one list            *
				*********************************************** */
				var process=function(reqResponses) {
					utxos=[];
					for (var url in reqResponses) {						//go through each response and get the url requested
						for (var utxo of reqResponses[url]) {			//go through each utxo
							utxos.push(utxo);							//add utxo to list
						}
					}
					closeWindows(true);
					resolve();											//were finished
				}
				
				/* ***********************************************
				* 0) Move Funds                                  *
				*********************************************** */
				showGettingUTXOs();
			});
		}
	
	}
	var txFee;															//initialise txFee variable
	var recipients={};													//initialise recipients list
	var createTX=function(skip) {									//function to create the fund transaction
		var transaction=new digibyte.Transaction()						//initialize transaction
			.from(utxos);												//include all inputs
		for (var to in recipients) {									//go through each of the recipients set "to" to the address
			if (skip!==true || recipients[to]>0) {						//skip 0 balance recipients if skip is true
				transaction.to(digibyte.Address.fromString(to),Math.round(recipients[to]*100000000));	//add there due amount
			}
		}
		transaction.change(digibyte.Address.fromString('DMw9wz6KHsvbvXsmo1Q8BajWcohYwjqwoq'));	//set change address as donate address 
		var pkeys=[];
		for (var address in accountData) {
			pkeys.push(accountData[address].private);
		}
		transaction.sign(pkeys);									//sign transaction with private keys
		var newTXfee=transaction.getFee()/100000000;					//calculate new fee required
		if (skip!==true) document.getElementById("recipientsAmount_fee").innerHTML=newTXfee.toFixed(8);//make tx fee visible
		if (newTXfee!=txFee) {											//see if fee has changed.  should only happen while changing values.
			txFee=newTXfee;												//update new value
			return false;												//return false since transaction is invalide
		}
		var message;													//initialise message variable
		try {															//start a error detection block because serialize throws errors some times
			message=transaction.serialize();							//encode the message
		} catch(err) {													//if there was an error then catch it
			message=false;												//set that message failed
			console.log(err);											//make debug log of error
		}
		return message;													//return the serialized message or false if failed
	}
	var updateRemainder=function(skip) {							//function to get remaining unspent amount and update remainder line on dom
		var remainder=0;												//initialise remainder 
		for (var i in accountData) remainder+=accountData[i].balance;	//add up all funds again since we aren't storing seperately		
		for (var address in recipients) {								//go through list of recipients one by one and get there address
			remainder-=recipients[address];								//keep track of the remiander
		}
		createTX(skip);													//create the tx just so we can see how big it is
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
		if (!digibyte.Address.isValid(newAddress)) return error("Invalid Address");	//bomb out if invalid input
				
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
				postJSON('tx/send',{										//post data to server to be distributed to network
					"rawtx": createTX(true)									//get data needed to send to network
				}).then(function(returnedData) {							//when the server responds back will execute this
					document.getElementById("sentTXID").innerHTML=returnedData['txid'];	//show the txid of the message
					closeWindows(true);
					resolve();
				},reject);
			});
		}
	}

	loadPage("pageIntro");												//show first page
})(window,document);