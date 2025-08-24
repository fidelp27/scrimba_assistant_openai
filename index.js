const form = document.querySelector("form");
const input = document.querySelector("input");
const reply = document.querySelector(".reply");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userPrompt = input.value;
    input.value = "";
    reply.innerHTML = "Pensando...";

    // Enviar el prompt del usuario a nuestro servidor (back-end)
    const response = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
    });

    const data = await response.json();

    // Mostrar la respuesta del servidor en la página
    reply.innerHTML = data.reply;
});