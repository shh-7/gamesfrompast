const word = "COMPUTER";

document.getElementById("word").textContent =
    word.split("").map(() => "_").join(" ");