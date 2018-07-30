/**
 * Created by 前端 on 2018/1/31.
 */

function  WebSockets(uri,name,sendM,symbols,callBack) {
    this.name = name;
    this.wsUri = uri;
    this.sendMessage = sendM;
    this.websocket = new WebSocket(uri);
    this.arrData = symbols;
    this.callBack = callBack;
}
WebSockets.prototype.init = function() {
    var that = this;
    this.websocket.onopen = function(evt) {
        that.onOpen(evt)
    };
    this.websocket.onclose = function(evt) {
        that.onClose(evt)
    };
    this.websocket.onmessage = function(evt) {
        that.onMessage(evt)
    };
    this.websocket.onerror = function(evt) {
        that.onError(evt)
    };
};
WebSockets.prototype.onOpen = function (e) {
     var that = this;
     for(var i = 0; i<that.arrData.length;i++){
          var res = JSON.stringify(that.sendMessage).replace(/\$symbol/g,that.arrData[i]);
          that.websocket.send(res);
     }
};
WebSockets.prototype.onClose = function (e) {
    // var that = this;
    // setTimeout(
    //     function () {
    //         var ws = new WebSockets(that.wsUri,that.name,that.sendMessage,that.arrData);
    //         ws.init();
    //     }
    //     ,3000);
};
WebSockets.prototype.onMessage = function (e) {
   var that = this;
   if(typeof e.data === "string"){
       var msg = JSON.parse(e.data);
       that.callBack(msg,that.name);
   }else {

       var render = new FileReader();
       render.onloadend = function () {
           var ms = pako.inflate(render.result, {
               to: 'string'
           });
           var msg = JSON.parse(ms);
           if (msg.ping) {
               that.websocket.send(JSON.stringify({
                   pong: msg.ping
               }));
           } else if (msg.tick) {
               var attr = msg.ch.split(".")[1];
               document.querySelector("." + that.name + attr).innerHTML = parseFloat(msg.tick.close);
           }
       };
       render.readAsBinaryString(e.data);
   }
};
WebSockets.prototype.onError = function (e) {
    // var that = this;
    // setTimeout(
    //     function () {
    //         var ws = new WebSockets(that.wsUri,that.name,that.sendMessage,that.arrData);
    //         ws.init();
    //     }
    //     ,3000);
};