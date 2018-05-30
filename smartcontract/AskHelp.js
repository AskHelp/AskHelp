"use strict";

var AskHelp = function() {
    LocalContractStorage.defineMapProperty(this, "dataMap");
	
	LocalContractStorage.defineMapProperty(this, "helpMap");
	LocalContractStorage.defineMapProperty(this, "helpMapIterator");
	LocalContractStorage.defineProperty(this, "size");
};

AskHelp.prototype = {
    init: function() {
		this.size = 0;
	},
	
	//存储一条求助信息
    save: function(uuid, amount, reason) {
        uuid = uuid.trim();
		reason = reason.trim();

        if (uuid === "") {
            throw new Error("empty uuid");
        }
        if (reason === "") {
            throw new Error("empty reason");
        }
		if(isNaN(amount)){
			throw new Error("wrong amount");
		}
		
		var obj = new Object();
		obj.key = uuid;
		obj.amount = amount;
        obj.reason = reason;
		obj.createdBy = Blockchain.transaction.from;
		obj.createdDate = Blockchain.transaction.timestamp;
		
		this.dataMap.set(uuid, JSON.stringify(obj));
		
		//帮助过我的人的数组，初始为空
		var helpIteratorArr = [];
		this.helpMapIterator.set(Blockchain.transaction.from, JSON.stringify(helpIteratorArr));		
    },
	
	//取出一条求助信息
    get: function(uuid) {
        uuid = uuid.trim();

        if (uuid === "") {
            throw new Error("empty uuid");
        }
		
        return this.dataMap.get(uuid);
    },
	
	//存储帮助过我的记录
	giveHelp: function(requestor, uuid, amountHelp) {
        uuid = uuid.trim();
		requestor = requestor.trim();

        if (uuid === "") {
            throw new Error("empty uuid");
        }
        if (requestor === "") {
            throw new Error("empty requestor");
        }
		if(isNaN(amountHelp)){
			throw new Error("wrong amountHelp");
		}
		
		//新建一条帮助过我的记录
		var obj = new Object();
		obj.key = this.size;
		obj.requestor = requestor;
		obj.amountHelp = amountHelp;//获得帮助的金额
		obj.amountReturn = 0;//偿还的金额
        obj.uuid = uuid;
		obj.createdBy = Blockchain.transaction.from;
		obj.createdDate = Blockchain.transaction.timestamp;
		
		//存储一条帮助过我的记录
		this.helpMap.set(this.size, JSON.stringify(obj));		
		
		//取出旧的帮助过我的记录数组，并追加一条新的记录
		var helpIteratorArr = JSON.parse(this.helpMapIterator.get(requestor));
		helpIteratorArr.push(this.size);
		
		//更新帮助过我的记录列表
		this.helpMapIterator.set(requestor, JSON.stringify(helpIteratorArr));
		
		//将金额转给求助者
		var result = Blockchain.transfer(obj.requestor, amountHelp * 1000000000000000000);
		if (!result) {
		  throw new Error(JSON.stringify(result));
		}
		Event.Trigger("GiveHelp", {
		  Transfer: {
			from: Blockchain.transaction.to,
			to: obj.requestor,
			value: amountHelp * 1000000000000000000
		  }
		});
		
		
		
		this.size += 1;
    },
	
	//取出所有帮助过我的记录
	getHelpList: function() {
        var requestor = Blockchain.transaction.from;
		var resultArr = [];
		var helpIteratorArr = [];
		var temp = this.helpMapIterator.get(requestor);
		if(temp != "" && temp != null){
			helpIteratorArr = JSON.parse(temp);
		}

		for(var i =0; i<helpIteratorArr.length;i++){
			resultArr.push(this.helpMap.get(helpIteratorArr[i]));
		}
		
        return JSON.stringify(resultArr);
    },
	
	//归还一条帮助过我的记录
	returnBack: function(key) {
        if (isNaN(key)) {
            throw new Error("key should be number");
        }
		
		var obj = JSON.parse(this.helpMap.get(key));
		obj.amountReturn += Blockchain.transaction.value/1000000000000000000;//偿还的金额完全自愿，可多可少，全部累加起来
		this.helpMap.set(key, JSON.stringify(obj));
		
		//将金额还给资助者
		var result = Blockchain.transfer(obj.createdBy, Blockchain.transaction.value);
		if (!result) {
		  throw new Error(JSON.stringify(result));
		}
		Event.Trigger("ReturnBack", {
		  Transfer: {
			from: Blockchain.transaction.to,
			to: obj.createdBy,
			value: Blockchain.transaction.value
		  }
		});
    }
};

module.exports = AskHelp;