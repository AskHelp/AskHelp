var dappAddress = "n1wawtCCRY4KTmomsmA4oTfw2mG5j65TjNU";

$(function() {
    var url = window.location.search;
    var uuid = "";
    var str = "";
    if (url.indexOf("?") != -1) {
        str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            if (strs[i].split("=")[0] == "uuid") {
                uuid = decodeURI(strs[i].split("=")[1]);
            }
        }
    }

    var uuid = uuid.trim();

    if (uuid == "") {

	} else {
			getHelpInfo(uuid);
	}
	
	
	$("#transferbutton").click(function() {
		var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
		var nebpay = new NebPay(); 
		
        var requestor = $("#requestor").val().trim();
        if (!requestor) {
            alert("没有求助者。");
            return;
        }
		
		var amountHelp = $("#amountHelp").val().trim();
		if (!amountHelp) {
            alert("请输入帮助金额。");
            return;
        }
		
		if (isNaN(amountHelp)) {
            alert("帮助金额只能是数字。");
            return;
        }
		
		amountHelp = Number(amountHelp);

        var to = dappAddress;
        var value = amountHelp;
        var callFunction = "giveHelp";
        var callArgs = '["' + requestor + '","' +  uuid + '",' + amountHelp + ']';
        nebpay.call(to, value, callFunction, callArgs, {
            listener: function(resp) {
                console.log(JSON.stringify(resp));

                
            }
        });
    });

});


function getHelpInfo(uuid) {
    var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
    var nebpay = new NebPay();    

    var to = dappAddress;
    var value = "0";
    var callFunction = "get";
    var callArgs = "[\"" + uuid + "\"]";
    nebpay.simulateCall(to, value, callFunction, callArgs, {
        listener: function(resp) {
            console.log(JSON.stringify(resp.result));
			if(resp.result == null || resp.result == ""){
				alert("对不起，没有找到对应记录");
				return;
			}
            var obj = JSON.parse(JSON.parse(resp.result));
			if(obj == null){
				alert("对不起，没有找到对应记录");
				return;
			}
			var requestor = obj.createdBy;
			var amount = obj.amount;
			var reason = obj.reason;
			
			$("#requestor").val(requestor);
			$("#amount").val(amount);
			$("#reason").val(reason);

        }
    });
}