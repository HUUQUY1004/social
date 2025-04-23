import React, { useEffect, useRef, useState } from 'react';
import { StringeeClient, StringeeCall } from 'stringee-chat-js-sdk';
import { generateTokenStringee } from '../../action/action';
import { useUser } from '../../store/useStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo, faX } from '@fortawesome/free-solid-svg-icons';
import useOnClickOutside from '../../hook/useOnClickOutSide';

const VideoCall = ({ currentChat, isCallVideo = false, onClose }) => {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [hasIncomingCall, setHasIncomingCall] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const { currentUser } = useUser();
  const ref = useRef();

  useOnClickOutside(ref, () => onClose(false));

  useEffect(() => {
    const init = async () => {
      const token = await generateTokenStringee(); // token chứa userId
      console.log(token);

      const stringeeClient = new StringeeClient([
        'wss://v1.stringee.com:6899/',
        'wss://v2.stringee.com:6899/',
      ]);
      stringeeClient.connect(token);

      stringeeClient.on('connect', () => {
        console.log('✅ Connected to Stringee server');
      });

      stringeeClient.on('authen', (res) => {
        console.log('✅ Authenticated:', res);
      });

      stringeeClient.on('incomingcall', (incomingCall) => {
        if (incomingCall.fromAlias !== currentUser.id) {
          return;
        }

        console.log('📞 Incoming call from:', incomingCall.from);

        setCall(incomingCall);
        setHasIncomingCall(true);

        incomingCall.on('addremotestream', (stream) => {
          remoteVideoRef.current.srcObject = stream;
        });

        incomingCall.on('addlocalstream', (stream) => {
          localVideoRef.current.srcObject = stream;
        });
      });

      setClient(stringeeClient);
    };

    init();
  }, []);

  const makeCall = () => {
    console.log('Making call');
    setIsCalling(true);

    const newCall = new StringeeCall(client, {
      from: currentUser.id, // Caller ID
      to: currentChat.id,    // Receiver ID
      isVideoCall: isCallVideo,
    });

    newCall.makeCall();

    newCall.on('addlocalstream', (stream) => {
      localVideoRef.current.srcObject = stream;
    });

    newCall.on('addremotestream', (stream) => {
      remoteVideoRef.current.srcObject = stream;
    });

    setCall(newCall);
  };

  const acceptCall = () => {
    if (call) {
      call.answer({ video: isCallVideo, audio: true });
      setIsCalling(true);
      setHasIncomingCall(false);
    }
  };

  const rejectCall = () => {
    if (call) {
      call.reject();
      setHasIncomingCall(false);
      setCall(null);
    }
  };

  const hangupCall = () => {
    if (call) {
      call.hangup();
      setIsCalling(false);
      setCall(null);
    }
  };

  const upgradeToVideoCall = () => {
    if (call) {
      call.upgradeToVideoCall();
      setIsCalling(true);
    }
  };

  return (
    <div className="h-[300px] w-[300px] bg-white rounded-sm p-4 rounded-sm" ref={ref}>
      <h2 className="text-center font-semibold text-2xl">
        {isCallVideo ? 'Video Call' : 'Voice Call'}
      </h2>

      <div className="text-center space-y-10 mt-5">
        <p>Calling to</p>
        <p className="text-2xl font-semibold">{currentChat?.username}</p>

        <div className="space-x-40">
          <button className="bg-slate-400 h-10 w-10 rounded-full" onClick={() => onClose(false)}>
            <FontAwesomeIcon icon={faX} />
          </button>
          <button
            className="h-10 w-10 bg-green-500 rounded-full text-white"
            onClick={makeCall}
          >
            {isCallVideo ? <FontAwesomeIcon icon={faVideo} /> : <FontAwesomeIcon icon={faPhone} />}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <video ref={localVideoRef} autoPlay muted style={{ width: 300 }} />
        <video ref={remoteVideoRef} autoPlay style={{ width: 300 }} />
      </div>

      {hasIncomingCall && (
        <div className="fixed top-20 right-20 bg-white shadow p-4 rounded-md z-50">
          <p className="text-xl font-semibold mb-4">
            📞 {currentChat.username} is calling you
          </p>
          <div className="space-x-4 flex justify-center">
            <button onClick={acceptCall} className="bg-green-500 px-4 py-2 text-white rounded">
              Accept
            </button>
            <button onClick={rejectCall} className="bg-red-500 px-4 py-2 text-white rounded">
              Reject
            </button>
          </div>
        </div>
      )}

      {isCalling && (
        <div className="mt-3">
          <p>
            Calling <strong>{currentChat.username}</strong>
          </p>
          <button className="btn btn-danger" onClick={hangupCall}>
            End Call
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
