import { md5 } from '@/utils/md5';
import service from './axios';
import { SLUG, THREAD_SLUG } from '@/config';

// Mock service for testing
const mockService = {
  post: async (url, params) => {
    if (url.includes('/user/login')) {
      if (params.name === 'junmooo' && params.pwd === md5('123')) {
        return {
          code: 0,
          data: {
            token: 'mock-token-123456',
            user: {
              id: 1,
              name: 'junmooo',
              email: 'junmooo@qq.com',
            },
          },
        };
      } else {
        return {
          code: 1,
          message: 'Invalid username or password',
        };
      }
    }
    return { code: 404, message: 'Not Found' };
  },
};

export const AIGC_URL = 'http://localhost:3001/api/v1';
export const IMG_URL = 'https://qingbing.top:6789';
export const AIGC_WS_URL = 'wss://qingbing.top:7606/ws/res';



export const text2Img = (params) => {
  return service.post(`${AIGC_URL}/aigc/text-2-img`, params);
};

export const text2ImgHistory = (params) => {
  return service.get(`${AIGC_URL}/aigc/text-2-img-history`, { params });
};

export const login = async (params) => {
  params.pwd = md5(params.pwd);
  const res = await mockService.post(`${AIGC_URL}/user/login`, params);
  // const res = await service.post(`${AIGC_URL}/user/login`, params);
  return res;
};

export const register = (params) => {
  params.pwd = md5(params.pwd);
  return service.post(`${AIGC_URL}/user/register`, params);
};

export const getImgUrl = (imgId) => {
  return `${IMG_URL}/flux/${imgId}.png`;
};

export const getDialogueHistory = (params) => {
  return service.get(`${AIGC_URL}/aigc/get-dialogues`, { params });
};

export const getCharts = () => {
  return service.get(`http://localhost:3001/api/v1/workspace/${SLUG}/thread/${THREAD_SLUG}/chats`, {headers: { Authorization: `Bearer ${THREAD_SLUG}` }});
};

export const tasks = (task_id) => {
  return service.get(`/tasks/${task_id}`);
};
