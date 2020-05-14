class RenderTodos {

  constructor() { }

  printTodos(todos, printArea) {
    printArea.innerHTML = null;
    if (todos.length == 0) {
      printArea.innerHTML = `<p class = "tasks-list__empty">Todos list is empty.</p>`
    } else {
      for (let i = 0; i < todos.length; i++) {
        printArea.innerHTML += `  <div class="tasks-list__item js-tasksListItem">
            <span class="tasks-list__item-status js-toDoStatus">${todos[i].status}</span>
            <div class = "tasks-list__edit-wrap js-editWrap">
            <input type="text" class = "tasks-list__edit-title js-editTitle inp" value = "${todos[i].title}">
            <input type="text" class = "tasks-list__edit-description js-editDescription inp" value = "${todos[i].description}">
            <button class="tasks-list__edit-btn btn js-btnSave">Save</button>
            <button class="tasks-list__edit-btn btn js-btnCancel">Cancel</button>
            </div>
            <div class ="tasks-list__item-wrap js-itemWrap">
            <h3 class="tasks-list__item-title">${todos[i].title}</h3>
            <p class="tasks-list__item-description">${todos[i].description}</p>
            <div class="tasks-list__btns-wrap">
              <button class="tasks-list__item-btn btn js-taskBtnEdit">
                Edit
              </button>
              <button class="tasks-list__item-btn btn js-taskBtnDelete">
                Delete
              </button>
              <button class="tasks-list__item-btn btn js-taskBtnHold">
                Hold
              </button>
              <button class="tasks-list__item-btn btn js-taskBtnDone">
                Done
              </button>
            </div>
            </div>
          </div>`
        this.changeBtnStatus(todos[i], i);
        this.freezeActions(i, todos[i].status);
        // storage.hasStatus(todos[i], todos[i].status);
      }
    }
    this.subscribeListeners(todos);
  }

  changeToDoStatus(todos, index) {
    let todosStatuses = document.querySelectorAll('.js-toDoStatus');
    todosStatuses[index].innerHTML = todos[index].status;
  }

  changeBtnStatus(todo, index) {
    let btnDone = document.querySelectorAll('.js-taskBtnDone');
    let btnHold = document.querySelectorAll('.js-taskBtnHold');
    todo.status === "Done" ? btnDone[index].innerHTML = "Undo" : btnDone[index].innerHTML = "Done";
    todo.status === "Hold" ? btnHold[index].innerHTML = "Unhold" : btnHold[index].innerHTML = "Hold";
  }

  freezeActions(index, status) {
    let btnsEdit = document.querySelectorAll('.js-taskBtnEdit');
    let btnsDelete = document.querySelectorAll('.js-taskBtnDelete');
    let btnsDone = document.querySelectorAll('.js-taskBtnDone');
    let btnsHold = document.querySelectorAll('.js-taskBtnHold');
    let frozenBtns;
    if (status === "Hold") {
      frozenBtns = [btnsEdit[index], btnsDelete[index], btnsDone[index]];
    } else if (status === "Done") {
      frozenBtns = [btnsEdit[index], btnsHold[index]];
    } else if (status === "Pending") {
      frozenBtns = [btnsEdit[index], btnsDelete[index], btnsHold[index], btnsDone[index]];
      frozenBtns.forEach((item) => {
        let attrValue = item.getAttribute('disabled');
        if (attrValue === "disable") {
          item.removeAttribute('disabled')
        }
      });
      return;
    }
    frozenBtns.forEach((item) => {
      let attrValue = item.getAttribute('disabled');
      if (attrValue === "disable") {
        item.removeAttribute('disabled')
      } else {
        item.setAttribute('disabled', 'disable')
      }
    });
  }

  enableEditingmode(todos, index) {
    let editWrap = document.querySelectorAll('.js-editWrap');
    let editTitleFields = document.querySelectorAll('.js-editTitle');
    let editDescriptionFields = document.querySelectorAll('.js-editDescription');
    let btnsSave = document.querySelectorAll('.js-btnSave');
    let btnsCancel = document.querySelectorAll('.js-btnCancel');
    let itemWrap = document.querySelectorAll('.js-itemWrap');
    editWrap[index].classList.add('active');
    itemWrap[index].classList.add('hide');
    btnsSave[index].addEventListener('click', () => {
      let preloaderWrapper = document.querySelector('.js-preloaderWrapper');
      let preloader = new Preloader();
      preloader.setPreloader(preloaderWrapper);
      setTimeout(() => {
        preloader.removePreloader(preloaderWrapper);
        let taskTitle = editTitleFields[index].value;
        let taskDescription = editDescriptionFields[index].value;
        let changedToDo = storage.saveChanges(todos[index], taskTitle, taskDescription);
        todos.splice(index, changedToDo);
        this.printTodos(todos, tasksListArea);
      }, 1000);
    })
    btnsCancel[index].addEventListener('click', () => {
      editWrap[index].classList.remove('active');
      itemWrap[index].classList.remove('hide');
    })
  }

  subscribeListeners(todos) {
    let tasksListItem = document.querySelectorAll('.js-tasksListItem');
    for (let i = 0; i < tasksListItem.length; i++) {
      tasksListItem[i].addEventListener('click', (event) => {
        if (event.target.classList.contains('js-taskBtnEdit')) {
          this.enableEditingmode(todos, i);
        } else if (event.target.classList.contains('js-taskBtnDelete')) {
          let preloaderWrapper = document.querySelector('.js-preloaderWrapper');
          let preloader = new Preloader();
          preloader.setPreloader(preloaderWrapper);
          setTimeout(() => {
            preloader.removePreloader(preloaderWrapper);
            storage.removeToDo(todos[i], i);
            todos = storage.getTodos();
            this.printTodos(todos, tasksListArea);
          }, 1000);
        } else if (event.target.classList.contains('js-taskBtnHold')) {
          let changedToDo = storage.setStatus(todos[i], "Hold", "Pending");
          todos.splice(i, changedToDo)
          this.changeToDoStatus(todos, i);
          this.changeBtnStatus(todos[i], i);
          this.freezeActions(i, todos[i].status);
        } else if (event.target.classList.contains('js-taskBtnDone')) {
          let changedToDo = storage.setStatus(todos[i], "Done", "Pending");
          todos.splice(i, changedToDo)
          this.changeToDoStatus(todos, i);
          this.changeBtnStatus(todos[i], i);
          this.freezeActions(i, todos[i].status);
        }
      })
    }
  }
}
