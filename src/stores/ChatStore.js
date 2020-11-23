import { observable, action, runInAction } from 'mobx';
import { message } from 'antd';
import moment from 'moment';
import io from 'socket.io-client';
import Constant from '../config/Constant';
import ModalType from '../config/ModalType';
import Helper from '../utils/Helper';
import ApiService from '../services/ApiService';
import SocketService from '../services/SocketService';
import ModalService from '../services/ModalService';
import LoadingBar from '../utils/LoadingBar';
import update from 'immutability-helper';
import _ from 'lodash';

class ChatStore {
  socket = null;

  // 대기방 time 실시간으로 보여주는 용도
  waitTimeRefreshIntervalHandler = null;

  // 현재 선택한 방 정보
  @observable currentRoomInfo = null;

  // 현재 선택한 계약정보
  @observable currentContractInfo = null;

  // 하단 탭 active index
  @observable bottmActiveTabIndex = -1;

  // 현재 방 탭 종류 : wait, ing, close
  @observable currentRoomTabName = 'wait';

  // 대기방 정렬 정보 : joinDate, waitTime
  @observable readyRoomSort = Constant.READY_ROOM_SORT_WAIT_TIME;

  // 채팅 하단 영역 display 여부
  @observable displayBottomContent = false;

  // 메시지 목록 검색 component view
  @observable displaySearchMessgeComponent = false;

  // 방 목록
  @observable roomList = [];

  // 대기탭 상단 최장대기 고객 시간
  @observable maxDateConvertString = '';

  // 진행 / 종료탭 상단 평균 상담 시간
  @observable averageSpeakTimeString = '';

  // 내 상담만 보기
  @observable checkSelf = false;

  // 방 검색 유형
  @observable searchType = '';

  // 방 검색 값
  @observable searchValue = '';

  // 종료 방 검색 시작일
  @observable startDate = moment().subtract(12, 'months');

  // 종료 방 검색 종료일
  @observable endDate = moment();

  @observable processingRoomListApiCall = false;

  @observable ingCheckSelf = false;

  @observable ingSearchType = 'customerName';

  @observable ingSearchValue = '';

  @observable closeCheckSelf = false;

  @observable closeSearchType = 'customerName';

  @observable closeSearchValue = '';

  @observable messageList = [];

  @observable message = '';

  @observable selectTemplateId = null;

  @observable searchContent = '';

  @action
  changeSearchContent(searchContent) {
    this.searchContent = searchContent;
  }

  @action
  changeMessage(message) {
    this.message = message;
  }

  @action
  sendMessage() {
    let { profile } = this.rootStore.appStore;
    let { companyId, speakerId } = profile;
    let roomId = this.currentRoomInfo.id;
    let socketParam = {
      companyId: companyId,
      speakerId: speakerId,
      roomId: roomId,
      isEmployee: 1,
      templateId: this.selectTemplateId,
      messageType: Constant.MESSAGE_TYPE_NORMAL,
      isSystemMessage: 0,
      messageAdminType: 0,
      messageDetail: null,
      message: this.message
    };
    SocketService.sendMessage(this.socket, socketParam);
    this.selectTemplateId = null;
    this.message = '';
  }

  @action
  sendMessageTypeLink(messageDetailInfo) {
    let { profile } = this.rootStore.appStore;
    let { companyId, speakerId } = profile;
    let roomId = this.currentRoomInfo.id;
    let socketParam = {
      companyId: companyId,
      speakerId: speakerId,
      roomId: roomId,
      isEmployee: 1,
      templateId: this.selectTemplateId,
      messageType: Constant.MESSAGE_TYPE_LINK,
      isSystemMessage: 0,
      messageAdminType: 0,
      messageDetail: messageDetailInfo.text,
      message: messageDetailInfo.url
    };
    SocketService.sendMessage(this.socket, socketParam);
    this.selectTemplateId = null;
    this.message = '';
  }

