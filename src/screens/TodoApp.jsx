import React, { useState, useCallback } from "react";
import { MdOutlineDelete, MdOutlineEdit, MdTaskAlt } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null); // Track the ID of the item being edited
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    createdAt: "",
    updatedAt: "",
  });

  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = Date.now();

    const newTodo = {
      ...formData,
      updatedAt: timestamp,
    };

    if (editId) {
      newTodo.createdAt = formData.createdAt; // Preserve the original creation date
      setTodos((prev) =>
        prev.map((todo) => (todo.id === editId ? newTodo : todo))
      );
    } else {
      newTodo.id = uuidv4();
      newTodo.createdAt = timestamp;
      setTodos((prev) => [...prev, newTodo]);
    }

    setEditId(null);
    setFormData({ id: "", title: "", createdAt: "", updatedAt: "" });
  };

  const handleDelete = (id) => {
    const filteredItems = todos.filter((item) => item.id !== id);
    setTodos(filteredItems);
    if (editId === id) {
      // Reset edit state if the item being edited is deleted
      setEditId(null);
      setFormData({ id: "", title: "", createdAt: "", updatedAt: "" });
    }
  };

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setFormData(todo);
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center overflow-auto">
      <div className="w-[60%] h-[50%]">
        <h1 className="text-center text-3xl font-bold font-sans py-6">
          Todo App
        </h1>

        <div className="flex justify-center w-full">
          <div className="w-[80%]">
            <form
              onSubmit={handleSubmit}
              className="flex justify-center w-full space-x-2"
            >
              <div className="w-full">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleOnChange}
                  className="w-full py-2 rounded-md pl-2 placeholder:capitalize outline-none"
                  placeholder="add your todo."
                  required={true}
                />
              </div>
              <button className="bg-gray-800 text-white px-8 py-2 rounded-md">
                {editId ? "Update" : "Add"}
              </button>
            </form>

            <ul className="space-y-4 py-6">
              {todos.length === 0 ? (
                <li className="py-2 bg-slate-200 shadow rounded-lg px-2 cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <MdTaskAlt className="text-3xl text-red-600 hover:text-green-red" />
                    <h1 className="text-lg text-slate-500 font-semibold text-center">
                      No Todos
                    </h1>
                  </div>
                </li>
              ) : (
                todos.map((todo, index) => (
                  <li
                    key={todo.id}
                    className="py-2 bg-slate-200 shadow rounded-lg px-2 cursor-pointer flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col items-center space-y-2">
                        <h1 className="pl-4">Task {index + 1}</h1>
                        <MdTaskAlt className="text-3xl text-green-600 hover:text-green-600" />
                      </div>

                      <span>{todo.title}</span>
                    </div>

                    <div>
                      <button onClick={() => handleEdit(todo)} className="p-2">
                        <MdOutlineEdit className="text-xl text-green-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="p-2"
                      >
                        <MdOutlineDelete className="text-xl text-red-600" />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
