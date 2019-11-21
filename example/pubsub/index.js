import Pubsub from "../../lib/pubsub.js";

Pubsub.subscribe("test", "example.index", function() {
  document.body.style.backgroundColor = "cadetblue";
  alert(`The "test" event has been heard!`);
});

setTimeout(function() {
  Pubsub.publish("test", "example.index");
}, 1000);
