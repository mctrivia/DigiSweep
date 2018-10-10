bitcoinjs.bitcoin.networks.bitcoin = {
	messagePrefix: '\x18DigiByte Signed Message:\n',
	bech32: 'dgb',
    bip32: {
		public: 0x0488B21E,
		private: 0x0488ADE4,
	},
	pubKeyHash: 0x1e,
	scriptHash: 0x3f,
	wif: 0x80
};
/*
bitcoinjs.bitcoin.networks.bitcoin.p2wpkh = {
	baseNetwork: "digibyte",
    messagePrefix: '\x18DigiByte Signed Message:\n',
	bech32: 'dgb',
    bip32: {
		public: 0x0488B21E,
		private: 0x0488ADE4,
	},
	pubKeyHash: 0x1e,
	scriptHash: 0x63,
	wif: 0x80
};
bitcoinjs.bitcoin.networks.bitcoin.p2wpkhInP2sh = {
	baseNetwork: "digibyte",
    messagePrefix: '\x18DigiByte Signed Message:\n',
	bech32: 'dgb',
    bip32: {
		public: 0x0488B21E,
		private: 0x0488ADE4,
	},
	pubKeyHash: 0x1e,
	scriptHash: 0x63,
	wif: 0x80
};
*/