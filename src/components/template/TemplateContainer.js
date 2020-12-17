import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import TemplateTree from './TemplateTree';
import TemplateSearch from './TemplateSearch';
import Constant from '../../config/Constant';

@withRouter
@inject('chatStore', 'uiStore', 'templateStore')
@observer
class TemplateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.selectTree = this.selectTree.bind(this);
    this.expendTree = this.expendTree.bind(this);
  }

  selectTree(selectedKeys, selectedTree) {
    let { templateStore } = this.props;
    templateStore.selectTree(selectedTree.node);
  }

  expendTree(expandedKeys) {
    let { templateStore } = this.props;
    templateStore.expendTree(expandedKeys);
  }

  componentDidMount() {
    this.props.uiStore.changeSideBarSelectMenuKName(
      Constant.SIDE_BAR_MENU_TEMPLATE
    );
    this.props.templateStore.getTreeData();
  }

  render() {
    let { templateStore } = this.props;
    let { expandedKeys, treeData } = templateStore;
    return (
      <div>
        <Row>
          <Col span={6}>
            <TemplateTree
              treeData={treeData}
              expandedKeys={expandedKeys}
              onSelect={this.selectTree}
              onExpand={this.expendTree}
            />
          </Col>
          <Col span={18}>
            <TemplateSearch />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TemplateContainer;
