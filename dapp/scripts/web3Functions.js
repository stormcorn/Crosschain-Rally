//CONNECT

var currentAddr = null;
var userAddr;
var web3;

var carContract;
var presaleContract;
var carDbContract;

var contractsLoaded = false;

const carAddr = '0xE3CED1e769bB4BD79e63c8A00E3cCd4DB952a95d';
const presaleAddr = '0xEC988aF461979750f8B0569CB30CfC2c88F61D9D';
const carDbAddr = '0xABa573b901dEC104a6aED395288192B26dAa8b65';

const carAbi = [{
	"inputs": [],
	"stateMutability": "nonpayable",
	"type": "constructor"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "account",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "operator",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "bool",
		"name": "approved",
		"type": "bool"
	}],
	"name": "ApprovalForAll",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "previousOwner",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "newOwner",
		"type": "address"
	}],
	"name": "OwnershipTransferred",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "operator",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "from",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256[]",
		"name": "ids",
		"type": "uint256[]"
	}, {
		"indexed": false,
		"internalType": "uint256[]",
		"name": "values",
		"type": "uint256[]"
	}],
	"name": "TransferBatch",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "operator",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "from",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "TransferSingle",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "string",
		"name": "value",
		"type": "string"
	}, {
		"indexed": true,
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "URI",
	"type": "event"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_oracle",
		"type": "address"
	}],
	"name": "addOracle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_thor",
		"type": "address"
	}],
	"name": "addThor",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "account",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "balanceOf",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address[]",
		"name": "accounts",
		"type": "address[]"
	}, {
		"internalType": "uint256[]",
		"name": "ids",
		"type": "uint256[]"
	}],
	"name": "balanceOfBatch",
	"outputs": [{
		"internalType": "uint256[]",
		"name": "",
		"type": "uint256[]"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "account",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "_id",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "_amount",
		"type": "uint256"
	}],
	"name": "burn",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "account",
		"type": "address"
	}, {
		"internalType": "uint256[]",
		"name": "_ids",
		"type": "uint256[]"
	}, {
		"internalType": "uint256[]",
		"name": "_amounts",
		"type": "uint256[]"
	}],
	"name": "burnBatch",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_from",
		"type": "address"
	}, {
		"internalType": "uint256[]",
		"name": "_burnIds",
		"type": "uint256[]"
	}, {
		"internalType": "uint256[]",
		"name": "_burnAmounts",
		"type": "uint256[]"
	}, {
		"internalType": "uint256[]",
		"name": "_mintIds",
		"type": "uint256[]"
	}, {
		"internalType": "uint256[]",
		"name": "_mintAmounts",
		"type": "uint256[]"
	}],
	"name": "burnForMint",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_oracle",
		"type": "address"
	}],
	"name": "delOracle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_thor",
		"type": "address"
	}],
	"name": "delThor",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_oracle",
		"type": "address"
	}],
	"name": "disableOracle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_thor",
		"type": "address"
	}],
	"name": "disableThor",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "exists",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "account",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "operator",
		"type": "address"
	}],
	"name": "isApprovedForAll",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_address",
		"type": "address"
	}],
	"name": "isOracle",
	"outputs": [{
		"internalType": "bool",
		"name": "allowed",
		"type": "bool"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_address",
		"type": "address"
	}],
	"name": "isThor",
	"outputs": [{
		"internalType": "bool",
		"name": "allowed",
		"type": "bool"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_to",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "_id",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "_amount",
		"type": "uint256"
	}],
	"name": "mint",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_to",
		"type": "address"
	}, {
		"internalType": "uint256[]",
		"name": "_ids",
		"type": "uint256[]"
	}, {
		"internalType": "uint256[]",
		"name": "_amounts",
		"type": "uint256[]"
	}],
	"name": "mintBatch",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "name",
	"outputs": [{
		"internalType": "string",
		"name": "",
		"type": "string"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "owner",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "relinquishOracle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "renounceOwnership",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "from",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"internalType": "uint256[]",
		"name": "ids",
		"type": "uint256[]"
	}, {
		"internalType": "uint256[]",
		"name": "amounts",
		"type": "uint256[]"
	}, {
		"internalType": "bytes",
		"name": "data",
		"type": "bytes"
	}],
	"name": "safeBatchTransferFrom",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "from",
		"type": "address"
	}, {
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}, {
		"internalType": "bytes",
		"name": "data",
		"type": "bytes"
	}],
	"name": "safeTransferFrom",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "operator",
		"type": "address"
	}, {
		"internalType": "bool",
		"name": "approved",
		"type": "bool"
	}],
	"name": "setApprovalForAll",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "_id",
		"type": "uint256"
	}, {
		"internalType": "string",
		"name": "_uri",
		"type": "string"
	}],
	"name": "setURI",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "bytes4",
		"name": "interfaceId",
		"type": "bytes4"
	}],
	"name": "supportsInterface",
	"outputs": [{
		"internalType": "bool",
		"name": "",
		"type": "bool"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "symbol",
	"outputs": [{
		"internalType": "string",
		"name": "",
		"type": "string"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "toAsgard",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"name": "tokenURI",
	"outputs": [{
		"internalType": "string",
		"name": "",
		"type": "string"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "totalSupply",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "newOwner",
		"type": "address"
	}],
	"name": "transferOwnership",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "_id",
		"type": "uint256"
	}],
	"name": "uri",
	"outputs": [{
		"internalType": "string",
		"name": "",
		"type": "string"
	}],
	"stateMutability": "view",
	"type": "function"
}];
const presaleAbi = [{
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "previousOwner",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "newOwner",
		"type": "address"
	}],
	"name": "OwnershipTransferred",
	"type": "event"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_oracle",
		"type": "address"
	}],
	"name": "addOracle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_thor",
		"type": "address"
	}],
	"name": "addThor",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "account",
		"type": "address"
	}],
	"name": "buyFlame",
	"outputs": [],
	"stateMutability": "payable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "account",
		"type": "address"
	}],
	"name": "buyGold",
	"outputs": [],
	"stateMutability": "payable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "account",
		"type": "address"
	}],
	"name": "buySilver",
	"outputs": [],
	"stateMutability": "payable",
	"type": "function"
}, {
	"inputs": [],
	"name": "carBase",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_oracle",
		"type": "address"
	}],
	"name": "delOracle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_thor",
		"type": "address"
	}],
	"name": "delThor",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_oracle",
		"type": "address"
	}],
	"name": "disableOracle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_thor",
		"type": "address"
	}],
	"name": "disableThor",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "ethBal",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "fBoxCap",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "fBoxM",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "fBoxPrice",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "gBoxCap",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "gBoxM",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "gBoxPrice",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_address",
		"type": "address"
	}],
	"name": "isOracle",
	"outputs": [{
		"internalType": "bool",
		"name": "allowed",
		"type": "bool"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_address",
		"type": "address"
	}],
	"name": "isThor",
	"outputs": [{
		"internalType": "bool",
		"name": "allowed",
		"type": "bool"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "owner",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "relinquishOracle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "renounceOwnership",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "sBoxCap",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "sBoxM",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "sBoxPrice",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "sb",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "gb",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "fb",
		"type": "uint256"
	}],
	"name": "setCaps",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "carAddr",
		"type": "address"
	}],
	"name": "setCarSftAddr",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "sp",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "gp",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "fp",
		"type": "uint256"
	}],
	"name": "setPrices",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "rngAddr",
		"type": "address"
	}],
	"name": "setRngAddr",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "toAsgard",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "newOwner",
		"type": "address"
	}],
	"name": "transferOwnership",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}],
	"name": "withdraw",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "withdrawAll",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}];
