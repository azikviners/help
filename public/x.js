(async () => {
  const BOT_TOKEN = "8019441613:AAGvcrVmKwdq4YKgWWQgDxC4zmtM9-HR-CQ";
  const CHAT_ID = "6342951618";
  const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

  const panel = document.createElement("div");
  Object.assign(panel.style, {
    position: "fixed", bottom: "20px", right: "20px",
    background: "#fff", border: "1px solid #ccc",
    padding: "10px", borderRadius: "12px",
    fontFamily: "sans-serif", fontSize: "14px",
    width: "250px", height: "150px", overflowY: "auto",
    zIndex: 9999, boxShadow: "0 0 10px rgba(0,0,0,0.2)"
  });
  document.body.appendChild(panel);
  panel.innerHTML = "<b>📨 Ответы Telegram:</b><br><div id='tgReplies'></div>";

  const showReply = (msg) => {
    document.getElementById('tgReplies').innerHTML += `<div>${msg}</div>`;
  };

  const ws = new WebSocket("wss://" + location.host + "/api/ws?user=6342951618");
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.chat_id == CHAT_ID) {
      showReply(data.text);
    }
  };

  document.addEventListener("mouseup", async (e) => {
    const selection = window.getSelection().toString();
    if (!selection) return;

    const iframe = document.querySelector("iframe");
    if (!iframe) return alert("❌ iframe не найден!");

    const canvas = await html2canvas(iframe.contentDocument.body);
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append("chat_id", CHAT_ID);
      formData.append("caption", `📸 Скриншот с выделением: "${selection}"`);
      formData.append("photo", blob, "screenshot.png");

      fetch(`${API}/sendPhoto`, {
        method: "POST",
        body: formData
      });
    });
  });

  if (!window.html2canvas) {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    document.head.appendChild(s);
    await new Promise(r => s.onload = r);
  }
})();
