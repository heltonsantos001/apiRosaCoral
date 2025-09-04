
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ sucesso: false, mensagem: "Método não permitido" });
  }

  const { codigo, brinde } = req.body;

  if (!codigo || !brinde) {
    return res.status(400).json({ sucesso: false, mensagem: "Campos 'codigo' e 'brinde' são obrigatórios" });
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/SEU_SCRIPT_ID/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, brinde })
      }
    );

    let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      console.error("Resposta não era JSON:", text);
      return res.status(500).json({ sucesso: false, mensagem: "Erro no Apps Script", detalhe: text });
    }

    res.json(data);

  } catch (err) {
    console.error("Erro interno:", err);
    res.status(500).json({ sucesso: false, mensagem: "Erro interno" });
  }
}