const carDbAbi = [{
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "previousOwner",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "newOwner",
		"type": "address"
	}],
	"name": "OwnershipTransferred",
	"type": "event"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_oracle",
		"type": "address"
	}],
	"name": "addOracle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_thor",
		"type": "address"
	}],
	"name": "addThor",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_oracle",
		"type": "address"
	}],
	"name": "delOracle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_thor",
		"type": "address"
	}],
	"name": "delThor",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_oracle",
		"type": "address"
	}],
	"name": "disableOracle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_thor",
		"type": "address"
	}],
	"name": "disableThor",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "string",
		"name": "nme",
		"type": "string"
	}, {
		"internalType": "uint256",
		"name": "tr",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "du",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "sp",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "acc",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "st",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "df",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "gn",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "nb",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "pl",
		"type": "uint256"
	}],
	"name": "fullSet",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "getAcc",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "getDrift",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "getDuration",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "getGetNitro",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "getName",
	"outputs": [{
		"internalType": "string",
		"name": "",
		"type": "string"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "getNitroBoost",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "getProlong",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "getSpeed",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "getSteer",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "getTier",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_address",
		"type": "address"
	}],
	"name": "isOracle",
	"outputs": [{
		"internalType": "bool",
		"name": "allowed",
		"type": "bool"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "_address",
		"type": "address"
	}],
	"name": "isThor",
	"outputs": [{
		"internalType": "bool",
		"name": "allowed",
		"type": "bool"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "slot",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "carID",
		"type": "uint256"
	}],
	"name": "mapcarT2",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "slot",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "carID",
		"type": "uint256"
	}],
	"name": "mapcarT3",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "slot",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "carID",
		"type": "uint256"
	}],
	"name": "mapcarT4",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "slot",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "carID",
		"type": "uint256"
	}],
	"name": "mapcarT5",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "slot",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "carID",
		"type": "uint256"
	}],
	"name": "mapcarT6",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "slot",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "carID",
		"type": "uint256"
	}],
	"name": "mapcarT7",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "owner",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "pushAcc",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "pushDrift",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "pushDuration",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "pushGetNitro",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "string",
		"name": "newName",
		"type": "string"
	}],
	"name": "pushName",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "pushNitroBoost",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "pushProlong",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "pushSpeed",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "pushSteer",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "value",
		"type": "uint256"
	}],
	"name": "pushTier",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "id",
		"type": "uint256"
	}],
	"name": "queryStats",
	"outputs": [{
		"internalType": "string",
		"name": "kName",
		"type": "string"
	}, {
		"internalType": "uint256",
		"name": "kTier",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "kDuration",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "kSpeed",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "kDrift",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "kGetNitro",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "kNitroBoost",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "kProlong",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "relinquishOracle",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [],
	"name": "renounceOwnership",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "index",
		"type": "uint256"
	}],
	"name": "t2Index",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "index",
		"type": "uint256"
	}],
	"name": "t3Index",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "index",
		"type": "uint256"
	}],
	"name": "t4Index",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "index",
		"type": "uint256"
	}],
	"name": "t5Index",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "index",
		"type": "uint256"
	}],
	"name": "t6Index",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "index",
		"type": "uint256"
	}],
	"name": "t7Index",
	"outputs": [{
		"internalType": "uint256",
		"name": "",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "toAsgard",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "newOwner",
		"type": "address"
	}],
	"name": "transferOwnership",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}];

