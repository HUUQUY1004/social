import React, { useEffect, useRef, useState } from 'react';
import { StringeeCall } from 'stringee-chat-js-sdk';
import { useUser } from '../../store/useStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo, faX } from '@fortawesome/free-solid-svg-icons';
import useOnClickOutside from '../../hook/useOnClickOutSide';
import { useTokenStringee } from '../../store/useToken';
import { getStringeeClient, addStringeeEventListener, isStringeeConnected } from '../../services/stringeeService';

const VideoCall = ({ currentChat, isCallVideo = false, onClose }) => {
  const [call, setCall] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [hasIncomingCall, setHasIncomingCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [connectError, setConnectError] = useState(null);
  const [localConnected, setLocalConnected] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const { currentUser } = useUser();
  const ref = useRef();
  const { isConnected } = useTokenStringee();
  
  useOnClickOutside(ref, () => onClose(false));

  useEffect(() => {
    // Get the existing Stringee client
    const stringeeClient = getStringeeClient();
    
    if (!stringeeClient) {
      setConnectError("Stringee client not initialized. Please try again.");
      return;
    }
    
    // Set up local connection status tracking
    setLocalConnected(isStringeeConnected());
    
    // Setup call event listeners
    const setupCallListeners = (callObj) => {
      callObj.on('error', (error) => {
        console.error('❌ Call error:', error);
        setIsCalling(false);
      });
  
      callObj.on('signalingstate', (state) => {
        console.log('📶 Call signaling state:', state.code, state.reason);
        
        // Call ended or rejected states
        if (state.code === 6 || state.code === 5) {
          setIsCalling(false);
          setCall(null);
        }
        
        // Call answered
        if (state.code === 3) {
          setIsCalling(true);
          setHasIncomingCall(false);
        }
      });
  
      callObj.on('mediastate', (state) => {
        console.log('📱 Media state:', state.code, state.reason);
      });
  
      callObj.on('addlocalstream', (stream) => {
        console.log('🎥 Local stream added');
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      });
  
      callObj.on('addremotestream', (stream) => {
        console.log('🎥 Remote stream added');
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });
    };
    
    // Handle connection events
    const connectHandler = () => {
      console.log('✅ Connected to Stringee server from VideoCall component');
      setLocalConnected(true);
      setConnectError(null);
    };
    
    const authenHandler = (res) => {
      console.log('Authentication response in VideoCall:', res);
      if (res.r !== 0) {
        setConnectError(`Authentication failed: ${res.message}`);
        setLocalConnected(false);
      } else {
        setLocalConnected(true);
      }
    };
    
    const errorHandler = (error) => {
      console.error('Stringee client error in VideoCall:', error);
      setConnectError(`Connection error: ${error}`);
      setLocalConnected(false);
    };
    
    // Handle incoming calls
    const incomingCallHandler = (incomingCall) => {
      console.log('📞 Incoming call in VideoCall component:', incomingCall);
      
      // Get caller info from customData if available
      try {
        const customData = JSON.parse(incomingCall.customData);
        setCaller({
          username: customData.from_username || "Unknown"
        });
      } catch (error) {
        setCaller({ username: "Unknown" });
      }
      
      setCall(incomingCall);
      setHasIncomingCall(true);
      
      // Set up call event listeners
      setupCallListeners(incomingCall);
    };
    
    const otherDeviceAuthenHandler = () => {
      console.warn('⚠️ Logged in from another device.');
      alert('Bạn đã đăng nhập ở thiết bị khác. Phiên làm việc này sẽ kết thúc.');
      onClose(false);
    };
    
    // Register all event listeners
    const removeConnectListener = addStringeeEventListener('connect', connectHandler);
    const removeAuthenListener = addStringeeEventListener('authen', authenHandler);
    const removeErrorListener = addStringeeEventListener('error', errorHandler);
    const removeIncomingCallListener = addStringeeEventListener('incomingcall', incomingCallHandler);
    const removeOtherDeviceAuthenListener = addStringeeEventListener('otherdeviceauthen', otherDeviceAuthenHandler);
    
    // Cleanup
    return () => {
      if (call && isCalling) {
        call.hangup();
      }
      
      removeConnectListener();
      removeAuthenListener();
      removeErrorListener();
      removeIncomingCallListener();
      removeOtherDeviceAuthenListener();
    };
  }, []);
  
  console.log("Connection status - Global:", isConnected, "Local:", localConnected);
  
  const makeCall = () => {
    const stringeeClient = getStringeeClient();
    
    if (!stringeeClient || !isStringeeConnected()) {
      alert('Đang kết nối đến máy chủ. Vui lòng thử lại sau.');
      return;
    }

    console.log('Making call from:', currentUser.id, 'to:', currentChat.id);
    setIsCalling(true);

    const fromId = String(currentUser.id);
    const toId = String(currentChat.id);
    
    console.log(`Making call with fromId=${fromId}, toId=${toId}, isVideoCall=${isCallVideo}`);

    const newCall = new StringeeCall(stringeeClient, {
      from: fromId,
      to: toId,
      isVideoCall: isCallVideo,
      customData: JSON.stringify({
        from_username: currentUser.username,
      })
    });

    // Set up call listeners
    newCall.on('error', (error) => {
      console.error('❌ Call error:', error);
      setIsCalling(false);
    });

    newCall.on('signalingstate', (state) => {
      console.log('📶 Call signaling state:', state.code, state.reason);
      
      // Call ended or rejected states
      if (state.code === 6 || state.code === 5) {
        setIsCalling(false);
        setCall(null);
      }
      
      // Call answered
      if (state.code === 3) {
        setIsCalling(true);
        setHasIncomingCall(false);
      }
    });

    newCall.on('mediastate', (state) => {
      console.log('📱 Media state:', state.code, state.reason);
    });

    newCall.on('addlocalstream', (stream) => {
      console.log('🎥 Local stream added');
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    });

    newCall.on('addremotestream', (stream) => {
      console.log('🎥 Remote stream added');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    });

    newCall.makeCall((res) => {
      console.log('Make call response:', res);
      if (res.r !== 0) {
        console.error('Make call failed:', res.message);
        alert(`Không thể gọi: ${res.message}`);
        setIsCalling(false);
      }
    });
    
    setCall(newCall);
  };

  const acceptCall = () => {
    if (call) {
      call.answer({ video: isCallVideo, audio: true }, (res) => {
        console.log('Answer call response:', res);
        if (res.r !== 0) {
          console.error('Answer call failed:', res.message);
          alert(`Không thể trả lời cuộc gọi: ${res.message}`);
          setHasIncomingCall(false);
        }
      });
      setIsCalling(true);
      setHasIncomingCall(false);
    }
  };

  const rejectCall = () => {
    if (call) {
      call.reject((res) => {
        console.log('Reject call response:', res);
      });
      setHasIncomingCall(false);
      setCall(null);
    }
  };

  const hangupCall = () => {
    if (call) {
      call.hangup((res) => {
        console.log('Hangup call response:', res);
      });
      setIsCalling(false);
      setCall(null);
    }
  };

  const renderCallContent = () => {
    if (connectError) {
      return (
        <div className="text-center mt-5">
          <p className="text-red-500">{connectError}</p>
          <button className="bg-blue-500 px-4 py-2 text-white rounded mt-2" onClick={() => onClose(false)}>
            Close
          </button>
        </div>
      );
    }
    
    if (!isConnected && !localConnected) {
      return (
        <div className="text-center mt-5">
          <p>Connecting to Stringee server...</p>
          <div className="mt-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      );
    }

    if (hasIncomingCall) {
      return (
        <div className="text-center mt-5">
          <p className="text-xl font-semibold mb-4">
            📞 {caller?.username || "Someone"} is calling you
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
      );
    }

    if (isCalling) {
      return (
        <div className="mt-3 text-center">
          <p>
            {call?.to === currentUser.id
              ? `In call with ${caller?.username || "Unknown"}`
              : `Calling ${currentChat?.username || "Unknown"}`}
          </p>
          <button className="bg-red-500 px-4 py-2 text-white rounded mt-2" onClick={hangupCall}>
            End Call
          </button>
        </div>
      );
    }

    return (
      <div className="text-center space-y-10 mt-5">
        <p>Call {currentChat?.username}</p>
        <div className="space-x-10">
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
    );
  };

  return (
    <div className="h-[300px] w-[300px] bg-white rounded-sm p-4" ref={ref}>
      <h2 className="text-center font-semibold text-2xl">
        {isCallVideo ? 'Video Call' : 'Voice Call'}
      </h2>

      {renderCallContent()}

      <div className={`flex justify-center gap-2 mt-3 ${(!isCalling || (!isCallVideo && !hasIncomingCall)) ? 'hidden' : ''}`}>
        <video ref={localVideoRef} autoPlay muted style={{ width: 140, height: 100 }} className="rounded" />
        <video ref={remoteVideoRef} autoPlay style={{ width: 140, height: 100 }} className="rounded" />
      </div>
    </div>
  );
};

export default VideoCall;