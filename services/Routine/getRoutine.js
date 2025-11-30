import { GoogleGenAI } from "@google/genai";

class RoutineService {
  constructor() {
    this.ai = new GoogleGenAI({});
  }

  buildSystemInstruction(userInput) {
    return `
This is the user prompt you need to analyze and respond to:
"${userInput}"

You are a strict API endpoint for a fitness application. 
Your ONLY job is to accept a user prompt and return a JSON object.

RULES:
1. Analyze the user's input.
2. If the input is NOT related to physical fitness, working out, body parts, or gym training, return strictly: {"status": "fail", "error": "irrelevant_prompt"}
3. If the input IS related, generate a 7-day workout schedule based on their request.
4. Return strictly: {"status": "success", "week_plan": [ ... ]}
5. The "week_plan" must be an array of 7 objects (Monday to Sunday).
6. Each day object must have: "day", "focus" (e.g., "Chest", "Rest"), and "exercises" (array of objects with "name", "sets", "reps").

Do not include any markdown formatting. Return raw JSON only.
`;
  }

  async generateRoutine(userInput) {
    try {
      const instruction = this.buildSystemInstruction(userInput);

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: instruction,
        config: {
          responseMimeType: "application/json",
        },
      });

      const routine = JSON.parse(response.text());

      if (routine.status === "fail") {
        throw new Error(routine.error || "Routine generation failed");
      }

      return routine;
    } catch (error) {
      console.error("Error generating routine:", error);
      throw error;
    }
  }

  validateRoutine(routine) {
    if (
      routine.status !== "success" ||
      !Array.isArray(routine.week_plan) ||
      routine.week_plan.length !== 7
    ) {
      return false;
    }

    for (const day of routine.week_plan) {
      if (
        typeof day.day !== "string" ||
        typeof day.focus !== "string" ||
        !Array.isArray(day.exercises)
      ) {
        return false;
      }

      for (const exercise of day.exercises) {
        if (
          typeof exercise.name !== "string" ||
          typeof exercise.sets !== "number" ||
          typeof exercise.reps !== "number"
        ) {
          return false;
        }
      }
    }

    return true;
  }
}

export default RoutineService;
