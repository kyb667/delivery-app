var allRecipeList;
var index = 1;
var maxIndex = 1;
var direct_search_check = 0;
var condition_search_check = 0;

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function selectRecipe(selectList, group){
    var token = getCookie('csrftoken');
    $.ajax({
        headers: { "X-CSRFToken": token },
        type:'POST',
        url:'./select/',
        data: {'selectList' : selectList , 'group' :group},
        dataType: 'json',
        async:false,
        success : function(data){
            recipeList = data['data']
            allRecipeList = data['data']
            $('#show_recipe_list').empty();
            $('#chage_recipe').empty();
            show_ul = document.querySelector('#show_recipe_list')
            show_html = ''
            chage_ul = document.querySelector('#chage_recipe')
            chage_html = ''
            var len = recipeList.length
            var maxPage = Math.floor(len / 16)
            var minPage = len % 16
            if (len > 16){ len = 16 }
            for (var i = 0; i < len; i++){
                info = recipeList[i]
                css = i + 1
                first = ''
                if (css % 4 == 1){ first = 'first' }
                show_html += '<li class="one_quarter show_recipedetail '+ first +'" name="'+ info.foodname +'">' +
                        '<a><img src="' + info.recipeimage + '" alt=""></a>' +
                        '<div>' + info.foodname + '</div></li>'
            }
            show_ul.innerHTML = show_html;
            if (minPage > 0){ maxPage += 1 }
            maxIndex = maxPage
            if (maxPage > 10){ maxPage = 10 }
            chage_html += '<li id="backPage"><a>&laquo; Previous</a></li>'
            for ( var i = 1; i <= maxPage; i ++){
                var css = ''
                if (i == 1){ css = 'current' }
                chage_html += '<li class="showPage ' + css +'" data-id="' + i +'">' +
                                ' <a>' + i +'</a>' +
                                '</li>'
            }
            chage_html += '<li id="nextPage"><a>Next &raquo;</a></li>'
            chage_ul.innerHTML = chage_html;
        }
    })
}
function showRecipe(num){
    if (allRecipeList){
        $('#show_recipe_list').empty();
        $('#chage_recipe').empty();
        show_ul = document.querySelector('#show_recipe_list')
        chage_ul = document.querySelector('#chage_recipe')
        show_html = ''
        chage_html = ''
        var listLen = allRecipeList.length
        var len = 16 * (num -1)
        var show_max = 16 * (num)
        if (show_max > listLen){
            show_max = listLen
        }
        for (var i = len; i < show_max ; i ++){
            info = recipeList[i]
            css = i + 1
            first = ''
            if (css % 4 == 1){ first = 'first' }
            show_html += '<li class="one_quarter show_recipedetail ' + first +'" name="'+ info.recipename +'">' +
            '<a><img src="' + info.recipeimage + '" alt=""></a>' +
            '<div>' + info.recipename + '</div>' +
            '<div>' + info.recipesummary + '</div></li>'
        }
        var maxPage = maxIndex
        var minPage = num - 3
        //TODO 보완이 필요함
        if (num == maxIndex){
            if (num > 9){
                minPage = num - 9
                maxPage = num
            }else{
                minPage = 1
                maxPage = num
            }
            
        }else{
            // 뒷자리 체크
            if (maxPage - num < 6){
                a = 6 - (maxIndex - num)
                minPage -= a
            }else{
                // 앞자리 체크
                if (num <= 4){
                    minPage = 1
                    maxPage = 10
                }
                else{
                    if(num + 5 < maxPage){
                        maxPage = num + 5
                    }
                } 
            }
        }
        chage_html += '<li id="backPage"><a>&laquo; Previous</a></li>'
        for (var i = minPage; i <= maxPage; i++){
            var css = ''
            if (i == num){ css = 'current' }
            chage_html += '<li class="showPage ' + css +'" data-id="' + i +'">' +
                            ' <a>' + i +'</a>' +
                            '</li>'
        }
        chage_html += '<li id="nextPage"><a>Next &raquo;</a></li>'
        show_ul.innerHTML = show_html;
        chage_ul.innerHTML = chage_html;
    }else{
        selectRecipe('', 'all')
    }
    
}
$(document).on("click", ".showPage", function(){
    showRecipe($(this).data('id'))
});
$(document).on("click", "#backPage", function(){
    if (index > 1){
        index -= 1
        showRecipe(index)
    }
});
$(document).on("click", "#nextPage", function(){
    if (index + 1 <= maxIndex){
        index += 1
        showRecipe(index)
    }
});
// 직접검색 드롭다운
$(document).on("click", "#direct_search_btn", function(){
    direct_search_check += 1
    $('#direct_search').empty();
    showHtml = document.querySelector('#direct_search')
    if (direct_search_check % 2 == 1){
        html = '<header> <address> By <a id="direct_search_btn"> 직접검색 <i id="direct_search_btn_css" class="fa fa-chevron-up"></i> </a> </address> </header>'
        html += '<form method="post" action="#"> <fieldset>  <input type="text" placeholder="음식 이름을 입력해주세요" onkeyup="select_search_word(this)"><ul id="search_word_list"></ul></fieldset></form>'
    }
    else{
        html = '<header> <address> By <a id="direct_search_btn"> 직접검색 <i id="direct_search_btn_css" class="fa fa-chevron-down"></i> </a> </address> </header>'
    }
    showHtml.innerHTML = html;
})
// 조건검색 드롭다운
$(document).on("click", "#condition_search_btn", function(){
    condition_search_check += 1
    $('#condition_search').empty();
    showHtml = document.querySelector('#condition_search')
    if (condition_search_check % 2 == 1){
        html = '<header> <address> By <a id="condition_search_btn"> 조건검색 <i id="condition_search_btn_css" class="fa fa-chevron-up"></i> </a></address> </header>'
        html += '<div class="comcont"> <nav class="pagination"> <ul>'
        $.ajax({
            url:"./getRecipeTypes/",
            success: function(data){
                var result = data['recipetypes']
                for (var i = 0; i < result.length; i++ ){
                    info = result[i]
                    html += '<li style="background-color: white;"> <a class="select_recipe_group" id="'+ info.fooddetail +'">'+ info.fooddetail +' </a> </li>'
                }
                html += '</ul> </nav> </div>'
                showHtml.innerHTML = html;
            },
        })
    }else{
        html = '<header> <address> By <a id="condition_search_btn"> 조건검색 <i id="condition_search_btn_css" class="fa fa-chevron-down"></i> </a></address> </header>'
        showHtml.innerHTML = html;
    }
    
});
//조건검색 그룹 표시
$(document).on("click",".select_recipe_group", function(){
    var id = $(this).attr('id')
    selectRecipe(id, 'recipetype')
})
//처음 로드
$(function(){
    selectRecipe('', 'all')
})
//직접검색 표시
function select_search_word(target){
    var word = encodeURI(target.value);
    if (word){
        $.ajax({
            type:'GET',
            dataType:'json',
            url:'./getRecipeNames/'+word+'/',
            success : function(data){
                var data = data['recipenames']
                $('#search_word_list').empty()
                list = document.querySelector('#search_word_list')
                html = ''
                for (var i = 0; i < data.length; i++){
                    info = data[i]
                    html += '<li style="background-color:#F7F7F7" class="show_recipedetail" name="'+ info.recipename +'"><a>'+ info.recipename +'</a></li>'
                }
                list.innerHTML = html;
            }
        })
    }
    
}
// 닭갈비 레시피만 나오게 함
$(document).on('click', '.show_recipedetail', function(){
    var name = encodeURI($(this).attr('name'))
    $.ajax({
        type:'GET',
        dataType:'json',
        url:'./'+name+'/',
        success : function(data){
            recipeList = data['recipeInfo']
            allRecipeList = data['recipeInfo']
            $('#show_recipe_list').empty();
            $('#chage_recipe').empty();
            show_ul = document.querySelector('#show_recipe_list')
            show_html = ''
            chage_ul = document.querySelector('#chage_recipe')
            chage_html = ''
            if (recipeList){
                var len = recipeList.length
                var maxPage = Math.floor(len / 16)
                var minPage = len % 16
                if (len > 16){ len = 16 }
                for (var i = 0; i < len; i++){
                    info = recipeList[i]
                    css = i + 1
                    show_html += '<li><a href="../showrecipe/'+ info.recipename +'_'+ info.recipeid +'/">' +
                    '<div>' + info.recipename + '</div>' + info.price + '</a></li>'
                }
                show_ul.innerHTML = show_html;
                if (minPage > 0){ maxPage += 1 }
                maxIndex = maxPage
                if (maxPage > 10){ maxPage = 10 }
                chage_html += '<li id="backPage"><a>&laquo; Previous</a></li>'
                for ( var i = 1; i <= maxPage; i ++){
                    var css = ''
                    if (i == 1){ css = 'current' }
                    chage_html += '<li class="showPage ' + css +'" data-id="' + i +'">' +
                                    ' <a>' + i +'</a>' +
                                    '</li>'
                }
                chage_html += '<li id="nextPage"><a>Next &raquo;</a></li>'
                chage_ul.innerHTML = chage_html;  

            }else{
                show_html += '<li><div> 해당하는 상품이 없습니다 </div></li>'
                show_ul.innerHTML = show_html;
            }
            
        }
    })
})
