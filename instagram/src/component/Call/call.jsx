
import React, { useEffect, useRef, useState } from 'react';
import { StringeeCall, StringeeClient } from 'stringee-chat-js-sdk';
import { useUser } from '../../store/useStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo, faX, faMicrophone, faMicrophoneSlash, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import useOnClickOutside from '../../hook/useOnClickOutSide';
import { useTokenStringee } from '../../store/useToken';
import { getStringeeClient, addStringeeEventListener, isStringeeConnected } from '../../services/stringeeService';
import { createStringeeClient } from '../../config/stringee';

const VideoCall = ({ currentChat, isCallVideo = false, onClose }) => {
  const [call, setCall] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [caller, setCaller] = useState(null);
  const [stringeeClient, setStringeeClient] = useState(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(isCallVideo);
  const [callDuration, setCallDuration] = useState(0);
  
  const { currentUser } = useUser();
  const ref = useRef();
  const { token, isConnected } = useTokenStringee();
  const callRef = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const callTimerRef = useRef();

  useOnClickOutside(ref, () => onClose(false));

  // Initialize Stringee client
  useEffect(() => {
    const initializeClient = async () => {
      try {
        // Try to get existing connected client first
        const existingClient = getStringeeClient();
        if (existingClient && isStringeeConnected()) {
          setStringeeClient(existingClient);
          setIsClientReady(true);
          return;
        }

        // Create new client if none exists or not connected
        const client = createStringeeClient();
        
        // Set up event listeners
        client.on('connect', () => {
          console.log('Stringee client connected for video call');
          setIsClientReady(true);
        });

        client.on('authen', (res) => {
          console.log('Stringee authentication:', res);
          if (res.r === 0) {
            setIsClientReady(true);
          }
        });

        client.on('disconnect', () => {
          console.log('Stringee client disconnected');
          setIsClientReady(false);
        });

        // Handle incoming calls
        client.on('incomingcall', (incomingCall) => {
          console.log('Incoming call:', incomingCall);
          setCall(incomingCall);
          setCaller({ username: incomingCall.fromNumber });
          setIsCalling(true);
          callRef.current = incomingCall;
          setupCallEventListeners(incomingCall);
        });

        setStringeeClient(client);

        // Connect with token
        if (token) {
          client.connect(token);
        }
      } catch (error) {
        console.error('Error initializing Stringee client:', error);
      }
    };

    initializeClient();

    // Cleanup on unmount
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      if (stringeeClient && stringeeClient.disconnect) {
        stringeeClient.disconnect();
      }
    };
  }, [token]);

  // Setup call event listeners
  const setupCallEventListeners = (callInstance) => {
    // Handle local video stream
    callInstance.on('addlocalstream', (stream) => {
      console.log('Local stream added' , stream);
      if (localVideoRef.current && isCallVideo) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true; // Mute local video to prevent echo
      }
    });

    // Handle remote video stream
    callInstance.on('addremotestream', (stream) => {
      console.log('Remote stream added');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    });

    // Handle signaling state changes
    callInstance.on('signalingstate', (state) => {
      console.log('Signaling state:', state);
      switch (state.code) {
        case 3: // Connected
          setIsCallConnected(true);
          startCallTimer();
          break;
        case 6: // Call ended
          endCall();
          break;
        default:
          break;
      }
    });

    // Handle media state changes
    callInstance.on('mediastate', (state) => {
      console.log('Media state:', state);
    });
  };

  // Start call timer
  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  // Format call duration
  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // End call and cleanup
  const endCall = () => {
    setIsCalling(false);
    setIsCallConnected(false);
    setCall(null);
    setCallDuration(0);
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    callRef.current = null;
  };

  const hangupCall = () => {
    if (callRef.current && callRef.current.hangup) {
      callRef.current.hangup((res) => {
        console.log('hangup call callback:', JSON.stringify(res));
        endCall();
      });
    }
  };

  const answerCall = () => {
    if (callRef.current && callRef.current.answer) {
      callRef.current.answer((res) => {
        console.log('Answer call result:', JSON.stringify(res));
        if (res.r === 0) {
          setIsCallConnected(true);
        }
      });
    }
  };

  const rejectCall = () => {
    if (callRef.current && callRef.current.reject) {
      callRef.current.reject((res) => {
        console.log('Reject call result:', JSON.stringify(res));
        endCall();
      });
    }
  };

  const makeCall = () => {
    if (!isClientReady || !stringeeClient) {
      console.error('Stringee client not ready');
      alert('Connection not ready. Please try again.');
      return;
    }

    if (!currentChat || !currentChat.id) {
      console.error('No chat partner selected');
      return;
    }

    try {
      const newCall = new StringeeCall(
        stringeeClient,
        currentUser.stringeeId.substring(0,9),
        currentChat.stringeeId.substring(0,9),
        isCallVideo
      );
      
      setupCallEventListeners(newCall);

      newCall.makeCall((res) => {
        console.log("Make call result:", JSON.stringify(res));
        if (res.r === 0) {
          setIsCalling(true);
          setCall(newCall);
          callRef.current = newCall;
        } else {
          console.error('Failed to make call:', res);
          alert('Failed to make call. Please try again.');
        }
      });
    } catch (error) {
      console.error('Error making call:', error);
      alert('Error making call. Please try again.');
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (callRef.current) {
      if (isMuted) {
        callRef.current.unmute();
      } else {
        callRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  // Toggle video (for video calls)
  const toggleVideo = () => {
    if (callRef.current && isCallVideo) {
      if (isVideoEnabled) {
        callRef.current.turnOffVideo();
      } else {
        callRef.current.turnOnVideo();
      }
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const renderCallContent = () => {
    // Incoming call
    if (isCalling && !isCallConnected && caller) {
      return (
        <div className="mt-3 text-center">
          <p className="mb-4">Incoming {isCallVideo ? 'video' : 'voice'} call from {caller.username}</p>
          <div className="space-x-4">
            <button 
              className="bg-green-500 hover:bg-green-600 h-12 w-12 rounded-full text-white" 
              onClick={answerCall}
            >
              <FontAwesomeIcon icon={faPhone} />
            </button>
            <button 
              className="bg-red-500 hover:bg-red-600 h-12 w-12 rounded-full text-white" 
              onClick={rejectCall}
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </div>
      );
    }

    // Active call
    if (isCalling && isCallConnected) {
      return (
        <div className="mt-3">
          {/* Call duration */}
          <div className="text-center mb-3">
            <p className="font-semibold">
              {call?.to === currentUser.id
                ? `${caller?.username || "Unknown"}`
                : `${currentChat?.username || "Unknown"}`}
            </p>
            <p className="text-sm text-gray-600">{formatCallDuration(callDuration)}</p>
          </div>

          {/* Video streams for video calls */}
          {isCallVideo && (
            <div className="relative mb-4">
              {/* Remote video (main) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                className="w-full h-48 bg-gray-900 rounded object-cover"
              />
              {/* Local video (small overlay) */}
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="absolute top-2 right-2 w-20 h-16 bg-gray-700 rounded border-2 border-white object-cover"
              />
            </div>
          )}

          {/* Voice call indicator */}
          {!isCallVideo && (
            <div className="flex justify-center items-center h-32 bg-gray-100 rounded mb-4">
              <FontAwesomeIcon icon={faPhone} className="text-4xl text-gray-500" />
            </div>
          )}

          {/* Call controls */}
          <div className="flex justify-center space-x-4">
            {/* Mute button */}
            <button 
              className={`h-10 w-10 rounded-full text-white ${
                isMuted ? 'bg-red-500' : 'bg-gray-600'
              }`}
              onClick={toggleMute}
            >
              <FontAwesomeIcon icon={isMuted ? faMicrophoneSlash : faMicrophone} />
            </button>

            {/* Video toggle button (only for video calls) */}
            {isCallVideo && (
              <button 
                className={`h-10 w-10 rounded-full text-white ${
                  !isVideoEnabled ? 'bg-red-500' : 'bg-gray-600'
                }`}
                onClick={toggleVideo}
              >
                <FontAwesomeIcon icon={isVideoEnabled ? faVideo : faVideoSlash} />
              </button>
            )}

            {/* End call button */}
            <button 
              className="bg-red-500 hover:bg-red-600 h-10 w-10 rounded-full text-white" 
              onClick={hangupCall}
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </div>
      );
    }

    // Calling state
    if (isCalling && !isCallConnected) {
      return (
        <div className="mt-3 text-center">
          <p className="mb-4">Calling {currentChat?.username || "Unknown"}...</p>
          <button 
            className="bg-red-500 hover:bg-red-600 px-6 py-2 text-white rounded" 
            onClick={hangupCall}
          >
            Cancel
          </button>
        </div>
      );
    }

    // Initial state - ready to make call
    return (
      <div className="text-center space-y-10 mt-5">
        <p>Call {currentChat?.username}</p>
        {!isClientReady && (
          <p className="text-yellow-600 text-sm">Connecting...</p>
        )}
        <div className="space-x-10">
          <button 
            className="bg-slate-400 h-10 w-10 rounded-full hover:bg-slate-500" 
            onClick={() => onClose(false)}
          >
            <FontAwesomeIcon icon={faX} />
          </button>
          <button
            className={`h-10 w-10 rounded-full text-white ${
              isClientReady ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={makeCall}
            disabled={!isClientReady}
          >
            {isCallVideo ? (
              <FontAwesomeIcon icon={faVideo} />
            ) : (
              <FontAwesomeIcon icon={faPhone} />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`${isCallConnected && isCallVideo ? 'h-[500px] w-[400px]' : 'h-[300px] w-[300px]'} bg-white rounded-sm p-4 transition-all duration-300`} ref={ref}>
      <h2 className="text-center font-semibold text-2xl mb-2">
        {isCallVideo ? 'Video Call' : 'Voice Call'}
      </h2>
      {renderCallContent()}
    </div>
  );
};

export default VideoCall;