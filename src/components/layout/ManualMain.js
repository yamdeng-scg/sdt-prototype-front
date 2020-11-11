import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, withRouter, Switch } from 'react-router-dom';
import NotFound from '../NotFound';
import SideBar from '../layout/SideBar';
import ChatContainer from '../chat/ChatContainer';
import TemplateContainer from '../template/TemplateContainer';
import ManualContainer from '../manual/ManualContainer';
import ManagerSettingContainer from '../manager/ManagerSettingContainer';

@withRouter
@inject('appStore', 'uiStore')
@observer
class ManualMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div style={{ height: '100%' }}>
          <SideBar />
          <div
            style={{
              height: '100%',
              marginLeft: 110
            }}
          >
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => <ChatContainer {...props} />}
              />
              <Route
                exact
                path="/chat"
                render={(props) => <ChatContainer {...props} />}
              />
              <Route
                exact
                path="/template"
                render={(props) => <TemplateContainer {...props} />}
              />
              <Route
                exact
                path="/manual"
                render={(props) => <ManualContainer {...props} />}
              />
              <Route
                path="/manager"
                render={(props) => <ManagerSettingContainer {...props} />}
              />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ManualMain;