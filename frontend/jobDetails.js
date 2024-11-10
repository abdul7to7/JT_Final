const server = "https://jt-final-0ato.onrender.com";
// const server = "http://localhost:3000";
const token = localStorage.getItem("token");
const jobId = localStorage.getItem("jobid");

document.addEventListener("DOMContentLoaded", async () => {
  const job = await getJob(jobId);
  if (job && job.success) {
    addJobToUI(job);
  }
});

document.getElementById("jobStatus").addEventListener("click", async (e) => {
  if (e.target.classList.contains("jobStatusValue")) {
    console.log("job status clicked:", e.target.getAttribute("value"));
    const body = {
      status: e.target.getAttribute("value"),
    };
    const job = await putJob(body);
    updateStatus(job.job.status);
  }
});

//selcting notes
document.getElementById("jobNotes").addEventListener("click", async (e) => {
  e.preventDefault();
  const jobNotesContainer = document.getElementById("jobNotesContainer");
  const jobRemindersContainer = document.getElementById(
    "jobRemindersContainer"
  );
  const jobFilesContainer = document.getElementById("jobFilesContainer");
  if (jobNotesContainer.style.display == "none") {
    jobNotesContainer.style.display = "block";
    jobRemindersContainer.style.display = "none";
    jobFilesContainer.style.display = "none";
    const jobNotesList = document.getElementById("jobNotesList");
    while (jobNotesList.childNodes.length > 0) {
      jobNotesList.removeChild(jobNotesList.firstChild);
    }
    const jobId = e.target.getAttribute("jobid");
    const res = await getNotes(jobId);
    if (res && res.success) {
      addNotesToUI(res.notes);
    }
  } else {
    jobNotesContainer.style.display = "none";
  }
});

//add new note
document.getElementById("addNoteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const noteContent = document.getElementById("noteContent").value;
  const res = await postNote(noteContent);
  addNoteToUI(res.note);
});

//delete a note
document.getElementById("jobNotesList").addEventListener("click", async (e) => {
  e.preventDefault();
  if (e.target.classList.contains("deleteNoteBtn")) {
    const noteId = e.target.getAttribute("id");
    await deleteNote(noteId);
    const parent = e.target.parentElement;
    const gparent = parent.parentElement;
    gparent.removeChild(parent);
  }
});

//selct job reminder
document.getElementById("jobReminders").addEventListener("click", async (e) => {
  e.preventDefault();
  const jobNotesContainer = document.getElementById("jobNotesContainer");
  const jobRemindersContainer = document.getElementById(
    "jobRemindersContainer"
  );
  const jobFilesContainer = document.getElementById("jobFilesContainer");

  if (jobRemindersContainer.style.display == "none") {
    jobNotesContainer.style.display = "none";
    jobRemindersContainer.style.display = "block";
    jobFilesContainer.style.display = "none";
    const jobId = e.target.getAttribute("jobid");
    const res = await getReminders(jobId);
    if (res && res.success) {
      addRemindersToUI(res.reminders);
    }
  } else {
    jobRemindersContainer.style.display = "none";
  }
});

//add a new reminder
document
  .getElementById("addReminderForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const reminderContent = document.getElementById("reminderContent").value;
    const reminderDate = document.getElementById("reminderDate").value;
    console.log("add reminder clicked", reminderContent, reminderDate);
    const res = await postReminder(reminderContent, reminderDate);
    addReminderToUI(res.reminder);
  });

//delete reminder
document
  .getElementById("jobRemindersList")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    if (e.target.classList.contains("deleteReminderBtn")) {
      const reminderId = e.target.getAttribute("id");
      await deleteReminder(reminderId);
      const parent = e.target.parentElement;
      const gparent = parent.parentElement;
      gparent.removeChild(parent);
    }
  });

//selct job files
document.getElementById("jobFiles").addEventListener("click", async (e) => {
  e.preventDefault();
  const jobNotesContainer = document.getElementById("jobNotesContainer");
  const jobRemindersContainer = document.getElementById(
    "jobRemindersContainer"
  );
  const jobFilesContainer = document.getElementById("jobFilesContainer");
  if (jobFilesContainer.style.display == "none") {
    jobNotesContainer.style.display = "none";
    jobRemindersContainer.style.display = "none";
    jobFilesContainer.style.display = "block";
    const jobId = e.target.getAttribute("jobid");
    const files = await getFiles(jobId);
    console.log(files);
    addFilesToUI(files);
  } else {
    jobFilesContainer.style.display = "none";
  }
});

