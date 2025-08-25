import { createMessage, createRun, retrieveMessages, retrieveRun, submitToolOutputs } from "./utils.js";

const assistant_id = "asst_dDlQhXTI30YPr6uDfyGtnN4N";
const id_thread = "thread_mvle20VXakc6nT7ddIWUWqsT";
// Mapa simple de funciones
const tools = {
   find_event_by_year: async ({ year }) => (`En el año ${year}, ocurrió un evento interesante.`),
};

const onToolCall = async (name, args) => {
  if (!tools[name]) throw new Error(`Tool desconocida: ${name}`);
  return await tools[name](args);
};

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
        console.log("run " + run)
        let status = run.status;

        while (status !== "completed" && status !== "failed") {
          const runData = await retrieveRun(id_thread, run.id); 
          status = runData.status;
          console.log("Run status:", status);
          if (status !== "completed") {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          if (status === "requires_action") {
            // OJO: usar runData (fresco), NO run
            const toolCalls = runData.required_action?.submit_tool_outputs?.tool_calls ?? [];

            if (toolCalls.length > 0) {
              const tool_outputs = [];

              for (const call of toolCalls) {
                const name = call.function?.name;
                let args = {};
                try {
                  args = JSON.parse(call.function?.arguments || "{}");
                } catch (e) {
                  console.warn("Arguments JSON inválido, se envía objeto vacío:", e);
                }

                const result = await onToolCall(name, args);

                tool_outputs.push({
                  tool_call_id: call.id,
                  output: typeof result === "string" ? result : JSON.stringify(result)
                });
              }

              // Enviar los resultados al run (esto avanza el estado)
              await submitToolOutputs(id_thread, run.id, tool_outputs);
            }
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