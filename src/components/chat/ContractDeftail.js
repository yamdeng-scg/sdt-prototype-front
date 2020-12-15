import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Typography, Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import MessageTemplateType from '../../config/MessageTemplateType';
import Helper from '../../utils/Helper';
const { Option } = Select;
const { Title } = Typography;

@withRouter
@inject('appStore', 'uiStore', 'chatStore')
@observer
class ContractDeftail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { chatStore } = this.props;
    let {
      contractList,
      selectedContractInfo,
      currentContractInfo,
      currentBillInfo,
      useContractNum,
      cash,
      billHistoryMonthList,
      currentHistoryMonth,
      virtualAccountList,
      currentVirtualAccount
    } = chatStore;
    currentVirtualAccount = currentVirtualAccount || {};
    selectedContractInfo = selectedContractInfo || {};
    let contractDetailComponent = null;
    if (currentContractInfo) {
      let {
        useContractNum,
        productName,
        contractStatus,
        customerName,
        handphone,
        address,
        gmtrBaseDay,
        billSendMethod,
        paymentType,
        centerName
      } = currentContractInfo;
      let addressStr = '';
      if (address && address.address1) {
        addressStr = address.address1 + ' ' + address.address2;
      }
      let billDetailComponent = null;
      if (currentBillInfo) {
        let {
          paymentDeadline,
          allPayAmounts,
          chargeAmt,
          basicRate,
          useRate,
          discountAmt,
          replacementCost,
          vat,
          adjustmentAmt,
          cutAmt,
          previousUnpayAmounts,
          latelyPreviousUnpayAmounts,
          previousUnpayInfos,
          payMethod
        } = currentBillInfo;
        billDetailComponent = (
          <React.Fragment>
            <Row
              style={{
                padding: 10,
                borderBottom: '1px solid #f0f0f0',
                borderTop: '1px solid #f0f0f0'
              }}
            >
              <Col span={24} style={{ marginBottom: 10 }}>
                <Select
                  style={{ width: 150, textAlign: 'left' }}
                  placeholder="청구년월을 선택해주세요"
                  value={currentHistoryMonth}
                  onChange={billMonth => {
                    chatStore.changeBillHistory(billMonth);
                  }}
                >
                  {billHistoryMonthList.map(info => {
                    return (
                      <Option value={info.billMonth}>{info.displayName}</Option>
                    );
                  })}
                </Select>{' '}
                <span
                  className="left bold text-under font-em1 inblock mrl5"
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_6)
                  }
                >
                  전체요약
                </span>
              </Col>
              <Col span={12} className="left bold color-basic">
                납기일
              </Col>
              <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_7)
                  }
                >
                  {Helper.convertDateToString(
                    paymentDeadline,
                    'YYYYMMDD',
                    'YYYY년MM월DD일'
                  )}
                </span>
              </Col>
              <Col span={12} className="left bold color-basic">
                총 청구요금
              </Col>
              <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_8)
                  }
                >
                  {allPayAmounts.toLocaleString()}원
                </span>
              </Col>
            </Row>
            <Row style={{ padding: 10, borderBottom: '1px solid #f0f0f0' }}>
              <Col span={12} className="left bold">
                <span className="color-basic">당월 소계</span>{' '}
                <span
                  className="left bold text-under font-em1 inblock mrl5"
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_9)
                  }
                >
                  요약
                </span>
              </Col>
              <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_10)
                  }
                >
                  {chargeAmt.toLocaleString()}원
                </span>
              </Col>
              <Col span={8} offset={8} style={{ textAlign: 'left' }}>
                기본 요금
              </Col>
              <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_11)
                  }
                >
                  {basicRate.toLocaleString()}원
                </span>
              </Col>
              <Col span={8} offset={8} style={{ textAlign: 'left' }}>
                사용 요금
              </Col>
              <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_12)
                  }
                >
                  {useRate.toLocaleString()}원
                </span>
              </Col>
              <Col span={8} offset={8} style={{ textAlign: 'left' }}>
                감면 금액
              </Col>
              <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_13)
                  }
                >
                  {discountAmt.toLocaleString()}원
                </span>
              </Col>
              <Col span={8} offset={8} style={{ textAlign: 'left' }}>
                계량기 교체 금액
              </Col>
              <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_14)
                  }
                >
                  {replacementCost.toLocaleString()}원
                </span>
              </Col>
              <Col span={8} offset={8} style={{ textAlign: 'left' }}>
                부가세
              </Col>
              <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_15)
                  }
                >
                  {vat.toLocaleString()}원
                </span>
              </Col>
              <Col span={8} offset={8} style={{ textAlign: 'left' }}>
                정산금액
              </Col>
              <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_16)
                  }
                >
                  {adjustmentAmt.toLocaleString()}원
                </span>
              </Col>
              <Col span={8} offset={8} style={{ textAlign: 'left' }}>
                절사금액
              </Col>
              <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_17)
                  }
                >
                  {cutAmt.toLocaleString()}원
                </span>
              </Col>
            </Row>
            <Row style={{ padding: 10, borderBottom: '1px solid #f0f0f0' }}>
              <Col span={12} className="left bold">
                <span className="color-basic">미납 소계</span>{' '}
                <span
                  className="left bold text-under font-em1 inblock mrl5"
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_18)
                  }
                >
                  요약
                </span>
              </Col>
              <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_19)
                  }
                >
                  {previousUnpayAmounts.toLocaleString()}원
                </span>
              </Col>
              {previousUnpayInfos.map(info => {
                return (
                  <Col
                    span={8}
                    offset={8}
                    style={{ textAlign: 'left' }}
                    onClick={() =>
                      chatStore.sendMessageTemplate(
                        MessageTemplateType.TYPE_20,
                        info.requestYm,
                        info.unpayAmtAll
                      )
                    }
                  >
                    {Helper.convertDateToString(
                      info.requestYm,
                      'YYYYMMDD',
                      'YYYY.MM.DD'
                    )}{' '}
                    : {info.unpayAmtAll.toLocaleString()}원
                  </Col>
                );
              })}
              <Col span={8} offset={8} style={{ textAlign: 'left' }}>
                이전 미납
              </Col>
              <Col span={8} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  {latelyPreviousUnpayAmounts.toLocaleString()}원
                </span>
              </Col>
            </Row>
            <Row
              style={{
                padding: 10,
                borderBottom: '1px solid #f0f0f0',
                marginBottom: 20
              }}
            >
              <Col span={12} className="left bold color-basic">
                납부 상태{' '}
              </Col>
              <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_21)
                  }
                >
                  {payMethod ? payMethod : '납부전'}
                </span>
              </Col>
              <Col span={12} className="left bold color-basic">
                입금전용계좌{' '}
              </Col>
              <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_22)
                  }
                >
                  전체가상계좌 전송
                </span>
              </Col>
              <Col span={10} offset={8} style={{ textAlign: 'left' }}>
                <Select
                  style={{ width: '100%', textAlign: 'left' }}
                  value={currentVirtualAccount.account}
                  onChange={account => {
                    chatStore.changeVirtualAccount(account);
                  }}
                >
                  {virtualAccountList.map(info => {
                    return <Option value={info.account}>{info.name}</Option>;
                  })}
                </Select>
              </Col>
              <Col span={6} style={{ textAlign: 'right', marginBottom: 5 }}>
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                  onClick={() =>
                    chatStore.sendMessageTemplate(MessageTemplateType.TYPE_23)
                  }
                >
                  {currentVirtualAccount.account}
                </span>
              </Col>
            </Row>
          </React.Fragment>
        );
      }
      contractDetailComponent = (
        <div
          style={{
            overflowY: 'scroll',
            height: document.documentElement.clientHeight - 215
          }}
          className={currentContractInfo ? '' : 'none'}
        >
          <Row className="pd10" align="middle">
            <Col span={12} className="left bold color-basic">
              사용계약번호
            </Col>
            <Col
              span={12}
              className="right mrb5"
              style={{
                position: 'relative'
              }}
            >
              <CopyToClipboard
                text={useContractNum}
                onCopy={() => alert('클립보드에 복사되었습니다')}
              >
                <span className="bold text-under">{useContractNum}</span>
              </CopyToClipboard>
              <div>{productName}</div>
            </Col>
            <Col span={12} className="left bold color-basic">
              계약상태
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              {contractStatus}
            </Col>
            <Col span={12} className="left bold color-basic">
              계약자 성명
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              {customerName}
            </Col>
            <Col span={12} className="left bold color-basic">
              휴대폰 번호
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <CopyToClipboard
                text={handphone}
                onCopy={() => alert('클립보드에 복사되었습니다')}
              >
                <span
                  style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  {handphone}
                </span>
              </CopyToClipboard>
            </Col>
            <Col span={12} className="left bold color-basic">
              주소
            </Col>
            <Col
              span={12}
              style={{ textAlign: 'right', marginBottom: 5 }}
              onClick={() =>
                chatStore.sendMessageTemplate(MessageTemplateType.TYPE_1)
              }
            >
              <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                {addressStr}
              </span>
            </Col>
            <Col span={12} className="left bold color-basic">
              점검기준일
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              매월 {gmtrBaseDay}일
            </Col>
            <Col span={12} className="left bold color-basic">
              청구서
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              {billSendMethod}
            </Col>
            <Col span={12} className="left bold color-basic">
              납부방법
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              {paymentType}
            </Col>
            <Col span={12} className="left bold color-basic">
              최근 계량기 교체일
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span
                style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                onClick={() =>
                  chatStore.sendMessageTemplate(MessageTemplateType.TYPE_2)
                }
              >
                2020년 1월 21일
              </span>
            </Col>
            <Col span={12} className="left bold color-basic">
              최근 안전점검일자
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span
                style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                onClick={() =>
                  chatStore.sendMessageTemplate(MessageTemplateType.TYPE_3)
                }
              >
                2020년 1월 21일
              </span>
            </Col>
            <Col span={12} className="left bold color-basic">
              잔여캐시
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span
                style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                onClick={() =>
                  chatStore.sendMessageTemplate(MessageTemplateType.TYPE_4)
                }
              >
                {cash.toLocaleString()} 캐시
              </span>
            </Col>
            <Col span={12} className="left bold color-basic">
              해당 고객센터
            </Col>
            <Col span={12} style={{ textAlign: 'right', marginBottom: 5 }}>
              <span
                style={{ fontWeight: 'bold', textDecoration: 'underline' }}
                onClick={() =>
                  chatStore.sendMessageTemplate(MessageTemplateType.TYPE_5)
                }
              >
                {centerName}
              </span>
            </Col>
          </Row>
          {billDetailComponent}
        </div>
      );
    }
    return (
      <div>
        <Row
          style={{
            padding: '10px 10px 0px 10px'
          }}
        >
          <Col span={24}>
            <Title level={3} className="text mr0">
              사용계약정보{' '}
              {contractList.length ? '(' + contractList.length + ')' : ''}
            </Title>
          </Col>
        </Row>
        <Row className="pd10" align="middle">
          <Col span={24} className="mrb10">
            <Select
              placeholder="계약번호를 선택해주세요"
              style={{ width: '100%', textAlign: 'left' }}
              value={selectedContractInfo.useContractNum}
              onChange={useContractNum => {
                chatStore.changeContractInfo(useContractNum);
              }}
            >
              {contractList.map(info => {
                return (
                  <Option value={info.useContractNum}>
                    {info.displayName}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col
            span={6}
            className="left color-basic bold"
            style={{
              display:
                selectedContractInfo.useContractNum === '직접입력' ? '' : 'none'
            }}
          >
            사용계약번호
          </Col>
          <Col
            span={18}
            className="right mrb5"
            style={{
              position: 'relative',
              display:
                selectedContractInfo.useContractNum === '직접입력' ? '' : 'none'
            }}
          >
            <Input
              placeholder="사용계약번호를 입력해주세요"
              allowClear
              suffix={
                <SearchOutlined
                  className="color-basic bold"
                  style={{
                    fontSize: 16
                  }}
                />
              }
              value={useContractNum}
              onChange={event => {
                let value = event.target.value;
                chatStore.changeUseContractNum(value);
              }}
              onPressEnter={() => {
                chatStore.loadContractInfo(useContractNum);
              }}
            />
          </Col>
        </Row>
        {contractDetailComponent}
      </div>
    );
  }
}

export default ContractDeftail;
