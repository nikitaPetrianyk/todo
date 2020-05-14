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

for (let i = 0; i < tabBtns.length; i++) {
    tabBtns[i].addEventListener('click', () => {
        showTabItem(i);
    })
}

