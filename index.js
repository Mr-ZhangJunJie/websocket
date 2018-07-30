window.onload = function () {
    //  动态生成表格
    var str = 'btcusdt bchusdt ethusdt etcusdt ltcusdt eosusdt xrpusdt omgusdt dashusdt zecusdt hsrusdt qtumusdt neousdt' +
        ' bchbtc ethbtc ltcbtc etcbtc eosbtc omgbtc dashbtc xrpbtc zecbtc qtumbtc hsrbtc';
    var symbols = str.split(" ");
    var tabel = ` <table border="1" cellspacing="0" width="90%" align="center">
          <tr>
              <th width="20%" text-align="center"></th>
              <th width="20%">Hobi</th>
              <th width="20%">Binance</th>
              <th width="20%">Okex</th>
              <th width="20%">Zb</th>
          </tr>
         ${productTr()}
        </table>`;
    function productTr(){
        var str = "";
        var backColor = "";
        for(var i=0;i<symbols.length;i++){
            backColor = i%2?"#F7F7F7":"#F9CC9D";
            str += `
                    <tr bgcolor=${backColor}>
                         <td>${symbols[i]}</td>
                         <td class="Hobi${symbols[i]}"></td>
                         <td class="Binance${symbols[i]}"></td>
                         <td class="Okex${symbols[i]}"></td>
                         <td class="Zb${symbols[i]}"></td>
                   </tr>
                `;
        }
        return str;
    };
    document.body.innerHTML = tabel;


    // Huobi
    var sendMessage = {
        "sub": "market.$symbol.kline.5min",
        "id": "$symbol"
    };
    var ws1 = new WebSockets("wss://api.huobi.pro/ws","Hobi",sendMessage,symbols);
    ws1.init();
    // Binance
    function binance() {
        for(var i=0;i<symbols.length;i++){
            connect(symbols[i]);
        }
    }
    binance();
    function connect(obj) {
        var stream = 'wss://stream.binance.com:9443/ws/';
        var  ws = new WebSocket(stream + obj +'@kline_' + '5m');
        ws.onmessage = function (e) {
            document.querySelector("."+"Binance"+obj).innerHTML=parseFloat(JSON.parse(e.data).k.c);
        };
        ws.onerror = function (e) {
            binance();
        };
        ws.onclose = function (e) {
            binance();
        };
    }
    //Zb
    var sendMessage1 = {
            'event':'addChannel',
            'channel':'$symbol_ticker',
    };
    function ws2Fun(msg,name) {
        if(msg.ticker){
            var num = msg.channel.indexOf("_");
            var str = msg.channel.slice(0,num);
           document.querySelector("."+name + str).innerHTML = parseFloat(msg.ticker.last);
        }
    }
    var ws2 = new WebSockets("wss://api.zb.com:9999/websocket","Zb",sendMessage1,symbols,ws2Fun);
    ws2.init();

    //Okex
    var sendMessage2 = {'event':'addChannel','channel':'ok_sub_spot_$symbol_ticker'};
    function ws3Fun(msg,name) {
        if(msg[0].data.last){
            var aa= msg[0].channel;
            var index= aa.indexOf("_ticker");
            var str = aa.slice(12,index);
            var str1 = str.replace(/\_/g,"");
            document.querySelector("."+ name + str1).innerHTML = parseFloat(msg[0].data.last);
        }
    }
    var str1 = 'btc_usdt bch_usdt eth_usdt et_cusdt ltc_usdt eos_usdt xrp_usdt omg_usdt dash_usdt zec_usdt hsr_usdt qtum_usdt neo_usdt' +
        ' bch_btc eth_btc ltc_btc etc_btc eos_btc omg_btc dash_btc xrp_btc zec_btc qtum_btc hsr_btc';
    var symbols1 = str1.split(" ");
    var ws3 = new WebSockets("wss://real.okex.com:10441/websocket","Okex",sendMessage2,symbols1,ws3Fun);
    ws3.init();
};