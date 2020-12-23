import { observable, action, computed, runInAction } from 'mobx';
import Helper from '../utils/Helper';
import Api from '../utils/Api';

// {
//   "loginName": "yamdeng1",
//   "password": "1234",
//   "companyId": "1",
//   "name": "안용성"
// }

class LoginStore {
  @observable loginName = Helper.getInfoByLocalStorage('loginName') || null;

  @observable password = null;

  @observable name = Helper.getInfoByLocalStorage('name') || null;

  @observable companyId = Helper.getInfoByLocalStorage('companyId') || '1';

  @observable saveLoginChecked =
    Helper.getInfoByLocalStorage('saveLoginChecked') || false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  changeLoginName(loginName) {
    this.loginName = loginName;
  }

  @action
  changePassword(password) {
    this.password = password;
  }

  @action
  changeName(name) {
    this.name = name;
  }

  @action
  changeCompany(companyId) {
    this.companyId = companyId;
  }

  @action
  changeSaveLoginChecked(saveLoginChecked) {
    this.saveLoginChecked = saveLoginChecked;
  }

  @action
  login() {
    let saveLoginChecked = this.saveLoginChecked;
    let apiParam = {};
    apiParam.loginName = this.loginName;
    apiParam.name = this.name;
    apiParam.password = this.password;
    apiParam.companyId = this.companyId;
    if (this.validForm()) {
      Api.post('auth/login', apiParam).then(response => {
        runInAction(() => {
          let data = response.data;
          let appStore = this.rootStore.appStore;
          appStore.setLoginInfo(data);
          if (saveLoginChecked) {
            Helper.saveInfoToLocalStorage('companyId', this.companyId);
            Helper.saveInfoToLocalStorage('loginName', this.loginName);
            Helper.saveInfoToLocalStorage('name', this.name);
            Helper.saveInfoToLocalStorage(
              'saveLoginChecked',
              this.saveLoginChecked
            );
          } else {
            Helper.removeInfoByLocalStorage('companyId');
            Helper.removeInfoByLocalStorage('loginName');
            Helper.removeInfoByLocalStorage('name');
            Helper.removeInfoByLocalStorage('saveLoginChecked');
          }
        });
      });
    }
  }

  validForm() {
    let success = true;
    if (!this.loginName || !this.name || !this.password || !this.companyId) {
      success = false;
    }
    return success;
  }

  // [확인] 버튼 활성화 여부
  @computed get enabledButton() {
    let success = true;
    if (!this.loginName || !this.name || !this.password || !this.companyId) {
      success = false;
    }
    return success;
  }

  @action
  clear() {
    this.password = null;
  }
}

export default LoginStore;
