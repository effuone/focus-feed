import axios from 'axios';

const backendApiUrl = 'https://focus-feed-production.up.railway.app';

const backendApiInstance = axios.create({
  baseURL: backendApiUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default backendApiInstance;
