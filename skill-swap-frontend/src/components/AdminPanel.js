import { useEffect, useState } from 'react';
import API from '../api';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsers = await API.get('/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const resSwaps = await API.get('/admin/swaps', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(resUsers.data);
        setSwaps(resSwaps.data);
      } catch (err) {
        console.error('Admin panel fetch error:', err);
        alert('Error fetching admin data — you may not be authorized or need to login again.');
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleDeleteUser = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('User deleted');
      // Remove deleted user from UI immediately without reload
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting user.');
    }
  };

  return (
    <div>
      <h3>All Users</h3>
      {users.map(u => (
        <div key={u.id}>
          <p>{u.name} — {u.email} {u.is_admin ? "(Admin)" : ""}</p>
          <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
        </div>
      ))}
      <h3>All Swaps</h3>
      {swaps.map(s => (
        <div key={s.id}>
          <p>{s.offered_skill} → {s.wanted_skill} | Status: {s.status}</p>
        </div>
      ))}
    </div>
  );

  <div>
  <h3>All Users</h3>
  {users.map(u => (
    <div key={u.id} className="user-item">
      
    </div>
  ))}
</div>

}



export default AdminPanel;
