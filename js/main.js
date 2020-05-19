$(document).ready(function(){
    

    function initApp(){
        $('.dynamic-dropdown-content').html('<li><a href="listform.html">Списковая форма</a></li>'
        +'<li><a href="editform.html">Форма редактирования</a></li>'
        +'<li><a href="login.html">Логин</a></li>'
        +'<li class="divider"></li>');


        // ИНИЦИАЛИЗАЦИЯ ЭЛЕМЕНТОВ MATERIALIZE
        $(".dropdown-trigger").dropdown({
            constrainWidth: false
        });
    }

    initApp();
});