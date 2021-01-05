class SocketService {
  sendMessage(socket, messageInfo) {
    socket.send(
      '/pub/socket/message', // 메시지 발송URI
      {}, // 전송할 헤더
      JSON.stringify({
        eventName: 'MESSAGE',
        data: messageInfo
      }) // 전송할 데이터
    );
  }

  saveHistory(socket, roomId, historyJson) {
    socket.send(
      '/pub/socket/message', // 메시지 발송URI
      {}, // 전송할 헤더
      JSON.stringify({
        roomId: roomId,
        eventName: 'SAVE_HISTORY',
        data: { history: historyJson }
      }) // 전송할 데이터
    );
  }

  deleteMessage(socket, messageId, roomId) {
    socket.send(
      '/pub/socket/message', // 메시지 발송URI
      {}, // 전송할 헤더
      JSON.stringify({
        roomId: roomId,
        eventName: 'DELETE_MESSAGE',
        data: { id: messageId }
      }) // 전송할 데이터
    );
  }

  readMessage(socket, roomId, speakerId, startId, endId) {
    socket.send(
      '/pub/socket/message', // 메시지 발송URI
      {}, // 전송할 헤더
      JSON.stringify({
        eventName: 'READ_MESSAGE',
        roomId: roomId,
        data: {
          endId: endId,
          startId: startId,
          speakerId: speakerId,
          roomId: roomId
        }
      }) // 전송할 데이터
    );
  }

  moreMessage(socket, roomId, startId) {
    socket.send(
      '/pub/socket/message', // 메시지 발송URI
      {}, // 전송할 헤더
      JSON.stringify({
        eventName: 'MESSAGE_LIST',
        roomId: roomId,
        data: {
          startId: startId
        }
      }) // 전송할 데이터
    );
  }

  review(socket, reviewScore) {
    socket.send(
      '/pub/socket/message', // 메시지 발송URI
      {}, // 전송할 헤더
      JSON.stringify({
        eventName: 'REVIEW',
        data: {
          reviewScore: reviewScore
        }
      }) // 전송할 데이터
    );
  }

  end(socket, roomId) {
    socket.send(
      '/pub/socket/message', // 메시지 발송URI
      {}, // 전송할 헤더
      JSON.stringify({
        eventName: 'END',
        roomId: roomId,
        data: {}
      }) // 전송할 데이터
    );
  }
}

export default new SocketService();
