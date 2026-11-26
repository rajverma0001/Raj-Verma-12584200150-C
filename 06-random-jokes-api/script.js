const fetchJokeBtn = document.getElementById("fetchJokeBtn");
const jokeSetup = document.getElementById("jokeSetup");
const jokePunch = document.getElementById("jokePunch");
const categoryTag = document.getElementById("categoryTag");

async function loadJoke() {
  fetchJokeBtn.disabled = true;
  jokeSetup.textContent = "Fetching a fresh joke...";
  jokePunch.textContent = "";

  try {
    const res = await fetch("https://official-joke-api.appspot.com/random_joke");
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const joke = await res.json();

    categoryTag.textContent = joke.type || "General";
    jokeSetup.textContent = joke.setup;
    jokePunch.textContent = joke.punchline;
  } catch (error) {
    jokeSetup.textContent = "Unable to reach the joke API. Check your internet connection.";
    jokePunch.textContent = error.message;
  } finally {
    fetchJokeBtn.disabled = false;
  }
}

fetchJokeBtn.addEventListener("click", loadJoke);
loadJoke();
