import React from 'react';
import { Button, Typography } from 'antd';
import Constant from '../../config/Constant';
const Title = Typography.Title;

class ChatAreaBottomWarning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { swearCount, insultCount, handleSendWarningMessage } = this.props;
    return (
      <div
        style={{
          position: 'relative',
          height: 400,
          overflowY: 'scroll'
        }}
        className="pd15"
      >
        <div className="mrb10">
          <Title level={4} className="text mr0">
            욕설 및 비속어 사용 경고
          </Title>
        </div>
        <div className="mrb10">
          <div
            style={{
              width: '80%',
              padding: '11px 15px 9px',
              position: 'relative'
            }}
            className="inblock left red mrb10"
          >
            욕설 및 비속어를 {swearCount}회 사용하셨습니다. 3회 사용 시
            상담채팅이 자동으로 종료됩니다
          </div>
          <div
            style={{
              width: '20%'
            }}
            className="inblock right"
          >
            <Button
              className="bg-basic color-white bold"
              onClick={() =>
                handleSendWarningMessage(
                  `욕설 및 비속어를 ${swearCount +
                    1}회 사용하셨습니다. 3회 사용 시
                상담채팅이 자동으로 종료됩니다.`,
                  Constant.WARN_MESSAGE_TYPE_SWEAR
                )
              }
            >
              전송
            </Button>
          </div>
        </div>
        <div>
          <Title level={4} className="text mr0">
            부적절한 대화 시도 경고
          </Title>
        </div>
        <div
          style={{
            marginBottom: 10
          }}
        >
          <div
            style={{
              width: '80%',
              display: 'inline-block',
              textAlign: 'left',
              padding: '11px 15px 9px',
              color: 'red',
              marginBottom: 10,
              position: 'relative'
            }}
          >
            가스업무와 관련 없는 부적절한 대화를 {insultCount}회 시도하셨습니다.
            이와 같은 대화를 3회 시도 시에는 상담채팅이 자동으로 종료됩니다.
          </div>
          <div
            style={{
              width: '20%',
              display: 'inline-block',
              textAlign: 'right'
            }}
          >
            <Button
              className="bg-basic color-white bold"
              onClick={() =>
                handleSendWarningMessage(
                  `가스업무와 관련 없는 부적절한 대화를 ${insultCount +
                    1}회 시도하셨습니다.
              이와 같은 대화를 3회 시도 시에는 상담채팅이 자동으로 종료됩니다.`,
                  Constant.WARN_MESSAGE_TYPE_INSULT
                )
              }
            >
              전송
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatAreaBottomWarning;
