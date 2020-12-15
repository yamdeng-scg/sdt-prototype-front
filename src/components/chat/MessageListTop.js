import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Typography } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ModalType from '../../config/ModalType';
import ModalService from '../../services/ModalService';
const { Title } = Typography;

@withRouter
@inject('appStore', 'uiStore', 'chatStore')
@observer
class MessageListTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { chatStore } = this.props;
    let { currentRoomInfo } = chatStore;
    return (
      <div className="bor-bottom pd10">
        <Title
          level={3}
          className="text mr0"
          onClick={() => chatStore.openBlackCustomerPopup(currentRoomInfo)}
        >
          {currentRoomInfo.isBlockCustomer ? (
            <SmileOutlined className="font-em1 inblock mrl5 bold" />
          ) : (
            <SmileOutlined className="color-basic font-em1 inblock mrl5 bold" />
          )}{' '}
          {currentRoomInfo.customerName}
        </Title>
        <Row className="pd-left5 pd-right5 mrb10">
          <Col span={12}>
            <span className="font-em2">{currentRoomInfo.telNumber}</span>
          </Col>
          <Col span={12} className="left pd-left10">
            <span className="font-em2">ID : </span>
            <CopyToClipboard
              text={currentRoomInfo.chatid}
              onCopy={() => alert('클립보드에 복사되었습니다')}
            >
              <span className="font-em2 text-under inblock mrr5">
                {currentRoomInfo.chatid}
              </span>
            </CopyToClipboard>
            <Button
              className="bg-basic color-white bold"
              onClick={() => chatStore.openMinwonAddPopup()}
            >
              민원등록
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={12} className="pd-left5 pd-right5">
            <Button
              block
              onClick={() => chatStore.openJoinHistoryPopup()}
              className="bg-basic color-white bold"
            >
              과거 채팅상담 기록
              {currentRoomInfo.joinHistoryCount
                ? '(' + currentRoomInfo.joinHistoryCount + ')'
                : ''}
            </Button>
          </Col>
          <Col span={12} className="pd-left5 pd-right5">
            <Button
              block
              onClick={() => chatStore.openMinwonHistoryPopup()}
              className="bg-basic color-white bold"
            >
              민원등록 기록
              {currentRoomInfo.minwonHistoryCount
                ? '(' + currentRoomInfo.minwonHistoryCount + ')'
                : ''}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MessageListTop;
