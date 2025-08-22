import fetch from "node-fetch";

export default async function handler(req, res) {
  const response = await fetch("https://api64.ipify.org?format=json");
  const data = await response.json();
 console.log("Vercel outbound IP:", data.ip); 
  res.status(200).json({
    vercelOutboundIP: data.ip,
  });
}
