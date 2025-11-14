import { apiHandlers } from './api';
import personerHandler from './personer';

export const handlers = [...apiHandlers, ...personerHandler];
