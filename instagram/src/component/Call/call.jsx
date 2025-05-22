import React, { useEffect, useRef, useState } from 'react';
import { StringeeCall, StringeeClient } from 'stringee-chat-js-sdk';
import { useUser } from '../../store/useStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faVideo, faX } from '@fortawesome/free-solid-svg-icons';
import useOnClickOutside from '../../hook/useOnClickOutSide';
import { useTokenStringee } from '../../store/useToken';
import { getStringeeClient, addStringeeEventListener, isStringeeConnected } from '../../services/stringeeService';
import { createStringeeClient } from '../../config/stringee';

const VideoCall = ({ currentChat, isCallVideo = false, onClose }) => {
  const [call, setCall] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [caller, setCaller] = useState(null);
  const [stringeeClient, setStringeeClient] = useState(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const { currentUser } = useUser();
  const ref = useRef();
  const { token, isConnected } = useTokenStringee();
  const callRef = useRef();

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
      if (stringeeClient && stringeeClient.disconnect) {
        stringeeClient.disconnect();
      }
    };
  }, [token]);

  const hangupCall = () => {
    if (callRef.current && callRef.current.hangup) {
      callRef.current.hangup((res) => {
        console.log('hangup call callback:', JSON.stringify(res));
        setIsCalling(false);
        setCall(null);
        callRef.current = null;
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
      console.log("hi");
      console.log(currentChat);
      
      

      // Set up call event listeners
      newCall.on('addlocalstream', (stream) => {
        console.log('Local stream added');
        // Handle local video stream if needed
      });

      newCall.on('addremotestream', (stream) => {
        console.log('Remote stream added');
        // Handle remote video stream if needed
      });

      newCall.on('signalingstate', (state) => {
        console.log('Signaling state:', state);
        if (state.code === 6) {
          // Call ended
          setIsCalling(false);
          setCall(null);
          callRef.current = null;
        }
      });

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

  const renderCallContent = () => {
    if (isCalling) {
      return (
        <div className="mt-3 text-center">
          <p>
            {call?.to === currentUser.id
              ? `In call with ${caller?.username || "Unknown"}`
              : `Calling ${currentChat?.username || "Unknown"}`}
          </p>
          <button 
            className="bg-red-500 px-4 py-2 text-white rounded mt-2" 
            onClick={hangupCall}
          >
            End Call
          </button>
        </div>
      );
    }

    return (
      <div className="text-center space-y-10 mt-5">
        <p>Call {currentChat?.username}</p>
        {!isClientReady && (
          <p className="text-yellow-600 text-sm">Connecting...</p>
        )}
        <div className="space-x-10">
          <button 
            className="bg-slate-400 h-10 w-10 rounded-full" 
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
    <div className="h-[300px] w-[300px] bg-white rounded-sm p-4" ref={ref}>
      <h2 className="text-center font-semibold text-2xl">
        {isCallVideo ? 'Video Call' : 'Voice Call'}
      </h2>
      {renderCallContent()}
    </div>
  );
};

export default VideoCall;