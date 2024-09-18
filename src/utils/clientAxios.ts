import { env } from '@/env';
import axios from 'axios';

export const clientAxios = axios.create({
  baseURL: `${env.baseURL}/api`,
});

clientAxios.defaults.withCredentials = true;
