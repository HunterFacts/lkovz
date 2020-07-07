function isNull (string){
    return string == null || string == undefined || string == "";
}
function initAuth(){
    if (!isNull(localStorage.getItem('session_token'))){
        $.ajax({
            type: 'POST', 
            url: 'http://cab.permedu.ru/api/parent', 
            headers: {
                "Content-Type":"application/json",
                "Accept":"*/*"
            },
            data: JSON.stringify({
                access_token: localStorage.getItem('session_token')
            }),
            success: function(object) {
                authCallback();
            },
            error: function(object){
                if (object.status == 401) {
                    localStorage.removeItem('session_token');
                    localStorage.removeItem('expires_in');
                    localStorage.removeItem('fioParent');
                    document.location.href = "./login.html?expires=true";
                }
            }
        });
    }
    else {
        document.location.href = "./login.html";
    }
}
function authCallback(){}
initAuth();