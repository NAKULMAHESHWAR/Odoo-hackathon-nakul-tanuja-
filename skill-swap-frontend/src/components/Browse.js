import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Browse() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await API.get('/users');
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.skills_offered?.join(',').toLowerCase().includes(search.toLowerCase()) ||
    u.skills_wanted?.join(',').toLowerCase().includes(search.toLowerCase())
  );

  const handleRequest = (id) => {
    navigate(`/swaps?receiverId=${id}`);
  };

  return (
    <div>
      <input placeholder="Search skills" value={search} onChange={(e) => setSearch(e.target.value)} />
      <ul>
        {filteredUsers.map(u => (
          <li key={u.id}>
            <p><b>{u.name}</b> — {u.skills_offered?.join(', ')}</p>
            <button onClick={() => handleRequest(u.id)}>Request Swap</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Browse;