//add a new file
document.getElementById("addFileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("jobFile").files[0];

  const res = await postFile(file);
  console.log("add File clicked");
  window.location.reload();
});

//delete file
document.getElementById("jobFilesList").addEventListener("click", async (e) => {
  e.preventDefault();
  if (e.target.classList.contains("deleteFileBtn")) {
    const fileKey = e.target.getAttribute("id");
    await deleteFile(fileKey);
    const parent = e.target.parentElement;
    const gparent = parent.parentElement;
    gparent.removeChild(parent);
  }
});

//delete job
document.getElementById("closeJob").addEventListener("click", async (e) => {
  e.preventDefault();
  let userResponse = confirm("Are you sure you want to proceed?");
  if (userResponse) {
    await deleteJob(jobId);
    window.location = "./main.html";
  }
});

document.getElementById("updateJob").addEventListener("click", (e) => {
  const updateForm = document.getElementById("updateJobForm");
  if (updateForm.style.display == "none") {
    updateForm.style.display = "block";
  } else {
    updateForm.style.display = "none";
  }
});

document
  .getElementById("updateJobForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const position = document.getElementById("jobPositionInput").value;
    const company = document.getElementById("companyInput").value;
    const maxSalary = document.getElementById("maxSalaryInput").value;
    const location = document.getElementById("locationInput").value;
    const status = document.getElementById("statusInput").value;
    const dateApplied = document.getElementById("dateAppliedInput").value;
    const description = document.getElementById("descriptionInput").value;
    let updateBody = {};
    if (position != "" && position != undefined && position != null) {
      updateBody.position = position;
    }
    if (company != "" && company != undefined && company != null) {
      updateBody.company = company;
    }
    if (
      maxSalary != "" &&
      maxSalary != undefined &&
      maxSalary != null &&
      maxSalary != 0
    ) {
      updateBody.maxSalary = maxSalary;
    }
    if (location != "" && location != undefined && location != null) {
      updateBody.location = location;
    }
    if (dateApplied != "" && dateApplied != undefined && dateApplied != null) {
      updateBody.dateApplied = dateApplied;
    }
    if (status != "" && status != undefined && status != null) {
      updateBody.status = status;
    }
    if (description != "" && description != undefined && description != null) {
      updateBody.description = description;
    }
    await putJob(updateBody);
    window.location.reload();
  });

// document.getElementById("addJobNote").addEventListener("click", (e) => {
//   const addNoteForm = document.getElementById("addNoteForm");
//   if (addNoteForm.style.display == "none") {
//     addNoteForm.style.display = "block";
//   } else {
//     addNoteForm.style.display = "none";
//   }
// });

// document.getElementById("addJobReminder").addEventListener("click", (e) => {
//   const addReminderForm = document.getElementById("addReminderForm");
//   if (addReminderForm.style.display == "none") {
//     addReminderForm.style.display = "block";
//   } else {
//     addReminderForm.style.display = "none";
//   }
// });

// document.getElementById("addJobFile").addEventListener("click", (e) => {
//   const addFileForm = document.getElementById("addFileForm");
//   if (addFileForm.style.display == "none") {
//     addFileForm.style.display = "block";
//   } else {
//     addFileForm.style.display = "none";
//   }
// });

function addJobToUI(job) {
  const jobNotes = document.getElementById("jobNotes");
  const jobReminder = document.getElementById("jobReminders");
  const jobFiles = document.getElementById("jobFiles");
  const closeJob = document.getElementById("closeJob");
  jobDetails.innerHTML = `<div class=main-heading>${job.jobDetails.position}</div><div class=sub-heading>${job.jobDetails.company}</div>`;
  updateStatus(job.jobDetails.status);
  jobReminder.setAttribute("jobid", job.jobDetails.id);
  jobNotes.setAttribute("jobid", job.jobDetails.id);
  jobFiles.setAttribute("jobid", job.jobDetails.id);
  closeJob.setAttribute("jobid", job.jobDetails.id);
}

function updateStatus(status) {
  const jobStatus = document.getElementById("jobStatus");
  let statusfetched = false;
  for (let i = 0; i < 6; i++) {
    if (jobStatus.children[i].textContent.toLowerCase() == status) {
      jobStatus.children[i].style.color = "purple";
      statusfetched = true;
    } else {
      if (!statusfetched) jobStatus.children[i].style.color = "green";
      else {
        jobStatus.children[i].style.color = "black";
      }
    }
  }
}

