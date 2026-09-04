const SHEET_NAMES = {
  "Counselor Application": "Counselor Applications",
  "Pastoral Reference": "Pastoral References",
};

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || "{}");
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = SHEET_NAMES[payload.formType] || "Submissions";
  const sheet = getOrCreateSheet(spreadsheet, sheetName);

  const headers = getHeadersForType(payload.formType);
  ensureHeaderRow(sheet, headers);

  const row = headers.map((header) => payload[header] || "");
  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(spreadsheet, sheetName) {
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function ensureHeaderRow(sheet, headers) {
  const existing = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const hasHeaders = existing.some((cell) => cell);

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function getHeadersForType(formType) {
  if (formType === "Pastoral Reference") {
    return [
      "submittedAt",
      "formType",
      "Applicant's Name",
      "Name/Title",
      "Name of Church",
      "Email",
      "How long known applicant",
      "Christian Character and Faithfulness",
      "Counselor Suitability",
      "message",
    ];
  }

  return [
    "submittedAt",
    "formType",
    "Name",
    "Email",
    "Cell Phone",
    "School/Occupation",
    "Year in School",
    "Interested in Teaching Seminar",
    "Seminar Title",
    "Seminar Abstract",
    "Church Name",
    "Baptized",
    "Church Roles",
    "Pastor's Name",
    "Pastor's Email",
    "Faith Testimony",
    "Desire to Serve",
    "Hope for Students",
    "Available for Required Gatherings",
    "message",
  ];
}
