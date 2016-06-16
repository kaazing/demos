/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';
	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ALL_TODOS,
				editing: null,
				newTodo: ''
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
				'/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
				'/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
			});
			router.init('/');
		},

		handleChange: function (event) {
			this.setState({newTodo: event.target.value});
		},

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTodo.trim();

			if (val) {
				this.props.model.addTodo(val);
				this.setState({newTodo: ''});
			}
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.props.model.toggleAll(checked);
		},

		toggle: function (todoToToggle) {
			this.props.model.toggle(todoToToggle);
		},
		busy: function(busyTodo){
			this.props.model.busy(busyTodo, true);
		},
		notbusy: function(busyTodo){
			this.props.model.busy(busyTodo, false);
		},

		destroy: function (todo) {
			this.props.model.destroy(todo);
		},

		edit: function (todo) {
			this.setState({editing: todo.id});
			this.props.model.busy(todo, true);
		},

		save: function (todoToSave, text) {
			this.props.model.save(todoToSave, text);
			this.setState({editing: null});
		},

		cancel: function () {
			this.setState({editing: null});
		},

		clearCompleted: function () {
			this.props.model.clearCompleted();
		},

		render: function () {
			var footer;
			var main;
			var todos = this.props.model.todos;

			var shownTodos = todos.filter(function (todo) {
				switch (this.state.nowShowing) {
				case app.ACTIVE_TODOS:
					return !todo.completed;
				case app.COMPLETED_TODOS:
					return todo.completed;
				default:
					return true;
				}
			}, this);

			var todoItems = shownTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.id}
						todo={todo}
						onToggle={this.toggle.bind(this, todo)}
						onBusy={this.busy.bind(this, todo)}
						onNotBusy={this.notbusy.bind(this, todo)}
						onDestroy={this.destroy.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={this.state.editing === todo.id}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel}
					/>
				);
			}, this);

			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			var completedCount = todos.length - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
					/>;
			}

			if (todos.length) {
				main = (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
						/>
						<ul className="todo-list">
							{todoItems}
						</ul>
					</section>
				);
			}

			return (
				<div>
					<header className="header">
						<h1>todos</h1>
						<input
							className="new-todo"
							placeholder="What needs to be done?"
							value={this.state.newTodo}
							onKeyDown={this.handleNewTodoKeyDown}
							onChange={this.handleChange}
							autoFocus={true}
						/>
					</header>
					{main}
					{footer}
				</div>
			);
		}
	});

	function render() {
		React.render(
			<TodoApp model={model}/>,
			document.getElementsByClassName('todoapp')[0]
		);
	}

	// Connect to WebSocket
	var client=UniversalClientDef("amqp");
	var connectionInfo= {
		url: "wss://demo-stage.kaazing.com:443/amqp091",
		username: "guest",
		password: "guest"
	};
	var TOPIC_PUB="todomvc";
	var TOPIC_SUB="todomvc";
	var noLocal=true;

	var model = new app.TodoModel('react-todos');

	var messageHandler=function(msg){
		model.onMessage(msg);
	};
	var exceptionHandler=function(error){
		alert(error);
	};
	client.connect(connectionInfo, exceptionHandler, function(connection){
		connection.subscribe(TOPIC_PUB, TOPIC_SUB,messageHandler, noLocal, function(subscription){
			console.info("Subscription is created "+subscription);
			model.setWsClient(subscription);

			var msg={
				command:"init"
			};
			subscription.sendMessage(msg);
			model.subscribe(render);
			render();
		});
	});
})();
