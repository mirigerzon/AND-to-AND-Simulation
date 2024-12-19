class TaskDB {
    constructor(name) {
        this.idCounter = 0;
        this.name = name;
        this.db = [];
        this.currentUser;
        this.allow="GET ,POST ,PUT ,DELETE";
    }
    get(name) {
        const db = JSON.parse(localStorage.getItem(this.name));
        if (!db)  throw new Error("no db created yet");
        const user = db.find(user => user.name === this.currentUser);
        if (!user) throw new Error("Not Found");
        if (name) {
            const tasks = user.tasks.filter(task => task.title === name);
            if (tasks.length) {
                return JSON.stringify(tasks);
            } else {
                throw new Error("Not Found");
            }
        } else {
            return JSON.stringify(user.tasks);
        }
    }
    getById(id) {
        const db = JSON.parse(localStorage.getItem(this.name));
        if (!db) throw "no db created yet";
        const user = db.find(user => user.name === this.currentUser);
        if (!user) throw new Error("Not Found");
        if (id) {
            const tasks = user.tasks.filter(task => task.id === id);
            if (tasks.length) {
                return JSON.stringify(tasks);
            } else {
                throw new Error("Not Found");
            }
        } else {
            return JSON.stringify(user.tasks);
        }
    }
    set(name, value) {
        const db = JSON.parse(localStorage.getItem(this.name)) || [];
        let taskLength = (db[0]) ? db[db.length - 1].tasks[db[db.length - 1].tasks.length - 1] : 0;
        this.idCounter = taskLength ? taskLength.id + 1 : 0;
        let user = db.find(user => user.name === this.currentUser);
        if (user) {
            user.tasks.push({ title: name, value: value, id: this.idCounter });
        } else {
            db.push({ name: this.currentUser, tasks: [{ title: name, value: value, id: this.idCounter }] });
        }
        localStorage.setItem(this.name, JSON.stringify(db));
        return JSON.stringify({ "id": this.idCounter });
    }
    delete(id) {
        const db = JSON.parse(localStorage.getItem(this.name));
        if (!db)  throw new Error("no db created yet");
        for (let j = 0; j < db.length; j++) {
            if (db[j].name === this.currentUser) {
                for (let i = 0; i < db[j].tasks.length; i++) {
                    if (db[j].tasks[i].id == id) {
                        db[j].tasks.splice(i, 1);
                    }
                }
            }
        }
        localStorage.setItem(this.name, JSON.stringify(db));
        return "OK";
    }
    put(id, value) {
        const db = JSON.parse(localStorage.getItem(this.name));
        if (!db) throw new Error("no db created yet");
        for (let j = 0; j < db.length; j++) {
            if (db[j].name === this.currentUser) {
                for (let i = 0; i < db[j].tasks.length; i++) {
                    if (db[j].tasks[i].id == id) {
                        db[j].tasks[i].value = value;
                    }
                }
            }
        }
        localStorage.setItem(this.name, JSON.stringify(db));
        return "OK";
    }
};