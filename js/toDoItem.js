let tamplate = document.createElement("template");
tamplate.innerHTML = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<li class="item">
    <input type="text" id="title"  disabled  = true>
    <input type="date" id="date" class="date" disabled  = true>
    <input type="" id="content" class="content" disabled  = true>
    <i class="fa-solid fa-trash"></i>
    <i class="fa-solid fa-pen"></i>
</li>
<style>
@import url('https://fonts.googleapis.com/css?family=Gochi+Hand');
.item{
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    background-color: transparent;
    padding: 0.7rem;
    padding-bottom: 0.2rem;
    border-bottom-right-radius: 15px 3px;
    border-bottom-left-radius: 0px 15px;
    font-family: 'Gochi Hand', cursive;
}
#title{
    width: 6vw;
    border: none;
    font-weight: 100;
}
#content{
    width: 10vw;
}
.content,.date{
    border:none;
}
.contentEdit, .dateEdit{
    border-bottom-right-radius: 15px 3px;
    border-bottom-left-radius: 0px 15px;
    border: none;
    border-bottom: dashed 3px #9e8d51;
}
#date, #content,#title{
    background-color: #9e8d5100;
    font-family: 'Gochi Hand', cursive;
    font-size: 0.8em;
    color: #0000008c;
}
i{
    flex: 1;
    font-weight: 900;
    color: #0000008c;
}
   </style>`  ;
class toDoItem extends HTMLElement {
    static observedAttributes = ["title", "content", "date"];
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.append(tamplate.content.cloneNode(true));
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.shadowRoot.querySelector('#' + name).value = newValue;
    }
    connectedCallback() {
        this.shadowRoot.querySelector('.fa-trash').addEventListener('click', this.deleteItem.bind(this));
        this.shadowRoot.querySelector('.fa-pen').addEventListener('click', this.updateItem.bind(this));
    }
    toggleEditableState(editable) {
        const elements = [this.shadowRoot.children[1].children[1], this.shadowRoot.children[1].children[2]];
        elements.forEach(el => {
            el.disabled = !editable;
            el.classList.toggle("dateEdit", editable);
            el.classList.toggle("contentEdit", editable);
            el.classList.toggle("date", !editable);
            el.classList.toggle("content", !editable);
        });}
    deleteItem() {
        const req = new FXMLHttpRequest();
        req.open('DELETE', `api/todos/${this.id}`);
        req.send();
        document.getElementById("toDoList").removeChild(this);
    }
    updateItem() {
        this.toggleEditableState(true);
        this.shadowRoot.children[1].children[2].addEventListener('focusout', (event) => {
                const [name, date, content] = ['0', '1', '2'].map(i => this.shadowRoot.children[1].children[i].value);
                const upDateToDoItem = { value: { date, content } };
                const req = new FXMLHttpRequest();
                req.open('PUT', `api/todos/${this.id}`);
                req.send(JSON.stringify(upDateToDoItem));
                this.toggleEditableState(false);
        });
    }
};
window.customElements.define("to-do-item", toDoItem);