  @action
  sendSystemMessage(message) {
    let { profile } = this.rootStore.appStore;
    let { companyId, speakerId } = profile;
    let roomId = this.currentRoomInfo.id;
    let socketParam = {
      companyId: companyId,
      speakerId: speakerId,
      roomId: roomId,
      isEmployee: 1,
      templateId: this.selectTemplateId,
      messageType: Constant.MESSAGE_TYPE_LINK,
      isSystemMessage: 1,
      messageAdminType: 0,
      messageDetail: message,
      message: null
    };
    SocketService.sendMessage(this.socket, socketParam);
    this.selectTemplateId = null;
    this.message = '';
  }

  @action
  sendImage() {
    this.selectTemplateId = null;
    this.message = '';
  }

  @action
  sendEmotikon() {
    this.selectTemplateId = null;
    this.message = '';
  }

  @action
  selectTemplate(templateId) {
    this.selectTemplateId = templateId;
    this.message = '';
  }

  @action
  appendMessage(message) {
    this.message = this.message + message;
    this.message = '';
  }

  @action
  openBlackCustomerPopup(roomInfo) {
    ModalService.openMiddlePopup(ModalType.BLACK_CUSTOMER_POPUP, {
      ok: (blockType, remark) => {
        let apiParam = { blockType: blockType, remark: remark };
        ApiService.put(
          'customer/' + roomInfo.customerId + '/block',
          apiParam
        ).then(response => {
          runInAction(() => {
            let data = response.data;
            let updateCurrentRoomInfo = update(this.currentRoomInfo, {
              $merge: { isBlockCustomer: data.isBlock }
            });
            this.currentRoomInfo = updateCurrentRoomInfo;
            let bodyText = '관심고객이 해제되었습니다';
            if (blockType) {
              bodyText = '관심고객으로 지정되었습니다';
            }
            ModalService.alert({ title: '관심고객 설정', body: bodyText });
          });
        });
      }
    });
  }

  @action
  initDate() {
    this.startDate = moment().subtract(12, 'months');
    this.endDate = moment();
    this.search();
  }

  @action
  changeIngCheckSelf(ingCheckSelf) {
    this.ingCheckSelf = ingCheckSelf;
    this.search();
  }

  @action
  changeIngSearchType(ingSearchType) {
    this.ingSearchType = ingSearchType;
  }

  @action
  changeIngSearchValue(ingSearchValue) {
    this.ingSearchValue = ingSearchValue;
  }

  @action
  changeCloseCheckSelf(closeCheckSelf) {
    this.closeCheckSelf = closeCheckSelf;
    this.search();
  }

  @action
  changeCloseSearchType(closeSearchType) {
    this.closeSearchType = closeSearchType;
  }

  @action
  changeCloseSearchValue(closeSearchValue) {
    this.closeSearchValue = closeSearchValue;
  }

