import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:7777/api', // ajustá si es necesario
});

export default instance;