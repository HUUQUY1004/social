import React, { useEffect, useRef, useState } from 'react';
import { StringeeClient, StringeeCall } from 'stringee-chat-js-sdk';
import { generateTokenStringee } from '../../action/action';
import { useUser } from '../../store/useStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo, faX } from '@fortawesome/free-solid-svg-icons';
import useOnClickOutside from '../../hook/useOnClickOutSide';

const VideoCall = ({ currentChat , isCallVideo= false, onClose }) => {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const {currentUser} = useUser()

  const ref = useRef()

  useOnClickOutside(ref, ()=> onClose(false))

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
      to: currentChat.id,         // ID người nhận
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
      <div className='h-[300px] w-[300px] bg-white rounded-sm p-4 rounded-sm' ref={ref}>
        <h2 className='text-center font-semibold text-2xl'>{isCallVideo? "Video Call": "Call"}</h2>

        <div className='text-center space-y-10 mt-5'>
          <p>Gọi đến</p>
          <p className='text-2xl font-semibold'>{currentChat?.username}</p>
          <div className='space-x-40'>
            <button className='bg-slate-400 h-10 w-10 rounded-full'>
              <FontAwesomeIcon icon={faX}/>
            </button>
            <button 
            className='h-10 w-10 bg-green-500 rounded-full text-white'
            onClick={makeCall}>
              {
                isCallVideo? 
                <FontAwesomeIcon  icon={faVideo}/>
                :
                <FontAwesomeIcon icon={faPhone}/>
              }
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <video ref={localVideoRef} autoPlay muted style={{ width: 300 }} />
          <video ref={remoteVideoRef} autoPlay style={{ width: 300 }} />
        </div>
      </div>
  );
};

export default VideoCall;
