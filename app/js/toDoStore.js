class TodoStorage {
    constructor() {
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeToDo(todo) {
        this.todos = this.todos.filter(item => item.id !== todo.id);
    }

    getTodos() {
        return this.todos;
    }

    removeAllTodos() {
        this.todos = [];
    }

    editToDo(todo, title, description) {
        let changingTodo = this.todos.find(item => item.id === todo.id);
        changingTodo.title = title;
        changingTodo.description = description;
        return changingTodo;
    }

    saveChanges(todo, title, description) {
        return this.editToDo(todo, title, description);
    }

    hasStatus(todo, status) {
        return todo.status !== status ? true : false;
    }

    setStatus(todo, status, statusPending) {
        let changingTodo = this.todos.find(item => item.id === todo.id);
        this.hasStatus(todo, status) ? changingTodo.status = status : changingTodo.status = statusPending;
        return changingTodo;
    }

    setStatusToAll(status, statusPending = "Pending") {
        this.todos.forEach(item => {
            this.hasStatus(item, status) ? item.status = status : item.status = statusPending;
        })
    }

    sortByTitle(todos) {
        let sortedByAlphabet = todos.sort((firstValue, secondValue) => {
            let lowerCaseFirstValue = firstValue.title[0].toLowerCase();
            let lowerCaseSecondValue = secondValue.title[0].toLowerCase();
            if (lowerCaseFirstValue < lowerCaseSecondValue) return -1
            if (lowerCaseFirstValue > lowerCaseSecondValue) return 1
            return 0;
        });
        return sortedByAlphabet;
    }

    makeArrayOfSubcollections() {
        let [pendingTodos, holdedTodos, doneTodos] = [[], [], []];
        this.todos.forEach(item => {
            (item.status === "Pending") ? pendingTodos.push(item) :
                (item.status === "Hold") ? holdedTodos.push(item) :
                    doneTodos.push(item)
        })
        let arrayOfSubcollections = [doneTodos, holdedTodos, pendingTodos];
        return arrayOfSubcollections;
    }

    sortByTitleArrayOfSubcollections(arrayOfSubcollections) {
        let sortedByStatusAndTitle = [];
        arrayOfSubcollections.forEach(item => {
            this.sortByTitle(item);
            sortedByStatusAndTitle.push(...item);
        })
        return sortedByStatusAndTitle;
    }

    sortByStatus() {
        let arrayOfSubcollections = this.makeArrayOfSubcollections();
        let sortedByStatusAndTitle = this.sortByTitleArrayOfSubcollections(arrayOfSubcollections);
        return sortedByStatusAndTitle;
    }

    findTodos(searchValue) {
        let lowerCaseSearchValue = searchValue.toLowerCase();
        let filteredBySearchValueTodos = this.todos.filter(item => {
            let lowerCaseTitle = item.title.toLowerCase();
            return lowerCaseTitle.startsWith(lowerCaseSearchValue)
        });
        return filteredBySearchValueTodos;
    }
}