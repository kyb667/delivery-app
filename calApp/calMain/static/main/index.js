$(document).ready(function(){
    $('#product_top3').empty()
    var form = document.querySelector('#product_top3')
    $.ajax({
        url:'./getTopthree',
        success:function(data){
            html = ''
            for (var i = 0; i < 3; i ++){
                var info = data['threeList'][i]
                if (i == 0){
                    html += '<li class="one_third first">'
                }else{
                    html += '<li class="one_third">'
                }
                html += '<article><a class="inverse" href="#">'
                html += '<img src="../static/calMain/images/our-work/img-1.jpg" alt="height=auto"/></a>'
                html +='<h6 class="heading font-x1">'+ info['recipename'] +'</h6>' 
                html += '<p>'+ info['recipesummary'] +'</p>'
                html += '<footer><a href="#">Read More &raquo;</a></footer>'
                html += '</article></li>'
            }
            form.innerHTML += html
        }
    })
})