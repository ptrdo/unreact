/**
 * @name unreact/lib/pubsub.js
 * @description Facilitates subscribing listeners to remarkable events.
 * @author ptrdo@users.noreply.github.com
 * @version 0.1.0, 2019/11/21
 * @requires ES6
 *
 * @usage pubsub.subscribe("default", "uniqueIdentifier", someFunction);
 * @usage pubsub.unsubscribe("default", "uniqueIdentifier"); // removes listeners of that event which are so-named
 * @usage pubsub.publish("default", someRelevantContextualData);
 */
const pubsub = {
  events: {
    "default": []
  },
  subscribe: function (eventName, observer, callback) {
    if (!!eventName) {
      if (!!callback && callback instanceof Function) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push({ observer: observer, callback: callback });
      }
    } else {
      console.error("unreact:pubsub:",'"Attempt to subscribe to unknown event!" Use:', Object.keys(this.events));
    }
  },
  unsubscribe: function (eventName, observer) {
    if (!!eventName && eventName in this.events) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i].observer === observer) {
          this.events[eventName].splice(i, 1);
          break;
        }
      };
    } else {
      console.error("unreact:pubsub:",'"Attempt to unsubscribe from unknown event!" Use:', Object.keys(this.events));
    }
  },
  publish: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (instance) {
        try {
          instance.callback(data);
        } catch (err) {
          console.warn("unreact:pubsub:", eventName, instance);
        }
      });
    }
  },
  isSubscribed: function(eventName) {
    return eventName in this.events && this.events[eventName].length > 0;
  },
  initialize: function () {
    for (let listener in this.events) {
      this.events[listener] = [];
    }
  },
  print: function () {
    return this.events;
  }
};

/**
 * addEventListener subscribes a callback to a remarkable event.
 *
 * @public
 * @param {String} eventName is expected to be either "signin" or "signout".
 * @param {String|*} observer is any unique identifier. e/g "comps.context.refresh"
 * @param {Function} callback is the code to execute upon publish of event.
 * @return {null}
 */
const addEventListener = function (eventName, observer, callback) {
  pubsub.subscribe(eventName, observer, callback);
};

/**
 * removeEventListener unsubscribes a callback from a remarkable event.
 *
 * @public
 * @param {String} eventName is expected to be either "signin" or "signout".
 * @param {String|*} observer is any unique identifier. e/g "comps.context.refresh"
 * @param {Function} callback is the code to execute upon publish of event.
 * @return {null}
 */
const removeEventListener = function (eventName, observer, callback) {
  pubsub.unsubscribe(eventName, observer, callback);
};

/**
 * clearEventListeners unsubscribes all callbacks from remarkable events.
 *
 * @public
 * @return {null}
 */
const clearEventListeners = function() {
  pubsub.initialize();
};

export default pubsub;