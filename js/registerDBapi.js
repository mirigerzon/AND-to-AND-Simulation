class RegisterDB {
    constructor(name) {
        this.name = name;
        this.db = [];
        this.allow="GET ,POST";
    }
    get(name) {
        const db = JSON.parse(localStorage.getItem(this.name));
        if (!db) throw new Error("no db created yet");

        if (name) {
            const element = db.find(element => element.name === name);
            if(element){
              return  JSON.stringify(element)
            }
            else{
                throw new Error("Not Found")
            }
        
        } else {
            return JSON.stringify(db);
        }
    }
    set(name, value) {
        if (localStorage.getItem(this.name) == null) {
            this.db = [];
            this.db.push({ "name": name, "value": value });
            localStorage.setItem(this.name, JSON.stringify(this.db));
            return "OK";
        }
        this.db = JSON.parse(localStorage.getItem(this.name));
        this.db.push({ "name": name, "value": value });
        localStorage.setItem(this.name, JSON.stringify(this.db));
        return "OK";
    }
};