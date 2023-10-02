class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      newTask: "",
      editingTaskId: null,
    };
  }

  componentDidMount() {
    // Charger les tâches depuis le localStorage lors de la première montée du composant
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      this.setState({ tasks: JSON.parse(storedTasks) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Enregistrer les tâches dans le localStorage lorsque l'état change
    if (prevState.tasks !== this.state.tasks) {
      localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
    }
  }

  // Ajouter une tâche
  addTask = () => {
    const { tasks, newTask } = this.state;
    if (newTask.trim() !== "") {
      const newTasks = [
        ...tasks,
        { id: Date.now(), text: newTask, completed: false },
      ];
      this.setState({ tasks: newTasks, newTask: "" });
    }
  };

  // Modifier une tâche
  editTask = (id) => {
    this.setState({ editingTaskId: id });
  };

  // Enregistrer les modifications de la tâche
  saveTask = (id, newText) => {
    const { tasks } = this.state;
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, text: newText };
      }
      return task;
    });
    this.setState({ tasks: updatedTasks, editingTaskId: null });
  };

  // Terminer une tâche
  completeTask = (id) => {
    const { tasks } = this.state;
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    this.setState({ tasks: updatedTasks });
  };

  // Supprimer une tâche
  deleteTask = (id) => {
    const { tasks } = this.state;
    const updatedTasks = tasks.filter((task) => task.id !== id);
    this.setState({ tasks: updatedTasks });
  };

  render() {
    const { tasks, newTask, editingTaskId } = this.state;

    return (
      <div className="container mt-5">
        <h1 className="text-center">To-Do List</h1>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nouvelle tâche"
            value={newTask}
            onChange={(e) => this.setState({ newTask: e.target.value })}
          />
          <div className="input-group-append">
            <button className="btn btn-info" onClick={this.addTask}>
              Ajouter
            </button>
          </div>
        </div>
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task.id} className="list-group-item">
              {editingTaskId === task.id ? (
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={task.text}
                    onChange={(e) => this.saveTask(task.id, e.target.value)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-success"
                      onClick={() => this.saveTask(task.id, task.text)}
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span
                    className={task.completed ? "text-muted" : ""}
                    onClick={() => this.completeTask(task.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {task.text}
                  </span>
                  <button
                    className="btn btn-warning ml-2 mx-3"
                    onClick={() => this.editTask(task.id)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => this.deleteTask(task.id)}
                  >
                    Supprimer
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

ReactDOM.render(<TodoApp />, document.getElementById("root"));
