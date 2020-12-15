import React from 'react';
import {
  Table,
  Tag,
  Checkbox,
  Typography,
  Input,
  Row,
  Col,
  Button
} from 'antd';
import { SearchOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import ModalService from '../../services/ModalService';
import ModalType from '../../config/ModalType';
const { Title } = Typography;

const columns = [
  {
    title: 'page',
    dataIndex: 'age',
    key: 'age',
    width: 65,
    align: 'center',
    render: text => <a>{text}</a>
  },
  {
    title: '목차',
    dataIndex: 'name',
    key: 'name',
    width: '50%',
    ellipsis: true
  },
  {
    title: '태그',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.map(tag => {
          return (
            <Tag className="color-basic inblock mrb5" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    )
  },
  {
    title: '',
    key: 'action',
    width: 50,
    render: (text, record) => (
      <StarFilled className="color-basic" style={{ fontSize: 17 }} />
    )
  }
];

const basicData = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer', 'developer', 'developer', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
];

let data = [];

for (let index = 0; index < 4; index++) {
  data = data.concat(basicData);
}

@withRouter
@inject('appStore', 'uiStore')
@observer
class ManualList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  openManualTagListPopup = () => {
    ModalService.openAlertPopup(ModalType.MANUAL_TAGLIST_POPUP, {});
  };

  render() {
    let { uiStore } = this.props;
    let { clientHeight } = uiStore;
    return (
      <div className="bor-right">
        <div style={{ padding: '10px 0px 7px 10px' }}>
          <Title
            level={3}
            className="text mr0"
            onClick={this.openManualTagListPopup}
          >
            상담 도우미
          </Title>
        </div>
        <div style={{ padding: '0px 10px' }}>
          <Input
            placeholder="input search text"
            enterButton={null}
            allowClear
            suffix={
              <SearchOutlined
                style={{
                  fontSize: 16,
                  color: '#1890ff'
                }}
              />
            }
          />
        </div>
        <div className="pd10">
          <Row>
            <Col span={12}>
              <Button
                className="bg-basic color-white bold font-em1"
                onClick={this.openManualTagListPopup}
              >
                태그보기
              </Button>
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginTop: 5 }}>
              <Checkbox>즐겨찾기만 보기</Checkbox>
            </Col>
          </Row>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={data}
            scroll={{ y: clientHeight - 250 }}
            size="small"
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {
                  uiStore.goPage('/manual/1/detail');
                }, // click row
                onDoubleClick: event => {}, // double click row
                onContextMenu: event => {}, // right button click row
                onMouseEnter: event => {}, // mouse enter row
                onMouseLeave: event => {} // mouse leave row
              };
            }}
          />
        </div>
      </div>
    );
  }
}

export default ManualList;
