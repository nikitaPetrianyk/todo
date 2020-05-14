class Preloader {
    constructor() { }

    setPreloader(preloader) {
        preloader.classList.add('active');
    }

    removePreloader(preloader) {
        preloader.classList.remove('active');
    }
}
