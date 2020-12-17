import React from 'react';
import { Row, Col, Typography, Tree } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
const { Title } = Typography;

class TemplateTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { expandedKeys, treeData } = this.props;
    return (
      <div className="bor-right">
        <Row className="pd10 bor-bottom">
          <Col span={24}>
            <Title level={4} className="cetner text">
              답변 템플릿 분류
            </Title>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Tree
              height={document.documentElement.clientHeight - 108}
              className="draggable-tree"
              expandedKeys={expandedKeys}
              blockNode
              treeData={treeData}
              onSelect={this.props.onSelect}
              onExpand={this.props.onExpand}
              switcherIcon={
                <CaretDownOutlined
                  style={{ fontSize: '16px', color: 'gray' }}
                />
              }
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TemplateTree;
