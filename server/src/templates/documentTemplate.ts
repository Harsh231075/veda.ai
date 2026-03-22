import { getPrintStyles } from './pdfStyles';

export const generateHtmlTemplate = (assignment: any): string => {
  const cssString = getPrintStyles();
  
  const sections = assignment.generatedPaper?.sections || [];
  
  // Calculate total marks
  let totalMarks = 0;
  sections.forEach((section: any) => {
    section.questions?.forEach((q: any) => {
      totalMarks += (q.marks || 0);
    });
  });

  const sectionsHtml = sections.map((section: any, sIdx: number) => {
    const questionsHtml = section.questions?.map((q: any, qIdx: number) => {
      let optionsHtml = '';
      if (q.options && q.options.length > 0) {
        const optionRows = q.options.map((opt: string, i: number) => {
          return `<div class="option-item">(${String.fromCharCode(97 + i)}) ${opt}</div>`;
        }).join('');
        optionsHtml = `<div class="options-list">${optionRows}</div>`;
      }

      const marksHtml = q.marks ? `<div class="marks">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</div>` : '';

      return `
        <div class="question-block">
          <div class="question-content-wrapper">
            <div class="question-number">${qIdx + 1}.</div>
            <div class="question-text-wrapper">
              <p class="question-text">${q.questionText}</p>
              ${optionsHtml}
            </div>
          </div>
          ${marksHtml}
        </div>
      `;
    }).join('') || '';

    const instructionHtml = section.instructions ? `<div class="section-instruction">${section.instructions}</div>` : '';

    return `
      <div class="section">
        <div class="section-title">${section.title}</div>
        ${instructionHtml}
        <div class="questions">
          ${questionsHtml}
        </div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${assignment.title || 'Question Paper'}</title>
      <style>
        ${cssString}
      </style>
    </head>
    <body>
      <div class="document">
        
        <div class="school-name">
          Delhi Public School
        </div>

        <div class="exam-meta">
          <div>Time Allowed: 45 Minutes</div>
          <div>Maximum Marks: ${totalMarks}</div>
        </div>
        
        <div class="compulsory-instruction">
          All questions are compulsory unless stated otherwise.
        </div>

        <div class="student-details">
          <div>Name: ______________________________</div>
          <div>Roll No: ____________________________</div>
          <div>Section: ____________________________</div>
        </div>

        ${sectionsHtml}
        
        ${sections.length === 0 ? '<p style="text-align:center; font-style:italic;">No sections generated</p>' : ''}
      </div>
    </body>
    </html>
  `;
};
