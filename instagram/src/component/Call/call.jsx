import React, { useEffect, useRef, useState } from 'react';
import { StringeeClient, StringeeCall } from 'stringee-chat-js-sdk';
import { generateTokenStringee } from '../../action/action';
import { useUser } from '../../store/useStore';

const VideoCall = ({ calleeId = 53, isCallVideo= false }) => {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const {currentUser} = useUser()

  useEffect(() => {
    const init = async () => {
      const token = await generateTokenStringee(); // token chứa userId

      const stringeeClient = new StringeeClient();
      stringeeClient.connect(token);

      stringeeClient.on('connect', () => {
        console.log('✅ Connected to Stringee server');
      });

      stringeeClient.on('authen', (res) => {
        console.log('✅ Authenticated:', res);
      });

      stringeeClient.on('incomingcall', function (incomingCall) {
        console.log('📞 Incoming call');
        incomingCall.answer({
          video: true,
          audio: true
        });

        incomingCall.on('addremotestream', (stream) => {
          remoteVideoRef.current.srcObject = stream;
        });

        setCall(incomingCall);
      });

      setClient(stringeeClient);
    };

    init();
  }, []);

  const makeCall = () => {
    const newCall = new StringeeCall(client, {
      from:currentUser.id,       // ID người gọi
      to: calleeId,         // ID người nhận
      isVideoCall: isCallVideo
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

  return (
      <div className='h-[400px] w-[400px] bg-white rounded-sm'>
        <h2>Video Call</h2>
        <button onClick={makeCall}>📞 Gọi đến userB</button>
        <div style={{ display: 'flex', gap: 10 }}>
          <video ref={localVideoRef} autoPlay muted style={{ width: 300 }} />
          <video ref={remoteVideoRef} autoPlay style={{ width: 300 }} />
        </div>
      </div>
  );
};

export default VideoCall;
