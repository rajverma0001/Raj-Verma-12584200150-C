const countryForm = document.getElementById("countryForm");
const countryField = document.getElementById("countryField");
const infoBanner = document.getElementById("infoBanner");
const uniTableBody = document.getElementById("uniTableBody");

async function loadUniversities(countryName) {
  infoBanner.textContent = `Loading universities for "${countryName}"...`;
  uniTableBody.innerHTML = "";

  try {
    const endpoint = `http://universities.hipolabs.com/search?country=${encodeURIComponent(countryName)}`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();

    if (!list.length) {
      infoBanner.textContent = `No records found for "${countryName}".`;
      return;
    }

    infoBanner.textContent = `Found ${list.length} universities in ${countryName}.`;

    list.forEach((item, index) => {
      const row = document.createElement("tr");
      const site = (item.web_pages && item.web_pages[0]) || "";
      const region = item["state-province"] || "Not Specified";

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${region}</td>
        <td>${site ? `<a href="${site}" target="_blank" rel="noopener noreferrer">${site}</a>` : "N/A"}</td>
      `;
      uniTableBody.appendChild(row);
    });
  } catch (err) {
    infoBanner.textContent = `Failed to load data: ${err.message}`;
  }
}

countryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = countryField.value.trim();
  if (value) loadUniversities(value);
});

loadUniversities(countryField.value.trim());
