"use strict"

class URLHelper {
    constructor(){
    }

    getParameterById(){

    }

    getAllParameters(){

    }

    setParameter(){

    }
}

class BasicSearch {
    constructor(table, tableForm){
        this.table = table;
        this.tableForm = tableForm;
        this.searchBtn = '.search-button';
        this.clearBtn = '.clear-button';
        this.init();
    }

    init(){
        let self = this;
        $(document).on('click', this.table + ' ' + this.searchBtn ,function(){
            self.searchBtnClick();
        });
        $(document).on('click', this.table + ' ' + this.clearBtn ,function(){
            self.clearSearch();
        });
    }
    searchBtnClick(){
        let jqueryFields = $(this.table + ' .field-search-table input'),
        self = this;
        this.values = [];
        jqueryFields.each(function(index){
            if ($(this).val() != null && $(this).val() != ''){
                let arrayOfVal = $(this).val().split(' '),
                columnname = $(this).data('columnname');
                arrayOfVal.forEach(function(value){
                    if (value != '' && value != ' ' && value != undefined && value != null) {
                        self.values.push({val: value, name: columnname});
                    }
                })
            }
        });
        self.tableForm.isChecked = false;
        self.tableForm.renderData(this.values);
        self.tableForm.buildPagination();
    }
    clearSearch(){
        let self = this;
        $(this.table + ' .field-search-table input').val("");
        self.tableForm.renderData(null);
        self.tableForm.buildPagination();
    }
}

class TableForm {
    constructor(container, view, isCheckers = false, editform = null) {
        this.container = container;
        let defaultView = {name:'main',text:"", type:"main", func: null}
        this.view = view;
        if (isCheckers){this.view.unshift(defaultView)}
        this.isCheckers = isCheckers;
        this.data = [];
        this.page = 1;
        this.countValuesOnPage = 5;
        this.selectedItems = new Map();
        this.searchpage = 1;
        this.isSearch = false;
        this.isChecked = false;
        this.filter = null;
        this.IsEdit = false;
        if (editform != null) {
            this.editform = editform.editform
            this.IsEdit = true;
        }
        this.init();
    }

    init(){
        let self = this;
        $(this.container + ' table').html("<thead><tr></tr></thead><tbody></tbody>");
        $(this.container).append('<ul class="pagination"></ul>');
        $(this.container + ' .pagination-select').formSelect();
        $(this.container + ' .pagination-select').change(function(){
            self.countValuesOnPage = Number($(this).val());
            self.page = 1;
            self.renderData();
            self.buildPagination();
        });
        //$(this.container).append('<ul class="pagination"></ul>');
        this.renderThead()
        $(document).on('click', this.container + ' .pagination a.page' ,function(){
            self.transitionPage($(this).data('page'));
        });
        $(document).on('click', this.container + ' .pagination a.page-chevron' ,function(){
            if (!$(this).hasClass("disabled")) {
                $(this).data('page') == 'next' ? self.nextPage() : self.previousPage();
            }
        });
        
    }

    renderLineThead(text){
        let self = this;
        $(self.container + ' table thead tr').append("<th>"+text+"</th>");
    }

    updateTable(){
        this.page=1;
        this.searchpage=1;
        this.renderData();
        this.buildPagination();
    }

    renderThead(){
        let self = this;
        $(self.container + ' table thead tr').empty();
        self.view.forEach(function(value){
            switch(value.type) {
                case 'main':
                    self.renderLineThead("<a class='dropdown-trigger btn btn-list-options "+self.container.slice(1)+"-dropdown' href='#' data-target='"+self.container.replace(/[\s.,%]/g, '')+"-dropdown'><i class='material-icons'>playlist_add_check</i><i class='material-icons'>arrow_drop_down</i></a>"+
                    "<a class='dropdown-trigger btn btn-update btn-list-options tooltipped' data-position='bottom' data-tooltip='Обновить'><i class='material-icons'>update</i></a>");
                    $(self.container).append("<ul id='"+self.container.replace(/[\s.,%]/g, '')+"-dropdown' class='dropdown-content'>"
                        +'<li><a class="select-all-to-page" href="#!">Выбрать все на странице</a></li>'
                        +'<li><a class="select-all-pages" href="#!">Выбрать все на всех страницах</a></li>'
                        +'<li><a class="watch-selected" href="#!">Посмотреть выбранное</a></li>'
                    +'</ul>');
                    $(self.container + " .btn-update").click(function(){self.updateTable()});
                    $(self.container + " .select-all-pages").click(function(){self.selectAllPages()});
                    $(self.container + " .select-all-to-page").click(function(){self.selectAllToPages()});
                    $(self.container + " .watch-selected").click(function(){self.watchSelected()});
                    $(self.container + " ."+self.container.slice(1)+'-dropdown').dropdown({
                        constrainWidth: false
                    });
                    $(self.container + ' .tooltipped').tooltip();
                    break;          
                default:
                    self.renderLineThead(value.text)
                    break;
            }
            
        });
        self.renderLineThead('');
    }

