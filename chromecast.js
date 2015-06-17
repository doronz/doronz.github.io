<!-- Setting up chromecast receiver -->
var appConfig = new cast.receiver.CastReceiverManager.Config();
// 100 minutes for testing, use default 10sec in prod by not setting this value
appConfig.maxInactivity = 6000;
window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
window.castReceiverManager.start(appConfig);

var customMessageBus = castReceiverManager.getCastMessageBus('urn:x-cast:com.doronzehavi.casttest');
customMessageBus.onMessage = function(event) {
 // Messages received here from client
  var header = document.createElement('H1');
  var text = document.createTextNode(event.data);
  header.appendChild(text);
 document.getElementById('content').appendChild(header);
  
}