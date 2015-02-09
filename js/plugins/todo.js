/**
 * @file todo command plugin script
 * @description 待办事项管理，并在标签页显示
 * @author tomasy
 * @email solopea@gmail.com
 */

define(function (require, exports, module) {
    var util = require('../common/util');
    var request = require('../common/request');
    var title = '添加todo';
    var subtitle = '添加todo，单击todo选项消除';

    function createItem(index, item) {
        return [
            '<div data-type="todo" data-id="' + item.id + '" data-index="' + index + '" class="ec-item">',
            '<span class="ec-item-text">' + item.text + '</span>',
            '<span class="ec-item-note">TODO</span>',
            '</div>'
        ];
    }

    function onInput(key) {
    }

    function onEnter(elem) {
        if (!elem || $(elem).data('type') === 'plugins') {
            addTodo.call(this, this.query);
        }
        else {
            removeTodo.call(this, elem);
        }
    }

    function removeTodo(id) {
        var cmdbox = this;
        getTodos(function (todos) {
            todos = todos.filter(function (todo) {
                return todo.id != id;
            });

            chrome.storage.sync.set({
                todo: todos

            }, function () {
                    cmdbox.empty();
                });
        });
    }

    function addTodo(todo) {
        var cmdbox = this;

        getTodos(function (todos) {
            if (!todos || !todos.length) {
                todos = [];
            }

            todos.push({
                id: +new Date(),
                text: todo

            });

            chrome.storage.sync.set({
                todo: todos

            }, function () {
                    cmdbox.empty();
                    noticeBg2refresh();
                });
        });
    }

    function noticeBg2refresh() {
        request.send({
            action: 'addTodo'

        });
    }

    function getTodos(callback) {
        chrome.storage.sync.get('todo', function (results) {
            var todos = results.todo;

            callback(todos);
        });
    }

    function showTodos() {
        var cmdbox = this;

        getTodos(function (todos) {
            cmdbox.showItemList(todos);
        });
    }

    module.exports = {
        title: title,
        subtitle: subtitle,
        showTodos: showTodos,
        onInput: onInput,
        onEnter: onEnter,
        createItem: createItem

    };
});
