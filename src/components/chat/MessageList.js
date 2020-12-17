import React from 'react';
import EmptyStartImage from '../../resources/images/star_empty.png';
import CloseImage from '../../resources/images/close.png';
import ModalType from '../../config/ModalType';
import Constant from '../../config/Constant';
import Helper from '../../utils/Helper';
import ModalService from '../../services/ModalService';
import _ from 'lodash';

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

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  convertMessageListToComponet() {
    let { messageList, wrapperType, searchValue, deleteHandle } = this.props;
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
                  messageType === Constant.MESSAGE_TYPE_LINK ||
                  messageType === Constant.MESSAGE_TYPE_TEL
                    ? 'orange'
                    : '#78c0fd',
                fontWeight:
                  messageType === Constant.MESSAGE_TYPE_LINK ||
                  messageType === Constant.MESSAGE_TYPE_TEL
                    ? 'bold'
                    : '',
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
                  color: 'black',
                  display: 'inline-block'
                }}
              >
                <span className={noReadCount ? 'red' : 'none'}>
                  {noReadCount}
                </span>
                <span
                  style={{
                    backgroundImage: `url(${EmptyStartImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left top',
                    width: 16,
                    height: 16,
                    display:
                      messageType === Constant.MESSAGE_TYPE_IMAGE
                        ? 'none'
                        : 'inline-block'
                  }}
                  onClick={() =>
                    this.openTemplateFormPopup(
                      messageInfo,
                      Constant.MESSAGE_TEMPLATE_TYPE_REPLAY
                    )
                  }
                />
                <span
                  onClick={() => deleteHandle(messageId)}
                  style={{
                    backgroundImage: `url(${CloseImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left top',
                    width: 16,
                    height: 16,
                    display:
                      wrapperType === Constant.MESSAGE_LIST_WRAPPER_TYPE_HISTORY
                        ? 'none'
                        : 'inline-block'
                  }}
                />
                <div style={{ color: '#a2a2a2' }}>
                  {/* {moment(messageInfo.createDate).format('LTS')} */}
                  {Helper.convertMessageDateToString(messageInfo.createDate)}
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
                  messageType === Constant.MESSAGE_TYPE_LINK ||
                  messageType === Constant.MESSAGE_TYPE_TEL
                    ? 'orange'
                    : '#78c0fd',
                fontWeight:
                  messageType === Constant.MESSAGE_TYPE_LINK ||
                  messageType === Constant.MESSAGE_TYPE_TEL
                    ? 'bold'
                    : '',
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
                  color: 'black',
                  display: 'inline-block'
                }}
              >
                <span className={noReadCount ? 'red' : 'none'}>
                  {noReadCount}
                </span>
                <span
                  style={{
                    backgroundImage: `url(${EmptyStartImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left top',
                    width: 16,
                    height: 16,
                    display: 'inline-block'
                  }}
                  onClick={() =>
                    this.openTemplateFormPopup(
                      messageInfo,
                      Constant.MESSAGE_TEMPLATE_TYPE_ASK
                    )
                  }
                />
                <div style={{ color: '#a2a2a2' }}>
                  {/* {moment(messageInfo.createDate).format('LTS')} */}
                  {Helper.convertMessageDateToString(messageInfo.createDate)}
                </div>
              </div>
            </div>
          </div>
        );
      }
      return messageComponent;
    });
    return messsageListComponent;
  }

  openTemplateFormPopup = (messageInfo, selectType) => {
    let { messageList } = this.props;
    let reply = '';
    let ask = '';
    if (selectType === Constant.MESSAGE_TEMPLATE_TYPE_REPLAY) {
      if (messageInfo.messageType === Constant.MESSAGE_TYPE_NORMAL) {
        let searchIndex = _.findIndex(messageList, info => {
          return info.id < messageInfo.id && info.isEmployee === 0;
        });
        if (searchIndex !== -1) {
          ask = messageList[searchIndex].message;
        }
        reply = messageInfo.message;
      }
    } else {
      if (messageInfo.messageType === Constant.MESSAGE_TYPE_NORMAL) {
        let searchIndex = _.findIndex(messageList, info => {
          return info.id > messageInfo.id && info.isEmployee === 1;
        });
        if (searchIndex !== -1) {
          reply = messageList[searchIndex].message;
        }
        ask = messageInfo.message;
      }
    }
    ModalService.openPopup(ModalType.TEMPLATE_FORM_POPUP, {
      reply,
      ask,
      okHandle: () => {
        ModalService.closePopup();
      }
    });
  };

  render() {
    let { clientHeight, wrapperType } = this.props;
    let messsageListComponent = this.convertMessageListToComponet();
    return (
      <React.Fragment>
        <div
          style={{
            height:
              wrapperType === Constant.MESSAGE_LIST_WRAPPER_TYPE_CHAT
                ? clientHeight
                : 'auto',
            maxHeight:
              wrapperType === Constant.MESSAGE_LIST_WRAPPER_TYPE_CHAT
                ? 'auto'
                : clientHeight,
            overflowY: 'scroll',
            position: 'relative',
            padding:
              wrapperType === Constant.MESSAGE_LIST_WRAPPER_TYPE_CHAT
                ? '10px 10px 90px 10px'
                : '10px 10px 10px 10px'
          }}
          id={
            wrapperType === Constant.MESSAGE_LIST_WRAPPER_TYPE_CHAT
              ? 'messageListScroll'
              : ''
          }
        >
          {messsageListComponent}
        </div>
      </React.Fragment>
    );
  }
}

export default MessageList;
