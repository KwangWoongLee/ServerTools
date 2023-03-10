import LoginModal from 'components/modal/Login';
import UserSelectModal from 'components/modal/UserSelect';
import ItemSelectModal from 'components/modal/ItemSelect';
import FileUploadModal from 'components/modal/FileUpload';

import ConfirmModal from 'components/common/Confirm';
import AlertModal from 'components/common/Alert';
import Spinner from 'components/common/Spinner'; // 제일끝에 둔다.
const Modals = () => {
  return (
    <>
      <FileUploadModal />
      <ItemSelectModal />
      <UserSelectModal />
      <LoginModal />
      <ConfirmModal />
      <AlertModal />
      <Spinner />
    </>
  );
};

export default Modals;
