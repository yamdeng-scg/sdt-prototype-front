import React from 'react';
import ChatAreaBottomReplySearch from './ChatAreaBottomReplySearch';
import ChatAreaBottomFav from './ChatAreaBottomFav';
import ChatAreaBottomLink from './ChatAreaBottomLink';
import ChatAreaBottomWarning from './ChatAreaBottomWarning';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import classNames from 'classnames';

@withRouter
@inject('chatStore')
@observer
class ChatAreaBottom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { chatStore } = this.props;
    let {
      bottmActiveTabIndex,
      displayBottomContent,
      swearCount,
      insultCount
    } = chatStore;
    // swearCount, insultCount, handleSendWarningMessage
    let applyBottomTabComponent = <ChatAreaBottomReplySearch />;
    if (bottmActiveTabIndex === 1) {
      applyBottomTabComponent = <ChatAreaBottomFav />;
    } else if (bottmActiveTabIndex === 2) {
      applyBottomTabComponent = <ChatAreaBottomLink />;
    } else if (bottmActiveTabIndex === 3) {
      applyBottomTabComponent = (
        <ChatAreaBottomWarning
          swearCount={swearCount}
          insultCount={insultCount}
          handleSendWarningMessage={(message, warnMessageType) => {
            chatStore.sendWarningMessage(message, warnMessageType);
          }}
        />
      );
    }
    if (!displayBottomContent) {
      applyBottomTabComponent = null;
    }
    return (
      <div style2={{ height: 500 }}>
        <Row className="center bor-top bor-bottom center mrt5">
          <Col
            span={6}
            onClick={() => {
              chatStore.changeBottomActiveTabIndex(0);
            }}
            className={classNames('pd10', 'font-em2', {
              'text-under': bottmActiveTabIndex === 0,
              'color-basic': bottmActiveTabIndex === 0,
              bold: bottmActiveTabIndex === 0
            })}
          >
            답변검색
          </Col>
          <Col
            span={6}
            onClick={() => {
              chatStore.changeBottomActiveTabIndex(1);
            }}
            className={classNames('pd10', 'font-em2', {
              'text-under': bottmActiveTabIndex === 1,
              'color-basic': bottmActiveTabIndex === 1,
              bold: bottmActiveTabIndex === 1
            })}
          >
            즐겨찾기
          </Col>
          <Col
            span={6}
            onClick={() => {
              chatStore.changeBottomActiveTabIndex(2);
            }}
            className={classNames('pd10', 'font-em2', {
              'text-under': bottmActiveTabIndex === 2,
              'color-basic': bottmActiveTabIndex === 2,
              bold: bottmActiveTabIndex === 2
            })}
          >
            화면링크
          </Col>
          <Col
            span={6}
            onClick={() => {
              chatStore.changeBottomActiveTabIndex(3);
            }}
            className={classNames('pd10', 'font-em2', {
              'text-under': bottmActiveTabIndex === 3,
              'color-basic': bottmActiveTabIndex === 3,
              bold: bottmActiveTabIndex === 3
            })}
          >
            경고메시지
          </Col>
        </Row>
        {applyBottomTabComponent}
      </div>
    );
  }
}

export default ChatAreaBottom;
