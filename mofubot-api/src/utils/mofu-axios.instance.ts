import axios from 'axios';

const service = axios.create({
  baseURL: process.env.MOFU_BASE_URL,
  timeout: 5000,
});

export default service;
