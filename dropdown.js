var btn = document.querySelector("button");

var dropdown = document.querySelector(".dropdown-options");

var optionLinks = document.querySelectorAll(".option a");

console.log(optionLinks);

btn.addEventListener("click", function(e) {
   e.preventDefault();
   console.log("btn");
   dropdown.classList.toggle("open");
});

var clickFn = function(e) {
   e.preventDefault();

   dropdown.classList.remove("open");

   btn.innerHTML = this.text;
   var activeLink = document.querySelector(".option .active")

   if (activeLink) {
      activeLink.classList.remove("active");
   }

   this.classList.add("active");
}

for (var i = 0; i < optionLinks.length; i++) {
   optionLinks[i].addEventListener("mousedown", clickFn, false);
}