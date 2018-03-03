/**
 * Created by 欧阳先学 on 2018/2/25 0025.
 */
function web3Utils() {
}

web3Utils.prototype.web3 = new Web3();
web3Utils.prototype.global_keystore;
web3Utils.prototype.tokenContract;
web3Utils.prototype.nodejs_server = "http://192.168.0.101:9081";
web3Utils.prototype.chain_server = "http://192.168.0.101:8545";
web3Utils.prototype.keystore = null;
web3Utils.prototype.nKeystore;
web3Utils.prototype.AccountName;
web3Utils.prototype.getAccountName = function () {
    // if(AccountName !=null &&AccountName !=""){
    return AccountName;
}
web3Utils.prototype.getAllWallets = function () {
    debugger;
    var v = localStorage.getItem('allwallets');
    var allwallets = null;
    if (v != "" && v != null) {
        var allwallets = JSON.parse(v);
        return allwallets;
    } else {
        return [{"name": "", "account": "", "keystore": ""}]
    }
}
web3Utils.prototype.putInfo = function () {

}
web3Utils.prototype.queryInfo = function () {

}

web3Utils.prototype.getCurrentWallet = function () {
    var v = localStorage.getItem('current_account');
    if (v == null || v == '') {
        v = '';
    }
    return v;
}
web3Utils.prototype.getWalletIndex = function () {
    var account = localStorage.getItem('current_account');
    if (account == "") {
        return 0;
    }
    var v = localStorage.getItem('allwallets');
    var allwallets = null;
    if (v != "" && v != null) {
        var allwallets = JSON.parse(v);
        for (var i = 0; i < allwallets.length; i++) {
            if (allwallets[i].account == account) {
                return i;
            }
        }
    }
    return 0;
}
web3Utils.prototype.getWalletbyAccount = function (account) {
    if (account == null || account == "") {
        return null;
    }
    var v = localStorage.getItem('allwallets');
    var allwallets = null;
    if (v != "" && v != null) {
        allwallets = JSON.parse(v);
        for (var i = 0; i < allwallets.length; i++) {
            if (account == allwallets[i].account) {
                return allwallets[i];
            } else {
                return allwallets[0];
            }
        }
    } else {
        return null;
    }
}
web3Utils.prototype.getWalletbyIndex = function (index) {
    index = parseInt(index);
    var v = localStorage.getItem('allwallets');
    var allwallets = null;
    if (v != "" && v != null) {
        allwallets = JSON.parse(v);
        if (index < allwallets.length) {
            return allwallets[index];
        } else {
            return allwallets[0];
        }
    } else {
        return null;
    }

}
web3Utils.prototype.getBalanceByUnit = function (amount, vUnit) {
    return amount;//单位转换
}
web3Utils.prototype.validateEth = function (account, amount) {
    try {
        var vAccount = web3Utils.web3.eth.getBalance(account);
        if (amount < vAccount) {
            return true;
        } else {
            return false;
        }

    } catch (e) {
        return e.message;
    }
}
web3Utils.prototype.validateName = function (account_name) {
    var v = localStorage.getItem('allwallets');
    var allwallets = null;
    if (v != "" && v != null) {
        var allwallets = JSON.parse(v);
        for (var i = 0; i < allwallets.length; i++) {
            if (allwallets[i].name == account_name) {
                return false;
            }
        }
    }
    return true;
}
web3Utils.prototype.validateToken = function (account, amount) {
    if (!web3Utils.web3.isConnected()) {
        return '';
    }
    try {
        var vAccount = web3Utils.tokenContract.balanceOf(account);
        if (amount < vAccount) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return e.message;
    }

}
web3Utils.prototype.validateAccount = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return false;
    }
}
web3Utils.prototype.validatePassword = function (Password) {
    if (Password == null) {
        return false;
    }
    if (Password.length < 6) {
        return false;
    }
    if (!/^(0x)?[0-9a-f]{6}$/i.test(Password)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{6}$/.test(Password) || /^(0x)?[0-9A-F]{6}$/.test(Password)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return false;
    }
    return true;
}
web3Utils.prototype.loadWallet = function (vAccountName, vKeyStore) {
    debugger;
    var allwallets = "";
    if (vAccountName == "" && vKeyStore == "") {/*加载默认的账号*/
        allwallets = localStorage.getItem('allwallets');
        var account = localStorage.getItem('current_account');
        if (account != null && account != "") {
            web3Utils.keystore = web3Utils.getWalletbyAccount(account).keystore;
        }
    } else {/*导入钱包,在vue里实现vAccountName验证和重复判断*/
        web3Utils.keystore = vKeyStore;
    }
    web3Utils.nKeystore = lightwallet.keystore.deserialize(web3Utils.keystore);
    var addresses = web3Utils.nKeystore.getAddresses();
    if (vAccountName != "" && vKeyStore != "") {
        if (allwallets == null || allwallets == '') {
            allwallets = [];
        }
        allwallets.push({"name": vAccountName, "account": addresses[0], "keystore": web3Utils.keystore});
        localStorage.setItem('allwallets', JSON.stringify(allwallets));
    }
    localStorage.setItem('current_account', addresses[0]);
    var web3Provider = new HookedWeb3Provider({
        host: web3Utils.chain_server,
        transaction_signer: web3Utils.nKeystore
    });
    web3Utils.web3.setProvider(web3Provider);
    console.log(web3Utils.web3.isConnected());
    if (web3Utils.web3.isConnected()) {
        localStorage.setItem(`current_account`, addresses[0]);
        web3Utils.global_keystore = lightwallet.keystore;
        web3Utils.outPrint('blockNumber=' + web3Utils.web3.eth.blockNumber);
        web3Utils.outPrint('accounts=' + web3Utils.web3.eth.accounts);
    } else {
        web3Utils.outPrint('服务器连接失败！');
        alert('服务器连接失败！');
        return false;
    }
    return true;
};
web3Utils.prototype.setWeb3Provider = function (keystore) {
    console.log(JSON.stringify(keystore));
    var web3Provider = new HookedWeb3Provider({
        host: web3Utils.chain_server,
        transaction_signer: keystore
    });
    web3Utils.web3.setProvider(web3Provider);
};
web3Utils.prototype.getAccountByIndex = function (index) {
    var allwallets = web3Utils.getAllWallets();
    if (allwallets.length > index) {
        return allwallets[index].account;
    } else {
        return '';
    }
}
web3Utils.prototype.getLastWallet = function () {
    var v = localStorage.getItem('allwallets');
    var allwallets = null;
    if (v != "" && v != null) {
        allwallets = JSON.parse(v);
        if (allwallets.length > 0) {
            return allwallets[allwallets.length - 1];
        } else {
            return allwallets[0];
        }
    } else {
        return null;
    }
}
web3Utils.prototype.newWallet = function (account_name, passowrd) {
    return true;
};
web3Utils.prototype.newAddresses = function (account_name, password) {
    if (password == '') {
        password = prompt('Enter password to retrieve addresses', 'Password');
    }
    var numAddr = '';
    web3Utils.global_keystore.keyFromPassword(password, function (err, pwDerivedKey) {
        debugger;
        web3Utils.global_keystore.generateNewAddress(pwDerivedKey, numAddr);
        console.log('global_keystore:' + web3Utils.global_keystore.toString());
        debugger;
        var addresses = web3Utils.global_keystore.getAddresses();
        localStorage.setItem(`current_account`, addresses[0])
        web3Utils.setWeb3Provider(web3Utils.global_keystore);
        debugger;
        web3Utils.keystore = web3Utils.global_keystore.serialize();
        console.log(web3Utils.keystore);
        localStorage.setItem(`wallet_keystore`, JSON.stringify(web3Utils.keystore));
        localStorage.setItem(`current_account`, addresses[0]);
        if (account_name != null || account_name != '') {
            var v = localStorage.getItem('allwallets');
            var allwallets = null;
            if (v != "" && v != null) {
                allwallets = JSON.parse(v);
                allwallets.push({"name": account_name, "account": addresses[0], "keystore": web3Utils.keystore});
            } else {
                allwallets = [{"name": account_name, "account": addresses[0], "keystore": web3Utils.keystore}];
            }
            localStorage.setItem('allwallets', JSON.stringify(allwallets));
        }
        alert("账户创建成功！" + addresses);
    })
};

