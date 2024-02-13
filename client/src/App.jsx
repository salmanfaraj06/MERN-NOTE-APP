
// This file is responsible for the UI of the app

import { Component } from "react"; //create components to add methods
class App extends Component { 
  //adding constructor for this class
  constructor(props) {
    super(props); //parent constructor
    this.state = {
      //can include the variables to be accessed
      notes: [],
      newNote: "",
    };
  }


  API_URL = "http://localhost:5038"; //api url

  componentDidMount() { 
    //method to call refreshNotes-inbuilt
    this.refreshNotes(); 
  }
  
  async refreshNotes() {
    fetch(this.API_URL + "/api/todoapp/GetNotes") //fetching data from server using GET method
      .then((response) => response.json()) //converting response to json
      .then((data) => this.setState({ notes: data })); //setting state with the data
    
  }

  async addClick() { //method to add notes
    var newNotes = document.getElementById("newNotes").value; //captured date from textbox
    const data = new FormData(); //form data to send to post api method
    data.append("description", newNotes); //appending the data to be sent

    fetch(this.API_URL + "/api/todoapp/AddNotes", { //fetching data from server using POST method
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((result) => {
        document.getElementById("newNotes").value = ""; //clearing the textbox
        alert("Note added successfully"); //alerting the user
        this.refreshNotes();
      });
  }

  async deleteClick(id) { //method to delete notes
    fetch(this.API_URL + "/api/todoapp/DeleteNotes?id=" + id, { //fetching data from server using DELETE method
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((result) => {
        alert("Note deleted successfully"); //alerting the user
       
        this.refreshNotes();
      });
  }

  render() { //render method to display the UI
    const { notes } = this.state;
    return (
      <div className="flex flex-col justify-around">
        <h1 className="w-full text-center text-3xl font-bold mt-6 mb-6 animate-gradient " >
          Notes App
        </h1>

        <div className="flex flex-wrap  justify-center items-center w-full md:w-auto">
          <input 
            id="newNotes" 
            className="shadow appearance-none border rounded w-full md:w-[500px] py-2 px-3 text-black-700 leading-tight focus:shadow-outline focus:outline-none"
            
          />
          <button 
            className="mt-2 md:mt-0 md:ml-2 px-5 py-1 text-sm text-blue-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            onClick={() => this.addClick()}
          >
            Add Note
          </button>
        </div>
        <div className="flex flex-col md:flex-row">
          {notes.map((note) => (
            <div key={note.id} className="w-full md:w-1/3 lg:w-1/3 xl:w-1/4 p-4">
              <div className="bg-white rounded shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out p-6">
                <h3 className="">{note.description}</h3>
                <button
                  onClick={() => this.deleteClick(note.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                >
                  Delete Note
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default App;
