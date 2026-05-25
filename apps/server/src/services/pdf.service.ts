import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { ValidatedGeneratedPaper } from "./validator.js";

const margin = 48;
const pageWidth = 595.28;
const pageHeight = 841.89;

export const createAssessmentPdf = async (paper: ValidatedGeneratedPaper) => {
  const pdfDoc = await PDFDocument.create();
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const ensureSpace = (space: number) => {
    if (y - space > margin) return;
    page = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
  };

  const drawText = (text: string, size = 10, x = margin, font = regular, color = rgb(0.13, 0.13, 0.13)) => {
    page.drawText(text, { x, y, size, font, color, maxWidth: pageWidth - margin * 2 });
    y -= size + 8;
  };

  const drawWrapped = (text: string, size = 10, indent = 0) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    const maxChars = Math.floor((pageWidth - margin * 2 - indent) / (size * 0.52));

    for (const word of words) {
      if (`${current} ${word}`.trim().length > maxChars) {
        lines.push(current);
        current = word;
      } else {
        current = `${current} ${word}`.trim();
      }
    }
    if (current) lines.push(current);

    for (const line of lines) {
      ensureSpace(20);
      drawText(line, size, margin + indent);
    }
  };

  drawText(paper.metadata.schoolName, 18, margin, bold);
  drawText(`${paper.title} | Subject: ${paper.metadata.subject} | Class: ${paper.metadata.classLevel}`, 11);
  drawText(`Time Allowed: ${paper.metadata.durationMinutes} minutes`, 10);
  drawText(`Maximum Marks: ${paper.totalMarks}`, 10);
  y -= 10;
  drawText("Student Details", 12, margin, bold);
  drawText("Name: ____________________________   Roll Number: __________________   Section: ________", 10);
  y -= 10;
  drawText("All questions are compulsory unless stated otherwise.", 10, margin, bold);
  y -= 8;

  paper.sections.forEach((section) => {
    ensureSpace(70);
    drawText(section.title, 13, margin, bold);
    drawWrapped(section.instruction, 9);
    section.questions.forEach((question, index) => {
      ensureSpace(42);
      drawWrapped(
        `${index + 1}. [${question.difficulty}] ${question.text} (${question.marks} marks)`,
        10,
        8,
      );
    });
    y -= 6;
  });

  return Buffer.from(await pdfDoc.save());
};
