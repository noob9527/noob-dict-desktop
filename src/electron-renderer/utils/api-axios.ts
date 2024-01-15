import axios from 'axios'
import { APP_CONSTANTS } from '../../common/app-constants'

export const apiAxios = axios.create({
  baseURL: APP_CONSTANTS.API_PREFIX,
})
