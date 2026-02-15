import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { text } from "@fortawesome/fontawesome-svg-core";
import './Home.css';

const Home = () => {
    const [inputValue, setInputValue] = useState('');
    const [todos, setTodos] = useState([]);
    const [username, setUserName] = useState('LourdesMiranda')

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch(`https://playground.4geeks.com/todo/users/${username}`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result.name)
                setTodos(result.todos)
            })
            .catch((error) => console.error(error));
    }, [])

    const deleteTodo = (id) => {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: "DELETE"
        })
            .then((response) => {
                if (response.ok) {
                    setTodos(todos.filter((t) => t.id !== id));
                }
            })
            .catch((error) => console.error(error));
    };
    return (
        <div className="container backGro">
            <div className="boxNew">
                <h2>To do List</h2>
                <ul>
                    <li className="item-lista">
                        <input
                            type="text"
                            onChange={e => setInputValue(e.target.value)}
                            value={inputValue}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && inputValue.trim() !== "") {
                                    const nuevaTarea = { label: inputValue.trim(), is_done: false };

                                    fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
                                        method: "POST",
                                        body: JSON.stringify(nuevaTarea),
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            setTodos([...todos, data]);
                                            setInputValue("");
                                        })
                                        .catch(error => console.error("Error guardando:", error));
                                }
                            }}
                            placeholder="¿Quieres añadir tareas? ✎"
                        />
                    </li>

                    {todos.map((t, index) => (
                        <li key={t.id || index} className="item-lista">
                            <span>{t.label}</span>
                            <FontAwesomeIcon
                                icon={faTrashCan}
                                className="icono-basura"
                                onClick={() => deleteTodo(t.id)}
                            />
                        </li>
                    ))}
                </ul>

                <div className="footer-contador">
                    {todos.length === 0 ? "No hay tareas, añade una." : `${todos.length} tareas pendientes`}
                </div>
            </div>
        </div>
    );
};

export default Home;