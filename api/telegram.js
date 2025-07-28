import { sendMessageToUser } from "./ws";

export default async function handler(req, res) {
  const body = req.body;

  if (body && body.message && body.message.chat && body.message.chat.id == 6342951618) {
    const text = body.message.text || "";
    sendMessageToUser("6342951618", { text, chat_id: 6342951618 });
  }

  res.status(200).send("ok");
}
