import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col, Input, Collapse } from 'antd';
import moment from 'moment';
import ApiService from '../../services/ApiService';
import { SearchOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

@inject('modalStore')
@observer
class MinwonHistoryPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { minwonList: [], searchValue: '' };
    this.changeSearchValue = this.changeSearchValue.bind(this);
    this.search = this.search.bind(this);
  }

  changeSearchValue(event) {
    let value = event.target.value;
    this.setState({ searchValue: value });
  }

  search() {
    let { modalData } = this.props;
    let { roomId } = modalData;
    let { searchValue } = this.state;
    ApiService.get('minwon', {
      params: { roomId: roomId, searchValue: searchValue }
    }).then(response => {
      let data = response.data;
      this.setState({ minwonList: data });
    });
  }

  componentDidMount() {
    let { modalData } = this.props;
    let { roomId } = modalData;
    ApiService.get('minwon', { params: { roomId: roomId } }).then(response => {
      let data = response.data;
      this.setState({ minwonList: data });
    });
  }

  render() {
    let { modalData } = this.props;
    let { minwonList, searchValue } = this.state;
    let { customerName, chatid, gasappMemberNumber } = modalData;
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>민원 등록 기록</Col>
        </Row>
        <Row className="mrt15 mrb10">
          <Col span={12} className="pd-left10">
            <span className="bold font-em1">고객정보 :</span>{' '}
            <span className="color-basic bold">{customerName} ID</span>
            <span className="bold text text-under inblock mrl5">
              ( 가스앱 ID : {gasappMemberNumber}, chatid :{chatid} )
            </span>
            <br />
            {'    '}
            <span>최근 1년간 연동 내역을 확인하실수 있습니다</span>
          </Col>
          <Col span={12} className="pd5">
            <Input
              placeholder="검색할 메모값을 입력해주세요"
              enterButton={null}
              allowClear
              size="large"
              value={searchValue}
              onChange={this.changeSearchValue}
              onPressEnter={this.search}
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
        </Row>
        <div style={{ maxHeight: 500, overflowY: 'scroll' }}>
          <Collapse>
            {minwonList.map(minwonInfo => {
              return (
                <Panel
                  header={
                    <div>
                      <span className="bold">등록일</span> :{' '}
                      {moment(minwonInfo.createDate).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )}
                      <span className="bold inblock mrl20" />|
                      <span className="bold inblock mrl20">담당자</span> :
                      {minwonInfo.createMemberName}
                    </div>
                  }
                  key={minwonInfo.id}
                >
                  <div>
                    <span className="bold">
                      * {minwonInfo.categoryLargeName} &gt;{' '}
                      {minwonInfo.categoryMiddleName} &gt;{' '}
                    </span>
                    <span className="bold color-basic font-em1">
                      {minwonInfo.categorySmallName}
                    </span>
                  </div>
                  <div className="mrl5">{minwonInfo.memo}</div>
                </Panel>
              );
            })}
          </Collapse>
        </div>
      </div>
    );
  }
}

export default MinwonHistoryPopup;
