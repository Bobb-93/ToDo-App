// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// define variables and functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const displayTodoItemsCount = function() {
	let count = todos.length || 0;
	nodes.totalItemsCount.innerHTML = count;
}

const displayCompletedItemsCount = function() {
	let count = 0;
	todos.forEach(
		todo => {
			if(todo.completed === true){
				count += 1;
			}else{
				count = count;
			}
		}
	);
	nodes.completedItemsCount.innerHTML = count;
}

const renderTodos = function(e) {
	// clean current todos:
	nodes.todoItems.innerHTML = '';
	
	// add todo item at the end
	todos.forEach( todo => {
		nodes.todoItems.innerHTML += `
		<li data-id=${todo.id}  class="${todo.completed?'completed':''}">
		<span class="todoID">${todo.id}.</span>
		<span>${todo.title}</span>
		<div class="removeTodo"><i class="far fa-trash-alt"></i></div>
		<div class="completeTodo"><i class="far ${todo.completed?'fa-check-square':'fa-square'}"></i></div>
		</li>
		`;
	})
	
	displayTodoItemsCount();
	displayCompletedItemsCount();
}

const addTodo = function() {
	// get the input text:
	const todoText = nodes.addTodoInput.value;
	
	const id = todos.length ? todos[todos.length-1].id + 1 : 1;
	
	// create the new todo object
	const newTodo = {
		"id": id,
		"title": todoText,
		"completed": false
	};
	
	// add new todo object to the end of todos array:
	// todos = [...todos, newTodo];
	todos.push(newTodo);
	
	
	// render todos:
	renderTodos();
	
	// clear input text
	nodes.addTodoInput.value = '';
	
	// focus on input for new todo:
	nodes.addTodoInput.focus();
}

const removeTodo = function (e) {
	// get id of todo to be removed
	let todoID;
	if(e.target.classList.contains('fa-trash-alt')){
		todoID = +e.target.parentNode.parentNode.dataset.id;
	}else if( e.target.classList.contains('removeTodo')){
		// if icon is streatched to div.removeTodo => this is not needed
		todoID = +e.target.parentNode.dataset.id;
	}else{
		return;
	}
	
	// get the index of todo to be removed from todos array:
	let idx = todos.findIndex(todo => todo.id === todoID);
	
	// remove from todos array the element with index idx:
	idx>=0 && todos.splice(idx, 1);
	
	// save to local storage
	// note, that localStorage.setItem() expects the second argument to be string
	localStorage.setItem('todos', JSON.stringify(todos));
	
	// render todos:
	renderTodos();
	// displayCompletedItemsCount();
}

const completeTodo = function (e) {
	// if (e.target.tagName === "DIV"){
	if(e.target.parentNode.classList.contains("removeTodo")){
		return;
	}

	let targetNode;
	let targetSquare;
	// if we click NOT exactly on the list items:
	if (e.target.tagName === "LI"){
		targetNode = e.target;
		targetSquare = e.target.children[3].children[0];
		currentItem = e.target.dataset.id;
		// console.log(currentItem);
	}
	//if we click exactly on the list items:
	else if (e.target.tagName === "SPAN"){
		targetNode = e.target.parentNode;
		targetSquare = e.target.parentNode.children[3].children[0];
		currentItem = e.target.parentNode.dataset.id;
		// console.log(currentItem);
	}
	//if we click on the checkboxes:
	// else if (e.target.parentNode.tagName === "DIV"){
	else if (e.target.parentNode.classList.contains("completeTodo")){
		targetNode = e.target.parentNode.parentNode;
		targetSquare = e.target;
		currentItem = e.target.parentNode.parentNode.dataset.id;
		// console.log(currentItem);
	}

	targetNode.classList.toggle('completed');
	targetSquare.classList.toggle('fa-square');
	targetSquare.classList.toggle('fa-check-square');

	// console.log(`currentItem = ${currentItem}`);
	completeTodoInArray();
	renderTodos();
}

const completeTodoInArray = function(){
	for (let i = 0; i < todos.length; i++) {
		// console.log(`todos[i].id = ${todos[i].id}`);
		// console.log(`currentItem = ${currentItem}`);
		// console.log(`todos[i].completed = ${todos[i].completed}`);

		if(+todos[i].id === +currentItem && todos[i].completed === false){
			// console.log('case 1');
			todos[i].completed = true;
			// console.log(todos);
			return;
		}else if(+todos[i].id === +currentItem && todos[i].completed === true){
			// console.log('case 2');
			todos[i].completed  = false;
			// console.log(todos);
			return;
		}
	}
}

// DOM cache:
const nodes = {
	'todoItems': document.querySelector('ul.todo-items'),
	'todoItems': document.querySelector('ul.todo-items'),
	'addTodoInput': document.querySelector('.todo-add>input'),
	'addTodoBtn': document.querySelector('.todo-add>.todo-add-btn'),
	'totalItemsCount': document.querySelector('.todo-app .todos-total>.output'),
	'completedItemsCount': document.querySelector('.todo-app .completed-total>.output')
}

let currentItem;

// let localStorage = window.localStorage;

// create todos array of todo objects from LocalStorage data
// note, that localStorage.getItem() returns data as string
// let todos = JSON.parse(localStorage.getItem('todos')) || [];
let todos = [
	{
		"id": 3,
		"title": "LEARN HTML",
		"completed":false
	},
	{
		"id": 4,
		"title": "Learn CSS",
		"completed":false
	}
];

console.log(todos);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// attach events
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
window.addEventListener('DOMContentLoaded', event=>{
	renderTodos();
});

// add Todo Item (on button click or on enter key pressed):
nodes.addTodoBtn.addEventListener('click', addTodo);

nodes.addTodoInput.addEventListener('keyup', function(e) {
	if(e.keyCode === 13){
		addTodo();
	}
})

// remove Todo Item:
nodes.todoItems.addEventListener('click', removeTodo, {capture: true})

// togleComplete
nodes.todoItems.addEventListener('click', completeTodo);
