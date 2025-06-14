import { BrowserRouter, Routes, Route } from "react-router-dom";
import { router } from "./router";
import DefaultLayout from "./component/Layout/layout";
import { Fragment, useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useTokenStringee } from "./store/useToken";
import { generateTokenStringee } from "./action/action";
import PopupWrapper from "./component/PopupWrapper/PopupWrapper";
import { createStringeeClient } from "./config/stringee";
import {
  setStringeeClient,
  setConnectionStatus,
} from "./services/stringeeService";
import { images } from "./source";

function App() {
  const { token, setToken, setIsConnected } = useTokenStringee();
  const [hasInComingCall, setHasInComingCall] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [callerInfo, setCallerInfo] = useState(null); // Thêm info người gọi
  const [isInCall, setIsInCall] = useState(false);

  const localVideo = useRef();
  const remoteVideo = useRef();
  const callRef = useRef();
  const stringeeClient = useRef(createStringeeClient()).current;
  const ringtoneRef = useRef(null);

  //  Dừng chuông
  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
      ringtoneRef.current = null;
    }
  };

  const settingCallEvent = (callInstance) => {
    callInstance.on("addremotestream", (stream) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = null;
        remoteVideo.current.srcObject = stream;
      }
    });
    callInstance.on("addlocalstream", (stream) => {
      console.log("local Stream hehhe: " + stream);

      if (localVideo.current) {
        localVideo.current.srcObject = null;
        localVideo.current.srcObject = stream;
      }
    });
    callInstance.on("signalingstate", (state) => {
      setCallStatus(state.reason);
      console.log("Call signaling state:", state);

      // Xử lý khi cuộc gọi kết thúc
      if (state.code === 6) {
        // Call ended
        setHasInComingCall(false);
        setCallerInfo(null);
        setIsInCall(false);
        callRef.current = null;
        if (localVideo.current) {
          localVideo.current.srcObject = null;
        }
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = null;
        }
      }
    });
    callInstance.on("mediastate", (state) => {
      console.log("mediastate", state);
    });
    callInstance.on("info", (info) => {
      console.log("on info:", JSON.stringify(info));
    });
  };

  useEffect(() => {
    const setupStringee = async () => {
      try {
        const newToken = token || (await generateTokenStringee());
        setToken(newToken);

        //  CONNECT
        stringeeClient.on("connect", () => {
          console.log("Connected to StringeeServer");
          setIsConnected(true);
          setConnectionStatus(true);
          setStringeeClient(stringeeClient);
        });

        stringeeClient.on("authen", (res) => {
          if (res.message === "SUCCESS") {
            console.info("Authen success");
          }
          setStringeeClient(stringeeClient);
        });

        const handleIncomingCall = (incomingCall) => {
          const audio = new Audio("/coming.mp3");
          ringtoneRef.current = audio;
          audio
            .play()
            .catch((err) => console.log("Không thể phát âm thanh" + err));

          console.log("Incoming call received:", incomingCall);
          callRef.current = incomingCall;
          settingCallEvent(incomingCall);
          setHasInComingCall(true);
          setCallerInfo({
            fromNumber: incomingCall.fromNumber,
            isVideoCall: incomingCall.isVideoCall,
          });
          setIsVideoCall(incomingCall.isVideoCall);
        };

        stringeeClient.on("incomingcall", handleIncomingCall);
        stringeeClient.on("incomingcall2", handleIncomingCall);

        stringeeClient.on("disconnect", () => {
          console.log("Disconnected from StringeeServer");
          setIsConnected(false);
          setConnectionStatus(false);
        });

        stringeeClient.connect(newToken);
      } catch (error) {
        console.error("Error setting up Stringee:", error);
      }
    };

    setupStringee();
  }, []);

  const acceptCall = () => {
    stopRingtone();
    if (callRef.current) {
      settingCallEvent(callRef.current);
      callRef.current.answer((res) => {
        console.log("answer call callback:", JSON.stringify(res));
        if (res.r === 0) {
          setHasInComingCall(false);
          setIsInCall(true);
        }
      });
    }
  };

  const rejectCall = () => {
    stopRingtone();
    if (callRef.current) {
      callRef.current.reject((res) => {
        console.log("reject call callback:", JSON.stringify(res));
        setHasInComingCall(false);
        setCallerInfo(null);
        callRef.current = null;
      });
    }
  };

  const hangupCall = () => {
    stopRingtone();
    if (callRef.current) {
      callRef.current.hangup((res) => {
        console.log("hangup call callback:", JSON.stringify(res));
        setHasInComingCall(false);
        setCallerInfo(null);
        callRef.current = null;
      });
    }
  };

  const upgradeToVideoCall = () => {
    if (callRef.current) {
      callRef.current.upgradeToVideoCall();
      setIsVideoCall(true);
    }
  };

  return (
    <div className="App">
      {hasInComingCall && (
        <PopupWrapper>
          <div className="bg-white w-[400px] px-4 py-5 flex flex-col items-center mt-3 gap-6 rounded-sm">
            <p>
              {callerInfo?.isVideoCall ? "Video call" : "Voice call"} từ{" "}
              {callerInfo?.fromNumber || "Unknown"}
            </p>
            <div>
              <button
                className="btn bg-green-500 me-3 text-white px-4 py-2 rounded-sm"
                onClick={acceptCall}
              >
                Trả lời
              </button>
              <button
                className="btn bg-red-500 text-white px-4 py-2 rounded-sm"
                onClick={rejectCall}
              >
                Từ chối
              </button>
            </div>
          </div>
        </PopupWrapper>
      )}

      {/* Video call interface - chỉ hiển thị khi đang trong cuộc gọi */}
      {isInCall && isVideoCall && (
        <div className="fixed top-0 left-0 w-full h-full bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Remote video - video của người gọi */}
            <video
              ref={remoteVideo}
              autoPlay
              className="w-full h-full object-cover"
            />

            {/* Local video - video của mình */}
            <video
              ref={localVideo}
              autoPlay
              muted
              className="absolute top-4 right-4 w-48 h-36 object-cover border-2 border-white rounded-lg"
            />

            {/* Call controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full"
                onClick={hangupCall}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice call interface - chỉ hiển thị khi đang trong cuộc gọi voice */}
      {isInCall && !isVideoCall && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 z-50 flex flex-col items-center justify-center text-white">
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-16 h-16"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">
              {callerInfo?.fromNumber || "Unknown"}
            </h2>
            <p className="text-gray-300">{callStatus}</p>
          </div>

          <div className="flex gap-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full"
              onClick={upgradeToVideoCall}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full"
              onClick={hangupCall}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <BrowserRouter>
        <Routes>
          {router.map((route, index) => {
            const Page = route.Component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </BrowserRouter>
      <ToastContainer className="z-50" position="bottom-right" />
    </div>
  );
}

export default App;
