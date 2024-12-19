class FXMLHttpRequest {
    constructor() {
        this.readyState = 0;
        this.fstatus = 0; // מצב הבקשה
        this.responseText = null;  // תוכן הבקשה - אם הצליחה
        this.response = null;  //תוכן השגיאה - אם קיימת
        this.url = '';
        this.method = '';
        this.headers = [];
        this.body = '';
        this.requestEvents = {
            'FXMLLoad': null,
        }
    }
    addEventListener(eventName, callback) {
        if (typeof callback === "function") {
            this.requestEvents[eventName] = callback;
        }
    }
    removeEventListener(eventName) {
        this.requestEvents[eventName] = null;
    }
    emit(eventName) {
        if (typeof this.requestEvents[eventName] === "function") {
            this.requestEvents[eventName]();
        }
    }
    open(method, url, async) {
        this.readyState = 1;
        this.method = method;
        this.url = url;
        this.headers[0] = `from :${User.name}`;
    }
    send(body = '') {
        this.readyState = 2;
        this.body = body;
        let request = `${this.method} /${this.url} HTTP/1.1 \n ${this.headers[0]} \n\n${this.body} `;
        const responseHandler = (response) => {
            this.response = response;
            const regex = /HTTP\/1\.1 (\d{3}) ([^\n]+)\n date:([^\n]+)\nContent-Type:([^\n]+)\nAllow:([^\n]+)\n\n([\s\S]*)/;
            const matches = this.response.match(regex);
            this.fstatus = matches[1];
            this.responseText = matches[6] === "OK" ? "" : matches[6];
            this.readyState = 4;
            this.emit('FXMLLoad');
        };
        Network.send(request, responseHandler);
        this.readyState = 3;
    }
}
