import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Input } from 'antd';
import {
  CloseOutlined,
  UpCircleOutlined,
  DownCircleOutlined
} from '@ant-design/icons';
import MessageList from './MessageList';
import SendMessageInput from './SendMessageInput';
import ChatAreaBottom from './ChatAreaBottom';
import MessageListTop from './MessageListTop';
import Constant from 'config/Constant';

@withRouter
@inject('appStore', 'uiStore', 'chatStore')
@observer
class MessageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { uiStore, chatStore } = this.props;
    let { clientHeight } = uiStore;
    let {
      displayBottomContent,
      displaySearchMessgeComponent,
      messageList,
      searchContent,
      disabledPrevButton,
      disabledNextButton,
      applySearchContent
    } = chatStore;
    let listClientHeight = clientHeight - 270;
    if (displayBottomContent) {
      listClientHeight = clientHeight - 715;
    }
    return (
      <div style={{ position: 'relative' }} className="bor-right">
        <MessageListTop />
        <Row>
          <Col span={24} style={{ position: 'relative' }}>
            <React.Fragment>
              {/* 715, 270 */}
              <MessageList
                clientHeight={listClientHeight}
                messageList={messageList}
                wrapperType={Constant.MESSAGE_LIST_WRAPPER_TYPE_CHAT}
                searchValue={applySearchContent}
                deleteHandle={messageId => {
                  chatStore.deleteMessage(messageId);
                }}
              />
              {/* 버튼 3개 */}
              <div
                style={{ position: 'absolute', bottom: 10, right: 10 }}
                className={displaySearchMessgeComponent ? 'none' : ''}
              >
                <Button
                  shape="circle"
                  size="large"
                  type="primary"
                  onClick={() =>
                    chatStore.changeDisplaySearchMessgeComponent(true)
                  }
                >
                  검색
                </Button>{' '}
                <Button type="primary" shape="circle" size="large">
                  이관
                </Button>{' '}
                <Button type="primary" shape="circle" size="large">
                  종료
                </Button>
              </div>
              {/* 대화검색 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  padding: '0px 10px',
                  marginBottom: 5,
                  zIndex: 10
                }}
                className={displaySearchMessgeComponent ? '' : 'none'}
              >
                <div
                  className="bg-white bor pd5"
                  style={{
                    borderRadius: '13px 13px 13px 13px'
                  }}
                >
                  <Row className="mrb5">
                    <Col
                      span={8}
                      offset={8}
                      className="center pd5 text bold font-em1"
                    >
                      대화내용 검색
                    </Col>
                    <Col
                      span={8}
                      className="right"
                      onClick={() =>
                        chatStore.changeDisplaySearchMessgeComponent(false)
                      }
                    >
                      <CloseOutlined />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Input
                        style={{ width: '90%' }}
                        allowClear
                        value={searchContent}
                        onChange={event => {
                          chatStore.changeSearchContent(event.target.value);
                        }}
                        onPressEnter={() => {
                          chatStore.changeApplySearchContent();
                        }}
                      />{' '}
                      <UpCircleOutlined
                        className={
                          disabledPrevButton ? 'color-gray' : 'color-basic'
                        }
                        style={{ fontSize: 18 }}
                        onClick={() => {
                          if (!disabledPrevButton) {
                            chatStore.gotoPrevMessage();
                          }
                        }}
                      />{' '}
                      {'  '}
                      <DownCircleOutlined
                        className={
                          disabledNextButton ? 'color-gray' : 'color-basic'
                        }
                        style={{ fontSize: 18 }}
                        onClick={() => {
                          if (!disabledNextButton) {
                            chatStore.gotoNextMessage();
                          }
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </React.Fragment>
          </Col>
          <Col span={24}>
            <SendMessageInput />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ChatAreaBottom />
          </Col>
        </Row>
      </div>
    );
  }
}

export default MessageContainer;
