function copyFunction() {
    var copyText = document.getElementById("copyInput");

    copyText.select();
    copyText.setSelectionRange(0, 99999); 
    navigator.clipboard.writeText(copyText.value);
    alert("Copied text: " + copyText.value);
  }