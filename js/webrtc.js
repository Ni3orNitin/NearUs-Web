import {
    database,
    ref,
    set,
    get,
    onValue
}
from "./firebase.js";

let peerConnection;

let localStream;

let remoteStream;

const servers = {

    iceServers:[

        {
            urls:[
                "stun:stun.l.google.com:19302"
            ]
        }

    ]

};

export async function startCall(
    roomId,
    localVideo,
    remoteVideo
){

    localStream =
    await navigator
    .mediaDevices
    .getUserMedia({

        video:true,
        audio:true

    });

    remoteStream =
    new MediaStream();

    localVideo.srcObject =
    localStream;

    remoteVideo.srcObject =
    remoteStream;

    peerConnection =
    new RTCPeerConnection(
        servers
    );

    localStream
    .getTracks()
    .forEach(track=>{

        peerConnection.addTrack(
            track,
            localStream
        );

    });

    peerConnection.ontrack =
    event=>{

        event.streams[0]
        .getTracks()
        .forEach(track=>{

            remoteStream.addTrack(
                track
            );

        });

    };

    const roomRef =
    ref(
        database,
        "calls/" + roomId
    );

    const roomData =
    await get(roomRef);

    if(!roomData.exists()){

        await createOffer(
            roomId
        );

    }

    else{

        await createAnswer(
            roomId
        );

    }

}

async function createOffer(
    roomId
){

    const offer =
    await peerConnection
    .createOffer();

    await peerConnection
    .setLocalDescription(
        offer
    );

    await set(
        ref(
            database,
            "calls/" +
            roomId +
            "/offer"
        ),
        offer
    );

    onValue(

        ref(
            database,
            "calls/" +
            roomId +
            "/answer"
        ),

        async snapshot=>{

            const answer =
            snapshot.val();

            if(
                answer &&
                !peerConnection
                .currentRemoteDescription
            ){

                await peerConnection
                .setRemoteDescription(
                    answer
                );

            }

        }

    );

}

async function createAnswer(
    roomId
){

    const offerSnap =
    await get(

        ref(
            database,
            "calls/" +
            roomId +
            "/offer"
        )

    );

    const offer =
    offerSnap.val();

    await peerConnection
    .setRemoteDescription(
        offer
    );

    const answer =
    await peerConnection
    .createAnswer();

    await peerConnection
    .setLocalDescription(
        answer
    );

    await set(

        ref(
            database,
            "calls/" +
            roomId +
            "/answer"
        ),

        answer

    );

}