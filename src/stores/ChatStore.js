/* global SockJS, Stomp */

import { observable, action, runInAction, computed } from 'mobx';
import { message } from 'antd';
import io from 'socket.io-client';
import moment from 'moment';
import Constant from '../config/Constant';
import Helper from '../utils/Helper';
import SocketService from '../services/SocketService';
import _ from 'lodash';

// http://localhost:8090
// https://cstalk-prototype.herokuapp.com/w
// http://localhost:8090/ws
const serverUrl = 'http://localhost:8080/ws';

// 챗봇 메시지 컨테이너 id
const chatbotContainerId = 'messageContainer';

// 스크롤 애니메이션 timeout
const scrollAnimationTime = 500;

class ChatStore {
  @observable
  socket = null;

  @observable
  customer = null;

  @observable
  roomInfo = null;

  // 방 목록
  @observable messageList = [];

  @observable message = '';

  @observable companyId = '1';

  @observable appId = '';

  @observable telNumber = '';

  @observable notMoreMessage = false;

  @observable afterJoinListCall = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  changeCompanyId(companyId) {
    this.companyId = companyId;
  }

  @action
  changeAppId(appId) {
    this.appId = appId;
  }

  @action
  changeName(name) {
    this.name = name;
  }

  @action
  changeMessage(message) {
    this.message = message;
  }

  @action
  sendMessage() {
    if (!this.socket) {
      return;
    }
    let { speakerId, companyId, roomId } = this.customer;
    let socket = this.socket;
    let message = this.message;
    let socketParam = {
      companyId: companyId,
      speakerId: speakerId,
      roomId: roomId,
      isEmployee: 0,
      templateId: null,
      messageType: Constant.MESSAGE_TYPE_NORMAL,
      isSystemMessage: 0,
      messageAdminType: 0,
      messageDetail: null,
      message: message
    };
    SocketService.sendMessage(socket, socketParam);
    this.message = '';
  }

