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
import ApiService from '../../services/ApiService';
import Helper from '../../utils/Helper';
import Constant from '../../config/Constant';
import _ from 'lodash';
const components = {
  DropdownIndicator: null
};

@inject('modalStore')
@observer
class TemplateFormPopup extends React.Component {
  categoryAllList = [];
  constructor(props) {
    super(props);
    let { modalData } = this.props;
    let { reply, ask, formType, templateId } = modalData;
    this.state = {
      expandedKeys: [],
      treeData: [],
      searchValue: '',
      smallCategoryInfo: null,
      inputValue: '',
      keywordList: [],
      reply: reply || '',
      ask: ask || '',
      isFavorite: false,
      formType: formType,
      templateId: templateId || null
    };
    this.treeRef = React.createRef();
    this.cancel = this.cancel.bind(this);
    this.changeReply = this.changeReply.bind(this);
    this.changeAsk = this.changeAsk.bind(this);
    this.toggleIsFavorite = this.toggleIsFavorite.bind(this);
    this.save = this.save.bind(this);
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

  cancel() {
    this.props.modalStore.hideModal();
  }

  handleChange = (keywordList, actionMeta) => {
    this.setState({ keywordList });
  };

  handleInputChange = inputValue => {
    this.setState({ inputValue });
  };

  handleKeyDown = event => {
    let { inputValue, keywordList } = this.state;
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        ApiService.post('keyword', {
          name: inputValue
        }).then(response => {
          let data = response.data;
          let searchIndex = _.findIndex(keywordList, info => {
            return info.name === data.name;
          });
          if (searchIndex === -1) {
            keywordList = keywordList.concat([data]);
          }
          this.setState({ keywordList, inputValue: '' });
        });
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  changeReply(event) {
    this.setState({ reply: event.target.value });
  }

  changeAsk(event) {
    this.setState({ ask: event.target.value });
  }

  toggleIsFavorite() {
    this.setState({ isFavorite: !this.state.isFavorite });
  }

  save() {
    let { modalData } = this.props;
    let { okHandle } = modalData;
    let {
      smallCategoryInfo,
      keywordList,
      ask,
      reply,
      isFavorite,
      formType,
      templateId
    } = this.state;
    let keywordIds = keywordList.map(info => info.id);
    let apiParam = {
      categorySmallId: smallCategoryInfo.id,
      ask: ask,
      reply: reply,
      isFavorite: isFavorite,
      keywordIds: keywordIds
    };
    if (formType === Constant.FORM_TYPE_NEW) {
      ApiService.post('template', apiParam).then(response => {
        alert('등록 되었습니다.');
        okHandle();
      });
    } else {
      ApiService.post('template/' + templateId, apiParam).then(response => {
        alert('저장 되었습니다.');
        okHandle();
      });
    }
  }

  componentDidMount() {
    let { formType, templateId } = this.state;
    ApiService.get('category/tree').then(response => {
      let data = response.data;
      this.categoryAllList = [];
      data.forEach(treeInfo => {
        Helper.addCategoryList(this.categoryAllList, treeInfo);
      });
      let treeData = data;
      let expandedKeys = [];
      this.setState({ treeData: treeData, expandedKeys: expandedKeys });
    });
    if (formType === Constant.FORM_TYPE_EDIT) {
      ApiService.get('template/' + templateId).then(response => {
        let data = response.data;
        let {
          ask,
          reply,
          isFavorite,
          categoryLargeName,
          categoryMiddleName,
          categorySmallId,
          categorySmallName,
          keywordList
        } = data;
        let smallCategoryInfo = {
          categoryLargeName,
          categoryMiddleName,
          categorySmallName,
          name: categorySmallName,
          categorySmallId,
          id: categorySmallId
        };
        this.setState({
          ask: ask,
          reply: reply,
          isFavorite: isFavorite,
          smallCategoryInfo,
          keywordList
        });
      });
    }
  }

  render() {
    let {
      treeData,
      searchValue,
      expandedKeys,
      smallCategoryInfo,
      inputValue,
      keywordList,
      ask,
      reply,
      isFavorite
    } = this.state;
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
                placeholder="카테고리 트리를 검색해주세요"
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
          </Row>
          <Row className="mrb5">
            <Col span={8}>
              <span className="bold">카테고리 분류</span>
            </Col>
          </Row>
          <Row className="mrb5">
            <Col span={8}>
              <Tree
                ref={this.treeRef}
                style={{ overflowY: 'auto', height: 350 }}
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
              <Row>
                <Col span={24} className="mrb10">
                  <span className="bold font-em1">선택한 카테고리</span>
                </Col>
                <Col span={24} className="mrb10">
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
              <Row>
                <Col span={24} className="mrb10">
                  <span className="bold font-em1">고객질문</span>
                </Col>
                <Col span={24} className="mrb10">
                  <Input
                    placeholder="질문을 입력해주세요"
                    allowClear
                    size="large"
                    value={ask}
                    onChange={this.changeAsk}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24} className="mrb10">
                  <span className="bold font-em1">상담사 답변</span>
                </Col>
                <Col span={24} className="mrb10">
                  <Input
                    placeholder="답변을 입력해주세요"
                    allowClear
                    size="large"
                    value={reply}
                    onChange={this.changeReply}
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
                    getOptionLabel={option => option.name}
                    getOptionValue={option => option.id}
                    onKeyDown={this.handleKeyDown}
                    placeholder="키워드를 입력해주세요"
                    value={keywordList}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <span className="bold font-em1 inblock mrr5">
                    즐겨쓰는 템플릿 등록
                  </span>
                  {isFavorite ? (
                    <StarFilled
                      onClick={this.toggleIsFavorite}
                      className="color-basic font-em2"
                    />
                  ) : (
                    <StarOutlined
                      onClick={this.toggleIsFavorite}
                      className="color-basic font-em2"
                    />
                  )}
                </Col>
              </Row>
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
            <Button block className="pd10 bold okbtn" onClick={this.save}>
              확인
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TemplateFormPopup;
