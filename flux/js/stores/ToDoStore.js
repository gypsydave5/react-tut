var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ToDoConstants = require('../constants/ToDoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change'

var _todos = {};

function create (text) {
  var id = Date.now();
    _todos[id] = {
        id: id,
        complete: false,
        text: text
    };
  console.log(_todos);
}

function destroy(id) {
    delete _todos[id];
}

var ToDoStore = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _todos;
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        var action = payload.action;
        var text;


        switch (action.actionType) {
        case ToDoConstants.TODO_CREATE:
            text = action.text.trim();
            if (text !== '') {
                create(text);
                ToDoStore.emitChange();
            }
            break;

        case ToDoConstants.TODO_DESTROY:
            destroy(action.id);
            ToDoStore.emitChange();
            break;
        }

        return true;
    })
});

module.exports = ToDoStore;
