import Constant from './Constant';

const Config = {};

// ajax timeout
Config.apiCallTimeout = 300000;

// 메시지 날짜 foramt
Config.defaultDateDisplayFormat = 'YYYY년 MM월 DD일';

// 빈값일 경우 보여주는 문자
Config.defaultEmptyValue = '-';

// 기본 CompanyCode
Config.defaultCompany = Constant.COMPANY_CODE_SEOUL;

// 웹 버전
Config.version = '3.2.0';

// QA 버전
Config.qaVersion = '33';

// Helper.scrollTopByDivId 애니메이션 기준 timeout
Config.scrollAnimationTimeout = 500;

// 기본 결제 유형
Config.defaultPayType = Constant.PAY_TYPE_CARD;

// 기본 페이징 목록 사이즈
Config.defaultPageSize = 10;
Config.displayMaxPageCount = 5;

Config.defaultFileUploadSize = 5242880;

export default Config;
