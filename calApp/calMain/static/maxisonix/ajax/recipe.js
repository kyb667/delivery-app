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
            div.innerHTML = '<br/>';
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
            div.innerHTML = '<br/>';
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
            div.innerHTML = '<br/>';
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
            div.innerHTML = '<br/>';
        }
    })
});
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
$('#selectrecipe').click(function(){
    var selectList = document.getElementById('div1').innerText
    if (selectList != ""){
        var res = selectList.split(" ");
        var token = getCookie('csrftoken');
        var x = document.getElementsByClassName("selectrecipe");
        var group = x[0].id
        $.ajax({
            headers: { "X-CSRFToken": token },
            type:'POST',
            url:'./select/',
            data: JSON.stringify({'selectList': res, 'group':group}),
            dataType: 'json',
            success : function(data){
                console.log(data)
            }
        })
    }
})