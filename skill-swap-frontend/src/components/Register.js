import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    await API.post('/auth/register', data);
    alert('Registered successfully');
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input name="location" placeholder="Location" onChange={handleChange} />
      <input name="skillsOffered" placeholder="Skills Offered (comma separated)" onChange={handleChange} />
      <input name="skillsWanted" placeholder="Skills Wanted (comma separated)" onChange={handleChange} />
      <input name="availability" placeholder="Availability" onChange={handleChange} />
      <input name="profileVisibility" placeholder="Public or Private" onChange={handleChange} />
      <input type="file" name="profilePhoto" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
