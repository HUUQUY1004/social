import React, { useRef } from 'react';
import { StringeeClient, StringeeCall } from 'stringee-chat-js-sdk';
import { generateTokenStringee } from '../../action/action';

const VideoCall = ({ calleeId = 53 }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const startCall = async () => {
    const token = await generateTokenStringee();

    const client = new StringeeClient();
    client.connect(token);

    client.on('authen', () => {
      const call = new StringeeCall(client, client.userId, calleeId, true);

      call.on('addlocalstream', (stream) => {
        localVideoRef.current.srcObject = stream;
      });

      call.on('addremotestream', (stream) => {
        remoteVideoRef.current.srcObject = stream;
      });

      call.makeCall((res) => {
        console.log('📞 Calling:', res);
      });
    });
  };

  return (
    <div>
      <button onClick={startCall}>Gọi video</button>
      <video ref={localVideoRef} autoPlay muted playsInline />
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
};

export default VideoCall;
