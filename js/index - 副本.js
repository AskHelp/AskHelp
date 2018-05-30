$(function() {
    var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
    var nebpay = new NebPay();

    var dappAddress = "n1yNdCdXoRqtZBkjwWzSojfs7QmR22XVKH1";
    var txHash = "9cda6c2d8e2f94be96d7f8dbf68f0cf68756d2d081b73033bec5359f877c6f5d";
    $("#savebutton").click(function() {
        var uuid = guid();

        var expressLoveWords = $("#expressLoveWords").val();
        if (expressLoveWords == "") {
            alert("请输入你要说的话。");
            return;
        }

        expressLoveWords = expressLoveWords.replace(/\n/g, "<br>");

        var to = dappAddress;
        var value = "0";
        var callFunction = "save";
        var callArgs = "[\"" + uuid + "\",\"" + expressLoveWords + "\"]";
        nebpay.call(to, value, callFunction, callArgs, {
            listener: function(resp) {
                console.log(JSON.stringify(resp));
                var expressLoveURL = "file:///E:/nas/dapp/testnet/ExpressLove/index.html" + "?uuid=" + uuid;

                $("#expressLoveURL").val(expressLoveURL);
            }
        });
    });
	
	$("#testbutton").click(function(){
		var expressLoveURL = $("#expressLoveURL").val().trim();
		if(expressLoveURL != ""){
			window.open(expressLoveURL);
		}
		
	});

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

        getLoveWords(uuid);
    }

});

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
        var r = Math.random() * 16 | 0,
        v = c == 'x' ? r: (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getLoveWords(uuid) {
    var NebPay = require("nebpay"); //https://github.com/nebulasio/nebPay
    var nebpay = new NebPay();

    var dappAddress = "n1yNdCdXoRqtZBkjwWzSojfs7QmR22XVKH1";
    var txHash = "9cda6c2d8e2f94be96d7f8dbf68f0cf68756d2d081b73033bec5359f877c6f5d";

    var to = dappAddress;
    var value = "0";
    var callFunction = "get";
    var callArgs = "[\"" + uuid + "\"]";
    nebpay.simulateCall(to, value, callFunction, callArgs, {
        listener: function(resp) {
            //console.log(JSON.stringify(resp.result));
            var expressLoveWords = JSON.parse(resp.result).expressLoveWords;
            $("#searchResult").html(expressLoveWords);

            $('#modal-container-367857').on('hide.bs.modal',
            function() {
                window.location.href = window.location.href.split("?")[0];
            });
            $("#modal-container-367857").modal();

        }
    });
}