    buildAdnRenderData(data){
        this.buildData(data);
        this.renderData();
    }

    buildData(data){
        let self = this;
        //urlHelper = new URLHelper();
        self.data = data;
        this.buildPagination();
    }

    watchSelected() {
        let self = this;
        self.filter = [];
        this.selectedItems.forEach(function(value, key){
            self.filter.push({val: value.id, name: 'id'});
        });
        this.isChecked = true;
        this.renderData(self.filter);
        this.buildPagination();
    }

    changeCheckBox(key, obj){
        if ($(this.container + ' table input[data-trigger="'+key+'"]').prop("checked")){
            this.selectedItems.set('select-'+key, obj);
        }
        else {
            this.selectedItems.delete('select-'+key);
        }

        if (this.isChecked){
            this.watchSelected();
        }
    }

    transitionPage(page){
        if (this.isSearch){
            this.searchpage = page;
        }
        else {
            this.page = page;
        }
        this.buildPagination();
        this.renderData(this.filter);
    }

    nextPage(){
        if (this.isSearch){
            this.searchpage = this.searchpage + 1;
        }
        else {
            this.page = this.page + 1;
        }
        this.buildPagination();
        this.renderData(this.filter);
    }

    previousPage(){  
        if (this.isSearch){
            this.searchpage = this.searchpage - 1;
        }
        else {
            this.page = this.page - 1;
        }
        this.buildPagination();
        this.renderData(this.filter);
    }
    
    renderPageInformation(textPages){
        $(self.container + ' .pagination-before').text(textPages.before+1);
        $(self.container + ' .pagination-after').text(textPages.after > textPages.all ? textPages.all : textPages.after);
        $(self.container + ' .pagination-all').text(textPages.all);
    }

    renderData(filter){
        let self = this,
        data = self.data,
        textPages = {
            before: '',
            after: '',
            all: ''
        }
        $(self.container + ' tbody').empty();
        if (filter == undefined || filter == null || filter.length == 0) {
            data = self.data.slice((self.page-1) * this.countValuesOnPage, ((self.page - 1) * self.countValuesOnPage) + self.countValuesOnPage);
            self.isSearch = false;
            self.filterData = null;
            self.filter = null;
            self.isChecked = false;
            textPages.before = (self.page-1) * this.countValuesOnPage;
            textPages.after = ((self.page - 1) * self.countValuesOnPage) + self.countValuesOnPage;
            textPages.all = self.data.length;
        }
        else {
            data = self.data.filter(function(value){
                let checker = false;
                let counter = 0;
                filter.forEach(function(filt){
                    if (self.isChecked) {
                        if (value[filt.name] == filt.val){
                            checker = true;
                            return false;
                        }
                    }
                    else {
                        if (value[filt.name].toUpperCase().indexOf(filt.val.toUpperCase()) != -1){
                            counter++;
                        }
                    }
                    
                })
                return filter.length == counter || checker;
            });
            self.filterData = data;
            data = data.slice((self.searchpage-1) * self.countValuesOnPage, ((self.searchpage - 1) * self.countValuesOnPage) + self.countValuesOnPage);
            self.isSearch = true;
            self.filter = filter;
            textPages.before = (self.searchpage-1) * this.countValuesOnPage;
            textPages.after = ((self.searchpage - 1) * self.countValuesOnPage) + self.countValuesOnPage;
            textPages.all = self.filterData.length;
        }
        data.forEach(function(obj, key){
            $(self.container + ' table tbody').append("<tr class='"+ (self.IsEdit ? "edituser" : "") + "' data-key-id="+obj.id+"></tr>");
            if (self.isCheckers){
                let checked = false;
                var objId = obj.id;
                try {
                    self.selectedItems.forEach(function(value, keySelect){
                        if (keySelect === 'select-'+ objId) {
                            checked = true;
                            return false;
                        }
                    });
                }
                catch (ex){}
                $(self.container + ' table tbody [data-key-id="'+obj.id+'"]').append("<td><p><label><input data-trigger="+obj.id+" type='checkbox' "+(checked ? 'checked' : '')+"/><span></span></label></p></td>");
                $('input[data-trigger="'+obj.id+'"]').change(function() {self.changeCheckBox(obj.id, obj)})
            }
            for (var keyObj in obj) {
                keyObj !== 'id' ? $(self.container + ' table tbody [data-key-id="'+obj.id+'"]').append(
                    self.IsEdit ? "<td><a href='"+self.editform+"?id="+obj.id+"'>"+obj[keyObj]+"</td>":"<td>"+obj[keyObj]+"</td>"
                    ) : undefined;
            }
            self.IsEdit ? ($(self.container + ' table tbody [data-key-id="'+obj.id+'"]').append("<td><a class='tooltipped' data-position='right' data-tooltip='Просмотр' href='"+self.editform+"?id="+obj.id+"'><i class='small edit-icon material-icons'>open_in_new</i></td>")) : undefined;
            self.IsEdit ? $('.tooltipped').tooltip() : undefined;
        });
        self.renderPageInformation(textPages)
    }

