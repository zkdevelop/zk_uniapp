import { defineStore } from "pinia";
import { ref } from "vue";
import { getToken } from "@/utils/api/meeting";
// import useUserStore from "./user";
// import useWSStore from "./ws";
import {
    Room,
    RoomEvent,
    Track,
    VideoPresets,
} from 'livekit-client';
import { LIVEKITURL } from "@/config.js";
import { useUserStore } from '@/store/userStore'
import { useWebSocket } from "@/pages/WebSocket/WebSocketService.vue"

export const useMeetingStore = defineStore("meeting", () => {
    const showMeetingDialog = ref(false); // 通话弹窗的显示与隐藏
    const userStore = useUserStore();
		const webSocket = useWebSocket();
    const currentVideoRef = ref();
    const remoteVideoRef = ref();
    const currentAudioRef = ref();
    const remoteAudioRef = ref();
    let room = ref(null);

    // let participants = ref([]);
    let token = '';
    let isCaller = ref(true); // 是否为主叫方
    let callerId = ref(""); //主叫方id
		let callerName = ref(""); //主叫方名称
    let isAnswered = ref(false); // 是否已接听
    let isGroup = ref(false); // 是否为群组通话
    let isVideoCall = ref(false); // 是否为视频通话

    async function createRoom(status) {
        const { roomType } = status;
        isVideoCall.value = roomType === 'video';
        // creates a new room with options
        room.value = new Room({
            // automatically manage subscribed video quality
            adaptiveStream: true,

            // optimize publishing bandwidth and CPU for published tracks
            dynacast: true,

            // default capture settings
            videoCaptureDefaults: {
                resolution: VideoPresets.h720.resolution,
            },
        });

        // pre-warm connection, this can be called as early as your page is loaded
        const roomName = crypto.randomUUID();
        const res = await getToken(roomName, userStore.userInfo.id);
        // meetingTokens.value[roomName] = res.token;
        token = res.token;
        room.value.prepareConnection(LIVEKITURL, token);

        // set up event listeners
        room.value
            .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
            .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
            .on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange)
            .on(RoomEvent.Disconnected, handleDisconnect)
            .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);

        // connect to room
        await room.value.connect(LIVEKITURL, token);

        // publish本地音视频流
        await room.value.localParticipant.setMicrophoneEnabled(true);
        await room.value.localParticipant.setCameraEnabled(isVideoCall.value);
    }

    function informParticipant(participant) {
        if (participant !== userStore.userInfo.id) {
            const message = JSON.stringify({
                type: 'room-created',
                sender: userStore.userInfo.id,
                receiver: participant,
                roomId: room.value.name,
                roomType: isVideoCall.value ? 'video' : 'audio'
            });
            webSocket.sendMessage(message);
        }
    }

    async function joinRoom(status) {
        const { roomName, roomType } = status;
        isVideoCall.value = roomType === 'video';
        console.log('join room', status);
        // creates a new room with options
        room.value = new Room({
            // 自动调整订阅的视频质量
            adaptiveStream: true,

            // 优化发布的音视频流的带宽和CPU
            dynacast: true,

            // 默认的音视频流设置
            videoCaptureDefaults: {
                resolution: VideoPresets.h720.resolution,
            },
        });

        // pre-warm connection, this can be called as early as your page is loaded
        const res = await getToken(roomName, userStore.userInfo.id);
        token = res.token;
        room.value.prepareConnection(LIVEKITURL, token);

        // set up event listeners
        room.value
            .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
            .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
            .on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange)
            .on(RoomEvent.Disconnected, handleDisconnect)
            .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);

        // connect to room
        await room.value.connect(LIVEKITURL, token);

        // publish本地音视频流
        // await room.value.localParticipant.enableCameraAndMicrophone();
        await room.value.localParticipant.setMicrophoneEnabled(true);
        await room.value.localParticipant.setCameraEnabled(isVideoCall.value);

        // room.value.remoteParticipants.forEach((participant) => {
            // participantConnected(participant);
            // console.log(participant, 'joinroom-participant');
        // });
    }

    // 获取远程音视频流
    function handleTrackSubscribed(
        track,
        publication,
        participant,
    ) {
        // console.log(track, 'handle track subscribed');
        const cameraPub = participant.getTrackPublication(Track.Source.Camera);
        const micPub = participant.getTrackPublication(Track.Source.Microphone);
        cameraPub?.videoTrack?.attach(remoteVideoRef.value);
        // console.log('track subscribed', participant);
    }

    function handleTrackUnsubscribed(
        track,
        publication,
        participant,
    ) {
        // remove tracks from all attached elements
        track.detach();
    }

    function handleLocalTrackUnpublished(
        publication,
        participant,
    ) {
        // when local tracks are ended, update UI to remove them from rendering
        publication.track.detach();
    }

    function handleActiveSpeakerChange(speakers) {
        // show UI indicators when participant is speaking
    }

    function handleDisconnect() {
        console.log('disconnected from room');
    }

    async function callRemote(target) {
        console.log('call remote', target);
        // 判断是否为群组通话
        if (target.isGroup) {
            isGroup.value = true;
            for (let member of target.members) {
                // 为自身id时不发送通话请求
                if (member.id === userStore.userInfo.id) {
                    continue;
                }
                const message = JSON.stringify({
                    type: 'call-remote',
                    sender: userStore.userInfo.id,
                    receiver: member.id,
                    isGroup: true,
                    roomType: isVideoCall.value ? 'video' : 'audio'
                });
                webSocket.sendMessage(message);
            }
        } else {
            isGroup.value = false;
            const message = JSON.stringify({
                type: 'call-remote',
                sender: userStore.userInfo.id,
                receiver: target.id,
                isGroup: false,
                roomType: isVideoCall.value ? 'video' : 'audio'
            });
            // console.log('call remote', message);
            webSocket.sendMessage(message);
        }
    }

    function acceptVideoCall() {
        // 接听通话
        const message = JSON.stringify({
            type: 'answer-call',
            sender: userStore.state.id,
            receiver: callerId.value,
            reply: 'accept'
        })
        webSocket.sendMessage(message);
        isAnswered.value = true;
    }

    function rejectVideoCall() {
        if (isCaller.value) {
            // 主叫方挂断

        } else {
            // 被叫方挂断
            isAnswered.value = false;
            const message = JSON.stringify({
                type: 'answer-call',
                sender: userStore.userInfo.id,
                receiver: callerId.value,
                reply: 'reject'
            });
            webSocket.sendMessage(message);
        }
        // 关闭通话弹窗
        showMeetingDialog.value = false;
    }

    function leaveRoom() {
        if (room.value) {
            room.value.disconnect();
        }
        console.log('leave room', room.value.name);
        const message = JSON.stringify({
            type: 'leave-room',
            sender: userStore.userInfo.id,
            roomId: room.value.name
        });
        webSocket.sendMessage(message);
    }

    return {
        showMeetingDialog,
        currentVideoRef,
        remoteVideoRef,
        currentAudioRef,
        remoteAudioRef,
        room,
        isCaller,
        isAnswered,
        callerId,
				callerName,
        isGroup,
        isVideoCall,
        createRoom,
        informParticipant,
        joinRoom,
        callRemote,
        acceptVideoCall,
        rejectVideoCall,
        leaveRoom
    };
});