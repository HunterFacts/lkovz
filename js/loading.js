function isNull (string){
    return string == null || string == undefined || string == "";
}
function initAuth(){
    if (!isNull(localStorage.getItem('session_token'))){
        
    }
    else {
        document.location.href = "./login.html";
    }
}
initAuth();