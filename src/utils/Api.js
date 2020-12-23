import axios from 'axios';
import Config from '../config/Config';
import Logger from './Logger';
import LoadingBar from '../utils/LoadingBar';
import rootStore from '../stores/RootStore';

let API_URL = 'https://cstalk-prototype.herokuapp.com/';

const Api = axios.create({
  baseURL: API_URL,
  disableLoadingBar: false
});

Api.defaults.timeout = Config.apiCallTimeout;
Api.defaults.headers.post['Content-Type'] = 'application/json';

// 요청 인터셉터
Api.interceptors.request.use(
  function(config) {
    config.headers['Authorization'] =
      config.headers['Authorization'] || rootStore.appStore.token || '';
    config.headers['Company'] =
      config.headers['Company'] || rootStore.appStore.company || '';
    if (!config.disableLoadingBar) {
      LoadingBar.show();
    }
    return config;
  },
  function(error) {
    Logger.error('api before client errors : ' + JSON.stringify(error));
    return Promise.reject(error);
  }
);

// 응답 인터셉터
Api.interceptors.response.use(
  function(response) {
    LoadingBar.hide();
    return response;
  },
  function(error) {
    let requestConfig = error.config;
    // let headers = requestConfig.headers;
    if (error && error.response) {
      if (!requestConfig.disableServerErrorHandle) {
        // 항상 체크하는 서버 에러
        if (error.response.status === 400) {
          // 입력값 오류는 json 구조가 틀림
          rootStore.appStore.handleRequestInputFieldError(error);
        } else if (error.response.status === 401) {
          // 인증 error
          rootStore.appStore.handleUnauthorizedError(error);
        } else if (error.response.status === 403) {
          // 403 error
          rootStore.appStore.handle403StatusError(error);
        } else if (error.response.status === 404) {
          // 404  error
          rootStore.appStore.handle404StatusError(error.config.url);
        } else if (error.response.status === 412) {
          // 412  error
          rootStore.appStore.handle412StatusError(error);
        } else if (error.response.status === 503) {
          // 서버 재시작
          rootStore.appStore.handle503StatusError(error);
        } else if (error.response.status === 510) {
          // 서버 점검
          rootStore.appStore.handle510StatusError(error);
        } else {
          if (!requestConfig.disableServerCommonErrorHandle) {
            // 공통 메시지 처리 : 403, 409, 412, 500, 501, 504
            rootStore.appStore.handleServerCommonError(error);
          }
        }
      }
    } else {
      // error.response가 존재하지 않는 경우 : 서버에서 http option method 오류시 response 값이 없을 수가 있음
      rootStore.appStore.handleNoResponseError(error);
    }
    LoadingBar.hide();
    return Promise.reject(error);
  }
);

export default Api;
