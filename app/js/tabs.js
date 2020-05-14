let tabBtns = document.querySelectorAll('.js-tabsBtn');
let tabItems = document.querySelectorAll('.js-tabsItem');

const showTabItem = (index) => {
    if (!tabItems[index].classList.contains('active')) {
        for (let i = 0; i < tabItems.length; i++) {
            tabItems[i].classList.remove('active');
            tabBtns[i].classList.remove('active');
        }
        tabItems[index].classList.add('active');
        tabBtns[index].classList.add('active');
    } else return;
}

const subscribeListenersToBtns = (cb, btnsList) => {
    for (let i = 0; i < btnsList.length; i++) {
        btnsList[i].addEventListener('click', () => {
            cb(i);
        })
    }
}

subscribeListenersToBtns(showTabItem, tabBtns);

