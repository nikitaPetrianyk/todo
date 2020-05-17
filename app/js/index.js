let tasksListArea = document.querySelector('.js-tasksList');
let preloaderWrapper = document.querySelector('.js-preloaderWrapper')
let btnAddToDo = document.querySelector('.js-btnAddToDo');
let btnSearchToDo = document.querySelector('.js-btnSearchToDo');
let btnShowDefaultTasks = document.querySelector('.js-btnShowAllTasks');

//sorting btns
let btnSortByTitle = document.querySelector('.js-btnSortByTitle');
let btnSortByStatus = document.querySelector('.js-btnSortByStatus');

//bulk actions btns
let bulkActionsBtnHold = document.querySelector('.js-bulkActionsBtnHold');
let bulkActionsBtnDone = document.querySelector('.js-bulkActionsBtnDone');
let bulkActionsBtnRemove = document.querySelector('.js-bulkActionsBtnRemove');

const TODO_STATUS = {
    hold: 'Hold',
    pending: 'Pending',
    done: 'Done'
}

let storage = new TodoStorage();
let preloader = new Preloader();

let todoItem = new TodoItem('Первый таск', "Сделать верстку для планировщика заданий");
let todoItem1 = new TodoItem('Второй таск', "Сделать логику для планировщика заданий");

storage.addTodo(todoItem);
storage.addTodo(todoItem1);

let render = new RenderTodos();
render.init(storage.todos, tasksListArea);


const addNewToDo = (titleDOMElement, descriptionDOMElement) => {
    let taskTitleValue = titleDOMElement.value;
    let taskDescriptionValue = descriptionDOMElement.value;
    let todo = new TodoItem(taskTitleValue, taskDescriptionValue);
    storage.addTodo(todo);
}

{
    let taskTitle = document.querySelector('.js-taskTitle');
    let taskDescription = document.querySelector('.js-taskDescription');

    btnAddToDo.addEventListener('click', () => {
        preloader.setPreloader(preloaderWrapper);
        setTimeout(() => {
            preloader.removePreloader(preloaderWrapper);
            addNewToDo(taskTitle, taskDescription);
            render.init(storage.todos, tasksListArea);
            taskTitle.value = "";
            taskDescription.value = "";
        }, 1000);
    })

}


let taskTitleForSearch = document.querySelector('.js-taskTitleForSearch');
taskTitleForSearch.addEventListener('keyup', () => {
    value = taskTitleForSearch.value;
    if (value.length !== 0) {
        btnSearchToDo.removeAttribute('disabled');
    } else {
        btnSearchToDo.setAttribute('disabled', 'disable')
    }
})

btnSearchToDo.addEventListener('click', () => {
    preloader.setPreloader(preloaderWrapper);
    setTimeout(() => {
        preloader.removePreloader(preloaderWrapper);
        let taskTitleForSearchValue = taskTitleForSearch.value;
        let filteredTodos = storage.findTodos(taskTitleForSearchValue);
        btnShowDefaultTasks.classList.add('active');
        taskTitleForSearch.value = "";
        render.init(filteredTodos, tasksListArea);
    }, 1000);
})

btnShowDefaultTasks.addEventListener('click', () => {
    preloader.setPreloader(preloaderWrapper);
    setTimeout(() => {
        preloader.removePreloader(preloaderWrapper);
        render.init(storage.todos, tasksListArea);
        btnShowDefaultTasks.classList.remove('active');
    }, 1000);
})

btnSortByTitle.addEventListener('click', () => {
    preloader.setPreloader(preloaderWrapper);
    setTimeout(() => {
        preloader.removePreloader(preloaderWrapper);
        let sortedTodos = storage.sortByTitle(storage.todos);
        render.init(sortedTodos, tasksListArea);
    }, 1000);
})

btnSortByStatus.addEventListener('click', () => {
    preloader.setPreloader(preloaderWrapper);
    setTimeout(() => {
        preloader.removePreloader(preloaderWrapper);
        let sortedTodos = storage.sortByStatus(storage.todos);
        render.init(sortedTodos, tasksListArea);
    }, 1000);

})

{
    bulkActionsBtnHold.addEventListener('click', () => {
        preloader.setPreloader(preloaderWrapper);
        setTimeout(() => {
            preloader.removePreloader(preloaderWrapper);
            storage.setStatusToAll("Hold", "Pending");
            render.init(storage.todos, tasksListArea);
        }, 1000);
    })
}

bulkActionsBtnDone.addEventListener('click', () => {
    preloader.setPreloader(preloaderWrapper);
    setTimeout(() => {
        preloader.removePreloader(preloaderWrapper);
        storage.setStatusToAll("Done", "Pending");
        render.init(storage.todos, tasksListArea);
    }, 1000);
})

bulkActionsBtnRemove.addEventListener('click', () => {
    preloader.setPreloader(preloaderWrapper);
    setTimeout(() => {
        preloader.removePreloader(preloaderWrapper);
        storage.removeAllTodos();
        render.init(storage.todos, tasksListArea);
    }, 1000);
})

