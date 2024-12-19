class Server {
    constructor(ip, nameDb) {
        this.ip = ip;
        this.currentDb = nameDb;
    }
    listen(request) {
        let response;
        const regex = /^(GET|POST|PUT|DELETE) \/([\S]+) HTTP\/1\.1 \n ([^\n]+) \n\n([\s\S]*)/;
        const matches = request.match(regex);
        const parts = matches[3].split(':');
        this.currentDb.currentUser = parts[1];
        let urlParts = matches[2].split("/");
        switch (matches[1]) {
            case 'GET':
                response = this.get(urlParts[2]);
                break;
            case 'POST':
                let allData = JSON.parse(matches[4]);
                let type = urlParts[1];
                response = this.post(allData["name"], allData["data"], type);
                break;
            case 'PUT':
                let putData = JSON.parse(matches[4]);
                response = this.put(urlParts[urlParts.length - 1], putData["value"]);
                break;
            case 'DELETE':
                response = this.delete(urlParts[urlParts.length - 1]);
                break;
        }
        return response;
    }
    get(searchObj) {
        try {
            let info = this.currentDb.get(searchObj);
            return this.response(info);
        }
        catch (error) {
            return this.response(error);
        }
    }
    post(name, data, type) {
        try {
            switch (type) {
                case "todos":
                    return this.response(this.currentDb.set(name, data));
                case "register":
                    if (this.addUser(name)) {
                        return this.response(this.currentDb.set(name, data));
                    } else {
                        throw new Error("user already exists");
                    }
                case "login":
                    if (this.loginCheck(name, data)) {
                        return this.response("OK");
                    } else {
                        throw new Error("authentication failed");
                    }
            }
        } catch (error) {
            return this.response(error);
        }
    }
    put(id, data) {
        try {
            return this.response(this.currentDb.put(id, data));
        }
        catch (error) {
            return this.response(error);
        }
    }
    delete(name) {
        try {
            return this.response(this.currentDb.delete(name));
        }
        catch (error) {
            return this.response(error);
        }
    }
    response(info) {
        let errors = { "no db created yet": { status: 404, statusText: "Not Found" }, "authentication failed": { status: 401, statusText: "Unauthorized" }, "Not Found": { status: 404, statusText: "Not Found" }, "user already exists": { status: 409, statusText: "Conflict" } };
        let statusText;
        let status;
        let type;
        if (typeof info != "object") {
            status = 200;
            statusText = 'OK';
            type = "application/json";
        }
        else {
            const errorInfo = errors[info.message];
            status = errorInfo ? errorInfo.status : 500; // Default to Internal Server Error if unknown error
            statusText = errorInfo ? errorInfo.statusText : "Internal Server Error";
            info = info.message;
            type="text/html"
        }
        return `HTTP/1.1 ${status} ${statusText}\n date:${this.formatDateToRFC1123()}\nContent-Type:${type}\nAllow:${this.currentDb.allow}\n\n${info}`;
    }
    formatDateToRFC1123() {
        const date = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const pad = num => num.toString().padStart(2, '0');
        const formattedDate = `${days[date.getUTCDay()]}, ${pad(date.getUTCDate())} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} GMT`;
        return formattedDate;
    }
    addUser(name) {
        if (this.currentDb.name === "registerDatabase") {
            try {
                this.currentDb.get(name);
                return false;
            }
            catch (error) {
                return true;
            }
        }
    }
    loginCheck(name, data) {
        try {
            const info = this.currentDb.get(name);
            if (typeof JSON.parse(info) == "object") {
                const parsedInfo = JSON.parse(info);
                return parsedInfo.value.email === data.email && parsedInfo.value.email === data.email;
            }
        }
        catch (error) {
            return false;
        }
    }
}