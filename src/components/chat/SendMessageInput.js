import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Input, Button } from 'antd';
const { TextArea } = Input;

@withRouter
@inject('appStore', 'chatStore')
@observer
class SendMessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { chatStore } = this.props;
    let { message } = chatStore;
    return (
      <div style={{ position: 'relative', paddingRight: 60 }}>
        <TextArea
          autoSize={true}
          className="bg-white inblock w100"
          placeholder="Ctrl 키와 Enter 키를 조합하면 메시지가 전송됩니다"
          value={message}
          onChange={event => {
            chatStore.changeMessage(event.target.value);
          }}
          onKeyPress={event => {
            if (event.ctrlKey && event.charCode === 13) {
              chatStore.sendMessage();
            }
          }}
        />{' '}
        <Button
          className="bg-basic color-white bold"
          style={{ position: 'absolute', bottom: 0, right: 0 }}
          disabled={!message}
          onClick={() => chatStore.sendMessage()}
        >
          전송
        </Button>
      </div>
    );
  }
}

export default SendMessageInput;
