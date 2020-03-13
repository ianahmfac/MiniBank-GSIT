import axios from 'axios';

export default axios.create({
    baseURL: 'http://10.68.101.6:8096/api'
});