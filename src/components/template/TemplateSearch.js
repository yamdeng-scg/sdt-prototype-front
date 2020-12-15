import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Checkbox, Input, Button, Select } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import ModalService from '../../services/ModalService';
import ModalType from '../../config/ModalType';
import { Pagination } from 'antd';
const { Option } = Select;

const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

@withRouter
@inject('appStore', 'uiStore')
@observer
class TemplateSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  openTemplateFormPopup = () => {
    ModalService.openPopup(ModalType.TEMPLATE_FORM_POPUP, {});
  };

  render() {
    let { uiStore } = this.props;
    let { clientHeight } = uiStore;
    return (
      <div>
        <div style={{ padding: 15, borderBottom: '1px solid #e0dcdc' }}>
          <Row>
            <Col span={6}>
              <Select
                defaultValue="lucy"
                style={{ width: '100%', textAlign: 'left' }}
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>
                  Disabled
                </Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </Col>
            <Col span={14} className="mrl10 mrr10">
              <Input style={{ width: '100%' }} />
            </Col>
            <Col span={3}>
              <Button
                className="bg-basic color-white bold"
                onClick={this.openTemplateFormPopup}
              >
                템플릿 추가
              </Button>
            </Col>
          </Row>
          <Row className="center mrt10 mrb10">
            <Col
              span={12}
              className="bor bg-basic color-white pd10 bold font-em1 text-under"
            >
              전체 답변 템플릿(N개)
            </Col>
            <Col
              span={12}
              className="bor-top bor-bottom bor-right pd10 font-em1 bg-gray"
            >
              즐겨쓰는 답변 템플릿(N개)
            </Col>
          </Row>
          <Row>
            <Col span={12} className="left">
              <span className="bold font-em1">* 전체 : </span>
              <span className="bold font-em1 color-basic"> 총 250개</span>
            </Col>
            <Col span={12} className="right">
              <Checkbox>내가 등록한 템플릿 보기</Checkbox>
            </Col>
          </Row>
        </div>
        <div style={{ maxHeight: clientHeight - 280, overflowY: 'scroll' }}>
          {data.map(info => (
            <div className="pd20 bor-bottom">
              <Row className="mrb10">
                <Col span={12} className="left bold color-basic font-em1">
                  요금 &gt; 요금혹인 &gt; 체납
                </Col>
                <Col span={12} className="right">
                  YY.MM.DD / 홍길동{' '}
                  {/* <StarFilled className="color-basic" /> */}
                  <StarOutlined className="color-basic font-em4" />{' '}
                  <Button
                    className="bg-basic color-white bold"
                    onClick={this.openTemplateFormPopup}
                  >
                    편집
                  </Button>{' '}
                  <Button className="bg-basic color-white bold">삭제</Button>
                </Col>
              </Row>
              <Row className="mrb10">
                <Col span={4} className="bold font-em1">
                  * 질문
                </Col>
                <Col span={20}>asdasd</Col>
              </Row>
              <Row className="mrb10">
                <Col span={4} className="bold font-em1">
                  * 답변
                </Col>
                <Col span={20}>
                  asdasd asda sdas asd asd asd asd asd asd asd asd as dasd asd
                  as das as das dasdasd asda sdas asd asd asd asd asd asd asd
                  asd as dasd asd as das as das dasdasd asda sdas asd asd asd d
                </Col>
              </Row>
              <Row className="mrb10">
                <Col span={4} className="bold font-em1">
                  * 키워드
                </Col>
                <Col span={20}>
                  <span
                    className="bold bg-basic pd7 color-white"
                    style={{ borderRadius: 10, border: '1px solid #fff' }}
                  >
                    #캐시
                  </span>
                </Col>
              </Row>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 15 }}>
          <Pagination onChange={this.onChange} total={50} />
        </div>
      </div>
    );
  }
}

export default TemplateSearch;
