#DigiQR

Uses a modified version of https://github.com/kazuhikoarase/qrcode-generator

All return an encoded image.  can be directly set as img tags src
	
		DigiQR.request(address,amount,size,logo,radius);
		DigiQR.address(address,size,logo,radius);
		DigiQR.explorer(address,size,logo,radius);
		DigiQR.text(data,size,logo,radius);
		DigiQR.id(uri,size,logo,radius);
	
		DigiQR.gen({
			"data":		string			value to encode in bar code,
			"size":		unsigned int	optional size in pixels.  default 200
			"logo":		unsigned int	optional logo.  defaults to off
											0,false,undefined	no logo
											1,true			 	logo with white box
											2					logo with white circle
											4					logo with no boarder
											5					large logo with white dots
											6					large logo with white squares		
			"r":		unsigned float	optional module radius.  must be value between 0-1.  default 0
			"symbol":	unsigned int	optional defaults to 0
											0					DigiByte logo
											1					DigiID logo
		});
		
		
	Can also include img tags in following format.  All but uri are optional:
			
		<img class="DigiQR" uri="digibyte:dgb1qqlzvqjew735uvpaelqs663ckxs7lnknrgulc82" size="150" logo="2" r="1">