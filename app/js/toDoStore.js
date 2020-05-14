class TodoStorage {
    constructor() {
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
        return this.todos;
    }

    removeToDo(todo) {
        this.todos = this.todos.filter(item => item.id !== todo.id);
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

    holdToDo(todo) {
        let changingTodo = this.todos.find(item => item.id === todo.id);
        if (changingTodo.status !== 'Hold') {
            changingTodo.status = 'Hold';
        } else {
            changingTodo.status = "Pending";
        }
        return changingTodo;
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

    doneToDo(todo) {
        let changingTodo = this.todos.find(item => item.id === todo.id);
        if (changingTodo.status !== 'Done') {
            changingTodo.status = 'Done';
        } else {
            changingTodo.status = "Pending";
        }
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

    sortByStatusAndTitle(todos) {
        let [pendingTodos, holdedTodos, doneTodos] = [[], [], []];
        let sortedByStatusAndTitle = [];

        todos.forEach(item => {
            if (item.status === "Pending") {
                pendingTodos.push(item)
            } else if (item.status === "Hold") {
                holdedTodos.push(item);
            } else {
                doneTodos.push(item)
            }
        })

        let arrayOfSubcollections = [doneTodos, holdedTodos, pendingTodos];
        arrayOfSubcollections.forEach(item => {
            this.sortByTitle(item);
            sortedByStatusAndTitle.push(...item);
        })

        return sortedByStatusAndTitle;
    }

    findTodos(searchValue) {
        let lowerCaseSearchValue = searchValue.toLowerCase();
        let filteredTodos = this.todos.filter(item => {
            let lowerCaseTitle = item.title.toLowerCase();
            return lowerCaseTitle.startsWith(lowerCaseSearchValue)
        });
        return filteredTodos;
    }
}