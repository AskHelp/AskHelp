var dappAddress = "n1wawtCCRY4KTmomsmA4oTfw2mG5j65TjNU";
var timerid = "";
$(function() {
    var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
    var nebpay = new NebPay();    

    $("#generateURL").click(function() {
        var uuid = guid();

        var amount = $("#amount").val().trim();
        if (!amount) {
            alert("请输入求助金额。");
            return;
        }
		
		if (isNaN(amount)) {
            alert("求助金额只能是数字。");
            return;
        }
		
		amount = Number(amount);
		
		var reason = $("#reason").val().trim();
        if (!reason) {
            alert("请输入求助原因。");
            return;
        }

        reason = reason.replace(/\n/g, "<br>");

        var to = dappAddress;
        var value = "0";
        var callFunction = "save";
        var callArgs = '["' + uuid + '",' +  amount + ',"' + reason + '"]';
        nebpay.call(to, value, callFunction, callArgs, {
            listener: function(resp) {
                
                var helpURL = "https://askhelp.github.io/AskHelp/display.html" + "?uuid=" + uuid;

                $("#helpURL").val(helpURL);
				
				var txHash = resp.txhash;

            }
        });
    });

});

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
        var r = Math.random() * 16 | 0,
        v = c == 'x' ? r: (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

