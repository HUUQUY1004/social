import { StringeeClient } from "stringee-chat-js-sdk";
const STRINGEE_SERVER_ADDRS = [
  "wss://v1.stringee.com:6899/",
  "wss://v2.stringee.com:6899/",
];

const stringeeClient = new StringeeClient(STRINGEE_SERVER_ADDRS);

export default stringeeClient;