function addNotesToUI(notes) {
  console.log(notes);
  const jobNotesList = document.getElementById("jobNotesList");
  notes.map((note) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${note.content}</span><button id=${note.id} class="deleteNoteBtn" >Delete</button>`;
    jobNotesList.appendChild(li);
  });
}

function addRemindersToUI(reminders) {
  console.log(reminders);
  const jobRemindersList = document.getElementById("jobRemindersList");
  reminders.map((reminder) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${reminder.content}</span><span>${new Date(
      reminder.date
    )
      .toISOString()
      .replace("T", " ")
      .slice(0, 16)}</span><button id=${
      reminder.id
    } class="deleteReminderBtn" >Delete</button>`;
    jobRemindersList.appendChild(li);
  });
}

function addFilesToUI(files) {
  const jobFilesList = document.getElementById("jobFilesList");
  files.map((file) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${file.name}</span><button id=${
      file.key.split("/")[1]
    } class="deleteFileBtn" >Delete</button>`;
    jobFilesList.appendChild(li);
  });
}

function addNoteToUI(note) {
  const jobNotesList = document.getElementById("jobNotesList");
  const li = document.createElement("li");
  li.innerHTML = `<span>${note.content}</span><button id=${note.id} class="deleteNoteBtn" >Delete</button>`;
  jobNotesList.appendChild(li);
}

function addReminderToUI(reminder) {
  const jobRemindersList = document.getElementById("jobRemindersList");
  const li = document.createElement("li");
  li.innerHTML = `<span>${reminder.content}</span><span>${new Date(
    reminder.date
  )
    .toISOString()
    .replace("T", " ")
    .slice(0, 16)}</span><button id=${
    reminder.id
  } class="deleteReminderBtn" >Delete</button>`;
  jobRemindersList.appendChild(li);
}

function addFileToUI(file) {
  const jobFilesList = document.getElementById("jobFilesList");
  const li = document.createElement("li");
  li.innerHTML = `<span>${file.name}</span><button id=${
    file.key.split("/")[1]
  } class="deleteFileBtn" >Delete</button>`;
  jobFilesList.appendChild(li);
}

async function getJob(id) {
  try {
    let res = await fetch(`${server}/job/${id}`, {
      headers: {
        token: token,
      },
    });
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}

async function getReminders(jobId) {
  try {
    let res = await fetch(`${server}/reminder/${jobId}/all`, {
      headers: {
        token: token,
      },
    });
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}

async function getNotes(jobId) {
  try {
    let res = await fetch(`${server}/note/${jobId}/all`, {
      headers: {
        token: token,
      },
    });
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}

async function getFiles(jobId) {
  try {
    let res = await fetch(`${server}/file/${jobId}/all`, {
      headers: {
        token: token,
      },
    });
    res = await res.json();
    return res.files;
  } catch (e) {
    console.log(e);
  }
}

async function postNote(content) {
  const jobId = localStorage.getItem("jobid");
  try {
    let res = await fetch(`${server}/note/${jobId}`, {
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        content: content,
      }),
    });
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}

async function postReminder(content, date) {
  const jobId = localStorage.getItem("jobid");
  try {
    let res = await fetch(`${server}/reminder/${jobId}`, {
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        content: content,
        date: date,
      }),
    });
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}

async function postFile(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    let res = await fetch(`${server}/file/${jobId}/upload`, {
      headers: {
        token: token,
        // "Content-Type": "application/json",
      },
      method: "POST",
      body: formData,
    });
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}

async function deleteNote(noteId) {
  try {
    let res = await fetch(`${server}/note/${jobId}/${noteId}`, {
      headers: {
        token: token,
      },
      method: "DELETE",
    });
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}

async function deleteReminder(reminderId) {
  try {
    let res = await fetch(`${server}/reminder/${jobId}/${reminderId}`, {
      headers: {
        token: token,
      },
      method: "DELETE",
    });
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}

async function deleteFile(fileKey) {
  try {
    let res = await fetch(`${server}/file/${jobId}/${fileKey}`, {
      headers: {
        token: token,
      },
      method: "DELETE",
    });
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}

async function deleteJob(id) {
  try {
    let res = await fetch(`${server}/job/${jobId}`, {
      headers: {
        token: token,
      },
      method: "DELETE",
    });
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}

async function putJob(updatedItems) {
  try {
    let res = await fetch(`${server}/job/${jobId}`, {
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(updatedItems),
    });
    res = await res.json();
    return res;
  } catch (e) {
    console.log(e);
  }
}
