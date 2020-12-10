import React from 'react';
import EmptyStartImage from '../../resources/images/star_empty.png';
import CloseImage from '../../resources/images/close.png';
import ModalType from '../../config/ModalType';
import Constant from '../../config/Constant';
import Helper from '../../utils/Helper';
import ModalService from '../../services/ModalService';

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
    let { messageList, wrapperType, searchValue } = this.props;
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
                  display:
                    wrapperType === Constant.MESSAGE_LIST_WRAPPER_TYPE_HISTORY
                      ? 'none'
                      : 'inline-block'
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
                  onClick={this.openTemplateFormPopup}
                />
                <span
                  style={{
                    backgroundImage: `url(${CloseImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left top',
                    width: 16,
                    height: 16
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
                  color: 'black',
                  display:
                    wrapperType === Constant.MESSAGE_LIST_WRAPPER_TYPE_HISTORY
                      ? 'none'
                      : 'inline-block'
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
                />
                <span
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
      }
      return messageComponent;
    });
    return messsageListComponent;
  }

  openTemplateFormPopup = () => {
    ModalService.openMiddlePopup(ModalType.TEMPLATE_FORM_POPUP, {});
  };

  render() {
    let { clientHeight, wrapperType } = this.props;
    let messsageListComponent = this.convertMessageListToComponet();
    return (
      <React.Fragment>
        <div
          style={{
            height: clientHeight,
            overflowY: 'scroll',
            position: 'relative',
            padding: '10px 10px 90px 10px'
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
