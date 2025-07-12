import { useEffect, useState } from 'react';
import API from '../api';

function Profile() {
  const [profile, setProfile] = useState({});
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        alert('Error fetching profile — please login again.');
      }
    };
    if (userId && token) {
      fetchProfile();
    }
  }, [userId, token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/users/${userId}`, profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating profile — please check your inputs.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={profile.name || ''} placeholder="Name" onChange={handleChange} />
      <input name="location" value={profile.location || ''} placeholder="Location" onChange={handleChange} />
      <input name="skillsOffered" value={profile.skills_offered?.join(',') || ''} placeholder="Skills Offered (comma separated)" onChange={handleChange} />
      <input name="skillsWanted" value={profile.skills_wanted?.join(',') || ''} placeholder="Skills Wanted (comma separated)" onChange={handleChange} />
      <input name="availability" value={profile.availability || ''} placeholder="Availability" onChange={handleChange} />
      <input name="profileVisibility" value={profile.profile_visibility || ''} placeholder="Public or Private" onChange={handleChange} />
      <button type="submit">Update Profile</button>
    </form>
  );
}

export default Profile;
