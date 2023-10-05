function filterFunction(text) {
  teamMembers = document.querySelectorAll(".team-member");
  teamMembers.forEach((element) => {
    currentName = element.querySelector(".name").textContent.toLowerCase();
    if (currentName.includes(text.toLowerCase())) {
      element.parentElement.style.display = "block";
    } else {
      element.parentElement.style.display = "none";
    }
  });
}
