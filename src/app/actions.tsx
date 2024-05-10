import "server-only";

import { createAI, createStreamableUI } from "ai/rsc";
import { ReactNode } from "react";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function submitUserMessage(userInput: string) {
  "use server";

  let ui, uiStreams;
  try {
    ui = createStreamableUI(<div>Loading...</div>);

    (async () => {
      try {
        ui.update(<div>UI Update 1</div>);
        uiStreams = Array.from({ length: 3 }).map((_, i) => {
          return createStreamableUI(<div>Nested {i}</div>);
        });

        await new Promise((resolve) => setTimeout(() => resolve(true), 3000)); // wait 3 seconds

        ui.update(
          <div>
            Composed UI{" "}
            {uiStreams.map((u) => {
              return u.value;
            })}
          </div>
        );
        await new Promise((resolve) => setTimeout(() => resolve(true), 3000)); // wait 3 seconds
      } catch (e) {
      } finally {
        for (let i = 0; i < uiStreams?.length ?? 0; i++) {
          uiStreams[i].done();
        }
        ui.done();
      }
    })();
  } catch (e) {}

  return {
    id: Date.now(),
    display: <div>{ui.value}</div>
  };
}

export type QueryResult = {
  columns: string[];
  results: (number | string)[][];
};

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    submitUserMessage
  },
  initialUIState,
  initialAIState
});
