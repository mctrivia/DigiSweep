

//var tx= new bitcoinjs.bitcoin.TransactionBuilder();
//tx.addOutput("DSBEXM5JVw3pMPt5yfoGAc75Hoy4ySRYVh",10000);

(function() {
	const TX_FEE=20000;
	const TX_MIN = 70000;
	const TX_MAX_UTXO = 60;

	
	function isValidAddress(addressString) {
		if (addressString.toUpperCase().substr(0,4)=='DGB1') {
			try {
				bitcoinjs.bitcoin.address.fromBech32(addressString);
				return true;
			} catch(e) {
				//unlikely but may be valid base58 address so do nothing here
			}
		}
		if ((addressString[0]=='D')||(addressString[0]!='S')) {
			try {
				bitcoinjs.bitcoin.address.fromBase58Check(addressString);
				return true;
			} catch(e) {
				//returns false below anyways so catch it is invalid only
			}
		}
		return false;
	}
	function isValidWIF(wifString) {
		try {
			bitcoinjs.bitcoin.ECPair.fromWIF(wifString);
			return true;
		} catch(e) {
			return false;
		}
	}
	function WIFtoAddress(wifString) {
		return bitcoinjs.bitcoin.ECPair.fromWIF(wifString).getAddress().toString();
	}
	function DigiByteTX() {
		var me=this;
		
		//initialise variables
		me.in=[];
		me.out={};
		me.change='';
		me.autoSplit=false;
	};
	DigiByteTX.prototype={
		addIn:		function(utxo,private) {
console.log('addIn',utxo,private);
			this.in.push([utxo["scriptPubKey"],utxo["txid"],utxo["vout"],Math.round(utxo["amount"]*100000000),private]);
		},
		addOut:		function(address,satoshis) {
console.log('addOut',address,satoshis);
			if (!this.isValidAddress(address)) throw address+" is invalid DigiByte address";
			if (this.out[address]==undefined) this.out[address]=0;
			this.out[address]+=satoshis;
		},
		setChange:	function(address) {
			if (!this.isValidAddress(address)) throw address+" is invalid DigiByte address";
			this.change=address;
		},
		getInCount:	function() {
			return this.in.length;
		},
		getOutCount:function() {
			return Object.keys(this.out).length;
		},
		getFee: function(inputs) {
			inputs=inputs||this.getInCount();
			return TX_FEE*Math.ceil(inputs/6);
		},
		getBalance:	function() {
			var balance=0-this.getFee();
			for (var data of this.in) {
				//data=[scriptPubKey,txid,vout,satoshis,private]
				balance+=data[3];					
			}
			return balance/100000000;
		},
		isValidAddress:function(addressString) {
			return isValidAddress(addressString);
		},
		toHex:			function() {
			var me=this,
				messageData,
				messageCount=(me.autoSplit==false)?1:Math.ceil(me.getInCount()/TX_MAX_UTXO);
				
			
			
console.log(messageCount);			
			if (messageCount==1) {
				//all 1 message so just copy data
				messageData=[{"in":me.in,"out":me.out,"fee":Math.round(me.getFee())}];	
console.log(messageData);				
				
			} else {
        document.open();
        document.write(msg);
        document.close();
throw 'not yet programmed';
/*
				//initialise parts
				messageData=[];
				for (var i=0;i<messageCount;i++) {
					messageData.push({"in":[],"out":{},"fee":0});
				}
				
				//copy outputs
				var input=JSON.parse(JSON.stringify(me.in));
				var out=JSON.parse(JSON.stringify(me.out));
			
				
				//add inputs and outputs
				var inputsPerMessage=Math.ceil(me.getInCount()/messageCount);
				for (var messageI=0;messageI<messageCount;messageI++) {
					//set fee
					messageData[messageI].fee=me.getFee(inputsPerMessage);
					
					//add inputs
					var balance=0;
					for (var i=0;i<inputsPerMessage;i++) {
						if (input.length==0) {
							messageData[messageI]=me.getFee(i);
							break;
						}
						var data=input.pop();
						balance+=data[3];	//satoshi
						messageData[messageI].in.push(data);
					}
					balance-=messageData[messageI].fee;
					
					//add outputs if we can add whole output to a message
					for (var address in out) {
						var satoshi=out[address];
						if (satoshi<=balance) {
							balance-=satoshi;
							messageData[messageI].out[address]=satoshi;
							out[address]=undefined;
						}						
						if (balance<TX_MIN) break;
					}
					
					//add parts if any left over
					for (var address in out) {
					
					
					// *************************
					
					}
					
					
					
				}
				*/
			
			}
			
			var hex=[];
			for (var message of messageData) {
				console.log(messageData);
				
				var tx= new bitcoinjs.bitcoin.TransactionBuilder();
				
				//add inputs
				var balance=0-message.fee;
				for (var data of message.in) {
					//data=[scriptPubKey,txid,vout,satoshis,private]
					var txid=data[1],
						vout=data[2],
						sats=data[3];
					tx.addInput(txid,vout);
					balance+=sats;
				}
				
				//add outputs
				for (var address in message.out) {
					var sats=message.out[address];
					tx.addOutput(address,sats);
					balance-=sats;
				}
				
				//add change if valid
				if ((balance>TX_MIN) && (me.change!='')) {
					tx.addOutput(me.change,balance);
				}
				
				//sign tx
				
console.log(tx);
				for (var index in message.in) {
console.log('sign:',index);
					var data=message.in[index];
					//data=[scriptPubKey,txid,vout,satoshis,private]
					var pkey=bitcoinjs.bitcoin.ECPair.fromWIF(data[4]);
					tx.sign(parseInt(index),pkey);
				}
				
				//generate raw transaction
				hex.push(tx.build().toHex());
			}
console.log(hex[0]);
			throw "Error";
			if (me.autoSplit==false) return hex[0];
			return hex;
		}
	}
	window['DigiByte']={
		"PrivateKey":	{
			"isValid":	isValidWIF,
			"toAddress":WIFtoAddress
		},
		"Address":	{			
			"isValid":	isValidAddress
		},
		"Transaction":	DigiByteTX
	};		
})();