import React from 'react';
import Constant from '../../config/Constant';
import moment from 'moment';
import { Button, Modal } from 'antd';

import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

const replaceHighLighText = function(message, searchValue) {
  let resultMessage = message;
  if (searchValue) {
    var regEx = new RegExp(searchValue, 'g');
    resultMessage = message.replace(
      regEx,
      '<span class="bg-yellow color-black">' + searchValue + '</span>'
    );
  }
  return resultMessage;
};

@withRouter
@inject('chatStore', 'uiStore')
@observer
class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewModal: false, imageSrc: '' };
    this.scrollRef = React.createRef();
    this.handleHistoryScrollEvent = this.handleHistoryScrollEvent.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(imageSrc) {
    this.setState({ viewModal: true, imageSrc: imageSrc });
  }

  closeModal() {
    this.setState({ viewModal: false });
  }

  handleHistoryScrollEvent() {
    let scrollDom = this.scrollRef.current,
      scrollTop = scrollDom.scrollTop;
    if (scrollTop < 30) {
      this.props.chatStore.moreMessageList();
    }
  }

  convertMessageListToComponet() {
    let { messageList, searchValue } = this.props;
    let messsageListComponent = messageList.map(messageInfo => {
      let isEmployee = messageInfo.isEmployee;
      let isSystemMessage = messageInfo.isSystemMessage;
      let messageType = messageInfo.messageType;
      let messageId = messageInfo.id;
      let message = messageInfo.message;
      let messageDetail = messageInfo.messageDetail;
      let noReadCount = messageInfo.noReadCount;
      let resultMessage = messageDetail ? messageDetail : message;
      let messageComponent = null;
      resultMessage = replaceHighLighText(resultMessage, searchValue);
      resultMessage = resultMessage.replace(/(?:\r\n|\r|\n)/g, '<br/>');
      if (isSystemMessage) {
        messageComponent = (
          <div
            id={messageId + 'message'}
            key={messageId}
            style={{ textAlign: 'center', marginBottom: 15 }}
          >
            <div
              style={{
                maxWidth: '80%',
                display: 'inline-block',
                textAlign: 'center',
                padding: '11px 15px 9px',
                color: 'red',
                wordBreak: 'break-all'
              }}
            >
              <div>{message}</div>
            </div>
          </div>
        );
      } else if (isEmployee) {
        messageComponent = (
          <div
            id={messageId + 'message'}
            key={messageId}
            style={{ textAlign: 'right', marginBottom: 15 }}
          >
            <div
              style={{
                maxWidth: '80%',
                display: 'inline-block',
                position: 'relative',
                borderRadius: '13px 0px 13px 13px',
                backgroundColor:
                  messageType === Constant.MESSAGE_TYPE_LINK
                    ? 'orange'
                    : '#78c0fd',
                fontWeight:
                  messageType === Constant.MESSAGE_TYPE_LINK ? 'bold' : '',
                textAlign: 'left',
                padding: '11px 15px 9px',
                color: '#fff',
                wordBreak: 'break-all'
              }}
            >
              {messageType === Constant.MESSAGE_TYPE_IMAGE ? (
                <img
                  src={message}
                  style={{ maxHeight: 300, width: '100%' }}
                  alt=""
                  onClick={() => this.openModal(message)}
                />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: resultMessage
                  }}
                />
              )}
              <div
                style={{
                  position: 'absolute',
                  left: -82,
                  bottom: -2,
                  textAlign: 'right',
                  color: 'black'
                }}
              >
                <div style={{ color: '#a2a2a2' }}>
                  <span className={noReadCount ? 'red' : 'none'}>
                    {noReadCount}
                  </span>
                  {moment(messageInfo.createDate).format('LTS')}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        messageComponent = (
          <div
            id={messageId + 'message'}
            key={messageId}
            style={{ textAlign: 'left', marginBottom: 15 }}
          >
            <div
              style={{
                maxWidth: '80%',
                display: 'inline-block',
                position: 'relative',
                borderRadius: '13px 0px 13px 13px',
                backgroundColor:
                  messageType === Constant.MESSAGE_TYPE_LINK
                    ? 'orange'
                    : '#78c0fd',
                fontWeight:
                  messageType === Constant.MESSAGE_TYPE_LINK ? 'bold' : '',
                textAlign: 'left',
                padding: '11px 15px 9px',
                color: '#fff',
                wordBreak: 'break-all'
              }}
            >
              {messageType === Constant.MESSAGE_TYPE_IMAGE ? (
                <img
                  src={message}
                  style={{ maxHeight: 300, width: '100%' }}
                  alt=""
                  onClick={() => this.openModal(message)}
                />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: resultMessage
                  }}
                />
              )}
              <div
                style={{
                  position: 'absolute',
                  right: -90,
                  bottom: -2,
                  textAlign: 'left',
                  color: 'black'
                }}
              >
                <div style={{ color: '#a2a2a2' }}>
                  {moment(messageInfo.createDate).format('LTS')}
                  <span className={noReadCount ? 'red' : 'none'}>
                    {noReadCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }
      if (messageInfo.groupingDate) {
        return (
          <React.Fragment>
            <h2 className="center-line">
              <span>{messageInfo.groupingDate}</span>
            </h2>
            {messageComponent}
          </React.Fragment>
        );
      }
      return messageComponent;
    });
    return messsageListComponent;
  }

  render() {
    let { clientHeight } = this.props;
    let { viewModal, imageSrc } = this.state;
    let messsageListComponent = this.convertMessageListToComponet();
    return (
      <React.Fragment>
        {/* 연결 url 모달/ */}
        <Modal
          visible={viewModal}
          footer={null}
          onCancel={() => this.closeModal()}
        >
          <img src={imageSrc} style={{ width: '100%' }} alt="" />
        </Modal>
        <div
          style={{
            height: clientHeight,
            overflowY: 'scroll',
            position: 'relative',
            padding: '10px 10px 90px 10px'
          }}
          id={'messageListScroll'}
          ref={this.scrollRef}
          onScroll={this.handleHistoryScrollEvent}
        >
          {messsageListComponent}
        </div>
      </React.Fragment>
    );
  }
}

export default MessageList;
