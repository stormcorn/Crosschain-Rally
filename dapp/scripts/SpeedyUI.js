$("#enter-cro").click(function () {
  $("#splashScreen").fadeOut();
  $("#pagina-content").fadeIn();
  $("#tab-group-2").fadeIn();
});

$(document).ready(function () {
  $("#tab-group-2").hide();
});

function showLogin() {
  $("#conBut").fadeIn();
}