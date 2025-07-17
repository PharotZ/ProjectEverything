function checkPwd() {
  var pw = document.getElementById("pswd").value;
  if(pw == "lardon") {
     document.getElementById("test").style.display="none";
     document.getElementById("bonus").style.display="flex";
     return false;
  } else {
     alert("Password is incorrect");
  }
}