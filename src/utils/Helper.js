import Config from '../config/Config';
import Constant from '../config/Constant';
import moment from 'moment';
import _ from 'lodash';

// 값이 undefined, null, '' 일 경우 기본값 정보
function convertEmptyValue(value) {
  if (value === undefined || value === null || value === '') {
    return Config.defaultEmptyValue;
  } else {
    return value;
  }
}

// os 클립보드에 textarea에 저장된 정보 복사
function copyToClipboard(id) {
  let textArea = document.getElementById(id);
  if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    let range, selection;
    range = document.createRange();
    range.selectNodeContents(textArea);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    textArea.setSelectionRange(0, 999999);
  } else {
    textArea.select();
  }
  document.execCommand('copy');
  alert('복사되었습니다');
}

// 로컬스토리지에 정보 save
function saveInfoToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// 로컬스토리지에 정보 get
function getInfoByLocalStorage(key) {
  let jsonString = localStorage.getItem(key);
  if (jsonString) {
    return JSON.parse(jsonString);
  } else {
    return null;
  }
}

// 로컬스토리지에 정보 remove
function removeInfoByLocalStorage(key) {
  localStorage.removeItem(key);
}

// 브라우저 타이틀 변경
function changeDocumentTitle(title) {
  document.title = title;
}

// 날짜 display 정보 변환
function convertDateToString(value, valueFormat, displayFormat) {
  if (value) {
    return moment(value, valueFormat).format(
      displayFormat || Config.defaultDateDisplayFormat
    );
  } else {
    return '';
  }
}

// 스크롤 하단으로 이동
function scrollBottomByDivId(divId, timeout) {
  let divElement = document.getElementById(divId);
  if ($('#' + divId)) {
    $('#' + divId)
      .stop()
      .animate(
        { scrollTop: divElement.scrollHeight },
        timeout || Config.scrollTopAnimationTimeout
      );
  }
}

// 스크롤 상단으로 이동
function scrollTopByDivId(divId, scrollTopPosition, timeout) {
  setTimeout(() => {
    if ($('#' + divId)) {
      $('#' + divId)
        .stop()
        .animate({ scrollTop: scrollTopPosition });
    }
  }, timeout || Config.scrollTopAnimationTimeout);
}

// 스크롤 왼쪽으로 이동
function scrollLeftByDivId(divId, scrollLeftPosition, timeout) {
  setTimeout(() => {
    if ($('#' + divId)) {
      $('#' + divId)
        .stop()
        .animate({ scrollLeft: scrollLeftPosition });
    }
  }, timeout || Config.scrollTopAnimationTimeout);
}

// 첫번째 글자 대문자로 변경
function capitalizeFirstLetter(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// 변수가 숫자인지 체크
function isNumber(value) {
  let success = false;
  if (value !== null && value !== '' && !isNaN(value)) {
    success = true;
  }
  return success;
}

// 모바일 청구서 코드의 title 정보 추출
function getBillSendMethodTitle(billSendMethodCodeValue) {
  let billSendMethodTitle = '';
  if (billSendMethodCodeValue === Constant.BILL_SEND_METHOD_PAPER) {
    billSendMethodTitle = '종이';
  } else if (billSendMethodCodeValue === Constant.BILL_SEND_METHOD_EMAIL) {
    billSendMethodTitle = '이메일';
  } else if (billSendMethodCodeValue === Constant.BILL_SEND_METHOD_LMS) {
    billSendMethodTitle = '문자';
  } else if (billSendMethodCodeValue === Constant.BILL_SEND_METHOD_MOBILE) {
    billSendMethodTitle = '모바일';
  } else if (billSendMethodCodeValue === Constant.BILL_SEND_METHOD_ALARMTALK) {
    billSendMethodTitle = '카카오 알림톡';
  } else if (billSendMethodCodeValue === Constant.BILL_SEND_METHOD_KAKAOPAY) {
    billSendMethodTitle = '카카오페이';
  }
  return billSendMethodTitle;
}

// 오늘인지 체크
function checkIsToady(value, valueFormat) {
  if (value) {
    return moment(value, valueFormat).isSame(moment(), 'day');
  } else {
    return false;
  }
}

// 이미지 파일 업로드 확장자 체크
const checkImageFileUploadExtension = function(fileObject) {
  const imageExtensionList = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
  let fileName = fileObject.name;
  let fileExtenstion = '';
  let searchIndex = fileName.lastIndexOf('.');
  if (searchIndex !== -1) {
    fileExtenstion = fileName
      .substr(fileName.lastIndexOf('.') + 1)
      .toLowerCase();
    let extensionSearchIndex = _.findIndex(imageExtensionList, info => {
      return info === fileExtenstion;
    });
    if (extensionSearchIndex !== -1) {
      return true;
    }
  }
  return false;
};

// 오늘 날짜 정보
const getTodayString = function() {
  let todayString = '';
  todayString = moment().format('YYYY-MM-DD');
  return todayString;
};

// 초를 문자열로 변환
const convertStringBySecond = function(diffSecond) {
  let timeString = '00';
  let minuteString = '00';
  let secondString = '00';
  let time = Math.floor(diffSecond / 3600);
  let minute = 0;
  let second = 0;
  if (!diffSecond) {
    return '';
  }
  if (time !== 0) {
    minute = Math.floor((diffSecond % 3600) / 60);
  } else {
    minute = Math.floor(diffSecond / 60);
  }
  second = Math.floor(diffSecond % 60);
  if (time !== 0) {
    if (time < 10) {
      timeString = '0' + time;
    } else {
      timeString = time;
    }
  }
  if (minute !== 0) {
    if (minute < 10) {
      minuteString = '0' + minute;
    } else {
      minuteString = minute;
    }
  }
  if (second !== 0) {
    if (second < 10) {
      secondString = '0' + second;
    } else {
      secondString = second;
    }
  }
  return timeString + ':' + minuteString + ':' + secondString;
};

const convertMessageDateToString = function(createDate) {
  let isToday = moment(createDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isSame(
    moment(),
    'day'
  );
  if (isToday) {
    return moment(createDate).format('LTS');
  } else {
    return moment(createDate).format('MM/DD HH:mm');
  }
};

const Helper = {
  convertEmptyValue: convertEmptyValue,
  copyToClipboard: copyToClipboard,
  saveInfoToLocalStorage: saveInfoToLocalStorage,
  getInfoByLocalStorage: getInfoByLocalStorage,
  removeInfoByLocalStorage: removeInfoByLocalStorage,
  changeDocumentTitle: changeDocumentTitle,
  convertDateToString: convertDateToString,
  scrollTopByDivId: scrollTopByDivId,
  scrollLeftByDivId: scrollLeftByDivId,
  scrollBottomByDivId: scrollBottomByDivId,
  capitalizeFirstLetter: capitalizeFirstLetter,
  isNumber: isNumber,
  getBillSendMethodTitle: getBillSendMethodTitle,
  checkIsToady: checkIsToady,
  checkImageFileUploadExtension: checkImageFileUploadExtension,
  getTodayString: getTodayString,
  convertStringBySecond: convertStringBySecond,
  convertMessageDateToString: convertMessageDateToString
};

export default Helper;
