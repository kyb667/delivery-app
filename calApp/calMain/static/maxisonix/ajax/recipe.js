var allRecipeList;
var index = 1;
var maxIndex = 1;

function allowDrop(ev){
    ev.preventDefault();
};
function drag(ev){
    ev.dataTransfer.setData("text", ev.target.id);
};
function drop(ev){
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
};
$('#selectrecipegroup').click(function(){
    console.log(nextPageNum)
    $('#sortable').empty();
    $.ajax({
        url:"./getRecipeGroups/",
        success: function(data){
            ul = document.querySelector('#sortable')
            div = document.querySelector('#div1')
            $(".selectrecipe").attr('id','recipegroup')
            html = ''
            var result = data['recipegroups']
            console.log(result)
            for (var i = 0; i < result.length; i++ ){
                info = result[i]
                html += '<li draggable="true" ondragstart="drag(event)"><a class="current" href="" id="' + 
                        info.recipegroup + '" ondrop="drop(event)" ondragover="allowDrop(event)" draggable="true" ondragstart="drag(event)" >' +
                        info.recipegroup + '</a></li>'
            }
            ul.innerHTML = html;
            div.innerHTML = '';
        }
    })
});
$('#selectrecipetype').click(function(){
    $('#sortable').empty();
    $.ajax({
        url:"./getRecipeTypes/",
        success: function(data){
            ul = document.querySelector('#sortable')
            div = document.querySelector('#div1')
            $(".selectrecipe").attr('id','recipetype')
            html = ''
            var result = data['recipetypes']
            console.log(result)
            for (var i = 0; i < result.length; i++ ){
                info = result[i]
                html += '<li draggable="true" ondragstart="drag(event)"><a class="current" href="" id="' + 
                        info.recipetype + '" ondrop="drop(event)" ondragover="allowDrop(event)" draggable="true" ondragstart="drag(event)" >' +
                        info.recipetype + '</a></li>'
            }
            ul.innerHTML = html;
            div.innerHTML = '';
        }
    })
});
$('#selectrecipelevel').click(function(){
    $('#sortable').empty();
    $.ajax({
        url:"./getRecipeLevels/",
        success: function(data){
            ul = document.querySelector('#sortable')
            div = document.querySelector('#div1')
            $(".selectrecipe").attr('id','recipelevel')
            html = ''
            var result = data['recipelevel']
            console.log(result)
            for (var i = 0; i < result.length; i++ ){
                info = result[i]
                html += '<li draggable="true" ondragstart="drag(event)"><a class="current" href="" id="' + 
                        info.recipelevel + '" ondrop="drop(event)" ondragover="allowDrop(event)" draggable="true" ondragstart="drag(event)" >' +
                        info.recipelevel + '</a></li>'
            }
            ul.innerHTML = html;
            div.innerHTML = '';
        }
    })
});
$('#selectrecipecookingtime').click(function(){
    $('#sortable').empty();
    $.ajax({
        url:"./getRecipeTimes/",
        success: function(data){
            ul = document.querySelector('#sortable')
            div = document.querySelector('#div1')
            $(".selectrecipe").attr('id','recipetime')
            html = ''
            var result = data['recipecookingtime']
            console.log(result)
            for (var i = 0; i < result.length; i++ ){
                info = result[i]
                html += '<li draggable="true" ondragstart="drag(event)"><a class="current" href="" id="' + 
                        info.recipecookingtime + '" ondrop="drop(event)" ondragover="allowDrop(event)" draggable="true" ondragstart="drag(event)" >' +
                        info.recipecookingtime + '</a></li>'
            }
            ul.innerHTML = html;
            div.innerHTML = '';
        }
    })
});
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
    console.log(456)
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
            console.log(recipeList)
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
                console.log(info)
                show_html += '<li class="one_quarter ' + first +'">' +
                        '<a href=""><img src="' + info.recipeimage + '" alt=""></a>' +
                        '<div><a href="">' + info.recipename + '</a></div>' +
                        '<div>' + info.recipesummary + '</div></li>'
                console.log(show_html)
            }
            show_ul.innerHTML = show_html;
            if (minPage > 0){ maxPage += 1 }
            maxIndex = maxPage
            if (maxPage > 11){ maxPage = 11 }
            chage_html += '<li id="backPage"><a>&laquo; Previous</a></li>'
            for ( var i = 1; i < maxPage; i ++){
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
$('#selectrecipe').click(function(){
    var selectList = document.getElementById('div1').innerText
    if (selectList != ""){
        var x = document.getElementsByClassName("selectrecipe");
        selectRecipe(selectList, x[0].id)
    }
});
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
            show_html += '<li class="one_quarter ' + first +'">' +
            '<a href=""><img src="' + info.recipeimage + '" alt=""></a>' +
            '<div><a href="">' + info.recipename + '</a></div>' +
            '<div>' + info.recipesummary + '</div></li>'
        }
        var maxPage = maxIndex
        var minPage = num - 3
        // 맨뒷자리
        if (num == maxIndex){
            minPage = num - 9
            maxPage = num
        }else{
            // 뒷자리 체크
            if (maxPage - num < 6){
                a = 6 - (maxIndex - num)
                minPage -= a
            }else{
                console.log('-----')
                console.log(minPage)
                console.log(maxPage)
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
                console.log('-----')
                console.log(minPage)
                console.log(maxPage)
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
    var num = $(this).data('id')
    index = num
    showRecipe(index)
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

$(function(){
    console.log(123)
    selectRecipe('', 'all')
})

