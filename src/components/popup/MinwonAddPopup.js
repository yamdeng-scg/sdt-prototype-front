import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col, Input, Tree, Button } from 'antd';
import { CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
import ApiService from '../../services/ApiService';
import Helper from '../../utils/Helper';
import _ from 'lodash';
const TextArea = Input.TextArea;
@inject('alertModalStore')
@observer
class MinwonAddPopup extends React.Component {
  categoryAllList = [];
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      treeData: [],
      searchValue: '',
      smallCategoryInfo: null,
      memo: ''
    };
    this.treeRef = React.createRef();
    this.ok = this.ok.bind(this);
    this.cancel = this.cancel.bind(this);
    this.changeMemo = this.changeMemo.bind(this);
  }

  onChange = e => {
    const { value } = e.target;
    let expandedKeys = [];
    if (value) {
      let findList = _.filter(this.categoryAllList, info => {
        return info.title.indexOf(value) !== -1;
      });
      findList.forEach(info => {
        Helper.addExpandedKeys(this.categoryAllList, expandedKeys, info);
      });
      if (findList.length) {
        let findKeys = findList.map(info => info.key);
        setTimeout(() => {
          this.treeRef.current.scrollTo({
            key: _.sortedUniq(findKeys)[0]
          });
        }, 500);
      }
    }
    this.setState({
      expandedKeys: _.uniq(expandedKeys),
      searchValue: value,
      autoExpandParent: true
    });
  };

  onSelect = (selectedKeys, tree) => {
    let info = tree.node.info;
    if (info.level === 3) {
      this.setState({ smallCategoryInfo: info });
    }
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };

  changeMemo(event) {
    this.setState({ memo: event.target.value });
  }

  ok() {
    let { alertModalStore, modalData } = this.props;
    let { smallCategoryInfo, memo } = this.state;
    alertModalStore.hideModal();
    modalData.ok(smallCategoryInfo, memo);
  }

  cancel() {
    this.props.alertModalStore.hideModal();
  }

  componentDidMount() {
    ApiService.get('category/tree/minwon').then(response => {
      let data = response.data;
      this.categoryAllList = [];
      data.forEach(treeInfo => {
        Helper.addCategoryList(this.categoryAllList, treeInfo);
      });
      let treeData = data;
      let expandedKeys = [];
      this.setState({ treeData: treeData, expandedKeys: expandedKeys });
    });
  }

  render() {
    let {
      treeData,
      searchValue,
      expandedKeys,
      smallCategoryInfo,
      memo
    } = this.state;
    let { modalData } = this.props;
    let { customerName, gasappMemberNumber, chatid } = modalData;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="bold bg-yellow">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return {
            title,
            key: item.key,
            level: item.level,
            info: item,
            children: loop(item.children)
          };
        }

        return {
          title,
          key: item.key,
          level: item.level,
          info: item
        };
      });
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>민원 등록</Col>
        </Row>
        <div className="pd15">
          <Row className="mrb10">
            <Col span={24}>
              <span className="bold font-em1">민원등록 고객 : </span>
              <span className="bold color-basic">{customerName}님 </span>
              <span className="bold">
                ( 가스앱 ID : {gasappMemberNumber}, chatid :{chatid} )
              </span>
            </Col>
          </Row>
          <Row className="mrb5">
            <Col span={8}>
              <span className="font-em1 bold">민원 검색</span>
            </Col>
            <Col span={16} className="pd-left10">
              <span className="font-em1 bold">선택한 민원 분류</span>
            </Col>
          </Row>
          <Row className="mrb10">
            <Col span={8}>
              <Input
                placeholder=""
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
                onChange={this.onChange}
              />
            </Col>
            <Col span={16} style={{ paddingLeft: 10 }} className="color-basic">
              <Input
                placeholder="분류선택시 자동 표기됩니다.(ex. 요금 > 요금확인 > FAX발송요청)"
                allowClear
                size="large"
                disabled
                value={
                  smallCategoryInfo
                    ? smallCategoryInfo.categoryLargeName +
                      ' > ' +
                      smallCategoryInfo.categoryMiddleName +
                      ' > ' +
                      smallCategoryInfo.name
                    : ''
                }
              />
            </Col>
          </Row>
          <Row className="mrb5">
            <Col span={8}>
              <span className="font-em1 bold">민원 분류</span>
            </Col>
            <Col span={16} className="pd-left10">
              <span className="font-em1 bold">민원 내용 </span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Tree
                ref={this.treeRef}
                height={350}
                className="draggable-tree"
                treeData={loop(treeData)}
                expandedKeys={expandedKeys}
                onSelect={this.onSelect}
                onExpand={this.onExpand}
                switcherIcon={
                  <CaretDownOutlined
                    style={{ fontSize: '16px', color: 'gray' }}
                  />
                }
              />
            </Col>
            <Col span={16} style={{ paddingLeft: 10 }}>
              <TextArea onChange={this.changeMemo} rows={15} />
            </Col>
          </Row>
        </div>
        <Row style={{ textAlign: 'center' }}>
          <Col span={12}>
            <Button block className="pd10 bold cancelbtn" onClick={this.cancel}>
              취소
            </Button>
          </Col>
          <Col span={12}>
            <Button
              block
              className="pd10 bold okbtn"
              onClick={this.ok}
              disabled={!memo || !smallCategoryInfo}
            >
              확인
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default MinwonAddPopup;
