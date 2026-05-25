import type { CreateAssignmentInput } from "../validators/assignment.validator.js";

interface PromptPayload {
  assignment: CreateAssignmentInput;
  uploadedText?: string;
}

export const buildAssessmentPrompt = ({ assignment, uploadedText }: PromptPayload) => {
  const distribution = assignment.questionTypes
    .map((item) => `- ${item.label}: ${item.count} questions, ${item.marks} marks each, type=${item.type}`)
    .join("\n");

  return `
You are an expert Indian school assessment designer.

Return STRICT JSON ONLY. Do not include markdown, commentary, code fences, or prose.

Create an exam question paper using this exact JSON shape:
{
  "title": "string",
  "metadata": {
    "subject": "string",
    "classLevel": "string",
    "durationMinutes": 45,
    "schoolName": "Delhi Public School, Sector-4, Bokaro",
    "dueDate": "YYYY-MM-DD"
  },
  "totalMarks": 20,
  "sections": [
    {
      "title": "Section A",
      "instruction": "string",
      "questions": [
        {
          "text": "string",
          "difficulty": "easy",
          "marks": 2,
          "type": "short"
        }
      ]
    }
  ]
}

Rules:
- difficulty must be one of: easy, moderate, challenging.
- type must be one of: mcq, short, diagram, numerical, long.
- Question counts and marks must match the requested distribution.
- Never return answer keys inside questions.
- Keep language clear, school-ready, and printable.
- Prefer CBSE-style wording and balanced difficulty.

Assignment:
Title: ${assignment.title}
Due date: ${assignment.dueDate.toISOString().slice(0, 10)}
Instructions: ${assignment.instructions || "No extra instructions"}

Question distribution:
${distribution}

Uploaded source material:
${uploadedText ? uploadedText.slice(0, 8000) : "No uploaded material. Generate a general curriculum-aligned assessment."}
`.trim();
};
