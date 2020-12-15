import React from 'react';
import { observer, inject } from 'mobx-react';
import { Modal } from 'antd';
import ModalType from '../../config/ModalType';
import AlertPopup from '../popup/AlertPopup';
import ConfirmPopup from '../popup/ConfirmPopup';
import BlackCustomerPopup from '../popup/BlackCustomerPopup';
import ChatBotHistroyPopup from '../popup/ChatBotHistroyPopup';
import JoinHistoryPopup from '../popup/JoinHistoryPopup';
import ManualTagListPopup from '../popup/ManualTagListPopup';
import MemberStateChangePopup from '../popup/MemberStateChangePopup';
import MinwonAddPopup from '../popup/MinwonAddPopup';
import TalkMovePopup from '../popup/TalkMovePopup';
import TemplateFormPopup from '../popup/TemplateFormPopup';
import MinwonHistoryPopup from '../popup/MinwonHistoryPopup';

@inject('modalStore')
@observer
class ModalContainer extends React.Component {
  render() {
    let modalComponent = null;
    let modalStore = this.props.modalStore;
    let { modalType, modalData, displayModal } = modalStore;
    switch (modalType) {
      case ModalType.JOIN_HISTORY_POPUP:
        modalComponent = <JoinHistoryPopup modalData={modalData} />;
        break;
      case ModalType.MINWON_ADD_POPUP:
        modalComponent = <MinwonAddPopup modalData={modalData} />;
        break;
      case ModalType.TEMPLATE_FORM_POPUP:
        modalComponent = <TemplateFormPopup modalData={modalData} />;
        break;
      case ModalType.MINWON_HISTORY_POPUP:
        modalComponent = <MinwonHistoryPopup modalData={modalData} />;
        break;
      default:
        break;
    }
    return (
      <Modal
        maskClosable={false}
        visible={displayModal}
        footer={null}
        onCancel={() => modalStore.hideModal()}
        className={modalType}
      >
        {modalComponent}
      </Modal>
    );
  }
}

export default ModalContainer;
