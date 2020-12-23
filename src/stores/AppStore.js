import { observable, action, runInAction, computed } from 'mobx';
import Helper from '../utils/Helper';
import Api from '../utils/Api';
import ApiService from '../services/ApiService';
import ModalService from '../services/ModalService';
import Constant from '../config/Constant';

class AppStore {
  // company
  @observable company = 0;

  // 로그인 token
  @observable token = Helper.getInfoByLocalStorage('token') || null;

  // 로그인한 사용자 정보
  @observable profile = Helper.getInfoByLocalStorage('profile') || {};

  // 회사 목록
  @observable companyList = [];

  // 현재 시간 통계 정보
  @observable currentStatsInfo = {};

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  logout() {
    ModalService.confirm({
      title: '로그아웃',
      body: '로그아웃하시겠습니까?',
      ok: () => {
        runInAction(() => {
          this.token = '';
          this.profile = null;
          Helper.removeInfoByLocalStorage('token');
        });
      }
    });
  }

  @action
  setLoginInfo(loginInfo) {
    this.token = loginInfo.token;
    this.profile = loginInfo.profile;
    Helper.saveInfoToLocalStorage('token', loginInfo.token);
    Helper.saveInfoToLocalStorage('profile', loginInfo.profile);
  }

  @action
  changeProfile(profile) {
    this.profile = profile;
  }

  @action
  changeToken(token) {
    this.token = token;
  }

  @action
  loadProfile() {
    Api.get('auth/profile').then(response => {
      let data = response.data;
      this.setLoginInfo(data);
    });
    ApiService.get('room', { params: { queryId: 'getCurrentTimeStats' } }).then(
      respone => {
        runInAction(() => {
          let data = respone.data;
          this.currentStatsInfo = data;
        });
      }
    );
  }

  // 400 status code 에러 처리
  handleRequestInputFieldError(httpError) {}

  // 401 status code 에러 처리(인증 오류)
  handleUnauthorizedError(httpError) {}

  // 403 status code 에러 처리
  handle403StatusError(httpError) {}

  // 404 status code 에러 처리
  handle404StatusError(url) {}

  // 412 status code 에러 처리
  handle412StatusError(httpError) {}

  // 503 status code 에러 처리
  handle503StatusError(httpError) {}

  // 504 status code 에러 처리
  handle504StatusError(httpError) {}

  // 510 status code 에러 처리
  handle510StatusError(httpError) {}

  // 400, 401, 404, 412, 428, 426, 502, 503, 504, 510 status code를 제외한 에러 처리
  // 403, 409, 412, 500, 501, 503, 504 status code 에러 처리
  handleServerCommonError(httpError, companyCode) {
    let response = httpError.response;
    let data = response.data || {};
    let serverErrorMessage = data.message || '알수없는 서버 오류입니다';
    if (serverErrorMessage) {
      serverErrorMessage = serverErrorMessage.replace(/\\n/g, '<br/>');
    }
    // 그외 서버 공통 에러 처리(status : 403, 409, 412, 500, 501, 503, 504)
    let modalData = {
      title: '서버오류',
      body: serverErrorMessage
    };
    ModalService.alert(modalData);
  }

  // response가 존재하지 않는 경우 : ex) option 메서드 오류
  handleNoResponseError() {}

  // 웹뷰 reload
  reloadApp() {
    document.location.href = '/' + process.env.PUBLIC_URL;
  }

  @action
  loadCompanyList() {
    ApiService.get('company').then(respone => {
      runInAction(() => {
        let data = respone.data;
        this.companyList = data;
      });
    });
  }

  @computed
  get isManager() {
    let profile = this.profile;
    let isManager = false;
    if (profile && profile.authLevel <= Constant.MEMBER_AUTH_MANAGER) {
      isManager = true;
    }
    return isManager;
  }
}

export default AppStore;
