import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Tree, Input } from 'antd';
import { StarFilled, StarOutlined, CaretDownOutlined } from '@ant-design/icons';
import ApiService from '../../services/ApiService';
import Helper from '../../utils/Helper';
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
class ChatAreaBottomReplySearch extends React.Component {
  categoryAllList = [];
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      treeData: [],
      templateList: [],
      filterList: [],
      searchValue: '',
      selectTreeInfo: null
    };
    this.treeRef = React.createRef();
    this.changeSearchValue = this.changeSearchValue.bind(this);
    this.changeFavortie = this.changeFavortie.bind(this);
    this.search = this.search.bind(this);
  }

  onSelect = (selectedKeys, tree) => {
    let info = tree.node.info;
    this.setState(
      {
        selectTreeInfo: info
      },
      () => {
        this.search();
      }
    );
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };

  search() {
    let { selectTreeInfo } = this.state;
    let apiUrl = 'template/findAll';
    let apiParam = {};
    if (selectTreeInfo.level === 0) {
      apiUrl = 'template/findAll';
    } else {
      if (selectTreeInfo.level === 1) {
        apiUrl = 'template/findByCategoryLargeId';
        apiParam.categoryLargeId = selectTreeInfo.id;
      } else if (selectTreeInfo.level === 2) {
        apiUrl = 'template/findByCategoryMiddleId';
        apiParam.categoryMiddleId = selectTreeInfo.id;
      } else if (selectTreeInfo.level === 3) {
        apiUrl = 'template/findByCategorySmallId';
        apiParam.categorySmallId = selectTreeInfo.id;
      }
    }
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
    ApiService.get('category/tree').then(response => {
      let data = response.data;
      this.categoryAllList = [];
      data.forEach(treeInfo => {
        Helper.addCategoryList(this.categoryAllList, treeInfo);
      });
      let rootTreeInfo = {
        title: '전체',
        key: '0',
        children: data,
        level: 0
      };
      let treeData = [rootTreeInfo];
      let expandedKeys = ['0'];
      this.setState(
        {
          treeData: treeData,
          expandedKeys: expandedKeys,
          selectTreeInfo: rootTreeInfo
        },
        () => {
          this.search();
        }
      );
    });
  }

  render() {
    let { chatStore } = this.props;
    let { treeData, expandedKeys, filterList, searchValue } = this.state;
    const loop = data =>
      data.map(item => {
        const title = <span>{item.title}</span>;
        if (item.children) {
          return {
            title,
            key: item.key,
            level: item.level,
            info: item,
            children: loop(item.children)
          };
        }

        return {
          title,
          key: item.key,
          level: item.level,
          info: item
        };
      });

    return (
      <Row>
        <Col span={10} className="bor-right">
          <Tree
            style={{ overflowY: 'auto', height: 450 }}
            className="draggable-tree"
            blockNode
            treeData={loop(treeData)}
            expandedKeys={expandedKeys}
            onSelect={this.onSelect}
            onExpand={this.onExpand}
            switcherIcon={
              <CaretDownOutlined style={{ fontSize: '16px', color: 'gray' }} />
            }
          />
        </Col>
        <Col span={14}>
          <div style2={{ padding: '10px 10px 0px 10px' }} className="pd10">
            <Input
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
              padding: 5,
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
                    className="inblock pd-right5"
                    style={{
                      width: '10%'
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
                    className="bg-gray pd10 mrb10 inblock text"
                    style={{
                      borderRadius: 10,
                      width: '90%'
                    }}
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

export default ChatAreaBottomReplySearch;
