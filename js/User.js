class User {
    static name;
    constructor(newName) {
        User.name = newName;
    }
    init() {
        page.openTemplate("todo");
        document.getElementById('submit-task').addEventListener('click', this.submitTask.bind(this));
        document.getElementById('searchBox').addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.search(document.getElementById('searchBox').value);
                document.getElementById('searchBox').value="";
            }
        });
        
        document.getElementById('log-out').addEventListener('click', page.logOut);
        this.displayAllTasks();
    }
    submitTask() {
        const task = {
            name: document.getElementById("title").value,
            data: {
                content: document.getElementById("content").value,
                date: (document.getElementById("date").value==="")? this.getFormattedDate():document.getElementById("date").value
            }
        };
        const req = new FXMLHttpRequest();
        req.open('POST', "api/todos");
        req.addEventListener('FXMLLoad', () => {
            const todo = document.createElement("to-do-item");
            const { id } = req.responseText;
            todo.id = id;
            ['title', 'date', 'content'].forEach(attributeId => document.getElementById(attributeId).value = "");
            todo.setAttribute('title', task.name);
            Object.entries(task.data).forEach(([key, value]) => todo.setAttribute(key, value));
            document.getElementById("toDoList").appendChild(todo);
        });
        req.send(JSON.stringify(task));
    }
    displayAllTasks() {
        const req = new FXMLHttpRequest();
        req.open('GET', 'api/todos');
        req.addEventListener('FXMLLoad', () => {
            if(req.fstatus==200){
            const toDoResponse = JSON.parse(req.responseText);
            if (toDoResponse) {
                toDoResponse.forEach(element => this.createTodoItem(element));
            }}
        });
        req.send();
    }
    createTodoItem(element) {
        const todo = document.createElement("to-do-item");
        todo.id = element.id;
        todo.setAttribute('title', element.title);
        this.setAttributes(todo, element.value);
        document.getElementById("toDoList").appendChild(todo);
    }
    setAttributes(todo, value) {
        Object.entries(value).forEach(([key, val]) => todo.setAttribute(key, val));
    }
    search(name) {
        const searchReq = new FXMLHttpRequest();
        searchReq.open('GET', `api/todos/${name}`);
        searchReq.send();
        searchReq.addEventListener('FXMLLoad', () => {
            document.getElementById("toDoList").replaceChildren();
            if(searchReq.fstatus==200){
            const toDoResponse = JSON.parse(searchReq.responseText);
            toDoResponse.forEach(element => this.createTodoItem(element));
            }
            if(searchReq.fstatus==404){
              let errorMessage =document.createElement('div');
              errorMessage.innerHTML="sorry, we couldn't find the task you were looking for";
              document.getElementById("toDoList").appendChild(errorMessage);
            }
        });
    }
     getFormattedDate() {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }
}
