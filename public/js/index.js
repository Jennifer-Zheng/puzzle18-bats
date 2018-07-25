function submitResults() {
  var ans = $("#answer").val();
  $.post("/", {code: ans}, data=>{
    if(data.status==="success") {
      alert("Admin access approved.");
      window.location.replace(data.redirect);
    }
    else {
      alert("Admin access denied.");
    }
  });
}
