import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import AuthContext from '../../auth';

const Logout = () => {
  const { fetchWithCSRF, currentUser, setCurrentUser } = useContext(AuthContext);

  const logout = async () => {
    const res = await fetch('/api/session', { method: "delete" });
    if (res.ok) setCurrentUser(null);
  }

  const handleSubmit = e => {
    e.preventDefault();
    logout();
  }

  return (!currentUser) ? <Redirect to="/login" /> : (
    <form className="simple" onSubmit={handleSubmit}>
      <button color="primary" variant="outlined" type="submit">Logout</button>
    </form>
  );
}

// const msp = state => ({ currentUserId: state.authentication.id });
// const mdp = dispatch => ({ logout: () => dispatch(logout())})
export default Logout;
