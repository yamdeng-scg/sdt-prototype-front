import React from 'react';
import { Card } from 'antd';

class TalkCloseummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="mrb20">
        <div className="text font-em4 bold mrb10 mrl5">상담처리 분석</div>
        <div className="none-border stats-box-shadow">
          <Card title={null} bordered={false}>
            <Card.Grid className="grid4">
              <div className="center font-em2 text bold mrb5">총 상담수</div>
              <div className="center font-em3 color-basic bold">0건</div>
            </Card.Grid>
            <Card.Grid className="grid4">
              <div className="center font-em2 text bold mrb5">
                종료상담 건수
              </div>
              <div className="center font-em3 color-basic bold">0건</div>
            </Card.Grid>
            <Card.Grid className="grid4">
              <div className="center font-em2 text bold mrb5">
                상담원 평균 응대 건수
              </div>
              <div className="center font-em3 color-basic bold">0건</div>
            </Card.Grid>
            <Card.Grid className="grid4">
              <div className="center font-em2 text bold mrb5">
                전일 대비 상담 증감
              </div>
              <div className="center font-em3 color-basic bold">0건</div>
            </Card.Grid>
          </Card>
        </div>
      </div>
    );
  }
}

export default TalkCloseummary;
