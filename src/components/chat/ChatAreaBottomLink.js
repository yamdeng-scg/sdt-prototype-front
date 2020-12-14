import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Menu, Row, Col } from 'antd';
import ApiService from '../../services/ApiService';

@withRouter
@inject('appStore', 'uiStore', 'chatStore')
@observer
class ChatAreaBottomLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = { menuList: [], selectMenuId: '', detailList: [] };
    this.changeMenu = this.changeMenu.bind(this);
  }

  changeMenu(menuId) {
    ApiService.get('link/findDetilByMenuIdAndEnableStatus', {
      params: { menuId: menuId }
    }).then(response => {
      let data = response.data;
      this.setState({ detailList: data, selectMenuId: menuId });
    });
  }

  componentDidMount() {
    ApiService.get('link/findMenuAll').then(response => {
      let data = response.data;
      let firstMenu = data[0];
      this.setState({ menuList: data, selectMenuId: firstMenu.id });
      this.changeMenu(firstMenu.id);
    });
  }

  render() {
    let { chatStore } = this.props;
    let { menuList, selectMenuId, detailList } = this.state;
    return (
      <Row>
        <Col span={8} className="bor-right">
          <div style={{ overflowY: 'auto', height: 400 }}>
            <Menu style={{ width: '100%' }} selectedKeys={[selectMenuId]}>
              {menuList.map(info => {
                return (
                  <Menu.Item
                    key={info.id}
                    onClick={() => this.changeMenu(info.id)}
                  >
                    {info.name}
                  </Menu.Item>
                );
              })}
            </Menu>
          </div>
        </Col>
        <Col span={16}>
          <div
            style={{
              overflowY: 'auto',
              height: 440
            }}
            className="pd10 left"
          >
            {detailList.map(info => {
              return (
                <span
                  className="tag-enable text-under bold"
                  onClick={() =>
                    chatStore.sendLinkMessage(
                      info.linkUrl,
                      info.linkText,
                      info.linkProtocol
                    )
                  }
                >
                  #{info.linkText}
                </span>
              );
            })}
          </div>
        </Col>
      </Row>
    );
  }
}

export default ChatAreaBottomLink;
