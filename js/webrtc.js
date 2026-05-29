import {
    database,
    ref,
    set,
    get,
    push,
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
    await navigator.mediaDevices.getUserMedia({

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
    .forEach(track => {

        peerConnection.addTrack(
            track,
            localStream
        );

    });

    peerConnection.ontrack =
    event => {

        event.streams[0]
        .getTracks()
        .forEach(track => {

            remoteStream.addTrack(
                track
            );

        });

    };



    /* ICE */

    peerConnection.onicecandidate =
    async event => {

        if(event.candidate){

            await push(

                ref(
                    database,
                    "rooms/" +
                    roomId +
                    "/candidates"
                ),

                JSON.stringify(
                    event.candidate
                )

            );

        }

    };



    const roomRef =
    ref(
        database,
        "rooms/" + roomId
    );

    const roomSnapshot =
    await get(roomRef);



    if(!roomSnapshot.exists()){

        await createRoom(roomId);

    }

    else{

        await joinRoom(roomId);

    }

}

async function createRoom(roomId){

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
            "rooms/" +
            roomId +
            "/offer"
        ),

        JSON.stringify(
            offer
        )

    );



    onValue(

        ref(
            database,
            "rooms/" +
            roomId +
            "/answer"
        ),

        async snapshot => {

            const data =
            snapshot.val();

            if(!data) return;

            if(
                peerConnection
                .currentRemoteDescription
            ) return;

            await peerConnection
            .setRemoteDescription(

                new RTCSessionDescription(
                    JSON.parse(data)
                )

            );

        }

    );

}

async function joinRoom(roomId){

    const offerSnapshot =
    await get(

        ref(
            database,
            "rooms/" +
            roomId +
            "/offer"
        )

    );

    const offer =
    JSON.parse(
        offerSnapshot.val()
    );



    await peerConnection
    .setRemoteDescription(

        new RTCSessionDescription(
            offer
        )

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
            "rooms/" +
            roomId +
            "/answer"
        ),

        JSON.stringify(
            answer
        )

    );

}