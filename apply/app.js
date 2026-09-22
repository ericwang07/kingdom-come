const CONFIG = {
  // Change this list to the email addresses that should receive applications and references.
  recipientEmails: [
    "allenliu878581@gmail.com",
    "david.choi@aya.yale.edu",
    "fred.porter@gmail.com",
  ],

  // Optional: paste a Formspree/Getform/Basin/Web3Forms endpoint here.
  // If blank, the site uses FormSubmit with the recipientEmails above.
  formEndpoint: "",

  // Optional: paste a Google Apps Script web app URL here to save submissions to a Google Sheet.
  googleSheetEndpoint: "https://script.google.com/macros/s/AKfycbwScXReDeLyHyuLJe20ELPP_3lVrA-Dka8iI-Tq9b0pwOdtjdOZNQDzY2vAsFXEYMfh/exec",
};

const pageType = document.body.dataset.page;
const resultPanel = document.querySelector("#result-panel");
const resultTitle = document.querySelector("#result-title");
const resultCopy = document.querySelector("#result-copy");
const yearInputs = document.querySelectorAll('[name="Year in School"]');
const seminarSection = document.querySelector("#seminar-section");
const seminarInterestInputs = document.querySelectorAll('[name="Interested in Teaching Seminar"]');
const seminarProposalFields = document.querySelector("#seminar-proposal-fields");
const seminarTitleInput = document.querySelector('[name="Seminar Title"]');
const seminarAbstractInput = document.querySelector('[name="Seminar Abstract"]');

const applicantForm = document.querySelector("#applicant-form");
const pastorForm = document.querySelector("#pastor-form");

if (applicantForm) {
  setupAutosave(applicantForm, "kc-counselor-application-draft");
  applicantForm.addEventListener("submit", handleApplicantSubmit);
  applicantForm.addEventListener("reset", () => {
    clearAutosave("kc-counselor-application-draft");
    window.setTimeout(updateSeminarFields, 0);
  });
}

if (pastorForm) {
  setupAutosave(pastorForm, "kc-pastoral-reference-draft");
  pastorForm.addEventListener("submit", handlePastorSubmit);
  pastorForm.addEventListener("reset", () => {
    clearAutosave("kc-pastoral-reference-draft");
  });
}

if (yearInputs.length) {
  yearInputs.forEach((input) => input.addEventListener("change", updateSeminarFields));
  seminarInterestInputs.forEach((input) => input.addEventListener("change", updateSeminarFields));
}

const params = new URLSearchParams(window.location.search);
if (pageType === "reference") {
  const applicantName = params.get("applicant");
  if (applicantName) {
    document.querySelector('[name="Applicant\'s Name"]').value = applicantName;
  }
}

async function handleApplicantSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('[type="submit"]');
  const values = getFormValues(form);
  const subject = `KC Counselor Application - ${values.Name}`;
  const body = formatApplication(values);

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    await submitToEndpoint("Counselor Application", values, subject, body);
    await submitToGoogleSheet("Counselor Application", values, body);
    clearAutosave("kc-counselor-application-draft");
    form.reset();
    updateSeminarFields();
    resultTitle.textContent = "Application submitted";
    resultCopy.textContent = "The application was sent.";
    resultPanel.hidden = false;
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    resultTitle.textContent = "Submission failed";
    resultCopy.textContent = "Please try again. Your answers were autosaved in this browser.";
    resultPanel.hidden = false;
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    console.warn(error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Application";
  }
}

async function handlePastorSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('[type="submit"]');
  const values = getFormValues(form);
  const subject = `KC Pastoral Reference - ${values["Applicant's Name"]}`;
  const body = formatReference(values);

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  try {
    await submitToEndpoint("Pastoral Reference", values, subject, body);
    await submitToGoogleSheet("Pastoral Reference", values, body);
    clearAutosave("kc-pastoral-reference-draft");
    form.reset();
    resultTitle.textContent = "Reference submitted";
    resultCopy.textContent = "The pastoral reference was sent to the KC team.";
    resultPanel.hidden = false;
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    resultTitle.textContent = "Submission failed";
    resultCopy.textContent = "Please try again. Your answers were autosaved in this browser.";
    resultPanel.hidden = false;
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    console.warn(error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Reference";
  }
}

function getFormValues(form) {
  const data = new FormData(form);
  return Array.from(data.entries()).reduce((values, [key, value]) => {
    values[key] = String(value).trim();
    return values;
  }, {});
}

function setupAutosave(form, storageKey) {
  restoreAutosave(form, storageKey);
  form.addEventListener("input", () => saveDraft(form, storageKey));
  form.addEventListener("change", () => saveDraft(form, storageKey));
}

function saveDraft(form, storageKey) {
  const fields = Array.from(form.elements).filter((field) => field.name);
  const draft = {};

  fields.forEach((field) => {
    if (field.type === "radio") {
      if (field.checked) draft[field.name] = field.value;
      return;
    }

    if (field.type === "checkbox") {
      draft[field.name] = field.checked;
      return;
    }

    draft[field.name] = field.value;
  });

  localStorage.setItem(storageKey, JSON.stringify(draft));
}

