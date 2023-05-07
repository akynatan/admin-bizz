import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  validateStatus: (status: number) => {
    if (status >= 200 && status < 300) {
      return true;
    }

    if (status === 401 && window.location.pathname !== '/') {
      localStorage.removeItem('@AdminBizz:token');
      localStorage.removeItem('@AdminBizz:user');

      window.location.href = '';
    }

    return false;
  },
});

export default api;
