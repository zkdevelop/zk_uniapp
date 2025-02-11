// 引入 request 文件
import request from '/utils/request.js'

export function getToken(roomName, userId) {
    return request({
        method: "post",
        url: "/livekit/token",
        data: { roomName: roomName, participantName: userId }
    });
}