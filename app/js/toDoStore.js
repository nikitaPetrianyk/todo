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

    holdAllTodos(isHolded) {
        if (!isHolded) {
            this.todos.forEach(item => {
                item.status = "Hold";
            })
            isHolded = true;
        } else {
            this.todos.forEach(item => {
                item.status = "Pending";
            })
            isHolded = false;
        }
        return [this.todos, isHolded];
    }

    doneAllTodos() {
        this.todos.forEach(item => {
            item.status = "Done"
        })
        return this.todos;
    }

    removeAllTodos() {
        this.todos = [];
        return this.todos;
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
        let hasStatus = true;
        hasStatus = todo.status !== status ? true : false;
        console.log(hasStatus);
        return hasStatus;
    }

    setStatus(todo, status, statusPending) {
        let changingTodo = this.todos.find(item => item.id === todo.id);
        let hasStatus = this.hasStatus(todo, status);
        hasStatus ? changingTodo.status = status : changingTodo.status = statusPending;
        return changingTodo;
    }

    sortByTitle(todos) {
        let sortedByAlphabet = todos.sort((firstValue, secondValue) => {
            let lowerCaseFirstValue = firstValue.title[0].toLowerCase();
            let lowerCaseSecondValue = secondValue.title[0].toLowerCase();
            if (lowerCaseFirstValue < lowerCaseSecondValue)
                return -1
            if (lowerCaseFirstValue > lowerCaseSecondValue)
                return 1
            return 0;
        });
        return sortedByAlphabet;
    }

    makeArrayOfSubcollections() {
        let [pendingTodos, holdedTodos, doneTodos] = [[], [], []];
        this.todos.forEach(item => {
            if (item.status === "Pending") {
                pendingTodos.push(item)
            } else if (item.status === "Hold") {
                holdedTodos.push(item);
            } else {
                doneTodos.push(item)
            }
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