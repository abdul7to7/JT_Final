const server = `https://jt-final-0ato.onrender.com`;
// const server = "http://localhost:3000";
const token = localStorage.getItem("token");

window.addEventListener("DOMContentLoaded", async () => {
  //removing filter when firstload or reload
  localStorage.removeItem("filteredstatus");
  localStorage.removeItem("filteredstartdate");
  localStorage.removeItem("filteredenddate");
  localStorage.removeItem("filteredminsalary");
  localStorage.removeItem("searchkeyword");
  const jobs = await getJobs();

  addJobsToUI(jobs);
});

document
  .getElementById("updateUserProfileBtn")
  .addEventListener("click", async (e) => {
    const form = document.getElementById("userUpdateForm");
    const updateFormUserName = document.getElementById("updateFormUserName");
    const updateFormPhoneNo = document.getElementById("updateFormPhoneNo");
    const updateFormCareerGoal = document.getElementById(
      "updateFormCareerGoal"
    );
    if (form.style.display == "none") {
      const user = await getUser();

      form.style.display = "block";
      updateFormUserName.value = user.user.username;
      updateFormPhoneNo.value = user.user.phoneno;
      updateFormCareerGoal.value = user.user.careerGoal;
    } else {
      form.style.display = "none";
    }
  });

document
  .getElementById("userUpdateForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = e.target.querySelector("button[type='submit']");
    submitButton.disabled = true;

    const username = document.getElementById("updateFormUserName").value;
    const phoneno = document.getElementById("updateFormPhoneNo").value;
    const careerGoal = document.getElementById("updateFormCareerGoal").value;
    await updateUser({ username, phoneno, careerGoal });
    e.target.style.display = "none";
    submitButton.disabled = false;
  });

document
  .getElementById("filteredStatus")
  .addEventListener("change", async (e) => {
    localStorage.setItem("filteredstatus", e.target.value);
    const jobs = await getJobs();
    addJobsToUI(jobs);
  });

document
  .getElementById("filteredStartDate")
  .addEventListener("change", async (e) => {
    localStorage.setItem("filteredstartdate", e.target.value);

    const jobs = await getJobs();
    addJobsToUI(jobs);
  });

document
  .getElementById("filteredEndDate")
  .addEventListener("change", async (e) => {
    localStorage.setItem("filteredenddate", e.target.value);

    const jobs = await getJobs();
    addJobsToUI(jobs);
  });

document
  .getElementById("filteredMinSalary")
  .addEventListener("input", async (e) => {
    localStorage.setItem("filteredminsalary", e.target.value);

    const jobs = await getJobs();
    addJobsToUI(jobs);
  });

document.getElementById("filterClear").addEventListener("click", async (e) => {
  e.preventDefault();
  localStorage.removeItem("filteredstatus");
  localStorage.removeItem("filteredstartdate");
  localStorage.removeItem("filteredenddate");
  localStorage.removeItem("filteredminsalary");
  document.getElementById("filteredStatus").value = "";
  document.getElementById("filteredStartDate").value = "";
  document.getElementById("filteredEndDate").value = "";
  document.getElementById("filteredMinSalary").value = "";

  const jobs = await getJobs();
  addJobsToUI(jobs);
});

document
  .getElementById("searchJobKeywords")
  .addEventListener("input", async (e) => {
    localStorage.setItem("searchkeyword", e.target.value);

    const jobs = await getJobs();
    addJobsToUI(jobs);
  });

document.getElementById("addJobForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitButton = e.target.querySelector("button[type='submit']");
  submitButton.disabled = true;

  const position = document.getElementById("jobPositionInput").value;
  const company = document.getElementById("companyInput").value;
  const maxSalary = document.getElementById("maxSalaryInput").value;
  const location = document.getElementById("locationInput").value;
  const status = document.getElementById("statusInput").value;
  const dateApplied = document.getElementById("dateAppliedInput").value;
  const description = document.getElementById("descriptionInput").value;
  const res = await createJob({
    position,
    company,
    maxSalary,
    location,
    status,
    dateApplied,
    description,
  });
  addJobToUI(res?.job);
  submitButton.disabled = false;
});

document.getElementById("jobsBody").addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("job")) {
    const id = e.target.getAttribute("id");
    localStorage.setItem("jobid", id);
    window.location.href = "./jobDetails.html";
  }
});

document.getElementById("addJobBtn").addEventListener("click", (e) => {
  const form = document.getElementById("addJobForm");
  if (form.style.display == "none") {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
});

function addJobsToUI(jobs) {
  removeJobsToUI();
  const jobsBody = document.getElementById("jobsBody");
  jobs?.map((job) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td class="job" id=${job.id}>${job.position}</td>
    <td>${job.company}</td>
    <td>${job.maxSalary}</td>
    <td>${job.location}</td>
    <td>${job.status}</td>
    <td>${job.dateApplied.split("T")[0]}</td>
    <td>${job.description}</td>
    `;
    jobsBody.appendChild(tr);
  });
}

function removeJobsToUI() {
  const jobsBody = document.getElementById("jobsBody");
  jobsBody.innerHTML = "";
}

function addJobToUI(job) {
  const jobsBody = document.getElementById("jobsBody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
  <td class="job" id=${job.id}>${job.position}</td>
  <td>${job.company}</td>
  <td>${job.maxSalary}</td>
  <td>${job.location}</td>
  <td>${job.status}</td>
  <td>${job.dateApplied.split("T")[0]}</td>
  <td>${job.description}</td>
  `;
  jobsBody.appendChild(tr);
}

async function getJobs() {
  try {
    const filteredStatus = localStorage.getItem("filteredstatus");
    const filteredStartDate = localStorage.getItem("filteredstartdate");
    const filteredEndDate = localStorage.getItem("filteredenddate");
    const filteredMinSalary = localStorage.getItem("filteredminsalary");
    const searchKeyword = localStorage.getItem("searchkeyword");
    let urlWithQuery = `${server}/job/all?`;
    if (filteredStatus)
      urlWithQuery += `status=${encodeURIComponent(filteredStatus)}&`;
    if (filteredMinSalary)
      urlWithQuery += `salary=${encodeURIComponent(filteredMinSalary)}&`;
    if (filteredStartDate)
      urlWithQuery += `startDate=${encodeURIComponent(filteredStartDate)}&`;
    if (filteredEndDate)
      urlWithQuery += `endDate=${encodeURIComponent(filteredEndDate)}&`;
    if (searchKeyword)
      urlWithQuery += `keyword=${encodeURIComponent(searchKeyword)}&`;

    urlWithQuery = urlWithQuery.slice(0, -1);
    let data = await fetch(`${urlWithQuery}`, {
      headers: {
        token: token,
      },
    });
    data = await data.json();
    return data.jobs;
  } catch (e) {
    console.log(e);
  }
}

async function createJob(job) {
  try {
    let data = await fetch(`${server}/job`, {
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(job),
    });
    data = await data.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}

async function getUser() {
  try {
    let data = await fetch(`${server}/user`, {
      headers: {
        token: token,
      },
    });
    data = await data.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}

async function updateUser(updateBody) {
  try {
    let data = await fetch(`${server}/user`, {
      headers: {
        token: token,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(updateBody),
    });
    data = await data.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}

function logout() {
  localStorage.clear();

  window.location.href = "./index.html";
}