    selectAllPages(){
        let data = this.data,
        self = this;
        if (data.length === self.selectedItems.size){
            self.selectedItems.clear()
        }
        else {
            data.forEach(function(obj, key){ 
                self.selectedItems.set('select-'+obj.id, obj);
            });
        }
        this.buildPagination();
        this.renderData(this.filter);
    }

    selectAllToPages(){
        let data = this.data,
        self = this,
        filter = this.filter;
        if (filter == undefined || filter == null || filter.length == 0) {
            data = self.data.slice((self.page-1) * this.countValuesOnPage, ((self.page - 1) * self.countValuesOnPage) + self.countValuesOnPage);
        }
        else {
            data = self.data.filter(function(value){
                let checker = false;
                filter.forEach(function(filt){
                    if (value[filt.name].indexOf(filt.val) != -1){
                        checker = true;
                        return false;
                    }
                })
                return checker;
            });
        }
        data.forEach(function(obj, key){ 
            self.selectedItems.set('select-'+obj.id, obj);
        });
        this.buildPagination();
        this.renderData(this.filter);
    }

    buildPagination(){
        let page = this.isSearch ? this.searchpage : this.page,
        data = this.isSearch ? this.filterData : this.data;
        self = this;
        $(self.container + ' .pagination').empty();
        let i = 1,
        end = page == Math.ceil((data.length / self.countValuesOnPage)) ? page : page == Math.ceil(((data.length / self.countValuesOnPage) - 1)) ? page + 1 : page + 2;
        if (page < 3){
            i = 1;
        } 
        else {
            i = page - 2;
        }

        if (data != undefined && data != null && data.length != 0) {
            $(self.container + ' .pagination').append('<li class="'+(page == 1 ? 'disabled' : '')+'"><a class="page-chevron '+(page == 1 ? 'disabled' : '')+'" data-page="previous" href="#!"><i class="material-icons">chevron_left</i></a></li>');
            while (i < end + 1){
                if (i == page) {
                    $(self.container + ' .pagination').append('<li class="waves-effect active"><a href="#!">'+i+'</a></li>')
                }
                else {
                    $(self.container + ' .pagination').append('<li class="waves-effect"><a class="page" data-page='+i+' href="#!">'+i+'</a></li>')
                }
                i++;
            }
            $(self.container + ' .pagination').append('<li class="'+(page == Math.ceil((data.length / self.countValuesOnPage)) ? 'disabled' : '')+'"><a class="page-chevron '+(page == Math.ceil((data.length / self.countValuesOnPage)) ? 'disabled' : '')+'" data-page="next" href="#!"><i class="material-icons">chevron_right</i></a></li>');
        }
    }
}

function ping(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(function(){
            $.ajax({
                type: 'GET', 
                url: 'http://cab.permedu.ru/api/ping?text=1', 
                headers: {
                    "Content-Type":"application/json",
                    "Accept":"*/*"
                },
            });
            ping(15000)}, ms);
    });
}
ping(0);
function preloaderClose(){
    $( ".preloader-container" ).animate({
        opacity: 0.1
    }, 500, function() {
        $('.preloader-container').hide();
    });
}
$(document).ready(function(){
    function initApp(){
        $('.dynamic-dropdown-content').html('<li><a href="listform.html">Учащиеся с ОВЗ</a></li>'
        +'<li class="divider"></li>');
        $('#fioParent').html(localStorage.getItem('fioParent'));
        $('#exitdropdown').dropdown();
        $('#exitUser').click(function(){
            localStorage.removeItem('session_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('fioParent');
            document.location.href = "./login.html";
        });

        // ИНИЦИАЛИЗАЦИЯ ЭЛЕМЕНТОВ MATERIALIZE
        $("#dropdown-trigger").dropdown({
            constrainWidth: false
        });
    }

    initApp();
});