function loadContracts() {
	if (!contractsLoaded) {
		web3 = window.web3;
		carContract = new web3.eth.Contract(carAbi, carAddr);
		presaleContract = new web3.eth.Contract(presaleAbi, presaleAddr);
		carDbContract = new web3.eth.Contract(carDbAbi, carDbAddr);
		contractsLoaded = true;
	}
}

//Init Moralis
const serverUrl = "https://zsvtu4rtg8an.usemoralis.com:2053/server";
const appId = "NVW24Y0Vvi9vTlUH1lw5vL8utXjgEMaGCAP64AEF";
Moralis.start({
	serverUrl,
	appId
});

//Connect

async function loginMetamask() {
	let user = Moralis.User.current();
	console.log(user);
	try {
		user = await Moralis.authenticate({
			signingMessage: "Crosschain Rally!"
		});
		console.log(user);
		await Moralis.enableWeb3();
		web3 = new Web3(Moralis.provider);
		console.log(web3);
		userAddr = await user.get('ethAddress');
		console.log(userAddr);
		currentAddr = userAddr;
		if (ethereum.networkVersion == 25) {
			$('#conBut').attr('disabled', true);
			startApp();
		} else {
			alert("Switch to CRONOS MAINNET and refresh to retry connection.");
		}
		$("#authModal").modal("hide");
	} catch (error) {
		console.log('auth failed', error);
	}
}

async function loginWalletConnect() {
	let user = Moralis.User.current();
	console.log(user);
	try {
		user = await Moralis.authenticate({
			provider: 'walletconnect',
			chainId: 25
		});
		console.log(user);
		await Moralis.enableWeb3({
			provider: 'walletconnect',
			chainId: 25,
			rpc: {
				25: 'https://mmf-rpc.xstaking.sg/'
			}
		});
		web3 = new Web3(Moralis.provider);
		console.log(web3);
		userAddr = await user.get('ethAddress');
		console.log(userAddr);
		currentAddr = userAddr;
		$('#conBut').attr('disabled', true);
		startApp();
		$("#authModal").modal("hide");
	} catch (error) {
		console.log('auth failed', error);
	}
}


