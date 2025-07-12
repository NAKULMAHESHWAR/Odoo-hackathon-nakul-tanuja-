import { useEffect, useState } from 'react';
import API from '../api';

function SwapRequests() {
  const [swaps, setSwaps] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSwaps = async () => {
      try {
        const res = await API.get('/swaps', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSwaps(res.data);
      } catch (err) {
        console.error('Error fetching swaps:', err);
        alert('Error fetching swaps — you may need to log in again.');
      }
    };

    if (token) {
      fetchSwaps();
    }
  }, [token]);

  const handleStatus = async (id, status) => {
    try {
      await API.put(`/swaps/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(`Swap ${status.toLowerCase()}`);

      // Update UI without reload
      setSwaps(swaps.map(s => s.id === id ? { ...s, status } : s));
    } catch (err) {
      console.error(`Error updating swap ${id}:`, err);
      alert('Error updating swap status.');
    }
  };

  return (
    <div>
      <h3>Your Swap Requests</h3>
      {swaps.map(s => (
        <div key={s.id}>
          <p>Offered: {s.offered_skill} — Wanted: {s.wanted_skill} — Status: {s.status}</p>
          {s.status === 'Pending' && (
            <>
              <button onClick={() => handleStatus(s.id, 'Accepted')}>Accept</button>
              <button onClick={() => handleStatus(s.id, 'Rejected')}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
  
}




export default SwapRequests;