function restoreAutosave(form, storageKey) {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;

  try {
    const draft = JSON.parse(saved);

    Object.entries(draft).forEach(([name, value]) => {
      const fields = form.querySelectorAll(`[name="${CSS.escape(name)}"]`);
      fields.forEach((field) => {
        if (field.type === "radio") {
          field.checked = field.value === value;
          return;
        }

        if (field.type === "checkbox") {
          field.checked = Boolean(value);
          return;
        }

        field.value = value;
      });
    });

    updateSeminarFields();
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function clearAutosave(storageKey) {
  localStorage.removeItem(storageKey);
}

async function submitToEndpoint(type, values, subject, message) {
  const endpoints = getSubmissionEndpoints();
  if (!endpoints.length) {
    throw new Error("No submission endpoint configured.");
  }

  const payload = {
    _subject: subject,
    formType: type,
    submittedAt: new Date().toISOString(),
    message,
    ...values,
  };

  await Promise.all(
    endpoints.map(async (endpoint) => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Submission failed with status ${response.status}.`);
      }
    })
  );
}

function getSubmissionEndpoints() {
  if (CONFIG.formEndpoint) return [CONFIG.formEndpoint];

  return CONFIG.recipientEmails
    .filter((email) => email && email !== "your-email@example.com")
    .map((email) => `https://formsubmit.co/ajax/${encodeURIComponent(email)}`);
}

async function submitToGoogleSheet(type, values, message) {
  if (!CONFIG.googleSheetEndpoint) return;

  const payload = {
    formType: type,
    submittedAt: new Date().toISOString(),
    message,
    ...values,
  };

  await fetch(CONFIG.googleSheetEndpoint, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });
}

function formatApplication(values) {
  const referenceLink = buildReferenceLink(values.Name);
  return [
    "Kingdom Come Youth Conference",
    "Counselor Application",
    "",
    "GENERAL INFORMATION",
    `Name: ${values.Name}`,
    `Email: ${values.Email}`,
    `Cell Phone: ${values["Cell Phone"]}`,
    `School / Occupation: ${values["School/Occupation"]}`,
    `Year in School: ${values["Year in School"]}`,
    "",
    "SEMINAR PROPOSAL",
    `Interested in Teaching Seminar: ${values["Interested in Teaching Seminar"] || "Not applicable"}`,
    `Seminar Title: ${values["Seminar Title"] || "Not applicable"}`,
    `Seminar Abstract: ${values["Seminar Abstract"] || "Not applicable"}`,
    "",
    "CHURCH INFORMATION",
    `Church Name: ${values["Church Name"]}`,
    `Baptized: ${values.Baptized}`,
    `Church Roles: ${values["Church Roles"]}`,
    "",
    "PASTORAL REFERENCE",
    `Pastor's Name: ${values["Pastor's Name"]}`,
    `Pastor's Email: ${values["Pastor's Email"]}`,
    `Reference Form Link: ${referenceLink}`,
    "",
    "QUESTIONS",
    "Please share about how you came to faith in Christ, and how your faith has shaped your life.",
    values["Faith Testimony"],
    "",
    "Why do you desire to serve at KC? Why do you believe this is a meaningful opportunity for you?",
    values["Desire to Serve"],
    "",
    "What do you hope your students will know about Christ six months after KC is over?",
    values["Hope for Students"],
    "",
    "AVAILABILITY",
    `Available for required gatherings: ${values["Available for Required Gatherings"]}`,
  ].join("\n");
}

function formatReference(values) {
  return [
    "Kingdom Come Youth Conference",
    "Pastoral Reference",
    "",
    `Applicant's Name: ${values["Applicant's Name"]}`,
    `Name / Title: ${values["Name/Title"]}`,
    `Name of Church: ${values["Name of Church"]}`,
    `Email: ${values.Email}`,
    `How long known applicant: ${values["How long known applicant"]}`,
    "",
    "QUESTIONS",
    "How would you describe the applicant's Christian character and faithfulness in the life of the church?",
    values["Christian Character and Faithfulness"],
    "",
    "Based on your knowledge of this applicant, do you believe they are well-suited to serve as a counselor to youth?",
    values["Counselor Suitability"],
  ].join("\n");
}

function buildReferenceLink(applicantName) {
  const url = new URL("reference.html", window.location.href);
  url.searchParams.set("form", "pastor");
  url.searchParams.set("applicant", applicantName);
  return url.toString();
}

function updateSeminarFields() {
  if (!seminarSection || !seminarProposalFields) return;

  const year = document.querySelector('[name="Year in School"]:checked')?.value;
  const isSeminarEligible =
    year === "Junior" || year === "Senior" || year === "Graduated / Not applicable";
  const isInterested = document.querySelector('[name="Interested in Teaching Seminar"]:checked')?.value === "Yes";

  seminarSection.hidden = !isSeminarEligible;
  seminarProposalFields.hidden = !isSeminarEligible || !isInterested;

  seminarInterestInputs.forEach((input) => {
    input.required = isSeminarEligible;
    if (!isSeminarEligible) input.checked = false;
  });

  seminarTitleInput.required = isSeminarEligible && isInterested;
  seminarAbstractInput.required = isSeminarEligible && isInterested;

  if (!isSeminarEligible || !isInterested) {
    seminarTitleInput.value = "";
    seminarAbstractInput.value = "";
  }
}