web3Utils.prototype.getEth = function (index) {
    index = parseInt(index);
    debugger;
    var fromAddr = '';
    if (index < 0) {
        var fromAddr = localStorage.getItem(`current_account`);
    } else {
        fromAddr = web3Utils.getAccountByIndex(index);
    }
    if (fromAddr == '') {
        return '';
    }
    if (!web3Utils.web3.isConnected()) {
        web3Utils.loadWallet("", "");
    }
    if (!web3Utils.web3.isConnected()) {
        return '';
    }
    var amount = web3Utils.web3.eth.getBalance(fromAddr)
    web3Utils.outPrint('查询ETH');
    web3Utils.outPrint(fromAddr + " balances =" + amount);
    return amount + "";
};
web3Utils.prototype.getToken = function (index) {
    index = parseInt(index);
    debugger;
    var fromAddr = '';
    if (index < 0) {
        var fromAddr = localStorage.getItem(`current_account`);
    } else {
        fromAddr = web3Utils.getAccountByIndex(index);
    }
    if (fromAddr == '') {
        return '';
    }
    if (!web3Utils.web3.isConnected()) {
        return '';
    }
    web3Utils.loadContract();
    var amount = web3Utils.tokenContract.balanceOf(fromAddr);
    web3Utils.outPrint('查询Token');
    web3Utils.outPrint(fromAddr + " token =" + amount);
    return amount + "";
}
web3Utils.prototype.getBalances = function () {
    var addresses = web3Utils.global_keystore.getAddresses();
    web3Utils.outPrint("balances" + web3Utils.web3.eth.getBalance(addresses[0]));//
}
web3Utils.prototype.setSeed = function () {
    debugger;
    var password = prompt('Enter Password to encrypt your seed', 'Password');
    lightwallet.keystore.createVault({
        password: password,
        seedPhrase: document.getElementById('seed').value,
        hdPathString: "m/0'/0'/0'"
    }, function (err, ks) {
        debugger;
        web3Utils.global_keystore = ks;
        web3Utils.newAddresses(password);
        web3Utils.setWeb3Provider(web3Utils.global_keystore);
        web3Utils.getBalances();
    })
}
web3Utils.prototype.showSeed = function () {
    debugger;
    var password = prompt('输入密码.', 'Password');
    web3Utils.nKeystore.keyFromPassword(password, function (err, pwDerivedKey) {
        var seed = web3Utils.nKeystore.getSeed(pwDerivedKey);
        web3Utils.outPrint("助记词=" + seed);
        // alert('助记词: "' + seed + '". Please write it down.');
    });
}
web3Utils.prototype.sendEth = function (from_account, to_account, amount) {
    debugger;
    if (from_account == '') {
        from_account = localStorage.getItem('current_account');
    }
    var value = amount;
    var gasPrice = 180000;
    var gas = 3000000;
    if (to_account == '') {
        alert('请输入接收帐号地址');
        return false;
    }
    if (!web3Utils.web3.isConnected()) {
        web3Utils.loadWallet("", "");
    }
    web3Utils.outPrint("发送ETH");//
    var from_amount = web3Utils.web3.eth.getBalance(from_account);
    if (from_amount < amount) {
        alert('交易失败：余额不足' + err);
        web3Utils.outPrint('error:余额不足' + err);
        return false;
    }
    web3Utils.outPrint("sendEth balances:</br> " + from_account + ":" + web3Utils.web3.eth.getBalance(from_account));
    web3Utils.web3.eth.sendTransaction({
        from: from_account,
        to: to_account,
        value: value,
        gasPrice: gasPrice,
        gas: gas
    }, function (err, txhash) {
        if (txhash != null) {
            alert('交易提交成功');
            localStorage.setItem('current_eth_txhash', txhash);
        } else {
            alert('交易失败：' + err);
            web3Utils.outPrint('error: ' + err);
            return false;
        }
        web3Utils.outPrint('send ETH result: ');
        web3Utils.outPrint('txhash: ' + txhash);
        return true;
    });
};
web3Utils.prototype.sendData = function (vData) {

};
web3Utils.prototype.loadContract = function () {
    debugger;
    if (!web3Utils.web3.isConnected()) {
        web3Utils.loadWallet("", "");
    }
    if (web3Utils.tokenContract != null) {
        return;
    }
    var abiObject = [{
        "constant": true,
        "inputs": [],
        "name": "coreSender",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "approve",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}, {
            "name": "contractHash",
            "type": "string"
        }, {"name": "_ruleHash", "type": "string"}],
        "name": "transferForRules",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {
            "name": "_value",
            "type": "uint256"
        }],
        "name": "transferFrom",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "", "type": "address"}],
        "name": "balances",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "getLockAmount",
        "outputs": [{"name": "_amount", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "", "type": "address"}, {"name": "", "type": "address"}],
        "name": "allowed",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}, {
            "name": "_period",
            "type": "uint256"
        }],
        "name": "transferAndSetLockDate",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "", "type": "address"}, {"name": "", "type": "uint256"}],
        "name": "transationLogs",
        "outputs": [{"name": "ruleHash", "type": "string"}, {
            "name": "contractHash",
            "type": "string"
        }, {"name": "transactionDateTime", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [{"name": "", "type": "address"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "availableBalance",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
        "name": "transfer",
        "outputs": [{"name": "success", "type": "bool"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "getReleaseDate",
        "outputs": [{"name": "releaseDate", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_sender", "type": "address"}],
        "name": "setSender",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
        "name": "allowance",
        "outputs": [{"name": "remaining", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{"name": "", "type": "address"}],
        "name": "balanceLocks",
        "outputs": [{"name": "amount", "type": "uint256"}, {"name": "unlockDate", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "getTranstions",
        "outputs": [{
            "components": [{"name": "ruleHash", "type": "string"}, {
                "name": "contractHash",
                "type": "string"
            }, {"name": "transactionDateTime", "type": "uint256"}], "name": "", "type": "tuple[]"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_owner", "type": "address"}, {
            "indexed": false,
            "name": "ruleHash",
            "type": "string"
        }, {"indexed": false, "name": "contractHash", "type": "string"}, {
            "indexed": false,
            "name": "transactionDateTime",
            "type": "uint256"
        }],
        "name": "TransationLogsed",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_owner", "type": "address"}, {
            "indexed": true,
            "name": "_amount",
            "type": "uint256"
        }, {"indexed": false, "name": "_expiry", "type": "uint256"}],
        "name": "BalanceLocked",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_from", "type": "address"}, {
            "indexed": true,
            "name": "_to",
            "type": "address"
        }, {"indexed": false, "name": "_value", "type": "uint256"}],
        "name": "Transfer",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{"indexed": true, "name": "_owner", "type": "address"}, {
            "indexed": true,
            "name": "_spender",
            "type": "address"
        }, {"indexed": false, "name": "_value", "type": "uint256"}],
        "name": "Approval",
        "type": "event"
    }];
    var contract = web3Utils.web3.eth.contract(abiObject);//JSON.parse(abi)
    web3Utils.tokenContract = contract.at("0x7c7c9e5771fe204ef562a1a93b1ccacd2da2e5b3");

};
web3Utils.prototype.outContract = function () {

};
web3Utils.prototype.sendToken = function (from_account, to_account, amount) {
    debugger;
    web3Utils.outPrint("发送Token");
    if (to_account == '') {
        alert('请输入接收帐号地址');
        return false;
    }
    if (!web3Utils.web3.isConnected()) {
        web3Utils.loadWallet("", "");
        if (!web3Utils.web3.isConnected()) {
            alert('网络连接失败！');
            return false;
        }
    }
    web3Utils.loadContract();
    if (web3Utils.tokenContract == null) {
        alert('合约加载失败！');
        return false;
    }
    var from_amount = web3Utils.tokenContract.balanceOf(from_account);
    if (from_amount < amount) {
        alert('交易失败：余额不足');
        web3Utils.outPrint('error:余额不足');
        return false;
    }
    var gasPrice = web3Utils.web3.eth.gasPrice;
    var transactionObject = {from: from_account, gas: 3000000};
    var result3 = web3Utils.tokenContract.transfer.sendTransaction(to_account, amount, transactionObject, function (err, txhash) { //,{value: 200, gas: 2000}  // web3Utils.web3.toWei(1, "ether")
        debugger;
        if (txhash != null) {
            alert('交易提交成功');
            localStorage.setItem('current_token_txhash', txhash);
        } else {
            alert('交易失败：' + err);
            web3Utils.outPrint('token tx error: ' + err);
            return false;
        }
        web3Utils.outPrint('token txhash: ' + txhash);
    });
    debugger;
};
var web3Utils = new web3Utils();
window.web3Utils = web3Utils;
