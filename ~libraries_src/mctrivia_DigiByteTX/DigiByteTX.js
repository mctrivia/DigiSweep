(function(undefined) {
	const TX_FEE=20000;		//satoshi per kb
	const TX_MIN = 70000;
	const TX_MAX_UTXO = 60;
	
	var bitcoinjs=window['bitcoinjs'];
	
	
	function isValidAddress(addressString) {
		var bitcoinAddress=bitcoinjs['bitcoin']['address'];
		if (addressString['toUpperCase']()['substr'](0,4)=='DGB1') {
			try {
				bitcoinAddress['fromBech32'](addressString);
				return true;
			} catch(e) {
				//unlikely but may be valid base58 address so do nothing here
			}
		}
		if ((addressString[0]=='D')||(addressString[0]=='S')) {
			try {
				bitcoinAddress['fromBase58Check'](addressString);
				return true;
			} catch(e) {
				//returns false below anyways so catch it is invalid only
			}
		}
		return false;
	}
	function isValidWIF(wifString) {
		try {
			bitcoinjs['bitcoin']['ECPair']['fromWIF'](wifString);
			return true;
		} catch(e) {
			return false;
		}
	}
	function WIFtoAddress(wifString) {
		return bitcoinjs['bitcoin']['ECPair']['fromWIF'](wifString)['getAddress']()['toString']();
	}
	function decodeAddress(address) {
		var bitcoinAddress=bitcoinjs['bitcoin']['address'];
		if (address['toUpperCase']()['substr'](0,4)=='DGB1') {
			return bitcoinAddress['fromBech32'](address);
		} else {
			return bitcoinAddress['fromBase58Check'](address);			
		}
	}
	function addressFromHash(hash,type) {
		type=type||"D";
		var bitcoinAddress=bitcoinjs['bitcoin']['address'];
		if (type=="dgb1") {
			return bitcoinAddress['toBech32'](hash,0,'dgb1');
		} else {
			return bitcoinAddress["toBase58Check"](hash,(type=="D")?30:63);
		}
	}
	
	
	
	
	function DigiByteTX() {
		var me=this;
		
		//initialise variables
		me.in=[];
		me.out={};
		me.data=[];
		me.change='';
		me.autoSplit=false;
	};
	DigiByteTX.prototype={
		"addIn":		function(utxo,priv) {
			var pkey=bitcoinjs['bitcoin']['ECPair']['fromWIF'](priv);
			this.in.push([utxo,pkey]);
		},
		"addData":		function(data) {
			if (data.length>80) throw data+" is to long";
			this.data.push(data);
		},
		"addOut":		function(address,satoshis) {
			if (!this["isValidAddress"](address)) throw address+" is invalid DigiByte address";
			if (this.out[address]==undefined) this.out[address]=0;
			this.out[address]+=satoshis;
		},
		"setChange":	function(address) {
			if (!this["isValidAddress"](address)) throw address+" is invalid DigiByte address";
			this.change=address;
		},
		"setSplit":		function(split) {
			this.autoSplit=split;
		},
		"getInCount":	function() {
			return this.in["length"];
		},
		"getOutCount":	function() {
			return Object["keys"](this.out)["length"];
		},
		"getFee":		function(inputs) {
			inputs=inputs||this["getInCount"]();
			return TX_FEE*Math["ceil"](inputs/6);
		},
		"getBalance":	function() {
			var balance=0-this["getFee"]();
			for (var data of this.in) {
				//data=[scriptPubKey,txid,vout,satoshis,private]
				balance+=data[0]["amount"];
			}
			return balance;
		},
		"isValidAddress":function(addressString) {
			return isValidAddress(addressString);
		},
		"toHex":		function() {
			var me=this,
				messageData=[],
				messageCount=(me.autoSplit==false)?1:Math["ceil"](me["getInCount"]()/TX_MAX_UTXO);
				
			if (messageCount==1) {
				//all 1 message so just copy data
				messageData=[{"in":me.in,"out":me.out,"fee":Math["round"](me["getFee"]()),"data":me.data}];
				
			} else {
				//initialise parts
				messageData=[];
				for (var i=0;i<messageCount;i++) {
					messageData['push']({"in":[],"out":{},"fee":0,"data":[]});
				}
				
				//copy outputs
				var input=JSON['parse'](JSON['stringify'](me.in));
				var out=JSON['parse'](JSON['stringify'](me.out));
				var data=JSON['parse'](JSON['stringify'](me.data));
			
				
				//add inputs and outputs
				var inputsPerMessage=Math['ceil'](me['getInCount']()/messageCount);
				for (var messageI=0;messageI<messageCount;messageI++) {
					//set fee
					messageData[messageI]['fee']=me['getFee'](inputsPerMessage);
					
					//add inputs
					var balance=0;
					for (var i=0;i<inputsPerMessage;i++) {
						if (input.length==0) {
							messageData[messageI]=me['getFee'](i);
							break;
						}
						var currentInput=input.pop();
						balance+=currentInput[0]['amount'];	//satoshi
						messageData[messageI].in['push'](currentInput);
					}
					balance=Math.round(balance*100000000-messageData[messageI]['fee']);	//convert to satoshi and remove fee
					
					//add outputs if we can add whole output to a message
					for (var address in out) {
						var satoshi=out[address];
						if (satoshi<=balance) {
							balance-=satoshi;
							messageData[messageI]['out'][address]=satoshi;
							out[address]=undefined;
						}						
						if (balance<TX_MIN) break;
					}
					
					//add parts if any left over
					if (balance>=TX_MIN) {
						for (var address in out) {
							out[address]-=balance;							//remove remainder from output
							messageData[messageI]['out'][address]=balance;		//add funds to message part
							break;											//we only have room for 1 anyways
						}
					}
					
					
					
				}
			
				//add any data if any
				var dataCountPerMessage=Math.ceil(me.data['length']/messageCount);
				for (var i=0;i<messageCount;i++) {
					if (data['length']==0) break;
					for (var ii=0;ii<dataCountPerMessage;ii++) {
						if (data['length']==0) break;
						messageData[i].data['push'](data['pop']());
					}
				}
			}
			
			var hex=[];
			for (var message of messageData) {
				
				var tx=new bitcoinjs['bitcoin']['TransactionBuilder']();
				
				//start balance tracking less fee
				var balance=0-message['fee'];
				
				//add inputs
				var utxos=[];
				for (var data of message['in']) {
					if (data[0]['address'].substr(0,4)=='dgb1') {
						var scriptPubkey = bitcoinjs['bitcoin']['script']['witnessPubKeyHash']['output']['encode'](
							bitcoinjs['bitcoin']['crypto']['hash160'](
								data[1]['getPublicKeyBuffer']()
							)
						);
						tx['addInput'](data[0]["txid"],data[0]["vout"],null, scriptPubkey);
					} else if (data[0]['address'].substr(0,1)=='S') {
						var witnessScript = bitcoinjs['bitcoin']['script']['witnessPubKeyHash']['output']['encode'](
							bitcoinjs['bitcoin']['crypto']['hash160'](
								data[1]['getPublicKeyBuffer']()
							)
						);
						var scriptPubKey = bitcoinjs['bitcoin']['script']['scriptHash']['output']['encode'](
							bitcoinjs['bitcoin']['crypto']['hash160'](witnessScript)
						);
						tx['addInput'](data[0]["txid"],data[0]["vout"],null, scriptPubkey);
					} else {
						tx['addInput'](data[0]["txid"],data[0]["vout"]);
					}
					balance+=data[0]["amount"]*100000000;
				}
				
				//add data
				for (var data of message['data']) {
					tx['addOutput'](
						bitcoinjs['bitcoin']['script']['compile']([
							bitcoinjs['bitcoin']['OP_RETURN'],
							data
						]),
						0
					);
				}
								
				//add outputs
				for (var address in message['out']) {
					tx['addOutput'](
						address,											//add address encoded correctly for transaction
						message['out'][address]								//satoshis to send
					);
					balance-=message['out'][address];
				}
				
				//add change if valid
				if ((me.change!='') && (balance>TX_MIN)) {
					tx['addOutput'](
						me.change,											//add address encoded correctly for transaction
						balance												//satoshis to send
					);
				}
				
				//sign tx
				for (var index in message['in']) {
					var data=message['in'][index];
					if (data[0]['address'].substr(0,4)=='dgb1') {
						tx['sign'](parseInt(index),data[1], null, null, Math.round(data[0]['amount']*100000000));
					} else if (data[0]['address'].substr(0,1)=='S') {
						var pubKeyHash = bitcoinjs['bitcoin']['crypto']['hash160'](data[1]['getPublicKeyBuffer']());
						var redeemScript = bitcoinjs['bitcoin']['script']['witnessPubKeyHash']['output']['encode'](pubKeyHash);
						tx['sign'](parseInt(index),data[1], redeemScript, null, Math.round(data[0]['amount']*100000000));
					} else {
						tx['sign'](parseInt(index),data[1]);
					}
				}
				
				//generate raw transaction
				hex.push(tx['build']()['toHex']());
			}
			
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
			"isValid":	isValidAddress,
			"decode":	decodeAddress,
			"fromHash":	addressFromHash
		},
		"Transaction":	DigiByteTX
	};		
})();