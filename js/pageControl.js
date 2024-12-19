let page = {
    templates: {
        login: document.getElementById('login'),
        register: document.getElementById('registration'),
        todo: document.getElementById('todo-page')
    },
    init() {
        if (localStorage.getItem("currentUser")) {
            let myUser = new User(localStorage.getItem("currentUser"));
            myUser.init();
        }
        else {
            page.openTemplate("register");
            new SignUp();
        }
    },
    openTemplate(template) {
        let mainDiv = document.getElementById("main-div");
        mainDiv.replaceChildren(page.templates[template].content.cloneNode(true));
        history.pushState({}, this.templates[template], `#${template}`);
    },
    pop() {
        let mainDiv = document.getElementById("main-div");
        let Myhash = location.hash.replace("#", "");
        if (Myhash === "todo"&&localStorage.getItem("currentUser")) {
            let myUser = new User(User.name);
            mainDiv.replaceChildren(page.templates[Myhash].content.cloneNode(true));
            document.getElementById('submit-task').addEventListener('click', myUser.submitTask.bind(myUser));
            document.getElementById('searchBox').addEventListener('keydown', (event) => { if (event.key === 'Enter') { myUser.search(document.getElementById('searchBox').value); } });
            document.getElementById('log-out').addEventListener('click', page.logOut);
            myUser.displayAllTasks();
        }
        else if(Myhash==="login"){
            mainDiv.replaceChildren(page.templates[Myhash].content.cloneNode(true));
             new Login();
        }
        else{
            mainDiv.replaceChildren(page.templates["register"].content.cloneNode(true));
            new SignUp();
        }
    },
    logOut() {
        localStorage.removeItem("currentUser");
        location.reload();
    }
};
window.addEventListener("popstate", page.pop);
page.init();

