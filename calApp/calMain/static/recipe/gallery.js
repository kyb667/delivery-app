var allRecipeList;
var index = 1;
var maxIndex = 1;
var direct_search_check = 0;
var condition_search_check = 0;

function selectRecipe(selectList, group){
    if ($('#show_recipe_list').length > 0){
        $.ajax({
            url:"./select",
            data: {'selectList' : selectList , 'group' :group},
            dataType: 'json',
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
                if (maxPage > 9){ maxPage = 9 }
                if (data['data'].length > 0){
                    chage_html += '<li id="backPage"><a>&laquo; Previous</a></li>'
                }
                for ( var i = 1; i <= maxPage; i ++){
                    var css = ''
                    if (i == 1){ css = 'current' }
                    chage_html += '<li class="showPage ' + css +'" data-id="' + i +'">' +
                                    ' <a>' + i +'</a>' +
                                    '</li>'
                }
                if (data['data'].length > 0){
                    chage_html += '<li id="nextPage"><a>Next &raquo;</a></li>'
                }else{
                    chage_html += '<li><div> 해당하는 상품이 없습니다 </div></li>'
                }
                chage_ul.innerHTML = chage_html;
            },
            error: function(data){
                alert('selectRecipe error')
            }
        })
    }
}
function showRecipe(showIndexNum){
    index = showIndexNum
    if (allRecipeList){
        $('#show_recipe_list').empty();
        $('#chage_recipe').empty();
        show_ul = document.querySelector('#show_recipe_list')
        chage_ul = document.querySelector('#chage_recipe')
        show_html = ''
        chage_html = ''
        var recipeLen = allRecipeList.length
        var indexMaxLen = parseInt(recipeLen/16)
        var showMinIndex = 0
        var showMaxIndex = 0
        var css = 0
        if (recipeLen % 16 != 0){
            indexMaxLen += 1
        }
        maxIndex = indexMaxLen
        if (showIndexNum <= 1){
            showMinIndex = 0
            showMaxIndex = 15
        }else{
            showMinIndex = 15*(showIndexNum-1) + (showIndexNum-1)
            showMaxIndex = showMinIndex + 16
        }
        for (var i = showMinIndex; i <= showMaxIndex ; i ++){
            info = allRecipeList[i]
            css += 1
            first = ''
            if (info){
                if (css % 4 == 1){ first = 'first' }
                if ('foodname' in info){
                    show_html += '<li class="one_quarter show_recipedetail '+ first +'" name="'+ info.foodname +'">' +
                            '<a><img src="' + info.recipeimage + '" alt=""></a>' +
                            '<div>' + info.foodname + '</div></li>'
                }
                else{
                    show_html += '<li class="one_quarter '+ first +'">' +
                                '<a href="../showrecipe/'+ info.recipename +'_'+ info.recipeid +'/">' +
                                '<div>' + info.recipename + '</div>' + info.price + '</a></li>'
                }
            }else{
                break
            }
        }
        var minIndexBtn = 1
        var maxIndexBtn = indexMaxLen
        if (indexMaxLen > 9){
            if (showIndexNum > indexMaxLen -4){
                minIndexBtn = indexMaxLen - 8
                maxIndexBtn = indexMaxLen
            }else if (showIndexNum > 4){
                if(showIndexNum <= indexMaxLen -4){
                    minIndexBtn = showIndexNum - 4
                    maxIndexBtn = showIndexNum + 4
                }
            }else{
                minIndexBtn = 1
                maxIndexBtn = 9
            }
            if (minIndexBtn < 1){minIndexBtn = 1}
            if (maxIndexBtn > indexMaxLen){maxIndexBtn = indexMaxLen}
        }
        chage_html += '<li id="backPage"><a>&laquo; Previous</a></li>'
        for (var i = minIndexBtn; i <= maxIndexBtn; i++){
            var css = ''
            if (i == showIndexNum){ css = 'current' }
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
        html += '<div> <fieldset><input type="text" id="direct_search_input" placeholder="음식 이름을 입력해주세요" onkeyup="select_search_word(this)"><ul id="search_word_list"></ul></fieldset></div>'
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
                    html += '<li style="background-color:#F7F7F7" class="show_recipedetail" name="'+ info.foodname +'"><a>'+ info.foodname +'</a></li>'
                }
                list.innerHTML = html;
            }
        })
    }
}
// 레시피만 나오게 함
$(document).on('click', '.show_recipedetail', function(){
    $('#search_word_list').empty()
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
                if(len % 16 !=0){maxPage += 1}
                if (len > 16){ len = 16 }
                css = 1
                for (var i = 0; i < len; i++){
                    info = recipeList[i]
                    css += 1
                    first = ''
                    if (css % 4 == 1){ first = 'first' }
                    show_html += '<li class="one_quarter '+ first +'">' +
                                '<a href="../showrecipe/'+ info.recipename +'_'+ info.recipeid +'/">' +
                                '<div>' + info.recipename + '</div>' + info.price + '</a></li>'
                }
                show_ul.innerHTML = show_html;
                maxIndex = maxPage
                if (maxPage > 9){ maxPage = 9 }
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
