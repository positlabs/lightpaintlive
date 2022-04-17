/*

  Slightly modified MicroEvent
  https://github.com/jeromeetienne/microevent.js

*/

var MicroEvent = function () {};
MicroEvent.prototype = {
  watch: function (event, fct) {
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(fct);
  },
  unwatch: function (event, fct) {
    this._events = this._events || {};
    if (event in this._events === false) return;
    this._events[event].splice(this._events[event].indexOf(fct), 1);
  },
  notify: function (event /* , args... */ ) {
    this._events = this._events || {};
    if (event in this._events === false) return;
    for (var i = 0; i < this._events[event].length; i++) {
      this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
    }
  }
};
MicroEvent.mixin = function (destObject) {
  var props = ['watch', 'unwatch', 'notify'];
  for (var i = 0; i < props.length; i++) {
    if (typeof destObject === 'function') {
      destObject.prototype[props[i]] = MicroEvent.prototype[props[i]];
    } else {
      destObject[props[i]] = MicroEvent.prototype[props[i]];
    }
  }
  return destObject;
}


/*

  Simple model that supports shallow property change watchers

*/
function Model(obj) {
  var model = this
  obj = Object.assign({}, obj) // clone just to be safe
  this._properties = obj
  Object.keys(obj).forEach(key => {
    Object.defineProperty(this, key, {
      get() {
        return obj[key]
      },
      set(newValue) {
        // console.log('set', key, newValue)
        // ignore if value isn't changed.
        // won't work for objects or arrays
        if (newValue === obj[key]) return
        var oldValue = obj[key]
        obj[key] = newValue
        model.notify(key, newValue, oldValue)
      },
      enumerable: true
    })
  })

  // manually set to trigger change handlers
  model.set = (key, newValue, silent = false) => {
    var oldValue = obj[key]
    obj[key] = newValue
    model.notify(key, newValue, oldValue, silent)
  }

}
MicroEvent.mixin(Model)

module.exports = Model
