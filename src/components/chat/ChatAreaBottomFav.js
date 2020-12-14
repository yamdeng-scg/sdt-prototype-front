import React from 'react';
import { Row, Col, Input } from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import ApiService from '../../services/ApiService';
import _ from 'lodash';

const replaceHighLighText = function(message, searchValue) {
  let resultMessage = message;
  if (searchValue) {
    var regEx = new RegExp(searchValue, 'g');
    resultMessage = message.replace(
      regEx,
      '<span class="bg-yellow color-black">' + searchValue + '</span>'
    );
  }
  return resultMessage;
};

@withRouter
@inject('appStore', 'uiStore', 'chatStore')
@observer
class ChatAreaBottomFav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      templateList: [],
      filterList: [],
      searchValue: ''
    };
    this.changeSearchValue = this.changeSearchValue.bind(this);
    this.changeFavortie = this.changeFavortie.bind(this);
    this.search = this.search.bind(this);
  }

  search() {
    let apiUrl = 'template/findAll';
    let apiParam = { checkFavorite: 1 };
    ApiService.post(apiUrl, apiParam).then(response => {
      let data = response.data;
      this.setState({ searchValue: '', templateList: data, filterList: data });
    });
  }

  changeSearchValue(value) {
    let { templateList } = this.state;
    let filterList = _.filter(templateList, info => {
      return info.reply.indexOf(value) !== -1;
    });
    if (!value) {
      filterList = templateList;
    }
    this.setState({ searchValue: value, filterList: filterList });
  }

  changeFavortie(templateId, isFavortie) {
    ApiService.put('template/' + templateId + '/favorite', {
      value: isFavortie ? false : true
    }).then(() => {
      this.search();
    });
  }

  componentDidMount() {
    this.search();
  }

  render() {
    let { chatStore } = this.props;
    let { filterList, searchValue } = this.state;
    return (
      <Row>
        <Col span={24}>
          <div style={{ padding: '10px 10px 0px 10px' }} className="right">
            <Input
              style={{ maxWidth: '90%' }}
              allowClear
              placeholder="검색어를 입력해주세요"
              value={searchValue}
              onChange={event => {
                this.changeSearchValue(event.target.value);
              }}
            />
          </div>
          <div
            style={{
              padding: 10,
              textAlign: 'right',
              overflowY: 'auto',
              height: 400
            }}
          >
            {filterList.map(info => {
              let {
                id,
                reply,
                isFavortie,
                linkUrl,
                linkText,
                linkProtocol
              } = info;
              let replyHtml = replaceHighLighText(reply, searchValue);
              return (
                <div>
                  <div
                    style={{
                      display: 'inline-block',
                      width: '10%',
                      paddingRight: 5
                    }}
                  >
                    {isFavortie ? (
                      <StarFilled
                        className="color-basic"
                        onClick={() => this.changeFavortie(id, isFavortie)}
                      />
                    ) : (
                      <StarOutlined
                        className="color-basic font-em2"
                        onClick={() => this.changeFavortie(id, isFavortie)}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      borderRadius: 10,
                      width: '90%'
                    }}
                    className="bg-gray pd10 mrb10 inblock"
                    onClick={() => chatStore.appendMessage(reply)}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: replyHtml
                      }}
                    />
                    <div
                      onClick={event => {
                        event.stopPropagation();
                        chatStore.sendLinkMessage(
                          linkUrl,
                          linkText,
                          linkProtocol
                        );
                      }}
                      className={linkUrl ? '' : 'none'}
                    >
                      {linkText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
    );
  }
}

export default ChatAreaBottomFav;
