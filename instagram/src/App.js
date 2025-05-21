import { BrowserRouter, Routes, Route } from "react-router-dom";
import { router } from "./router";
import DefaultLayout from "./component/Layout/layout";
import { Fragment, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useTokenStringee } from "./store/useToken";
import { generateTokenStringee } from "./action/action";
import {
  initializeStringee,
  addStringeeEventListener,
} from "./services/stringeeService";

function App() {
  const { token, setToken, setIsConnected } = useTokenStringee();

  useEffect(() => {
    const setupStringee = async () => {
      try {
        const newToken = token || (await generateTokenStringee());

        // Parse token to get userId for debugging
        try {
          const payload = JSON.parse(atob(newToken.split(".")[1]));
          console.log("UserId from token:", payload.userId);
        } catch (e) {
          console.error("Failed to parse token:", e);
        }

        if (!token) {
          setToken(newToken);
        }

        // Initialize Stringee client
        initializeStringee(newToken);

        // Set up event listeners
        const connectHandler = () => setIsConnected(true);
        const authenHandler = (res) => {
          if (res.r === 0) {
            console.log("✅ Authentication successful");
            setIsConnected(true);
          } else {
            console.error("❌ Authentication failed:", res.message);
            setIsConnected(false);
          }
        };
        const disconnectHandler = () => setIsConnected(false);
        const incomingCallHandler = (incomingCall) => {
          console.log("📞 Incoming call in App.js:", incomingCall);
          // You might want to handle global incoming calls here
          // For example, showing a notification
          // This is a fallback in case the VideoCall component isn't mounted
          alert("Có người gọi");
        };

        // Register event listeners
        const removeConnectListener = addStringeeEventListener(
          "connect",
          connectHandler
        );
        const removeAuthenListener = addStringeeEventListener(
          "authen",
          authenHandler
        );
        const removeDisconnectListener = addStringeeEventListener(
          "disconnect",
          disconnectHandler
        );
        const removeIncomingCallListener = addStringeeEventListener(
          "incomingcall",
          incomingCallHandler
        );

        // Cleanup
        return () => {
          removeConnectListener();
          removeAuthenListener();
          removeDisconnectListener();
          removeIncomingCallListener();
        };
      } catch (error) {
        console.error("❌ Error setting up Stringee:", error);
      }
    };

    setupStringee();
  }, [token, setToken, setIsConnected]);

  return (
    <div className="App">
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
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
