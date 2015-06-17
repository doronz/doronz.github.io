window.onload = function() {
  cast.receiver.logger.setLevelValue(0);
  window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  
  
  // create a CastMessageBus to handle messages for a custom namespace
  window.messageBus =
    window.castReceiverManager.getCastMessageBus(
    'urn:x-cast:com.doronzehavi.casttest');
  
  
  window.messageBus.onMessage = function(event) {
    console.log('Message [' + event.senderId + ']: ' + event.data);
    // display the message from the sender
    displayText(event.data); 
  }
  
  
  // initialize the CastReceiverManager
  var appConfig = new cast.receiver.CastReceiverManager.Config();
  appConfig.maxInactivity = 6000;
  window.castReceiverManager.start(appConfig);
  console.log('Receiver Manager started');
};

function displayText(text) {
 // Messages received here from client
  document.getElementById("header").innerHTML = text;
  
}