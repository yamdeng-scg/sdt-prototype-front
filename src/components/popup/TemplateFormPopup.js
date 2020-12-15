import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col, Input, Tree, Button } from 'antd';
import {
  StarFilled,
  StarOutlined,
  CaretDownOutlined,
  SearchOutlined
} from '@ant-design/icons';
import CreatableSelect from 'react-select/creatable';
const components = {
  DropdownIndicator: null
};

const createOption = label => ({
  label,
  value: label
});

@inject('modalStore')
@observer
class TemplateFormPopup extends React.Component {
  constructor(props) {
    super(props);

    const x = 10;
    const y = 2;
    const z = 1;
    const gData = [];

    const generateData = (_level, _preKey, _tns) => {
      const preKey = _preKey || '0';
      const tns = _tns || gData;

      const children = [];
      for (let i = 0; i < x; i++) {
        const key = `${preKey}-${i}`;
        tns.push({ title: key, key });
        if (i < y) {
          children.push(key);
        }
      }
      if (_level < 0) {
        return tns;
      }
      const level = _level - 1;
      children.forEach((key, index) => {
        tns[index].children = [];
        return generateData(level, key, tns[index].children);
      });
    };
    generateData(z);

    this.state = {
      inputValue: '',
      value: [],
      gData: gData,
      expandedKeys: ['0-0', '0-0-0', '0-0-0-0']
    };
  }

  onDragEnter = info => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  onDrop = info => {
    console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...this.state.gData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    this.setState({
      gData: data
    });
  };

  handleChange = (value, actionMeta) => {
    console.group('Value Changed');
    console.log(value);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    this.setState({ value });
  };

  handleInputChange = inputValue => {
    this.setState({ inputValue });
  };

  handleKeyDown = event => {
    const { inputValue, value } = this.state;
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        console.group('Value Added');
        console.log(value);
        console.groupEnd();
        this.setState({
          inputValue: '',
          value: [...value, createOption(inputValue)]
        });
        event.preventDefault();
    }
  };

  render() {
    const { inputValue, value } = this.state;
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>템플릿 등록</Col>
        </Row>
        <div className="pd15">
          <Row className="mrl10 mrb10">
            <Col span={24}>
              <span className="bold">
                * 카테고리를 검색하거나, 아래 분류를 통해 직접 선택하여 템플릿을
                등록해주세요
              </span>
            </Col>
          </Row>
          <Row className="mrb5">
            <Col span={8}>
              <span className="bold">카테고리 검색</span>
            </Col>
            <Col span={16} className="pd-left10">
              <Input
                placeholder="input search text"
                enterButton={null}
                allowClear
                size="large"
                suffix={
                  <SearchOutlined
                    style={{
                      fontSize: 16,
                      color: '#1890ff'
                    }}
                  />
                }
              />
            </Col>
          </Row>
          <Row className="mrb5">
            <Col span={8}>
              <span className="bold">카테고리 분류</span>
            </Col>
          </Row>
          <Row className="mrb5">
            <Col span={8}>
              <Tree
                style={{ overflowY: 'auto', height: 350 }}
                className="draggable-tree"
                defaultExpandedKeys={this.state.expandedKeys}
                draggable
                blockNode
                onDragEnter={this.onDragEnter}
                onDrop={this.onDrop}
                treeData={this.state.gData}
                switcherIcon={
                  <CaretDownOutlined
                    style={{ fontSize: '16px', color: 'gray' }}
                  />
                }
              />
            </Col>
            <Col span={16} style={{ paddingLeft: 10 }}>
              <Row>
                <Col span={24} className="mrb10">
                  <span className="bold font-em1">선택한 카테고리</span>
                </Col>
                <Col span={24} className="mrb10">
                  <Input
                    placeholder="input search text"
                    allowClear
                    size="large"
                    disabled
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24} className="mrb10">
                  <span className="bold font-em1">고객질문</span>
                </Col>
                <Col span={24} className="mrb10">
                  <Input
                    placeholder="input search text"
                    allowClear
                    size="large"
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24} className="mrb10">
                  <span className="bold font-em1">상담사 답변</span>
                </Col>
                <Col span={24} className="mrb10">
                  <Input
                    placeholder="input search text"
                    allowClear
                    size="large"
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24} className="mrb10">
                  <span className="bold font-em1">키워드</span>
                </Col>
                <Col span={24} className="mrb10">
                  <CreatableSelect
                    components={components}
                    inputValue={inputValue}
                    isClearable
                    isMulti
                    menuIsOpen={false}
                    onChange={this.handleChange}
                    onInputChange={this.handleInputChange}
                    onKeyDown={this.handleKeyDown}
                    placeholder="Type something and press enter..."
                    value={value}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <span className="bold font-em1 inblock mrr5">
                    즐겨쓰는 템플릿 등록
                  </span>
                  <StarOutlined className="color-basic font-em2" />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <Row style={{ textAlign: 'center' }}>
          <Col span={12}>
            <Button block className="pd10 bold cancelbtn">
              취소
            </Button>
          </Col>
          <Col span={12}>
            <Button block className="pd10 bold okbtn">
              확인
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TemplateFormPopup;
