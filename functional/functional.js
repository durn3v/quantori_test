(function () {
    let state = undefined;

    /**
     * Global application state
     * @template T
     * @param {T} initialValue
     * @returns {[T, function(T): void]}
     */
    function useState(initialValue) {
        state = state || JSON.parse(localStorage.getItem('list')) || initialValue;

        function setValue(newValue) {
            state = newValue;
            localStorage.setItem('list', JSON.stringify(newValue))
            renderApp();
        }

        return [state, setValue];
    }

    /**
     * Functional component for the list
     * @param items {string[]}
     * @returns {HTMLElement} - List element
     */
    function List({ items, deleteItem, checkItem, DONE }) {


        const ul = document.createElement("div");
        ul.className = 'list'

        const listItems = items.map((item, ind) => {

            const label = document.createElement("label");
            console.log(item.done !== DONE)
            console.log(DONE)
            if (item.done) label.style = 'color:gray'
            const li = document.createElement("input");
            li.oninput = () => checkItem(ind)
            li.style = 'transform:scale(1.8); margin-right:20px; accent-color:gray '
            li.checked = item.done

            label.append(li, item.name)
            li.type = 'checkbox'
            const button = document.createElement("button");
            button.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2H8C8 1.44772 7.55228 1 7 1C6.44772 1 6 1.44772 6 2ZM5 2C5 0.89543 5.89543 0 7 0C8.10457 0 9 0.89543 9 2H13C13.2761 2 13.5 2.22386 13.5 2.5C13.5 2.77614 13.2761 3 13 3H12.4364L11.2313 11.8378C11.0624 13.0765 10.0044 14 8.75422 14H5.24578C3.99561 14 2.93762 13.0765 2.76871 11.8378L1.56355 3H1C0.723858 3 0.5 2.77614 0.5 2.5C0.5 2.22386 0.723858 2 1 2H5ZM6 5.5C6 5.22386 5.77614 5 5.5 5C5.22386 5 5 5.22386 5 5.5V10.5C5 10.7761 5.22386 11 5.5 11C5.77614 11 6 10.7761 6 10.5V5.5ZM8.5 5C8.77614 5 9 5.22386 9 5.5V10.5C9 10.7761 8.77614 11 8.5 11C8.22386 11 8 10.7761 8 10.5V5.5C8 5.22386 8.22386 5 8.5 5ZM3.75954 11.7027C3.86089 12.4459 4.49568 13 5.24578 13H8.75422C9.50432 13 10.1391 12.4459 10.2405 11.7027L11.4272 3H2.57281L3.75954 11.7027Z" fill="#838383" />
            </svg>`

            button.onclick = () => deleteItem(ind)



            // console.log(li)
            if (item.done === DONE) {
                ul.append(label)
                !item.done ? ul.append(button) : ul.append(document.createElement("div"))
            }

        }
        ).join("")


        ul.style = 'display:grid; grid-template-columns:auto auto; '
        return ul;
    }

    /**
     * Button component
     * @param text {string}
     * @param onClick {function}
     * @returns {HTMLButtonElement} - Button element
     */
    function Button({ text, onClick }) {
        const button = document.createElement("button");
        button.innerHTML = text;
        button.onclick = onClick;
        return button;
    }


    function Header(TEXT, STYLE) {
        const header = document.createElement("div");
        header.className = 'header'
        header.innerHTML = TEXT
        header.style = STYLE
        return header
    }

    function Search(searchItem) {
        const el = document.createElement("div");
        el.className = 'search'


        el.innerHTML = `
            <input placeholder='Search Task' class='searchBar' value='${localStorage.getItem('searchBar')}'   ></input>
            <button class='newTaskButton' onclick='document.querySelector(".modal").style = "display:grid"' style='justify-self:right' >+ New Task</button>
        `
        // ='display:block'

        console.log(el.children[0])
        el.children[0].oninput = (e) => {
            e.target.value = e.target.value
            console.log(e.target.value)
            localStorage.setItem('searchBar', e.target.value)
            searchItem(e.target.value)
        }

        return el
    }

    function Modal({ ONCLICK }) {
        const el = document.createElement("div");
        el.className = 'modal'
        el.style = 'display:none'






        el.innerHTML = `
          <div style='position:fixed; inset:0; background:rgb(0,0,0,0.5); display:grid;place-items:center'>
                <div style='width:30rem;padding:2rem; background:white;'>
            <div class='header' style='font-size:1.6rem; width:fit-content; margin:auto'>Add New Task</div>
            <input placeholder='Task Title' class='searchBar' id='newTaskBar' oninput='  document.querySelector("#newTaskBar").value !== "" ? document.querySelector("#addTask").disabled = false : document.querySelector("#addTask").disabled = true' style='margin-top:20px;'></input>
            <div style='display:grid; grid-template-columns:auto auto; gap:1rem;  margin-top:100px;'>
            <button class='newTaskButton' onclick={document.querySelector(".modal").style="display:none"} style='background:transparent'>Cancel</button>
            <button class='newTaskButton addTask' id='addTask'    disabled  >Add Task</button>
            </div>
            </div>
           </div>
        `
        el.children[0].children[0].children[2].children[1].onclick = () => ONCLICK(document.querySelector("#newTaskBar").value)

        return el
    }


    /**
     * App container
     * @returns {HTMLDivElement} - The app container
     */
    function App() {
        const [items, setItems] = useState([{ name: "Item 1", done: false }, { name: "Item 2", done: false }, { name: "Item 3", done: false }]);
     

        function addItem(NEW) {
            console.log(NEW)
            setItems([...items, { name: NEW, done: false }]);
         
        }

        function deleteItem(INDEX) {
            console.log(INDEX)
            items.splice(INDEX, 1)
            setItems(items);
        
        }

        function checkItem(INDEX) {
            console.log(INDEX)
            items[INDEX].done = !items[INDEX].done
            setItems(items);
           
        }

        function searchItem(INPUT) {
            console.log(INPUT)
            console.log(items.filter(ii => ii.name.includes(INPUT)))
           
            setItems(items.filter(ii => ii.name.toLocaleLowerCase().includes(INPUT.toLocaleLowerCase())));
      
        }

        const div = document.createElement("div");
        div.className = 'div'
        const list = List({ items, deleteItem, checkItem, DONE: false });
        const notDoneList = List({ items, deleteItem, checkItem, DONE: true });
        const button = Button({ text: "Add item", onClick: addItem });
        const search = Search(searchItem)
        const modal = Modal({ ONCLICK: addItem })

        div.append(Header('To Do List'), search, Header('All Tasks', 'font-size:1.6rem'), list, Header('Completed Tasks', 'font-size:1.6rem'), notDoneList, modal);
        return div;
    }

    /**
     * Render the app.
     * On change whole app is re-rendered.
     */
    function renderApp() {
        const appContainer = document.getElementById("functional-example");
        appContainer.innerHTML = "";
        appContainer.append(App());
    }

    // initial render
    renderApp();
})();