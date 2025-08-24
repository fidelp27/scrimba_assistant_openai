import { createMessage, createRun, retrieveMessages, retrieveRun } from "./utils.js";

const assistant_id = "asst_dDlQhXTI30YPr6uDfyGtnN4N";
const id_thread = "thread_mvle20VXakc6nT7ddIWUWqsT";

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // --- Servir los archivos del front-end ---
    if (url.pathname === "/") return new Response(Bun.file("./index.html"));
    if (url.pathname === "/index.js") return new Response(Bun.file("./index.js"));
    if (url.pathname === "/index.css") return new Response(Bun.file("./index.css"));

    // --- Ruta de la API para chatear ---
    if (url.pathname === "/chat" && req.method === "POST") {
      try {
        const { prompt } = await req.json();

        await createMessage(id_thread, "user", prompt);
        
        // <-- CAMBIO: Se ajusta la llamada para que coincida con el nuevo orden de argumentos
        const run = await createRun(id_thread, assistant_id); 
        
        let status = run.status;

        while (status !== "completed" && status !== "failed") {
          const runData = await retrieveRun(id_thread, run.id); 
          status = runData.status;
          console.log("Run status:", status);
          if (status !== "completed") {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        const messagesData = await retrieveMessages(id_thread);
        const assistantReply = messagesData.data[0].content[0].text.value;

        return new Response(JSON.stringify({ reply: assistantReply }), {
          headers: { "Content-Type": "application/json" },
        });

      } catch (error) {
        console.error("Error en el endpoint /chat:", error);
        return new Response(JSON.stringify({ error: "Hubo un error en el servidor" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log("Servidor escuchando en http://localhost:3000");