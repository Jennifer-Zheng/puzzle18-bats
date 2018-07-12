function submitResults() {
  var ans = $("#answer").val();
  $.post("/", {code: ans}, data=>{
    if(data.status==="success")
      alert("Admin access approved.");
    else {
      alert("Admin access denied.");
    }
  });
}
