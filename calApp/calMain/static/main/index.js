$(document).ready(function(){
    $('#product_top3').empty()
    var form = document.querySelector('#product_top3')
    $.ajax({
        url:'./getTopthree',
        success:function(data){
            html = ''
            for (var i = 0; i < 3; i ++){
                var info = data['threeList'][i][0]
                if (i == 0){
                    html += '<li class="one_third first">'
                }else{
                    html += '<li class="one_third">'
                }
                html += '<article><a class="inverse" href="#">'
                html += '<img src="../static/calMain/images/our-work/img-1.jpg" alt="height=auto"/></a>'
                html +='<h6 class="heading font-x1">'+ info['recipename'] +'</h6>' 
                html += '<p>'+ info['recipesummary'] +'</p>'
                html += '<footer><a href="./showrecipe/'+ info['food_name_id']+'_'+ info['recipeid'] +'">Read More &raquo;</a></footer>'
                html += '</article></li>'
            }
            form.innerHTML += html
        }
    }),
    $('#getPopular').empty()
    var form1 = document.querySelector('#getPopular')
    $.ajax({
        url:'./getPopularProdect',
        success:function(data){
            html = '<h2 class="heading">오늘의 인기 레시피</h2>'
            html += '<p class="btmspace-50">'+ data['popular']['recipename'] +'<br/></p>'
            html += '<article><a href="#"><i class="icon fa fa-odnoklassniki"></i></a>'
            html += '<h6 class="heading font-x1"> 판매자(<a>'+ data['popular']['seller_id_id'] +'</a>) 한마디 </h6>'
            html += '<p>'+ data['popular']['recipesummary'] +'</p>'
            html += '</article>'
            html += '<article><a href="#"><i class="icon fa fa-odnoklassniki"></i></a>'
            html += '<h6 class="heading font-x1"> 재료 </h6>'
            html += '<p>라면</p>'
            html += '</article>'
            html += '<article><a href="#"><i class="icon fa fa-object-ungroup"></i></a>'
            html += '<h6 class="heading font-x1">만드는 방법</h6>'
            for (var i = 0; i< data['valList'][0].length; i++){
                html += '<p>'+data['valList'][0][i]['recipedetailnum'] + '. '
                html += data['valList'][0][i]['recipedetailtext'] + '</p>'
            }
            html += '</article>'
            form1.innerHTML += html
        }
    })
})