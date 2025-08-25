import { openai } from "./config.js";

// create message
export async function createMessage(thread_id, role, content) {
  const threadMessages = await openai.beta.threads.messages.create(
    thread_id,
    { role: role, content: content }
  );
  return threadMessages;
}

// create run 
// <-- CAMBIO: Se invirtieron los parámetros para que thread_id sea siempre el primero
export async function createRun(thread_id, assistant_id) {
  const run = await openai.beta.threads.runs.create(
    thread_id,
    { assistant_id: assistant_id }
  );
  return run;
}

// retrieve run
export async function retrieveRun(thread_id, run_id) {
  const run =  await openai.beta.threads.runs.retrieve(
    run_id,
    { thread_id: thread_id }
  );
  return run;
}

// retrieve messages
export async function retrieveMessages(thread_id) {
  const threadMessages = await openai.beta.threads.messages.list(
    thread_id
  );
  console.log(threadMessages)
  return threadMessages;
}

// submit tool outputs
export async function submitToolOutputs(thread_id, run_id, tool_outputs) {
  // Nota: el SDK oficial usa este método con la firma (threadId, runId, { tool_outputs })
  return openai.beta.threads.runs.submitToolOutputs(run_id, {thread_id,  tool_outputs });
}

// cancel run
export async function cancelRun(thread_id, run_id) {
  return await openai.beta.threads.runs.cancel(
    run_id,
    { thread_id: thread_id }
  );
}
//cancelRun("thread_mvle20VXakc6nT7ddIWUWqsT","run_BlqLyTsYDJXz07pdRYBHCyW8");
