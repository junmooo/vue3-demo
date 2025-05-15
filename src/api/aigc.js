import { md5 } from '@/utils/md5';
import service from './axios';

export const AIGC_URL = 'https://qingbing.top:7606';
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
  const res = await service.post(`${AIGC_URL}/user/login`, params);
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

export const tasks = (task_id) => {
  return service.get(`/tasks/${task_id}`);
};
