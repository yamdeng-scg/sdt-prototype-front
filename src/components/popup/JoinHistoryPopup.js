import React from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col, Collapse, Input } from 'antd';
import update from 'immutability-helper';
import { SearchOutlined } from '@ant-design/icons';
import MessageList from '../chat/MessageList';
import ApiService from '../../services/ApiService';
import Constant from '../../config/Constant';
import LoadingBar from '../../utils/LoadingBar';
import _ from 'lodash';
const { Panel } = Collapse;

@inject('modalStore')
@observer
class JoinHistoryPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: '', joinHistoryList: [] };
    this.search = this.search.bind(this);
    this.change = this.change.bind(this);
    this.changeMessage = this.changeMessage.bind(this);
  }

  search() {
    let { modalData } = this.props;
    let { message } = this.state;
    let { roomId } = modalData;
    ApiService.get('room/' + roomId + '/findSearchJoinHistory', {
      params: {
        message: message
      }
    }).then(response => {
      let data = response.data;
      this.setState({ joinHistoryList: data });
    });
  }

  change(id) {
    let { joinHistoryList } = this.state;
    let { modalData } = this.props;
    let { roomId } = modalData;
    let searchIndex = _.findIndex(joinHistoryList, info => {
      return info.id == id;
    });
    let searchInfo = joinHistoryList[searchIndex];
    if (searchInfo && !searchInfo.messageList) {
      ApiService.get('message', {
        params: {
          queryId: 'findRangeById',
          roomId: roomId,
          startId: searchInfo.startMessageId || 0,
          endId: searchInfo.endMessageId
        }
      }).then(response => {
        let data = response.data;
        let updateJoinHistoryList = update(joinHistoryList, {
          [searchIndex]: {
            messageList: { $set: data }
          }
        });
        this.setState({ joinHistoryList: updateJoinHistoryList });
      });
    }
  }

  changeMessage(event) {
    let value = event.target.value;
    this.setState({ message: value });
  }

  componentDidMount() {
    this.search();
  }

  render() {
    let { modalData } = this.props;
    let { joinHistoryList, message } = this.state;
    let { customerName, chatid } = modalData;
    return (
      <div className="pd-top15">
        <Row className="center pd-bottom15 bor-bottom text font-em2 bold">
          <Col span={24}>과거 채팅상담 기록</Col>
        </Row>
        <Row className="mrt15 mrb10">
          <Col span={12} className="pd-left10">
            <span className="bold font-em2">고객정보 :</span>{' '}
            <span className="font-em2">{customerName} ID</span>
            <span className="bold text text-under font-em2 inblock mrl5">
              {chatid}
            </span>
            <br />
            {'    '}
            <span>최근 1년간 연동 내역을 확인하실수 있습니다</span>
          </Col>
          <Col span={12} className="pd5">
            <Input
              placeholder="input search text"
              enterButton={null}
              allowClear
              size="large"
              suffix={
                <SearchOutlined
                  className="color-basic"
                  style={{
                    fontSize: 16
                  }}
                  onClick={this.search}
                />
              }
              value={message}
              onChange={this.changeMessage}
            />
          </Col>
        </Row>
        <div style={{ maxHeight: 600, overflowY: 'scroll' }}>
          <Collapse>
            {joinHistoryList.map(info => {
              let {
                id,
                startDate,
                endDate,
                memberName,
                tags,
                messageList
              } = info;
              messageList = messageList || [];
              tags = tags || '';
              let tagArray = [];
              if (tags) {
                tagArray = tags.split(',');
              }
              return (
                <Panel
                  header={
                    <div
                      onClick={() => {
                        this.change(id);
                      }}
                    >
                      {startDate} ~ {endDate}
                      <span className="bold inblock mrl20" />|
                      <span className="bold inblock mrl20">담당자</span> :
                      {memberName}
                      <div className="mrt5">
                        * 주요문의유형
                        <div className="mrt5 mrl5">
                          {tagArray.map(tagString => {
                            return (
                              <span
                                style={{
                                  borderRadius: 10,
                                  marginBottom: 5
                                }}
                                className="mrr5 inblock pd7 bg-basic color-white"
                              >
                                #{tagString}{' '}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  }
                  key={id}
                >
                  <div>
                    <MessageList
                      clientHeight={300}
                      messageList={messageList}
                      wrapperType={Constant.MESSAGE_LIST_WRAPPER_TYPE_HISTORY}
                      searchValue={message}
                    />
                  </div>
                </Panel>
              );
            })}
            {/* 이전 히스토리 */}
          </Collapse>
        </div>
      </div>
    );
  }
}

export default JoinHistoryPopup;
