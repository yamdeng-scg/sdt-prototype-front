import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import ModalService from '../../services/ModalService';
import ModalType from '../../config/ModalType';
import Code from '../../config/Code';
import Helper from '../../utils/Helper';

const { Text, Title } = Typography;

@withRouter
@inject('appStore', 'uiStore', 'loginStore')
@observer
class TopHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.openMemberStateChangePopup = this.openMemberStateChangePopup.bind(
      this
    );
  }

  openMemberStateChangePopup() {
    ModalService.openAlertPopup(ModalType.MEMBER_STATE_CHANGE_POPUP, {});
  }

  logout = () => {
    let { appStore } = this.props;
    appStore.logout();
  };

  render() {
    let { appStore } = this.props;
    let { profile, currentStatsInfo } = appStore;
    return (
      <div
        style={{
          width: '100%',
          height: 50,
          position: 'fixed',
          top: 0,
          left: 0
        }}
        className="bor-bottom"
      >
        <Row>
          <Col
            span={18}
            style={{ textAlign: 'left', paddingTop: 5, paddingLeft: 10 }}
          >
            <Title
              level={3}
              style={{ display: 'inline-block', marginRight: 20 }}
            >
              <Text className="color-basic" strong>
                {profile.companyName}
              </Text>
            </Title>
            <div style={{ display: 'inline-block' }}>
              <span className="bold font-em4 text">{profile.name}</span>{' '}
              <span className="font-em2 mrr5 inblock">상담사님</span>{' '}
              <span className="font-em1 inblock mrr20">
                {Helper.getTodayString()}
              </span>
              <span className="bold">대기</span>{' '}
              <span className="bold color-basic font-em1">
                {currentStatsInfo.readyCount}
              </span>
              건{' | '} <span className="bold">진행</span>{' '}
              <span className="bold color-basic font-em1">
                {currentStatsInfo.ingCount}
              </span>
              건{' | '} <span className="bold">완료</span>{' '}
              <span className="bold color-basic font-em1">
                {currentStatsInfo.endCount}
              </span>
              건
            </div>
          </Col>
          <Col
            span={6}
            style={{ textAlign: 'right', paddingTop: 10, paddingRight: 10 }}
          >
            <div className="inblock" onClick={this.openMemberStateChangePopup}>
              <span className="inblock mrr5 font-em1 bold">
                {Code.getCodeNameByValue('memberStateCodeList', profile.state)}
              </span>
              <span
                className="inblock mrr5 bg-basic font-em1"
                style={{
                  padding: 6,
                  marginRight: 15,
                  borderRadius: '50%'
                }}
              />
            </div>

            <span className="inblock font-em1 bold" onClick={this.logout}>
              로그아웃{' '}
              <LogoutOutlined
                className="color-basic bold"
                style={{ fontSize: 16 }}
              />
            </span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TopHeader;
