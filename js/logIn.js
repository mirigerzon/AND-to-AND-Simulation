
class Login {
    constructor() {
        this.loginLink = document.getElementById('loginLink');
        this.registerLink = document.getElementById('registerLink');
        this.init();
    }
    init() {
        this.loginLink.addEventListener('click', this.checkLoginInput.bind(this));
        this.registerLink.addEventListener('click', this.changePage.bind(this));
    }
    checkLoginInput() {
        const userName = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('pwd').value;
        if (!userName || !email || !password) {
            alert("Please fill in all the details");
            return;
        }
        const user = { name: userName, data: { email, password } };
        const url = "api/login";
        const userReq = new FXMLHttpRequest();
        userReq.open('POST', url);
        userReq.addEventListener('FXMLLoad', () => {
            if (userReq.fstatus == 200) {
                localStorage.setItem("currentUser", userName);
                const myUser = new User(userName);
                myUser.init();
            } else {
                alert("Oops, it seems that the user you entered does not exist in the system, please try again");
            }
        });
        userReq.send(JSON.stringify(user));
    }
    changePage() {
        page.openTemplate("register");
        new SignUp();
    }
}


