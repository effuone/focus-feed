import axios from 'axios';

const backendApiUrl = 'http://localhost:8000';

const backendApiInstance = axios.create({
  baseURL: backendApiUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default backendApiInstance;
