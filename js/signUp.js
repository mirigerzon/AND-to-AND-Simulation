class SignUp {
    constructor() {
        this.init();
    }
    init() {
        document.getElementById('signUpLink').addEventListener('click', this.checkSignUpInput.bind(this));
        document.getElementById('logInLink').addEventListener('click', this.changePage.bind(this));
    }
    checkSignUpInput() {
        const password = document.getElementById('pwd').value;
        const email = document.getElementById('userEmail').value;
        const userName = document.getElementById('userName').value;
        if (!password || !email || !userName) {
            alert("Please fill in all the details");
            return;
        }
        const url = "api/register";
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("The email you entered is not a valid email address");
            return;
        }
        const createUser = { name: userName, data: { email, password } };
        const signupReq = new FXMLHttpRequest();
        signupReq.open('POST', url);
        signupReq.send(JSON.stringify(createUser));
        signupReq.addEventListener('FXMLLoad', () => {
            if (signupReq.fstatus == 200) {
                localStorage.setItem("currentUser", createUser.name);
                new User(createUser.name).init();
            } else {
                alert("Oops, it looks like the user you entered already exists in the system, please log in");
                this.changePage();
            }
        });
    }
    changePage() {
        page.openTemplate("login");
        new Login();
    }
}