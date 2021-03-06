import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col } from 'antd';

const data = [1, 1, 1, 1, 1];

@inject('alertModalStore')
@observer
class ManualTagListPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>상담도우미 태그</Col>
        </Row>
        <div className="pd10" style={{ maxHeight: 350, overflowY: 'scroll' }}>
          {data.map((info, index) => (
            <span className={index % 2 === 0 ? 'tag-enable' : 'tag-disable'}>
              #캐시
            </span>
          ))}
        </div>
      </div>
    );
  }
}

export default ManualTagListPopup;
