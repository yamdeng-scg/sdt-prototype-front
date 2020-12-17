import Constant from './Constant';
import _ from 'lodash';

const Code = {};

// 룸 목록 조회 키워드 유형
Code.roomListSearcTypeCodeList = [
  { name: '고객명', value: 'customerName' },
  { name: '대화내용', value: 'message' },
  { name: '상담사', value: 'empName' }
];

// state: 회원 상태
//  -0 : 정상
//  -1 : 휴식
//  -2 : 회의
//  -3 : 콜집중
//  -5 : 퇴근
//  -9 : 기타

Code.memberStateCodeList = [
  { name: '상담중', value: 0 },
  { name: '휴식중', value: 1 },
  { name: '회의중', value: 2 },
  { name: '콜중', value: 3 },
  { name: '퇴근', value: 5 },
  { name: '기타', value: 9 }
];

// -지정 안됨(헤제) : '' or null
// -욕설 및 비속어 사용 : 욕설 및 비속어 사용
// -업무 외 대화시도 : 업무 외 대화시도
// -모든 업무에 불만 : 모든 업무에 불만
// -같은 내용 지속적 반복 : 같은 내용 지속적 반복
// -과도한 의심 : 과도한 의심
// -무리한 업무진행 요구 : 무리한 업무진행 요구
// -사장 및 상급자 찾음 : 사장 및 상급자 찾음
// -신고협박 : 신고협박
Code.blockTypeCodeList = [
  { name: '지정 안됨(헤제)', value: '' },
  { name: '욕설 및 비속어 사용', value: '욕설 및 비속어 사용' },
  { name: '업무 외 대화시도', value: '업무 외 대화시도' },
  { name: '모든 업무에 불만', value: '모든 업무에 불만' },
  { name: '같은 내용 지속적 반복', value: '같은 내용 지속적 반복' },
  { name: '과도한 의심', value: '과도한 의심' },
  { name: '무리한 업무진행 요구', value: '무리한 업무진행 요구' },
  { name: '사장 및 상급자 찾음', value: '사장 및 상급자 찾음' },
  { name: '신고협박', value: '신고협박' }
];

Code.templateSearchCodeList = [
  { name: '전체', value: '' },
  { name: '등록자', value: 'memberName' },
  { name: '질문', value: 'ask' },
  { name: '답변', value: 'reply' },
  { name: '키워드', value: 'keyword' }
];

Code.getCodeNameByValue = function(codeCategory, codeValue) {
  let codeName = null;
  let codeList = Code[codeCategory] || [];
  let searchIndex = _.findIndex(codeList, codeInfo => {
    if (codeValue === codeInfo.value) {
      return true;
    } else {
      return false;
    }
  });
  if (searchIndex !== -1) {
    let findCodeInfo = codeList[searchIndex];
    codeName = findCodeInfo.name;
  }
  return codeName;
};

export default Code;
