var dappAddress = "n1vkbHuKoSbmG1eu4FZmLnD9P659tik8eyx";

$(function() {
    getHelpList();
	
	
	$("#shownotfinish").click(function() {
		getHelpListForNotFinish();
    });
	
	$("#showall").click(function() {
		getHelpList();
    });

});


function getHelpList() {
    var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
    var nebpay = new NebPay();    

    var to = dappAddress;
    var value = "0";
    var callFunction = "getHelpList";
    var callArgs = "[]";
    nebpay.simulateCall(to, value, callFunction, callArgs, {
        listener: function(resp) {
            console.log(JSON.stringify(resp.result));
if(!resp.result){
				return;
			}
            var myArr = JSON.parse(JSON.parse(resp.result));
			
			var str = "";
			for(var i=0;i<myArr.length;i++){
				var obj = JSON.parse(myArr[i]);
				str += '<div class="col-md-4" ><div class="thumbnail"><div class="caption"><span  style="text-align:center"><h3>';
				if(obj.amountReturn < obj.amountHelp){
					str += '<font color="red">'+'未还清' + '</font>';
				}else{
					str += '<font color="green">'+'已还清' + '</font>';
				}
				str += '</h3></span><div class="form-group"><label for="helper">资助者</label><input type="text" class="form-control" id="helper"  readonly="true" value="';
				str += obj.createdBy;
				str += '"/></div><div class="form-group"><label for="amountHelp">资助金额（NAS）</label><input type="text" class="form-control" id="amountHelp"  readonly="true" value="';
				str += obj.amountHelp;
				str += '"/></div><div class="form-group"><label for="amountReturn">已还金额（NAS）</label><input type="text" class="form-control" id="amountReturn"  readonly="true" value="';
				str += obj.amountReturn;
				str += '"/></div><div class="form-group"><label for="amount">继续还（NAS）</label><input type="text" class="form-control" id="amount'+obj.key+'" value="';
				str += '"/><br><div  align="center"><button type="button" class="btn btn-primary" id="savebutton" onclick="transferamount('+obj.key+');">感恩&偿还</button> </div></div></div></div></div>';
			}
			
			if(str != ""){
				$("#searchResult").html(str);
			}

        }
    });
}

function getHelpListForNotFinish() {
    var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
    var nebpay = new NebPay();    

    var to = dappAddress;
    var value = "0";
    var callFunction = "getHelpList";
    var callArgs = "[]";
    nebpay.simulateCall(to, value, callFunction, callArgs, {
        listener: function(resp) {
            console.log(JSON.stringify(resp.result));
			if(!resp.result){
				return;
			}
            var myArr = JSON.parse(JSON.parse(resp.result));
			
			var str = "";
			for(var i=0;i<myArr.length;i++){
				var obj = JSON.parse(myArr[i]);
				if(obj.amountReturn >= obj.amountHelp){
					continue;
				}
				str += '<div class="col-md-4" ><div class="thumbnail"><div class="caption"><span  style="text-align:center"><h3>';
				if(obj.amountReturn < obj.amountHelp){
					str += '<font color="red">'+'未还清' + '</font>';
				}else{
					str += '<font color="green">'+'已还清' + '</font>';
				}
				str += '</h3></span><div class="form-group"><label for="helper">资助者</label><input type="text" class="form-control" id="helper"  readonly="true" value="';
				str += obj.createdBy;
				str += '"/></div><div class="form-group"><label for="amountHelp">资助金额（NAS）</label><input type="text" class="form-control" id="amountHelp"  readonly="true" value="';
				str += obj.amountHelp;
				str += '"/></div><div class="form-group"><label for="amountReturn">已还金额（NAS）</label><input type="text" class="form-control" id="amountReturn"  readonly="true" value="';
				str += obj.amountReturn;
				str += '"/></div><div class="form-group"><label for="amount">继续还（NAS）</label><input type="text" class="form-control" id="amount'+obj.key+'" value="';
				str += '"/><br><div  align="center"><button type="button" class="btn btn-primary" id="savebutton" onclick="transferamount('+obj.key+');">感恩&偿还</button> </div></div></div></div></div>';
			}
			
			if(str != ""){
				$("#searchResult").html(str);
			}

        }
    });
}

function transferamount(key){
	var amount = $("#amount"+key).val();
	if(!amount){
		alert("请输入金额。");
		return;
	}
	
	if(isNaN(amount)){
		alert("金额只能是数字。");
		return;
	}
	
	amount = Number(amount);
    var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
    var nebpay = new NebPay();  
    var to = dappAddress;
    var value = amount;
    var callFunction = "returnBack";
    var callArgs = '['+key+']';
    nebpay.call(to, value, callFunction, callArgs, {
        listener: function(resp) {
            console.log(JSON.stringify(resp));

            
        }
    });
}