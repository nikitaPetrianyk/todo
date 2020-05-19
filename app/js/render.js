class RenderTodos {

  constructor() { }

  printInfoAboutEmpty(printArea) {
    printArea.innerHTML = `<p class = "cards-list__empty">Todos list is empty.</p>`
  }

  getTemplateTodo(status, title, description) {
    return `  <div class="card cards-list__item js-tasksListItem">
                  <span class="card__status js-toDoStatus">${status}</span>
                  <div class = "card__edit-wrap card__edit-wrap--column js-editWrap">
                      <input type="text" class = "card__edit-title js-editTitle inp inp--width" value = "${title}">
                      <input type="text" class = "card__edit-description js-editDescription inp inp--width" value = "${description}">
                      <div class = "card__btns-wrap btn-group btn-group--items-between">
                          <div class = "card__edit-btn">
                              <button class="btn btn--default btn--width btn--rounded js-btnSave">Save</button>
                          </div>
                          <div class = "card__edit-btn">
                              <button class="btn btn--default btn--width btn--rounded js-btnCancel">Cancel</button>
                          </div>
                      </div>
                  </div>
                  <div class ="card__inner card__inner--column js-itemWrap">
                      <div class="card__info-wrap card__info-wrap--column">
                          <h3 class="card__item-title">${title}</h3>
                          <p class="card__item-description">${description}</p>
                      </div>
                      <div class="card__btns-wrap btn-group btn--group--row btn-group--items-between">
                          <div class = "card__item-btn">
                              <button class="btn btn--default btn--width btn--rounded js-taskBtnEdit">
                                Edit
                              </button>
                          </div>
                          <div class = "card__item-btn">
                              <button class="btn btn--default btn--width btn--rounded js-taskBtnDelete">
                                Delete
                              </button>
                          </div>
                          <div class = "card__item-btn">
                              <button class="btn btn--default btn--width btn--rounded js-taskBtnHold">
                                Hold
                              </button>
                          </div>
                          <div class = "card__item-btn">
                              <button class="btn btn--default btn--width btn--rounded js-taskBtnDone">
                                Done
                              </button>
                          </div>
                      </div>
                  </div>
                </div>`
  }

  printTodos(todos, printArea) {
    for (let i = 0; i < todos.length; i++) {
      printArea.innerHTML += this.getTemplateTodo(todos[i].status, todos[i].title, todos[i].description);
      this.changeBtnStatus(todos[i], i);
      this.freezeActions(i, todos[i].status);
    }
  }

  render(todos, printArea) {
    printArea.innerHTML = null;
    todos.length == 0 ? this.printInfoAboutEmpty(printArea) : this.printTodos(todos, printArea);
  }

  init(todos, printArea) {
    this.render(todos, printArea)
    this.subscribeListeners(todos, printArea);
  }

  changeToDoItemStatus(todos, index) {
    let todosStatuses = document.querySelectorAll('.js-toDoStatus');
    todosStatuses[index].innerHTML = todos[index].status;
  }

  changeBtnStatus(todo, index) {
    let btnsDone = document.querySelectorAll('.js-taskBtnDone');
    let btnsHold = document.querySelectorAll('.js-taskBtnHold');
    todo.status === "Done" ? btnsDone[index].innerHTML = "Undo" : btnsDone[index].innerHTML = "Done";
    todo.status === "Hold" ? btnsHold[index].innerHTML = "Unhold" : btnsHold[index].innerHTML = "Hold";
  }

  removeAttributeOnItems(items, attribute) {
    items.forEach((item) => {
      let hasAttribute = item.getAttribute(attribute);
      if (hasAttribute) item.removeAttribute(attribute)
    });
  }

  replaceAttributeOnItems(items, attribute, attributeValue) {
    items.forEach((item) => {
      let attrValue = item.getAttribute(attribute);
      attrValue === attributeValue ? item.removeAttribute(attribute) : item.setAttribute(attribute, attributeValue)
    });
  }

  getItemsActionBtns() {
    let btnsEdit = document.querySelectorAll('.js-taskBtnEdit');
    let btnsDelete = document.querySelectorAll('.js-taskBtnDelete');
    let btnsHold = document.querySelectorAll('.js-taskBtnHold');
    let btnsDone = document.querySelectorAll('.js-taskBtnDone');
    return [btnsEdit, btnsDelete, btnsHold, btnsDone]
  }

  makeArrayOfButtonsForFreezing(index, status, btnsEdit, btnsDelete, btnsHold, btnsDone) {
    let frozenBtns;
    (status === "Hold") ? frozenBtns = [btnsEdit[index], btnsDelete[index], btnsDone[index]] :
      (status === "Done") ? frozenBtns = [btnsEdit[index], btnsHold[index]] :
        frozenBtns = [btnsEdit[index], btnsDelete[index], btnsHold[index], btnsDone[index]]
    return frozenBtns;
  }

  removeOrReplaceAttributesOnItems(items, status, attribute, attributeValue) {
    (status === "Pending") ? this.removeAttributeOnItems(items, attribute)
      : this.replaceAttributeOnItems(items, attribute, attributeValue);
  }

  freezeActions(index, status) {
    let [btnsEdit, btnsDelete, btnsHold, btnsDone] = this.getItemsActionBtns(index);
    let frozenBtns = this.makeArrayOfButtonsForFreezing(index, status, btnsEdit, btnsDelete, btnsHold, btnsDone);
    this.removeOrReplaceAttributesOnItems(frozenBtns, status, 'disabled', 'disable');
  }

  addTimeout(cb, ...paramsOfCb) {
    setTimeout(() => cb(...paramsOfCb), 1000);
  }

  setListener(type, item, cb, ...paramsOfCb) {
    item.addEventListener(type, () => {
      cb(...paramsOfCb);
    })
  }

  openEditingMenu(editWrap, itemWrap, index) {
    editWrap[index].classList.add('active');
    itemWrap[index].classList.add('hide');
  }

  closeEditingMenu(editWrap, itemWrap, index) {
    editWrap[index].classList.remove('active');
    itemWrap[index].classList.remove('hide');
  }

  enablePreloader() {
    let preloaderWrapper = document.querySelector('.js-preloaderWrapper');
    let preloader = new Preloader();
    preloader.setPreloader(preloaderWrapper);
    this.addTimeout(preloader.removePreloader, preloaderWrapper);
  }

  editTodo(changingTitleFields, changingDescriptionFields, todos, index) {
    let changedTaskTitle = changingTitleFields[index].value;
    let changedTaskDescription = changingDescriptionFields[index].value;
    let changedToDo = storage.saveChanges(todos[index], changedTaskTitle, changedTaskDescription);
    return changedToDo;
  }

  printTodosWithChangedToDo(todos, index, changedToDo, printArea) {
    todos.splice(index, changedToDo);
    this.init(todos, printArea);
  }

  handleSaveBtnClick(editTitleFields, editDescriptionFields, todos, index, printArea) {
    this.enablePreloader();
    let changedToDo = this.editTodo(editTitleFields, editDescriptionFields, todos, index);
    this.addTimeout(() => { this.printTodosWithChangedToDo(todos, index, changedToDo, printArea); });
  }

  enableEditingmode(todos, index, printArea) {
    let editWrap = document.querySelectorAll('.js-editWrap');
    let editTitleFields = document.querySelectorAll('.js-editTitle');
    let editDescriptionFields = document.querySelectorAll('.js-editDescription');
    let btnsSave = document.querySelectorAll('.js-btnSave');
    let btnsCancel = document.querySelectorAll('.js-btnCancel');
    let itemWrap = document.querySelectorAll('.js-itemWrap');
    this.openEditingMenu(editWrap, itemWrap, index);
    this.setListener('click', btnsSave[index], () => this.handleSaveBtnClick(editTitleFields, editDescriptionFields, todos, index, printArea))
    this.setListener('click', btnsCancel[index], this.closeEditingMenu, editWrap, itemWrap, index);
  }

  handleDeleteBtnClick(todos, index, printArea) {
    storage.removeToDo(todos[index], index);
    let updatedTodosList = storage.getTodos();
    this.init(updatedTodosList, printArea);
  }

  handleFreezeBtns(todo, index, status) {
    this.changeBtnStatus(todo, index);
    this.freezeActions(index, status);
  }

  handleUpdateToDoStatus(todos, index, status, statusPending = "Pending") {
    let changedToDo = storage.setStatus(todos[index], status, statusPending);
    todos.splice(index, changedToDo);
    this.changeToDoItemStatus(todos, index);
    this.handleFreezeBtns(todos[index], index, todos[index].status);
  }

  subscribeListeners(todos, printArea) {
    let tasksListItem = document.querySelectorAll('.js-tasksListItem');
    for (let i = 0; i < tasksListItem.length; i++) {
      tasksListItem[i].addEventListener('click', (event) => {
        if (event.target.classList.contains('js-taskBtnEdit')) {
          this.enableEditingmode(todos, i, printArea);
        } else if (event.target.classList.contains('js-taskBtnDelete')) {
          this.enablePreloader();
          this.addTimeout(() => this.handleDeleteBtnClick(todos, i, printArea))
        } else if (event.target.classList.contains('js-taskBtnHold')) {
          this.handleUpdateToDoStatus(todos, i, "Hold");
        } else if (event.target.classList.contains('js-taskBtnDone')) {
          this.handleUpdateToDoStatus(todos, i, "Done");
        }
      })
    }
  }
}
