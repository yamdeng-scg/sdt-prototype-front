import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Checkbox, Input, Button, Select } from 'antd';
import { StarFilled, StarOutlined, SearchOutlined } from '@ant-design/icons';
import ModalService from '../../services/ModalService';
import ModalType from '../../config/ModalType';
import Code from '../../config/Code';
import Constant from '../../config/Constant';
import { Pagination } from 'antd';
import moment from 'moment';
const { Option } = Select;

@withRouter
@inject('appStore', 'uiStore', 'templateStore')
@observer
class TemplateSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.openTemplateFormPopup = this.openTemplateFormPopup.bind(this);
    this.changeSearchType = this.changeSearchType.bind(this);
    this.changeSearchValue = this.changeSearchValue.bind(this);
    this.changeCurrentTabName = this.changeCurrentTabName.bind(this);
    this.changeCheckMyAdd = this.changeCheckMyAdd.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changeFavortie = this.changeFavortie.bind(this);
    this.search = this.search.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);
  }

  openTemplateFormPopup = templateId => {
    ModalService.openPopup(ModalType.TEMPLATE_FORM_POPUP, {
      templateId: templateId,
      okHandle: () => {
        ModalService.closePopup();
        this.search();
      }
    });
  };

  changeSearchType(value) {
    this.props.templateStore.changeSearchType(value);
  }

  changeSearchValue(event) {
    let value = event.target.value;
    this.props.templateStore.changeSearchValue(value);
  }

  changeCurrentTabName(tabName) {
    this.props.templateStore.changeCurrentTabName(tabName);
  }

  changeCheckMyAdd(event) {
    let { templateStore } = this.props;
    templateStore.changeCheckMyAdd(event.target.checked);
  }

  changePage(page) {
    let { templateStore } = this.props;
    templateStore.changePage(page);
  }

  changeFavortie(templateId, isFavortie) {
    let { templateStore } = this.props;
    templateStore.changeFavortie(templateId, isFavortie);
  }

  search() {
    let { templateStore } = this.props;
    templateStore.changePage(1);
  }
  deleteTemplate(templateId) {
    let { templateStore } = this.props;
    templateStore.deleteTemplate(templateId);
  }

  componentDidMount() {
    this.search();
  }

  render() {
    let { uiStore, templateStore } = this.props;
    let {
      searchType,
      searchValue,
      currentTabName,
      checkMyAdd,
      templateList,
      totalCount,
      pageSize,
      page
    } = templateStore;
    let { clientHeight } = uiStore;
    let templateSearchCodeList = Code.templateSearchCodeList;
    return (
      <div>
        <div style={{ padding: 15, borderBottom: '1px solid #e0dcdc' }}>
          <Row>
            <Col span={6}>
              <Select
                defaultValue="lucy"
                style={{ width: '100%', textAlign: 'left' }}
                onChange={this.changeSearchType}
                value={searchType}
              >
                {templateSearchCodeList.map(info => {
                  return <Option value={info.value}>{info.name}</Option>;
                })}
              </Select>
            </Col>
            <Col span={14} className="mrl10 mrr10">
              <Input
                style={{ width: '100%' }}
                onChange={this.changeSearchValue}
                onPressEnter={this.search}
                value={searchValue}
                suffix={
                  <SearchOutlined
                    className="color-basic"
                    style={{
                      fontSize: 16
                    }}
                    onClick={this.search}
                  />
                }
              />
            </Col>
            <Col span={3}>
              <Button
                className="bg-basic color-white bold"
                onClick={() => this.openTemplateFormPopup()}
              >
                템플릿 추가
              </Button>
            </Col>
          </Row>
          <Row className="center mrt10 mrb10">
            <Col
              span={12}
              className={
                currentTabName === Constant.TEMPLATE_SEARCH_TAB_ALL
                  ? 'bor bg-basic color-white pd10 bold font-em1 text-under'
                  : 'bor-top bor-bottom bor-right pd10 font-em1 bg-gray'
              }
              onClick={() =>
                this.changeCurrentTabName(Constant.TEMPLATE_SEARCH_TAB_ALL)
              }
            >
              전체 답변 템플릿
              {currentTabName === Constant.TEMPLATE_SEARCH_TAB_ALL
                ? `(${totalCount}개)`
                : ''}
            </Col>
            <Col
              span={12}
              className={
                currentTabName === Constant.TEMPLATE_SEARCH_TAB_FAVORITE
                  ? 'bor bg-basic color-white pd10 bold font-em1 text-under'
                  : 'bor-top bor-bottom bor-right pd10 font-em1 bg-gray'
              }
              onClick={() =>
                this.changeCurrentTabName(Constant.TEMPLATE_SEARCH_TAB_FAVORITE)
              }
            >
              즐겨쓰는 답변 템플릿
              {currentTabName === Constant.TEMPLATE_SEARCH_TAB_FAVORITE
                ? `(${totalCount}개)`
                : ''}
            </Col>
          </Row>
          <Row>
            <Col span={12} className="left">
              <span className="bold font-em1">* 전체 : </span>
              <span className="bold font-em1 color-basic">
                {' '}
                총 {totalCount}개
              </span>
            </Col>
            <Col span={12} className="right">
              <Checkbox checked={checkMyAdd} onChange={this.changeCheckMyAdd}>
                내가 등록한 템플릿 보기
              </Checkbox>
            </Col>
          </Row>
        </div>
        <div style={{ maxHeight: clientHeight - 280, overflowY: 'scroll' }}>
          {templateList.map(info => (
            <div className="pd20 bor-bottom">
              <Row className="mrb10">
                <Col span={12} className="left bold color-basic font-em1">
                  {info.categoryLargeName} &gt; {info.categoryMiddleName} &gt;{' '}
                  {info.categorySmallName}
                </Col>
                <Col span={12} className="right">
                  {moment(info.createDate).format('YY.MM.DD')} /{' '}
                  {info.memberName}{' '}
                  {info.isFavortie ? (
                    <StarFilled
                      className="color-basic"
                      onClick={() =>
                        this.changeFavortie(info.id, info.isFavortie)
                      }
                    />
                  ) : (
                    <StarOutlined
                      className="color-basic font-em4"
                      onClick={() =>
                        this.changeFavortie(info.id, info.isFavortie)
                      }
                    />
                  )}{' '}
                  <Button
                    className="bg-basic color-white bold"
                    onClick={() => this.openTemplateFormPopup(info.id)}
                  >
                    편집
                  </Button>{' '}
                  <Button
                    className="bg-basic color-white bold"
                    onClick={() => this.deleteTemplate(info.id)}
                  >
                    삭제
                  </Button>
                </Col>
              </Row>
              <Row className="mrb10">
                <Col span={4} className="bold font-em1">
                  * 질문
                </Col>
                <Col span={20}>{info.ask}</Col>
              </Row>
              <Row className="mrb10">
                <Col span={4} className="bold font-em1">
                  * 답변
                </Col>
                <Col span={20}>{info.reply}</Col>
              </Row>
              <Row className="mrb10">
                <Col span={4} className="bold font-em1">
                  * 키워드
                </Col>
                <Col span={20}>
                  {info.keywordNames
                    ? info.keywordNames.split(',').map(info => {
                        return (
                          <span
                            className="bold bg-basic pd7 color-white"
                            style={{
                              borderRadius: 10,
                              border: '1px solid #fff'
                            }}
                          >
                            #{info}
                          </span>
                        );
                      })
                    : ''}
                </Col>
              </Row>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 15 }}>
          <Pagination
            onChange={this.changePage}
            total={totalCount}
            pageSize={pageSize}
            current={page}
          />
        </div>
      </div>
    );
  }
}

export default TemplateSearch;
