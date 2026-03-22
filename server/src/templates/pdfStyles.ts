export const getPrintStyles = (): string => `
@import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');

@page {
  size: A4;
  margin: 20mm;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Times New Roman', Times, serif;
  color: #000;
  background: white;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* We do not set fixed width like 170mm here because we let Puppeteer's native margin handle it. */
.document {
  width: 100%;
  margin: 0 auto;
}

/* HEADER STYLES */
.school-name {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.exam-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
}

.compulsory-instruction {
  text-align: center;
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 20px;
  font-style: italic;
}

/* STUDENT DETAILS BOX */
.student-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
  font-size: 14px;
}

.student-details div {
  margin-bottom: 5px;
}

/* SECTION STYLES */
.section {
  margin-bottom: 30px;
}

.section-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.section-instruction {
  font-size: 14px;
  font-style: italic;
  margin-bottom: 15px;
  text-align: center;
}

/* QUESTION STYLES */
.question-block {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1.5;
  page-break-inside: avoid;
  break-inside: avoid;
}

.question-content-wrapper {
  display: flex;
  gap: 10px;
  flex: 1;
}

.question-number {
  font-weight: bold;
  min-width: 20px;
}

.question-text {
  margin: 0 0 8px 0;
}

.options-list {
  margin-top: 5px;
  margin-left: 20px;
}

.option-item {
  margin-bottom: 4px;
}

.marks {
  font-weight: bold;
  white-space: nowrap;
  margin-left: 15px;
}
`;
