import { StringeeClient } from "stringee-chat-js-sdk";
const STRINGEE_SERVER_ADDRS = [];

export function createStringeeClient() {
  return new StringeeClient(STRINGEE_SERVER_ADDRS);
}