async function startApp() {
	let shortenedAccount = currentAddr.replace(currentAddr.substring(5, 38), "***");
	$('#conBut').html(shortenedAccount + "<small><div id='RNDMBalance'></div></small>");
	loadContracts();
	loadContent();
}


var theAuthModal = '<div class="m-0">' +
	'    <div id="authModal" class="modal fade" tabindex="-1">' +
	'        <div class="modal-dialog">' +
	'            <div class="modal-content">' +
	'                <div class="modal-header">' +
	'                    <h5 class="modal-title">Connect Wallet</h5>' +
	'                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>' +
	'                </div>' +
	'                <div class="modal-body">' +
	'                    <p>Choose Metamask or WalletConnect</p>' +
	'                    <p class="text-secondary"><small>CRONOS Network Only!</small></p>' +
	'                </div>' +
	'                <div class="d-flex justify-content-center modal-footer">' +
	'                    <button onclick="loginMetamask()" class="btn btn-m font-900 text-uppercase bg-blue-dark">Metamask</button>' +
	'                    <button onclick="loginWalletConnect()" class="btn btn-m font-900 text-uppercase bg-blue-dark">WalletConnect</button>' +
	'                </div>' +
	'            </div>' +
	'        </div>' +
	'    </div>' +
	'</div>';

$(document).ready(function () {
	$("#authenticationModal").html(theAuthModal);
	$("#authModal").modal("hide");
});

function showConnect() {
	$("#authModal").modal("show");
	$('.modal-backdrop').remove();
}

function loadContent() {
	//Web3GetterAggregation
	myBalance();
	getSilverPrice();
	getGoldPrice();
	getFlamePrice();
	getSilverLeft();
	getGoldLeft();
	getFlameLeft();
}

async function myBalance() {
	let bq = await web3.eth.getBalance(currentAddr);
	let pbq = web3.utils.fromWei(bq);
	let cbq = parseFloat(pbq).toFixed(3);
	document.getElementById('myBalance').innerHTML = cbq + " CRO"
}

//SALE
//contract writes
async function buySilverBox() {
	let sbp = await presaleContract.methods.sBoxPrice().call();
	let cleanP = web3.utils.toWei(sbp);
	presaleContract.methods.buySilver(currentAddr).send({
		from: currentAddr,
		value: cleanP
	});
}

async function buyGoldBox() {
	let sbp = await presaleContract.methods.gBoxPrice().call();
	let cleanP = web3.utils.toWei(sbp);
	presaleContract.methods.buyGold(currentAddr).send({
		from: currentAddr,
		value: cleanP
	});
}

async function buyFlameBox() {
	let sbp = await presaleContract.methods.fBoxPrice().call();
	let cleanP = web3.utils.toWei(sbp);
	presaleContract.methods.buyFlame(currentAddr).send({
		from: currentAddr,
		value: cleanP
	});
}
//contract reads
async function getSilverPrice() {
	let sbp = await presaleContract.methods.sBoxPrice().call();
	document.getElementById('sPrice').innerHTML = sbp + " CRO"
}

async function getGoldPrice() {
	let sbp = await presaleContract.methods.gBoxPrice().call();
	document.getElementById('gPrice').innerHTML = sbp + " CRO"
}

async function getFlamePrice() {
	let sbp = await presaleContract.methods.fBoxPrice().call();
	document.getElementById('fPrice').innerHTML = sbp + " CRO"
}

async function getSilverLeft() {
	let sCap = await presaleContract.methods.sBoxCap().call();
	let sMinted = await presaleContract.methods.sBoxM().call();
	document.getElementById('sLeft').innerHTML = (sCap - sMinted) + " left";
}

async function getGoldLeft() {
	let sCap = await presaleContract.methods.gBoxCap().call();
	let sMinted = await presaleContract.methods.gBoxM().call();
	document.getElementById('gLeft').innerHTML = (sCap - sMinted) + " left";
}

async function getFlameLeft() {
	let sCap = await presaleContract.methods.fBoxCap().call();
	let sMinted = await presaleContract.methods.fBoxM().call();
	document.getElementById('fLeft').innerHTML = (sCap - sMinted) + " left";
}