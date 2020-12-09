import React from 'react';
import {
  Tabs,
  Button,
  Badge,
  Input,
  Select,
  Row,
  Col,
  Checkbox,
  List,
  Typography,
  DatePicker
} from 'antd';
import classNames from 'classnames';
import Code from '../../config/Code';
import Constant from '../../config/Constant';
import {
  ReloadOutlined,
  SmileOutlined,
  SearchOutlined
} from '@ant-design/icons';
import Helper from '../../utils/Helper';

import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

const { Paragraph, Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const getCountLabelName = function(tabName) {
  let labelName = '상담대기';
  // wait, ing, close
  if (tabName === Constant.ROOM_TYPE_WAIT) {
    labelName = '상담대기';
  } else if (tabName === Constant.ROOM_TYPE_ING) {
    labelName = '상담진행';
  } else if (tabName === Constant.ROOM_TYPE_CLOSE) {
    labelName = '상담종료';
  }
  return labelName;
};

const getTimeLabelName = function(tabName) {
  let labelName = '최장대기 고객 시간';
  if (tabName === Constant.ROOM_TYPE_WAIT) {
    labelName = '최장대기 고객 시간';
  } else if (tabName === Constant.ROOM_TYPE_ING) {
    labelName = '평균 상담 시간';
  } else if (tabName === Constant.ROOM_TYPE_CLOSE) {
    labelName = '평균 상담 시간';
  }
  return labelName;
};

const replaceHighLighText = function(message, searchValue) {
  let resultMessage = message;
  if (searchValue) {
    var regEx = new RegExp(searchValue, 'g');
    resultMessage = message.replace(
      regEx,
      '<span class="bold bg-yellow">' + searchValue + '</span>'
    );
  }
  return resultMessage;
};

@withRouter
@inject('appStore', 'uiStore', 'chatStore')
@observer
class RoomList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.chatStore.listenWaitTimeRefreshEvent();
    this.props.chatStore.search();
  }

  componentWillUnmount() {
    this.props.chatStore.removeReadyTimeRefreshEvent();
  }

  render() {
    let { chatStore, appStore } = this.props;
    let { isManager } = appStore;
    let {
      currentRoomTabName,
      readyRoomSort,
      roomList,
      maxDateConvertString,
      averageSpeakTimeString,
      processingRoomListApiCall,
      currentRoomInfo,
      ingSearchType,
      ingSearchValue,
      ingCheckSelf,
      closeSearchType,
      closeSearchValue,
      closeCheckSelf,
      startDate,
      endDate
    } = chatStore;
    let roomListSearcTypeCodeList = Code.roomListSearcTypeCodeList;
    let uiStore = this.props.uiStore;
    let clientHeight = uiStore.clientHeight;
    let roomListCount = roomList.length;
    let pojoRoomList = roomList.toJS();
    let roomListDivHeight = clientHeight;
    // 245, 270, 310
    return (
      <div
        style={{
          height: '100%'
        }}
        className="bor-right"
      >
        <div className="pd10 bor-bottom">
          <Title level={3} className="text mr0">
            {getCountLabelName(currentRoomTabName)}{' '}
            <span className="color-basic">{roomListCount}</span> 건
          </Title>
          <div>
            <span className="bold font-em1">
              {getTimeLabelName(currentRoomTabName)}
              {' : '}
            </span>
            <span className="red bold font-em1">
              {currentRoomTabName === Constant.ROOM_TYPE_WAIT
                ? maxDateConvertString
                : averageSpeakTimeString}
            </span>
          </div>
        </div>
        <Tabs
          activeKey={currentRoomTabName}
          tabBarStyle={{
            padding: '0px 5px 0px 5px',
            marginBottom: 0,
            borderBottom: '1px solid #cdcdcd'
          }}
          size={'large'}
          centered
          onChange={tabName => chatStore.changeRoomTab(tabName)}
        >
          {/* 대기 방 목록 */}
          <TabPane
            tab={
              currentRoomTabName === Constant.ROOM_TYPE_WAIT &&
              roomListCount ? (
                <Badge color={'orange'} className="font-em1 bold">
                  대기
                </Badge>
              ) : (
                <span
                  className={
                    currentRoomTabName === Constant.ROOM_TYPE_WAIT
                      ? 'font-em1 bold'
                      : 'font-em1'
                  }
                >
                  대기
                </span>
              )
            }
            key={Constant.ROOM_TYPE_WAIT}
          >
            <Row className="right pd10 bor-bottom">
              <Col span={24}>
                <span
                  className={classNames('inblock', 'mrr5', {
                    bold: readyRoomSort === Constant.READY_ROOM_SORT_WAIT_TIME,
                    'text-under':
                      readyRoomSort === Constant.READY_ROOM_SORT_WAIT_TIME
                  })}
                  onClick={() =>
                    chatStore.changeReadyRoomSort(
                      Constant.READY_ROOM_SORT_WAIT_TIME
                    )
                  }
                >
                  최장대기순 ▼
                </span>{' '}
                <span
                  className={classNames('inblock', {
                    bold: readyRoomSort === Constant.READY_ROOM_SORT_JOIN_DATE,
                    'text-under':
                      readyRoomSort === Constant.READY_ROOM_SORT_JOIN_DATE
                  })}
                  onClick={() =>
                    chatStore.changeReadyRoomSort(
                      Constant.READY_ROOM_SORT_JOIN_DATE
                    )
                  }
                >
                  최근접수순 ▼
                </span>
              </Col>
            </Row>
            {pojoRoomList.length ? (
              <List
                className=""
                dataSource={pojoRoomList}
                style={{
                  overflowY: 'scroll',
                  height: roomListDivHeight - 245
                }}
                rowKey="id"
                renderItem={(item, index) => (
                  <List.Item
                    style={{
                      position: 'relative'
                    }}
                    className={
                      currentRoomInfo && currentRoomInfo.id === item.id
                        ? 'pd-left20 pd-right5 bor-bottom bg-baisc-low'
                        : 'pd-left20 pd-right5 bor-bottom'
                    }
                  >
                    <p
                      className={item.isOnline ? 'dot-fill' : 'dot'}
                      style={{ position: 'absolute', top: 15, left: 6 }}
                    />{' '}
                    <span className="bold text">{item.customerName}님</span>
                    {item.isBlockCustomer ? (
                      <SmileOutlined className="font-em1 inblock mrl5 bold" />
                    ) : (
                      <SmileOutlined className="color-basic font-em1 inblock mrl5 bold" />
                    )}
                    {item.noReadCount ? (
                      <Badge
                        count={item.noReadCount}
                        className="site-badge-count-room"
                      >
                        <span className="inblock mrl15" />
                      </Badge>
                    ) : null}
                    {item.memberName ? (
                      <span
                        className="bold color-basic inblock bg-gray"
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          borderRadius: 10,
                          paddingLeft: 10,
                          paddingRight: 10
                        }}
                      >
                        {item.memberName}
                      </span>
                    ) : null}
                    <div style={{ position: 'relative' }}>
                      {item.lastMessageDetail ? (
                        <span className="roomlist-inner-link">
                          {item.lastMessageDetail}
                        </span>
                      ) : (
                        <Paragraph
                          style={{ marginTop: 10, width: '75%' }}
                          ellipsis
                        >
                          {item.lastMessage}
                        </Paragraph>
                      )}
                      <p style={{ position: 'absolute', top: 0, right: 0 }}>
                        <span className="red">{item.waitTime}</span>
                      </p>
                    </div>
                    <div className="center">
                      <Button
                        shape="round"
                        size="small"
                        onClick={() => chatStore.openChatbotHistoryPopup(item)}
                        className="bg-basic color-white bold"
                      >
                        챗봇대화
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={() => chatStore.matchRoom(item)}
                        className="bg-basic color-white bold"
                      >
                        상담하기
                      </Button>{' '}
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div
                className={
                  processingRoomListApiCall
                    ? 'none'
                    : 'pd-top30 center bold font-em2'
                }
                style={{
                  overflowY: 'scroll',
                  height: roomListDivHeight - 245
                }}
              >
                대기중인 상담이 없습니다
              </div>
            )}
          </TabPane>
          {/* 진행 방 목록 */}
          <TabPane
            tab={
              <span
                className={
                  currentRoomTabName === Constant.ROOM_TYPE_ING
                    ? 'font-em1 bold'
                    : 'font-em1'
                }
              >
                진행
              </span>
            }
            key={Constant.ROOM_TYPE_ING}
          >
            <Row className="pd5">
              <Col span={8}>
                <Select
                  style={{ width: '100%' }}
                  onChange={value => {
                    chatStore.changeIngSearchType(value);
                  }}
                  value={ingSearchType}
                >
                  {roomListSearcTypeCodeList.map(codeInfo => {
                    return (
                      <Option value={codeInfo.value}>{codeInfo.name}</Option>
                    );
                  })}
                </Select>
              </Col>
              <Col span={16}>
                <Input
                  placeholder="검색할 값을 입력해주세요"
                  enterButton={null}
                  allowClear
                  value={ingSearchValue}
                  suffix={
                    <SearchOutlined
                      className="color-basic bold"
                      style={{
                        fontSize: 16
                      }}
                      onClick={() => {
                        chatStore.search();
                      }}
                    />
                  }
                  onChange={event => {
                    chatStore.changeIngSearchValue(event.target.value);
                  }}
                  onPressEnter={() => {
                    chatStore.search();
                  }}
                />
              </Col>
            </Row>
            <Row className={isManager ? 'right pd-bottom5 bor-bottom' : 'none'}>
              <Col span={24}>
                <Checkbox
                  checked={ingCheckSelf}
                  onChange={event =>
                    chatStore.changeIngCheckSelf(event.target.checked)
                  }
                >
                  내 상담만 보기
                </Checkbox>
              </Col>
            </Row>
            {pojoRoomList.length ? (
              <List
                className=""
                dataSource={pojoRoomList}
                style={{
                  overflowY: 'scroll',
                  height: roomListDivHeight - 270
                }}
                rowKey="id"
                renderItem={(item, index) => (
                  <List.Item
                    style={{
                      position: 'relative'
                    }}
                    className={
                      currentRoomInfo && currentRoomInfo.id === item.id
                        ? 'pd-left20 pd-right5 bor-bottom bg-baisc-low'
                        : 'pd-left20 pd-right5 bor-bottom'
                    }
                  >
                    <p
                      className={item.isOnline ? 'dot-fill' : 'dot'}
                      style={{ position: 'absolute', top: 15, left: 6 }}
                    />{' '}
                    <span className="bold text">{item.customerName}님</span>
                    {item.isBlockCustomer ? (
                      <SmileOutlined className="font-em1 inblock mrl5 bold" />
                    ) : (
                      <SmileOutlined className="color-basic font-em1 inblock mrl5 bold" />
                    )}
                    {item.noReadCount ? (
                      <Badge
                        count={item.noReadCount}
                        className="site-badge-count-room"
                      >
                        <span className="inblock mrl15" />
                      </Badge>
                    ) : null}
                    {item.memberName ? (
                      <span
                        className="bold color-basic inblock bg-gray"
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          borderRadius: 10,
                          paddingLeft: 10,
                          paddingRight: 10
                        }}
                      >
                        {item.memberName}
                      </span>
                    ) : null}
                    <div style={{ position: 'relative' }}>
                      {item.lastMessageDetail ? (
                        <span className="roomlist-inner-link">
                          {item.lastMessageDetail}
                        </span>
                      ) : (
                        <div
                          style={{
                            marginTop: 10,
                            marginBottom: 14,
                            width: '75%'
                          }}
                          className="text-overflow"
                          ellipsis
                          dangerouslySetInnerHTML={{
                            __html: replaceHighLighText(
                              item.lastMessage,
                              ingSearchType === 'message' ? ingSearchValue : ''
                            )
                          }}
                        />
                      )}
                      {/* <p style={{ position: 'absolute', top: 0, right: 0 }}>
                        <span className="red">{item.waitTime}</span>
                      </p> */}
                    </div>
                    <div className="center">
                      <Button
                        shape="round"
                        size="small"
                        onClick={() => chatStore.openChatbotHistoryPopup(item)}
                        className="bg-basic color-white bold"
                      >
                        챗봇대화
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={() => chatStore.matchRoom(item)}
                        className="bg-basic color-white bold"
                      >
                        상담하기
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={() => chatStore.transferRoom(item)}
                        className="bg-basic color-white bold"
                      >
                        이관
                      </Button>{' '}
                      <Button
                        shape="round"
                        size="small"
                        onClick={() => chatStore.closeRoom(item)}
                        className="bg-basic color-white bold"
                      >
                        종료
                      </Button>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div
                className={
                  processingRoomListApiCall
                    ? 'none'
                    : 'pd-top30 center bold font-em2'
                }
                style={{
                  overflowY: 'scroll',
                  height: roomListDivHeight - 270
                }}
              >
                진행중인 상담이 없습니다
              </div>
            )}
          </TabPane>
          {/* 종료 방 목록 */}
          <TabPane
            tab={
              <span
                className={
                  currentRoomTabName === Constant.ROOM_TYPE_CLOSE
                    ? 'font-em1 bold'
                    : 'font-em1'
                }
              >
                종료
              </span>
            }
            key={Constant.ROOM_TYPE_CLOSE}
          >
            <Row className="pd5">
              <Col span={8}>
                <Select
                  style={{ width: '100%' }}
                  onChange={value => {
                    chatStore.changeCloseSearchType(value);
                  }}
                  value={closeSearchType}
                >
                  {roomListSearcTypeCodeList.map(codeInfo => {
                    return (
                      <Option value={codeInfo.value}>{codeInfo.name}</Option>
                    );
                  })}
                </Select>
              </Col>
              <Col span={16}>
                <Input
                  placeholder="검색할 값을 입력해주세요"
                  enterButton={null}
                  allowClear
                  value={closeSearchValue}
                  suffix={
                    <SearchOutlined
                      className="color-basic bold"
                      style={{
                        fontSize: 16
                      }}
                      onClick={() => {
                        chatStore.search();
                      }}
                    />
                  }
                  onChange={event => {
                    chatStore.changeCloseSearchValue(event.target.value);
                  }}
                  onPressEnter={() => {
                    chatStore.search();
                  }}
                />
              </Col>
            </Row>
            <Row className="pd5">
              <Col span={24}>
                <RangePicker
                  style={{ width: '90%' }}
                  onChange={dates => chatStore.changeDates(dates[0], dates[1])}
                  value={[startDate, endDate]}
                  allowClear={false}
                />{' '}
                {'   '}
                <ReloadOutlined
                  className="color-basic bold"
                  style={{ fontSize: 16 }}
                  onClick={() => chatStore.initDate()}
                />
              </Col>
            </Row>
            <Row className="right pd-bottom5 bor-bottom">
              <Col span={24}>
                <Checkbox
                  checked={closeCheckSelf}
                  onChange={event =>
                    chatStore.changeCloseCheckSelf(event.target.checked)
                  }
                >
                  내 상담만 보기
                </Checkbox>
              </Col>
            </Row>
            {pojoRoomList.length ? (
              <List
                className=""
                dataSource={pojoRoomList}
                style={{
                  overflowY: 'scroll',
                  height: roomListDivHeight - 315
                }}
                rowKey="id"
                renderItem={(item, index) => (
                  <List.Item
                    style={{
                      position: 'relative'
                    }}
                    className={
                      currentRoomInfo && currentRoomInfo.id === item.id
                        ? 'pd-left20 pd-right5 bor-bottom bg-baisc-low'
                        : 'pd-left20 pd-right5 bor-bottom'
                    }
                    onDoubleClick={() => {
                      chatStore.selectRoom(item);
                    }}
                  >
                    <p
                      className={item.isOnline ? 'dot-fill' : 'dot'}
                      style={{ position: 'absolute', top: 15, left: 6 }}
                    />{' '}
                    <span className="bold text">{item.customerName}님</span>
                    {item.isBlockCustomer ? (
                      <SmileOutlined className="font-em1 inblock mrl5 bold" />
                    ) : (
                      <SmileOutlined className="color-basic font-em1 inblock mrl5 bold" />
                    )}
                    {item.memberName ? (
                      <span
                        className="bold color-basic inblock bg-gray"
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          borderRadius: 10,
                          paddingLeft: 10,
                          paddingRight: 10
                        }}
                      >
                        {item.memberName}
                      </span>
                    ) : null}
                    <div style={{ position: 'relative' }}>
                      {item.lastMessageDetail ? (
                        <span className="roomlist-inner-link">
                          {item.lastMessageDetail}
                        </span>
                      ) : (
                        <div
                          style={{
                            marginTop: 10,
                            marginBottom: 14,
                            width: '75%'
                          }}
                          className="text-overflow"
                          dangerouslySetInnerHTML={{
                            __html: replaceHighLighText(
                              item.lastMessage,
                              closeSearchType === 'message'
                                ? closeSearchValue
                                : ''
                            )
                          }}
                        />
                      )}
                      <p style={{ position: 'absolute', top: 0, right: 0 }}>
                        <span className="color-basic">
                          {Helper.convertDateToString(
                            item.endDate,
                            'YYYY-MM-DDTHH:mm:ss.SSSZ',
                            'MM.DD HH:mm'
                          )}
                        </span>
                      </p>
                    </div>
                    <div className="center">
                      <Button
                        shape="round"
                        size="small"
                        onClick={event => {
                          event.stopPropagation();
                          chatStore.matchRoom(item);
                        }}
                        className="bg-basic color-white bold"
                      >
                        상담하기
                      </Button>{' '}
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div
                className={
                  processingRoomListApiCall
                    ? 'none'
                    : 'pd-top30 center bold font-em2'
                }
                style={{
                  overflowY: 'scroll',
                  height: roomListDivHeight - 315
                }}
              >
                검색결과가 존재하지 않습니다
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default RoomList;
