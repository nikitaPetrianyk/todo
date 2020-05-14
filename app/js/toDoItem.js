class TodoItem {
    constructor(title, description) {
        this.id = Math.floor(Math.random() * Math.floor(100));
        this.title = title;
        this.description = description;
        this.status = 'Pending';
    }
}