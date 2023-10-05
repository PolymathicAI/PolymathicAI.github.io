function filterFunction(text) {
  teamMembers = document.querySelectorAll(".team-member");
  teamMembers.forEach((element) => {
    currentName = element.querySelector(".name").textContent.toLowerCase();
    if (currentName.includes(text.toLowerCase())) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
}
