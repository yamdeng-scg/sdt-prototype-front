import { observable, action, runInAction } from 'mobx';
import AppHistory from '../utils/AppHistory';

class UiStore {
  // 로딩바 display
  @observable displayLoadingBar = false;

  // 이전 라우팅 url
  @observable beforeRouteUrl = null;

  // 현재 라우팅 url
  @observable currentRouteUrl = null;

  // 오늘의 통계 정보
  @observable todayStatsInfo = null;

  // 브라우저 inner height
  @observable clientHeight = document.documentElement.clientHeight;

  // chat, template, manual, stats, manager
  @observable sideBarSelectMenuKName = 'chat';

  @action
  changeSideBarSelectMenuKName(sideBarSelectMenuKName) {
    this.sideBarSelectMenuKName = sideBarSelectMenuKName;
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
    window.addEventListener('resize', this.handleResizeEvent.bind(this));
  }

  handleResizeEvent() {
    runInAction(() => {
      this.clientHeight = document.documentElement.clientHeight;
    });
  }

  // 히스토리 이동 공통 인터페이스
  goPage(url, isReplace) {
    if (isReplace) {
      AppHistory.replace(url);
    } else {
      AppHistory.push(url);
    }
  }

  @action
  changeCurrentRouteUrl(currentRouteUrl) {
    if (this.currentRouteUrl) {
      this.beforeRouteUrl = this.currentRouteUrl;
    }
    this.currentRouteUrl = currentRouteUrl;
  }

  @action
  changeOnlyCurrentRouteUrl(currentRouteUrl) {
    this.currentRouteUrl = currentRouteUrl;
  }

  // 로딩바 show
  @action
  showLoadingBar() {
    this.displayLoadingBar = true;
  }

  // 로딩바 hide
  @action
  hideLoadingBar() {
    this.displayLoadingBar = false;
  }

  // 오늘의 상담 정보 요청
  @action
  loadTodayStats() {}

  @action
  clearModal() {
    this.rootStore.modalStore.hideAllModal();
    this.rootStore.alertModalStore.hideModal();
  }
}

export default UiStore;
