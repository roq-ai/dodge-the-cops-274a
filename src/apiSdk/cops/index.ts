import axios from 'axios';
import queryString from 'query-string';
import { CopInterface, CopGetQueryInterface } from 'interfaces/cop';
import { GetQueryInterface } from '../../interfaces';

export const getCops = async (query?: CopGetQueryInterface) => {
  const response = await axios.get(`/api/cops${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCop = async (cop: CopInterface) => {
  const response = await axios.post('/api/cops', cop);
  return response.data;
};

export const updateCopById = async (id: string, cop: CopInterface) => {
  const response = await axios.put(`/api/cops/${id}`, cop);
  return response.data;
};

export const getCopById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/cops/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCopById = async (id: string) => {
  const response = await axios.delete(`/api/cops/${id}`);
  return response.data;
};
