const { default: makeWASocket } = require("@whiskeysockets/baileys");
const axios = require("axios");
require("dotenv").config();

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyElb4BWVEPB9uJIAUwrz6zOlILlkLcy1I25UW7QdnXTmCS2GA26G2wCb_XRPcU7IDZGw/exec";
const sock = makeWASocket({ printQRInTerminal: true });

// Funções do Bot
async function agendar(data, hora, servico, profissional) {
  try {
    const response = await axios.get(`${WEB_APP_URL}?action=agendar&params=${data}|${hora}|${remetente}|${servico}|${profissional}|50`);
    return response.data;
  } catch (error) {
    return "❌ Erro: " + error.message;
  }
}

async function verAgenda(data, profissional) {
  const response = await axios.get(`${WEB_APP_URL}?action=ver_agenda&data=${data}&profissional=${profissional}`);
  return response.data;
}

// Ouvinte de Mensagens
sock.ev.on("messages.upsert", async ({ messages }) => {
  const msg = messages[0];
  if (!msg.message?.conversation) return;

  const texto = msg.message.conversation.toLowerCase();
  const jid = msg.key.remoteJid;

  // [1] COMANDO: AGENDAR
  if (texto.startsWith("agendar")) {
    const [, data, hora, servico] = texto.split(" ");
    const resposta = await agendar(data, hora, servico, "Dono");
    await sock.sendMessage(jid, { text: resposta });
  }

  // [2] COMANDO: VER AGENDA
  if (texto.startsWith("ver agenda")) {
    const [, data, profissional] = texto.split(" ");
    const agenda = await verAgenda(data, profissional);
    await sock.sendMessage(jid, { text: agenda });
  }

  // [3] COMANDO: LUCRO HOJE
  if (texto === "lucro hoje") {
    const response = await axios.get(`${WEB_APP_URL}?action=lucro_hoje`);
    await sock.sendMessage(jid, { text: response.data });
  }
});

console.log("Bot iniciado!");