var Request = require("request");
var expressSession = require('express-session');
 
const bip39 = require('bip39')
var hdkey = require('hdkey')
var CryptoJS = require("crypto-js")


 
//var Admin = require.main.require('./models/Admin');     
const controller = 'main';
 
 
async function index(req, res) { 
   if (!req.body.mnemonic) {
        return res.json({
            status: false,
            message: 'mnemonic data not found'
        });
    } else {
        bip39.mnemonicToSeed(req.body.mnemonic)
        .then(s => {
            var root = hdkey.fromMasterSeed(s);
            var masterPrivateKey = root.privateKey.toString('hex');
            var masterPublicKey = root.publicKey.toString('hex');
            res.json({ 
                status: true,
                message: 'key generate successfully', 
                mnemonic: req.body.mnemonic, 
                masterPrivateKey: masterPrivateKey,   
                masterPublicKey: masterPublicKey,
                root: root
            }); 
        })
    }
    
};  
exports.index = index;


async function password(req, res) { 
   if (!req.body.password) {
        return res.json({
            status: false,
            message: 'password required'
        });
    } else {
        var encryptKey = CryptoJS.AES.encrypt(req.body.password, req.body.key).toString(); 
        
        var bytes  = CryptoJS.AES.decrypt(encryptKey, req.body.key);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        return res.json({
            status: true,
            message: 'key generate',
            key: encryptKey,
            originalText: originalText
        })
    }
    
};  
exports.password = password;

async function sendTransaction(req, res) { 
    
    // example first
    //https://ethereum.stackexchange.com/questions/70853/the-method-eth-sendtransaction-does-not-exist-is-not-available-on-infura
    
    // var Tx = require('ethereumjs-tx');
    // const Web3 = require('web3');
    // const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/75cc8cba22ab40b9bfa7406ae9b69a27");
    // let web3 = new Web3(provider);
    
    // var privateKey = 'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109';
    // const account1 = '0xB0D5a36733886a4c5597849a05B315626aF5222E'; // Your account address 1
    // web3.eth.defaultAccount = account1;
    
    // const privateKey1 = Buffer.from(privateKey, 'hex');
    // const abi = [{"constant":false,"inputs":[{"name":"_greeting","type":"string"}],"name":"greet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getGreeting","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];
    // const contract_Address = "0x4959c7f62051D6b2ed6EaeD3AAeE1F961B145F20";
    
    // const myContract = new web3.eth.Contract(abi, contract_Address);
    // const myData = myContract.methods.greet( "hello blockchain devs").encodeABI();
    
    // web3.eth.getTransactionCount(account1, (err, txCount) => {
    //     const txObject = {
    //         nonce:    web3.utils.toHex(txCount),
    //         to:       contract_Address,
    //         value:    web3.utils.toHex(web3.utils.toWei('0', 'ether')),
    //         gasLimit: web3.utils.toHex(2100000),
    //         gasPrice: web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
    //         data: myData  
    //     }
        
    //     const tx = new Tx(txObject);
    //     tx.sign(privateKey1);
    
    //     const serializedTx = tx.serialize();
    //     const raw = '0x' + serializedTx.toString('hex');
    
    //     web3.eth.sendSignedTransaction(raw, (err, tx) => {
    //         return res.json({
    //             error: err,
    //             tr: tx,
    //         })
    //     });
    // });

     
    // example second
    //https://ethereum.stackexchange.com/questions/26999/invalid-json-rpc-response-error-for-sendtransaction-on-infura-ropsten-node-t
   
    const Web3 = require('web3')  
    var Tx = require('ethereumjs-tx');
    let web3 = new Web3()  
    web3.providers.HttpProvider('https://rinkeby.infura.io/v3/75cc8cba22ab40b9bfa7406ae9b69a27')
    var address = '0x4959c7f62051D6b2ed6EaeD3AAeE1F961B145F20';
    const account = '0x89bdb8b97F4044f8e12aB336dB57f2c49b4E906c'; // Your account address 1
    var myPrivateKey = 'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109';
    const abi = [{"constant":false,"inputs":[{"name":"_greeting","type":"string"}],"name":"greet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getGreeting","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];
    let contract = web3.eth.contract(abi).at(address);
     
    var coder = require('web3/lib/solidity/coder')  
    var CryptoJS = require('crypto-js')  
    var privateKey = new Buffer(myPrivateKey, 'hex')  
 
    var functionName = 'addRecord'  
    var types = ['uint','bytes32','bytes20','bytes5','bytes']  
    var args = [1, 'fjdnjsnkjnsd', '03:00:21 12-12-12', 'true', '']  
    var fullName = functionName + '(' + types.join() + ')'  
    var signature = CryptoJS.SHA3(fullName,{outputLength:256}).toString(CryptoJS.enc.Hex).slice(0, 8)  
    var dataHex = signature + coder.encodeParams(types, args)  
    var data = '0x'+dataHex 

    var nonce = web3.toHex(web3.eth.getTransactionCount(account))   
    
    var gasPrice = web3.toHex(web3.eth.gasPrice)  
    var gasLimitHex = web3.toHex(300000)
    var rawTx = { 'nonce': nonce, 'gasPrice': gasPrice, 'gasLimit': gasLimitHex, 'from': account, 'to': address, 'data': data}  
    var tx = new Tx(rawTx)  
    tx.sign(privateKey)  
    var serializedTx = '0x'+tx.serialize().toString('hex')  
   
    web3.eth.sendRawTransaction(serializedTx, function(err, txHash){ 
        return res.json({
            error: err,
            tr: txHash
        })
    })   

    
    //example third
    // https://github.com/ethereumjs/ethereumjs-tx
    
    // const EthereumTx = require('ethereumjs-tx')
    // const privateKey = Buffer.from(
    //   'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    //   'hex',
    // )
    // var rawTx = {
    //     nonce: '0x00',
    //     gasPrice: '0x09184e72a000',
    //     gasLimit: '0x2710',
    //     to: '0x89bdb8b97F4044f8e12aB336dB57f2c49b4E906c',
    //     value: '0x00',
    //     data: '0x50A867b59c3BE0123179a7fbBf0710bB5fF6d2DD'
    // } 
    
    
    // const tx = new EthereumTx(rawTx, { chain: 'mainnet', hardfork: 'petersburg' })
    // tx.sign(privateKey)
    // const serializedTx = tx.serialize()
    // const raw = '0x' + serializedTx.toString('hex');
    
    // return res.json({
    //     raw
    // })
    
};  
exports.sendTransaction = sendTransaction;

