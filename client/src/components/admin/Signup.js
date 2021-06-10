import React, { useState, useContext } from 'react';
import { Redirect, NavLink, useHistory } from 'react-router-dom';
import AuthContext from '../../auth';
// import { signup, editUser, resetMessage, deleteUser } from './store/authentication';
// import { Input, Button } from '@material-ui/core';

const Signup = () => {
  const { fetchWithCSRF, currentUser, setCurrentUser } = useContext(AuthContext);
  const [email, setEmail] = useState(currentUser ? currentUser.email : '');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  let history = useHistory();

  const signup = async (email, password) => {
    const res = await fetch(`/api/users`, { method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    let user = (await res.json()).user;
    // dispatch(res.ok ? setUser(data.user) : setMessage(data.error.errors[0].msg));
    setCurrentUser(user);
    if (res.ok) history.push('/');
  };

  const editUser = async (email, password, id) => {
    const res = await fetch(`/api/users`, { method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, id })
    });
    let user = (await res.json()).user;
    // dispatch(res.ok ? setUser(data.user) : setMessage(data.error.errors[0].msg));
    setCurrentUser(user);
    setMessage("Success!");
  };

  const deleteUser = async () => {
    const res = await fetch("/api/users", { method: 'DELETE'});
    // if (res.ok) dispatch(removeUser());
    let data = await res.json();
    if (!data.message) {
      setCurrentUser(null);
    } else {
      setMessage(data.message);
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    let message = !email ? "Email address is needed." :
                  !password?"Password is needed." :
                  password !== password2 ? "Passwords must match" : "";
    setMessage(message);
    if (!message) {
      if (currentUser) {
        editUser(email, password, currentUser.id);
      } else {
        signup(email, password);
      }
    }
  }

  const handleDelete = e => {
    e.preventDefault();
    deleteUser();
  }

  return (
    <main className="centered middled">
      <form className="auth" onSubmit={handleSubmit}>
        <h1>
          {currentUser ? null : "Welcome to my react/node-fs template!"}
        </h1>
        <h4>
          {currentUser ? "Change your email and/or password?" : "I hope that you will either login or signup."}
        </h4>
        <span>Email address:</span>
        <input
          type="text" placeholder="Email" name="email" value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <span>Password:</span>
        <input
          type="password" placeholder="" name="password" value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <span>Confirm password:</span>
        <input
          type="password" placeholder="" name="password2" value={password2}
          onChange={e => setPassword2(e.target.value)}
        />
        <button color="primary" variant="outlined" type="submit">
          {currentUser ? "Submit changes" : "Signup"}
        </button>
        <span style={{color: "red", paddingLeft:"10px"}}>{message}</span>
        {currentUser ? null :
          <span>
            <NavLink className="nav" to="/login" activeClassName="active">
              Login
            </NavLink>
          </span>}
      </form>
      {!currentUser ? null : <form className="auth" onSubmit={handleDelete}>
        <button color="primary" variant="outlined" type="submit">{"Delete account?"}</button>
      </form>}
    </main>
  );
}

export default Signup;
