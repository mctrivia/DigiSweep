(function() {
	
/*_____ _   _ _____ _______ 
 |_   _| \ | |_   _|__   __|
   | | |  \| | | |    | |   
   | | | . ` | | |    | |   
  _| |_| |\  |_| |_   | |   
 |_____|_| \_|_____|  |_| 
*/
	// mnemonics is populated as required by getLanguage
    var mnemonics = { "english": new Mnemonic("english") };
    var mnemonic = mnemonics["english"];
	
    var network = bitcoinjs.bitcoin.networks.bitcoin;
   
	
	
	function init() {
        // Events
		/*
        setQrEvents(DOM.showQrEls);
        disableForms();
        hidePending();
        hideValidationError();
        populateNetworkSelect();
        populateClientSelect();
		*/
    }
	
/*_    _      _        __       _ 
 | |  | |    | |      / _|     | |
 | |__| | ___| |_ __ | |_ _   _| |
 |  __  |/ _ \ | '_ \|  _| | | | |
 | |  | |  __/ | |_) | | | |_| | |
 |_|  |_|\___|_| .__/|_|  \__,_|_|
               | |                
               |_|  
*/

	function findDerivationPathErrors(path) {
        // TODO is not perfect but is better than nothing
        // Inspired by
        // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#test-vectors
        // and
        // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#extended-keys
        var maxDepth = 255; // TODO verify this!!
        var maxIndexValue = Math.pow(2, 31); // TODO verify this!!
        if (path[0] != "m") {
            return "First character must be 'm'";
        }
        if (path.length > 1) {
            if (path[1] != "/") {
                return "Separator must be '/'";
            }
            var indexes = path.split("/");
            if (indexes.length > maxDepth) {
                return "Derivation depth is " + indexes.length + ", must be less than " + maxDepth;
            }
            for (var depth = 1; depth<indexes.length; depth++) {
                var index = indexes[depth];
                var invalidChars = index.replace(/^[0-9]+'?$/g, "")
                if (invalidChars.length > 0) {
                    return "Invalid characters " + invalidChars + " found at depth " + depth;
                }
                var indexValue = parseInt(index.replace("'", ""));
                if (isNaN(depth)) {
                    return "Invalid number at depth " + depth;
                }
                if (indexValue > maxIndexValue) {
                    return "Value of " + indexValue + " at depth " + depth + " must be less than " + maxIndexValue;
                }
            }
        }
        
		return false;
    }

	
	function findNearestWord(word,language) {
        var words = WORDLISTS[language];
        var minDistance = 99;
        var closestWord = words[0];
        for (var i=0; i<words.length; i++) {
            var comparedTo = words[i];
            if (comparedTo.indexOf(word) == 0) {
                return comparedTo;
            }
            var distance = Levenshtein.get(word, comparedTo);
            if (distance < minDistance) {
                closestWord = comparedTo;
                minDistance = distance;
            }
        }
        return closestWord;
    }
	
	function findPhraseErrors(phrase) {
        // Preprocess the words
        phrase = mnemonic.normalizeString(phrase);
        var words = phraseToWordArray(phrase);
        // Detect blank phrase
        if (words.length == 0) {
            return "Blank mnemonic";
        }
        // Check each word
        for (var i=0; i<words.length; i++) {
            var word = words[i];
            var language = getLanguage(phrase);
            if (WORDLISTS[language].indexOf(word) == -1) {
                console.log("Finding closest match to " + word);
                var nearestWord = findNearestWord(word,language);
                return word + " not in wordlist, did you mean " + nearestWord + "?";
            }
        }
		
        // Check the words are valid
		var properPhrase = words.join(language == "japanese"?"\u3000":" ");
        var isValid = mnemonic.check(properPhrase);
        if (!isValid) {
            return "Invalid mnemonic";
        }
        return false;
    }


	function phraseToWordArray(phrase) {
        var words = phrase.split(/\s/g);
        var noBlanks = [];
        for (var i=0; i<words.length; i++) {
            var word = words[i];
            if (word.length > 0) {
                noBlanks.push(word);
            }
        }
        return noBlanks;
    }

	function getLanguage(phrase) {
        // Check if how many words from existing phrase match a language.
        var language = "";
        if (phrase.length > 0) {
            var words = phraseToWordArray(phrase);
            var languageMatches = {};
            for (l in WORDLISTS) {
                // Track how many words match in this language
                languageMatches[l] = 0;
                for (var i=0; i<words.length; i++) {
                    var wordInLanguage = WORDLISTS[l].indexOf(words[i]) > -1;
                    if (wordInLanguage) {
                        languageMatches[l]++;
                    }
                }
                // Find languages with most word matches.
                // This is made difficult due to commonalities between Chinese
                // simplified vs traditional.
                var mostMatches = 0;
                var mostMatchedLanguages = [];
                for (var l in languageMatches) {
                    var numMatches = languageMatches[l];
                    if (numMatches > mostMatches) {
                        mostMatches = numMatches;
                        mostMatchedLanguages = [l];
                    }
                    else if (numMatches == mostMatches) {
                        mostMatchedLanguages.push(l);
                    }
                }
            }
            if (mostMatchedLanguages.length > 0) {
                // Use first language and warn if multiple detected
                language = mostMatchedLanguages[0];
                if (mostMatchedLanguages.length > 1) {
                    console.warn("Multiple possible languages");
                    console.warn(mostMatchedLanguages);
                }
            }
        }
        
		// Default to English if no other option
        if (language.length == 0) {
            language = "english";
        }
		
        return language;
    }
	
	
/* _____                            _         _    _ _____    _  __          
  / ____|                          | |       | |  | |  __ \  | |/ /          
 | |     ___  _ __ ___  _ __  _   _| |_ ___  | |__| | |  | | | ' / ___ _   _ 
 | |    / _ \| '_ ` _ \| '_ \| | | | __/ _ \ |  __  | |  | | |  < / _ \ | | |
 | |___| (_) | | | | | | |_) | |_| | ||  __/ | |  | | |__| | | . \  __/ |_| |
  \_____\___/|_| |_| |_| .__/ \__,_|\__\___| |_|  |_|_____/  |_|\_\___|\__, |
                       | |                                              __/ |
                       |_|                                             |___/ 
*/

	function getHDKeyFromXPrv(xPrv,addedDerivationPath) {
        var extendedKey=bitcoinjs.bitcoin.HDNode.fromBase58(xPrv, network);
		
        // Derive the key from the path
        var pathBits = addedDerivationPath.split("/");
        for (var i=0; i<pathBits.length; i++) {
            var bit = pathBits[i];
            var index = parseInt(bit);
            if (isNaN(index)) {
                continue;
            }
            var hardened = bit[bit.length-1] == "'";
            var isPriv = !(extendedKey.isNeutered());
            var invalidDerivationPath = hardened && !isPriv;
            if (invalidDerivationPath) {
                extendedKey = null;
            }
            else if (hardened) {
                extendedKey = extendedKey.deriveHardened(index);
            }
            else {
                extendedKey = extendedKey.derive(index);
            }
        }

        return extendedKey;
	}
	
	function getHDKey(seedPhrase,passPhrase) {
		//set defaults
		passPhrase=passPhrase||"";
		
		/* *************************
		* 1) Get Mnemonic Language *
		************************* */
		var language = getLanguage(seedPhrase);
		// Load the bip39 mnemonic generator for this language if required
        if (!(language in mnemonics)) {
            mnemonics[language] = new Mnemonic(language);
        }
        mnemonic = mnemonics[language];
		
		/* *************************
		* 2) Validate Seed Phrase  *
		************************* */
		var errorText = findPhraseErrors(seedPhrase);
        if (errorText) {
            console.log(errorText);
            return false;
        }
		
		/* *************************
		* 3) Compute Root          *
		************************* */
        // Calculate seed and bip32RootKey
	    var seed = mnemonic.toSeed(seedPhrase,passPhrase);
        return bitcoinjs.bitcoin.HDNode.fromSeedHex(seed, network);
	}
	

/*______                       _   
 |  ____|                     | |  
 | |__  __  ___ __   ___  _ __| |_ 
 |  __| \ \/ / '_ \ / _ \| '__| __|
 | |____ >  <| |_) | (_) | |  | |_ 
 |______/_/\_\ .__/ \___/|_|   \__|
             | |                   
             |_|           
*/
	window['bip39']["getLanguage"]=getLanguage;
	window['bip39']["getHDKey"]=getHDKey;
	window['bip39']["findPhraseErrors"]=findPhraseErrors;
	window['bip39']["getHDKeyFromXPrv"]=getHDKeyFromXPrv;
	window['bip39']["english"]=WORDLISTS['english'];
})();