  @action
  changeDates(startDate, endDate) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.search();
  }

  @action
  changeCheckSelf(checkSelf) {
    this.checkSelf = checkSelf;
  }

  @action
  changeSearchType(searchType) {
    this.searchType = searchType;
  }

  @action
  changeSearchValue(searchValue) {
    this.searchValue = searchValue;
  }

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  listenWaitTimeRefreshEvent() {
    if (this.waitTimeRefreshIntervalHandler) {
      clearInterval(this.waitTimeRefreshIntervalHandler);
    }
    this.waitTimeRefreshIntervalHandler = setInterval(() => {
      runInAction(() => {
        let waitStartDates = this.roomList.map(room =>
          room.waitStartDate ? moment(room.waitStartDate) : moment()
        );
        this.roomList.forEach(room => {
          room.waitTime = Helper.convertStringBySecond(
            moment().diff(room.waitStartDate, 'seconds')
          );
        });
        let maxDate = moment.min(waitStartDates);
        let maxDateConvertString = '';
        if (maxDate) {
          maxDateConvertString = Helper.convertStringBySecond(
            moment().diff(maxDate, 'seconds')
          );
        }
        this.maxDateConvertString = maxDateConvertString;
      });
    }, 1000);
  }

  removeReadyTimeRefreshEvent() {
    if (this.waitTimeRefreshIntervalHandler) {
      clearInterval(this.waitTimeRefreshIntervalHandler);
    }
  }

  // 메시지 목록 검색 component view 여부 변경
  @action
  changeDisplaySearchMessgeComponent(displaySearchMessgeComponent) {
    this.displaySearchMessgeComponent = displaySearchMessgeComponent;
  }

  // 방 탭 변경
  @action
  changeRoomTab(tabName) {
    LoadingBar.show();
    this.currentRoomTabName = tabName;
    if (tabName === Constant.ROOM_TYPE_WAIT) {
      this.listenWaitTimeRefreshEvent();
    } else {
      this.removeReadyTimeRefreshEvent();
    }
    this.search();
  }

  @action
  matchRoom(roomInfo) {
    if (!this.currentRoomInfo || this.currentRoomInfo.id !== roomInfo.id) {
      let { profile } = this.rootStore.appStore;
      let { speakerId } = profile;
      if (this.currentRoomInfo) {
        SocketService.leave(this.socket, this.currentRoomInfo.id);
      }
      // 종료 or 대기
      if (roomInfo.state >= 2 || (roomInfo.state < 2 && !roomInfo.memberId)) {
        ApiService.post('room/' + roomInfo.id + '/matchRoom').then(response => {
          runInAction(() => {
            let data = response.data;
            SocketService.join(this.socket, data.id, speakerId).then(
              messageList => {
                runInAction(() => {
                  let oriMessageList = this.messageList.toJS();
                  let newMessageList = _.concat(messageList, oriMessageList);
                  this.messageList = newMessageList;
                  setTimeout(() => {
                    Helper.scrollBottomByDivId('messageListScroll', 500);
                  }, 500);
                });
              }
            );
            this.currentRoomInfo = data;
            this.currentRoomTabName = Constant.ROOM_TYPE_ING;
            this.search();
          });
        });
      } else {
        // 진행
        ApiService.get('room/' + roomInfo.id).then(response => {
          runInAction(() => {
            let data = response.data;
            SocketService.join(this.socket, data.id, speakerId).then(
              messageList => {
                runInAction(() => {
                  let oriMessageList = this.messageList.toJS();
                  let newMessageList = _.concat(messageList, oriMessageList);
                  this.messageList = newMessageList;
                  setTimeout(() => {
                    Helper.scrollBottomByDivId('messageListScroll', 500);
                  }, 500);
                });
              }
            );
            this.currentRoomInfo = data;
            this.currentRoomTabName = Constant.ROOM_TYPE_ING;
          });
        });
      }
    }
    this.selectTemplateId = null;
  }

  @action
  closeRoom(roomInfo) {
    ModalService.confirm({
      title: '상담종료',
      body: '현재 상담을 종료하시겠습니까?',
      ok: () => {
        ApiService.post('room/' + roomInfo.id + '/closeRoom').then(response => {
          ModalService.alert({
            title: '상담종료',
            body: '상담이 종료되었습니다',
            ok: () => {
              runInAction(() => {
                this.currentRoomTabName = Constant.ROOM_TYPE_CLOSE;
                this.search();
              });
            }
          });
        });
      }
    });
  }

  @action
  transferRoom(roomInfo) {
    ModalService.openMiddlePopup(ModalType.TALK_MOVE_POPUP, {
      customerName: roomInfo.customerName,
      ok: (transferValue, selectInfo) => {
        let apiParam = { transferType: 'ready' };
        if (transferValue) {
          apiParam = { transferType: 'toMember', memberId: transferValue };
        }
        ApiService.post('room/' + roomInfo.id + '/transferRoom', apiParam).then(
          response => {
            let transferName = selectInfo.id ? selectInfo.name : '상담 대기건';
            ModalService.alert({
              title: '상담이관 완료',
              body:
                '<span class="bold">' +
                "'" +
                transferName +
                "'</span>으로 이관 하였습니다",
              ok: () => {
                runInAction(() => {
                  if (selectInfo.id) {
                    this.currentRoomTabName = Constant.ROOM_TYPE_ING;
                  } else {
                    this.currentRoomTabName = Constant.ROOM_TYPE_WAIT;
                    this.listenWaitTimeRefreshEvent();
                  }
                  this.search();
                });
              }
            });
          }
        );
      }
    });
  }

  // 방 선택
  @action
  selectRoom(roomInfo) {
    // TODO : 메시지 목록을 api로 가져온다
    this.currentRoomInfo = roomInfo;
    this.selectTemplateId = null;
  }

  // 하단 탭 index 변경
  @action
  changeBottomActiveTabIndex(tabIndex) {
    if (
      this.bottmActiveTabIndex === -1 ||
      this.bottmActiveTabIndex === tabIndex
    ) {
      this.displayBottomContent = !this.displayBottomContent;
    } else if (
      this.bottmActiveTabIndex !== tabIndex &&
      !this.displayBottomContent
    ) {
      this.displayBottomContent = true;
    }
    this.bottmActiveTabIndex = tabIndex;
  }

  // 대기 방 정렬 정보 변경
  @action
  changeReadyRoomSort(readyRoomSort) {
    this.readyRoomSort = readyRoomSort;
    this.search();
  }

  @action
  openChatbotHistoryPopup(roomInfo) {
    ModalService.openMiddlePopup(ModalType.CHAT_BOT_HISTORY_POPUP, {
      history: roomInfo.joinHistoryJson
    });
  }

  @action
  openMinwonAddPopup() {
    let currentRoomInfo = this.currentRoomInfo;
    ModalService.openMiddlePopup(ModalType.MINWON_ADD_POPUP, {
      customerName: currentRoomInfo.customerName,
      chatid: currentRoomInfo.chatid,
      gasappMemberNumber: currentRoomInfo.gasappMemberNumber,
      ok: (smallCategoryInfo, memo) => {
        let apiParam = {
          gasappMemberNumber: currentRoomInfo.gasappMemberNumber,
          useContractNum: null,
          categorySmallId: smallCategoryInfo.id,
          minwonCode: smallCategoryInfo.minwonCode,
          telNumber: currentRoomInfo.telNumber,
          memo: memo,
          chatid: currentRoomInfo.chatid,
          roomId: currentRoomInfo.id
        };
        ApiService.post('minwon', apiParam).then(response => {
          ModalService.alert({
            title: '민원등록 완료',
            body: '민원이 등록되었습니다'
          });
          ApiService.get('room/' + currentRoomInfo.id).then(response => {
            runInAction(() => {
              let data = response.data;
              this.currentRoomInfo = data;
            });
          });
        });
      }
    });
  }

  @action
  openMinwonHistoryPopup() {
    let currentRoomInfo = this.currentRoomInfo;
    if (currentRoomInfo.joinHistoryCount) {
      ModalService.openMiddlePopup(ModalType.MINWON_HISTORY_POPUP, {
        customerName: currentRoomInfo.customerName,
        chatid: currentRoomInfo.chatid,
        gasappMemberNumber: currentRoomInfo.gasappMemberNumber,
        roomId: currentRoomInfo.id
      });
    } else {
      ModalService.alert({ body: '등록한 민원이 없습니다' });
    }
  }
  @action
  search() {
    this.processingRoomListApiCall = true;
    let apiParam = {};
    let currentRoomTabName = this.currentRoomTabName;
    if (currentRoomTabName === Constant.ROOM_TYPE_WAIT) {
      apiParam.queryId = 'findReadyState';
      apiParam.sort = this.readyRoomSort;
    } else if (currentRoomTabName === Constant.ROOM_TYPE_ING) {
      apiParam.queryId = 'findIngState';
      apiParam.checkSelf = this.ingCheckSelf ? 'Y' : 'N';
      apiParam.searchType = this.ingSearchType;
      apiParam.searchValue = this.ingSearchValue;
    } else if (currentRoomTabName === Constant.ROOM_TYPE_CLOSE) {
      apiParam.queryId = 'findSearchCloseState';
      apiParam.checkSelf = this.closeCheckSelf ? 'Y' : 'N';
      apiParam.searchType = this.closeSearchType;
      apiParam.searchValue = this.closeSearchValue;
      apiParam.startDate = moment(this.startDate).format('YYYY-MM-DD');
      apiParam.endDate = moment(this.endDate).format('YYYY-MM-DD');
    }
    ApiService.get('room', { params: apiParam })
      .then(response => {
        runInAction(() => {
          this.processingRoomListApiCall = false;
          let data = response.data;
          let totalSpeakMinute = 0;
          data.forEach(info => {
            if (info.speakMinute) {
              totalSpeakMinute = totalSpeakMinute + info.speakMinute;
            }
          });
          let averageSpeakMinute = 0;
          if (totalSpeakMinute) {
            averageSpeakMinute = Math.floor(totalSpeakMinute / data.length);
          }
          this.averageSpeakTimeString = Helper.convertStringBySecond(
            averageSpeakMinute * 60
          );
          this.roomList = data;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.processingRoomListApiCall = false;
        });
      });
  }

  initSocket() {
    let { profile, token } = this.rootStore.appStore;
    let socketUrl = 'http://localhost:8090';
    if (!this.socket || this.socket.disconnected) {
      socketUrl =
        socketUrl + '?companyId=' + profile.companyId + '&token=' + token;
      this.socket = io(socketUrl);
      this.initDefaultSocektEvent();
    }
  }

  initDefaultSocektEvent() {
    this.socket.on('connect', this.onConnect.bind(this));
    this.socket.on('disconnect', this.onDisconnect.bind(this));
    this.socket.on('welcome', this.onWelcome.bind(this));
    this.socket.on('message-list', this.onMessageList.bind(this));
    this.socket.on('message', this.onMessage.bind(this));
    this.socket.on('error', this.onError.bind(this));
    this.socket.on('read-message', this.onReadMessage.bind(this));
    this.socket.on('receive-event', this.onReceiveEvent.bind(this));
  }

  onConnect() {
    message.info('socket connect', 1);
  }

  onDisconnect() {
    message.warning('socket disconnect', 1);
  }

  onWelcome(socketResponse) {
    message.info('welcome : ' + JSON.stringify(socketResponse), 1);
  }

  onMessageList(messageList) {
    console.log('messageList : ' + messageList);
  }

  onMessage(message) {
    runInAction(() => {
      let oriMessageList = this.messageList.toJS();
      this.messageList = oriMessageList.concat([message]);
      Helper.scrollBottomByDivId('messageListScroll', 500);
    });
  }

  onError(error) {
    console.log('error : ' + error);
  }

  onReadMessage(readMessage) {
    console.log('readMessage : ' + readMessage);
  }

  onReceiveEvent(eventInfo) {
    console.log('receiveEvent : ' + eventInfo);
  }

  handleAccordionChange(event, accordionName, isOpen) {
    let offsetParent1 = event.target.offsetParent;
    let parent1TageName = offsetParent1.tagName;
    if (!isOpen && event.target.offsetParent) {
      let moveScrollYposition = event.target.offsetParent.offsetTop;
      if (parent1TageName === 'P') {
        moveScrollYposition = event.target.offsetParent.offsetParent.offsetTop;
      }
    }
    // Helper.scrollTopByDivId('messageListScroll', moveScrollYposition, 100);
  }

  @action
  clear() {
    this.currentRoomInfo = null;
    this.displayBottomContent = false;
  }
}

export default ChatStore;