  @action
  connectSocket() {
    let companyId = this.companyId;
    let appId = this.appId;
    this.afterJoinListCall = false;
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        let secretKey = '$CSTALK#_' + moment().format('YYYYMMDD');
        let socketUrl = serverUrl;
        let sockJsInstance = new SockJS(socketUrl);
        let socket = Stomp.over(sockJsInstance);
        socket.connect(
          {
            companyId: companyId,
            gasappMemberNumber: appId,
            secretKey: secretKey
          },
          socketResponse => {
            this.onConnect(socketResponse);
            this.initSocketEventTypeStomp();
            resolve();
          },
          () => {
            // console.log('error');
          }
        );
        this.socket = socket;
      } else {
        resolve();
      }
    });
  }

  // 소켓 이벤트 등록 : stomp
  @action
  initSocketEventTypeStomp() {
    if (this.socket) {
      // 개인메시지 수신전용 구독(Session 기반)
      this.socket.subscribePrivate = this.socket.subscribe(
        '/user/session/message',
        subscribeInfo => {
          this.onPrivateSubscribe(subscribeInfo);
        },
        {} // 구독시 전송할 헤더
      );
    }
  }

  @action
  setCustomer(customer) {
    this.customer = customer;
    if (this.socket) {
      this.saveHistory();
      this.socket.subscribeRoom = this.socket.subscribe(
        `/sub/socket/room/${customer.roomId}`, // 구독채널명
        subscribeInfo => {
          this.onRoomSubscribe(subscribeInfo);
        },
        {} // 구독시 전송할 헤더
      );
    }
  }

  @action
  onPrivateSubscribe(socketResponse) {
    if (socketResponse && socketResponse.body) {
      let body = JSON.parse(socketResponse.body);
      let { eventName, data } = body;
      if (eventName === 'LOGINED') {
        this.setCustomer(data.profile);
      } else if (eventName === 'MESSAGE_LIST') {
        this.onMessageList(data.messages);
      } else if (eventName === 'START_MESSAGE') {
        this.onMessage(data.message);
      } else if (eventName === 'MESSAGE') {
        this.onMessage(data.message);
      }
    }
  }

  @action
  onRoomSubscribe(socketResponse) {
    if (socketResponse && socketResponse.body) {
      let body = JSON.parse(socketResponse.body);
      let { eventName, data } = body;
      if (eventName === 'MESSAGE') {
        this.onMessage(data.message);
      } else if (eventName === 'READ_MESSAGE') {
        this.onReadMessage(data);
      }
    }
  }

  @action
  onConnect(socketResponse) {
    message.info('socket connect !!!');
  }

  @action
  onDisconnect(socketResponse) {
    message.warning('socket disconnect!!');
    this.socket = null;
  }

  @action
  onMessageList(messageList) {
    if (!messageList.length) {
      this.notMoreMessage = true;
    } else {
      let oriMessageList = this.messageList.toJS();
      let updateMessageList = messageList.concat(oriMessageList);
      let groupingDate = '';
      updateMessageList.forEach(messageInfo => {
        messageInfo.groupingDate = '';
        let createDateString = moment(messageInfo.createDate).format(
          'YYYY-MM-DD'
        );
        if (groupingDate !== createDateString) {
          messageInfo.groupingDate = createDateString;
          groupingDate = createDateString;
        }
      });
      this.messageList = updateMessageList;
      if (!this.afterJoinListCall) {
        setTimeout(() => {
          Helper.scrollBottomByDivId('messageListScroll', 500);
          setTimeout(() => {
            runInAction(() => {
              this.afterJoinListCall = true;
            });
          }, 100);
        }, 1000);
      }
    }
  }

  @action
  moreMessageList() {
    let messageList = this.messageList.toJS();
    if (messageList.length && this.afterJoinListCall && !this.notMoreMessage) {
      let firstMessage = messageList[0];
      let startId = firstMessage.id;
      let socket = this.socket;
      let { roomId } = this.customer;
      SocketService.moreMessage(socket, roomId, startId);
    }
  }

  @action
  onMessage(newMessage) {
    runInAction(() => {
      let oriMessageList = this.messageList.toJS();
      let searchIndex = _.findIndex(oriMessageList, messageInfo => {
        return (
          messageInfo.groupingDate ===
          moment(newMessage.createDate).format('YYYY-MM-DD')
        );
      });
      if (searchIndex === -1) {
        newMessage.groupingDate = moment(newMessage.createDate).format(
          'YYYY-MM-DD'
        );
      }
      setTimeout(() => {
        Helper.scrollBottomByDivId('messageListScroll', 500);
      }, 500);
      let socket = this.socket;
      let { speakerId, roomId } = this.customer;
      /*
    
        메시지가 왔을 경우 읽음 처리
          1.내가 보낸 메시지가 아닌 경우

      */
      if (newMessage.speakerId !== speakerId) {
        SocketService.readMessage(
          socket,
          roomId,
          speakerId,
          newMessage.id,
          newMessage.id
        );
        newMessage.noReadCount = newMessage.noReadCount - 1;
      }
      this.messageList = oriMessageList.concat([newMessage]);
    });
  }

  @action
  onError(error) {
    message.warn('error : ' + error);
  }

  @action
  onReadMessage(data) {
    message.info('readMessage : ' + data);
    let { speakerId, roomId } = this.customer;
    // room 정보가 동일하고 speakerId가 내가 아닌 경우에만 처리
    if (roomId === data.roomId) {
      if (speakerId !== data.speakerId) {
        let messageList = this.messageList.toJS();
        let newMessageList = messageList.map(info => {
          if (info.noReadCount !== 0) {
            // id가 startId 보다 크거나 endId 보다 작거나 같은 경우에 읽음 처리 -1
            if (info.id >= data.startId - 1 && info.id <= data.endId) {
              info.noReadCount = info.noReadCount - 1;
            }
          }
          return info;
        });
        this.messageList = newMessageList;
      }
    }
  }

  @action
  onRoomDetail(roomInfo) {
    // message.info('roomDetail : ' + roomInfo);
    this.roomInfo = roomInfo;
  }

  @action
  disconnect() {
    let socket = this.socket;
    if (socket) {
      socket.disconnect();
    }
    this.messageList = [];
  }

  @action
  review(reviewScore) {
    let socket = this.socket;
    SocketService.review(socket, reviewScore);
  }

  @action
  end() {
    let socket = this.socket;
    let customer = this.customer;
    let { roomId } = customer;
    SocketService.end(socket, roomId);
  }

  @action
  saveHistory() {
    let socket = this.socket;
    let customer = this.customer;
    let { roomId } = customer;
    SocketService.saveHistory(socket, roomId, [
      {
        m: '나도 오늘 저녁이 기대된다!yap',
        t: '2019-08-23 17:41:28'
      },
      {
        m: 'ㅏㅏㅏㅏㅏㅏ',
        t: '2019-08-23 17:41:39'
      }
    ]);
  }

  @action
  moreMessage() {
    let socket = this.socket;
  }

  // div 기준으로 스크롤 이동시키기
  @action
  scrollBottomByDivId() {
    Helper.scrollBottomByDivId(chatbotContainerId, scrollAnimationTime);
  }

  // 로그인 버튼 여부 체크
  @computed
  get disabledButton() {
    let disabled = true;
    let companyId = this.companyId;
    let appId = this.appId;
    let name = this.name;
    if (companyId && appId && name) {
      disabled = false;
    }
    return disabled;
  }

  // 연결끊기 버튼 여부 체크
  @computed
  get disabledDisconnectButton() {
    let disabled = true;
    let socket = this.socket;
    if (!socket || socket.disconnected) {
      disabled = false;
    }
    return disabled;
  }

  // 소켓 연결 여부
  @computed
  get connectedSocket() {
    let connected = true;
    let socket = this.socket;
    if (!socket) {
      connected = false;
    }
    return connected;
  }

  @action
  clear() {
    this.currentRoomInfo = null;
    this.displayBottomContent = false;
  }
}

export default ChatStore;
