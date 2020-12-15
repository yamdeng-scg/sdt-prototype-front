import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import RoomList from './RoomList';
import MessageContainer from './MessageContainer';
import ContractDeftail from './ContractDeftail';
import MyTodayStats from './MyTodayStats';
import Constant from '../../config/Constant';

@withRouter
@inject('chatStore', 'uiStore', 'appStore')
@observer
class ChatContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let { profile } = this.props.appStore;
    let { companyId } = profile;
    this.props.uiStore.changeSideBarSelectMenuKName(
      Constant.SIDE_BAR_MENU_CHAT
    );
    this.props.chatStore.initSocket();
    this.props.chatStore.applyContractPattern(companyId);
  }

  componentWillUnmount() {
    this.props.chatStore.clear();
  }

  render() {
    let { chatStore } = this.props;
    let { currentRoomInfo } = chatStore;
    let detailMessgeComponent = null;
    if (currentRoomInfo) {
      detailMessgeComponent = (
        <React.Fragment>
          <Col span={10}>
            <MessageContainer />
          </Col>
          <Col span={8}>
            <ContractDeftail />
          </Col>
        </React.Fragment>
      );
    } else {
      detailMessgeComponent = (
        <Col span={18}>
          <MyTodayStats />
        </Col>
      );
    }
    return (
      <Row style={{ height: '100%' }}>
        <Col span={6}>
          <RoomList />
        </Col>
        {detailMessgeComponent}
      </Row>
    );
  }
}

export default ChatContainer;
