//wrappers
let tasksListArea = document.querySelector('.js-tasksList');
let preloaderWrapper = document.querySelector('.js-preloaderWrapper')

//tabs btns
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

//info for new Todo and Search Todo
let taskTitle = document.querySelector('.js-taskTitle');
let taskDescription = document.querySelector('.js-taskDescription');
let taskTitleForSearch = document.querySelector('.js-taskTitleForSearch');

const TODO_STATUS = {
    hold: 'Hold',
    pending: 'Pending',
    done: 'Done'
}

let storage = new TodoStorage();
let preloader = new Preloader();
let render = new RenderTodos();

let defaultTaskOne = new TodoItem('Создать другие таски', "Ввести данные таска и нажать на кнопку 'Add'");
storage.addTodo(defaultTaskOne);

addTimeout(() => render.init(storage.todos, tasksListArea));

//button listeners
btnAddToDo.addEventListener('click', () => handleAddToDo(storage.todos, taskTitle, taskDescription, tasksListArea));
btnSearchToDo.addEventListener('click', () => { handleSearchToDo(taskTitleForSearch); })
btnShowDefaultTasks.addEventListener('click', () => { handleShowDefaultTasks(storage.todos, tasksListArea) })
btnSortByTitle.addEventListener('click', () => { handleSortByTitle(storage.todos, tasksListArea) })
btnSortByStatus.addEventListener('click', () => { handleSortByStatus(storage.todos, tasksListArea) })
bulkActionsBtnHold.addEventListener('click', () => { handleSetStatusToAll(storage.todos, TODO_STATUS.hold, tasksListArea) })
bulkActionsBtnDone.addEventListener('click', () => { handleSetStatusToAll(storage.todos, TODO_STATUS.done, tasksListArea) })
bulkActionsBtnRemove.addEventListener('click', () => { handleRemoveAllTodos(tasksListArea) })

//secondary functions
function addTimeout(cb, ...paramsOfCb) {
    render.enablePreloader();
    setTimeout(() => cb(...paramsOfCb), 1000);
}

const addNewToDo = (titleDOMElement, descriptionDOMElement) => {
    let [titleValue, descriptionValue] = getInfoForNewTodo(titleDOMElement, descriptionDOMElement)
    let todo = new TodoItem(titleValue, descriptionValue);
    storage.addTodo(todo);
}

const getInfoForNewTodo = (titleDOMElement, descriptionDOMElement) => {
    let taskTitleValue = titleDOMElement.value;
    let taskDescriptionValue = descriptionDOMElement.value;
    return [taskTitleValue, taskDescriptionValue];
}

const isEmptyInfoForNewToDo = (titleDOMElement, descriptionDOMElement) => {
    let [titleValue, descriptionValue] = getInfoForNewTodo(titleDOMElement, descriptionDOMElement)
    return titleValue.length == 0 || descriptionValue == 0 ? true : false;
}

const isEmptyInfoForSearch = (titleDOMElement) => {
    let titleValue = titleDOMElement.value;
    return titleValue.length == 0 ? true : false;
}

const clearInputFields = (inputFields) => {
    inputFields.forEach(item => item.value = '');
}

//сlick handlers

const handleAddToDo = (todos, taskTitle, taskDescription, printArea) => {
    if (!isEmptyInfoForNewToDo(taskTitle, taskDescription)) {
        render.enablePreloader();
        addTimeout(() => {
            addNewToDo(taskTitle, taskDescription);
            render.init(todos, printArea);
            clearInputFields([taskTitle, taskDescription]);
        })
    }
}

const handleSearchToDo = (taskTitleForSearch) => {
    if (!isEmptyInfoForSearch(taskTitleForSearch)) {
        render.enablePreloader();
        addTimeout(() => {
            let taskTitleForSearchValue = taskTitleForSearch.value;
            let filteredTodos = storage.findTodos(taskTitleForSearchValue);
            btnShowDefaultTasks.classList.add('active');
            render.init(filteredTodos, tasksListArea);
            clearInputFields([taskTitleForSearch]);
        })
    }
}

const handleShowDefaultTasks = (todos, printArea) => {
    render.enablePreloader();
    addTimeout(() => {
        render.init(todos, printArea);
        btnShowDefaultTasks.classList.remove('active');
    })
}

const handleSortByTitle = (todos, printArea) => {
    render.enablePreloader();
    addTimeout(() => {
        let sortedTodos = storage.sortByTitle(todos);
        render.init(sortedTodos, printArea);
    })
}

const handleSortByStatus = (todos, printArea) => {
    render.enablePreloader();
    addTimeout(() => {
        let sortedTodos = storage.sortByStatus(todos);
        render.init(sortedTodos, printArea);
    })
}

const handleSetStatusToAll = (todos, status, printArea) => {
    render.enablePreloader();
    addTimeout(() => {
        storage.setStatusToAll(status);
        render.init(todos, printArea);
    })
}

const handleRemoveAllTodos = (printArea) => {
    render.enablePreloader();
    addTimeout(() => {
        storage.removeAllTodos();
        render.init(storage.todos, printArea);
    })
}


