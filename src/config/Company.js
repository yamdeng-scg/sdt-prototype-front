import Constant from './Constant';
import _ from 'lodash';

const SeoulCompany = {
  id: Constant.COMPANY_CODE_SEOUL,
  contractPattern: '5-5'
};

const IncheonCompany = {
  id: Constant.COMPANY_CODE_INCHEON,
  contractPattern: '7'
};

const companyList = [SeoulCompany, IncheonCompany];

const getCompanyConfig = function(companyId, configName) {
  let searchIndex = _.findIndex(companyList, info => {
    return info.id === companyId;
  });
  let companyInfo = companyList[searchIndex];
  let configValue = companyInfo[configName];
  return configValue;
};

export default getCompanyConfig;
