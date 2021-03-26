// id check
$("#id").change(function(){
    var user_id = $('#id').val();
    $.ajax({
      url:'../ajax/checkid/',
      data:{
        'id' : user_id
      },
      dataType: 'json',
      success: function(data){
        if(data['check']){
          $("input[type=text][name=id]").val('');
          alert("id 중복")
        }
      }
    })
  });
// password check
$("#password").change(function(){
  var password = $('#password').val();
  var passwordRegExp = /^[a-zA-z0-9]{4,12}$/;
  if (!passwordRegExp.test(password)){
    $("input[type=password][name=password]").val('');
    alert("비밀번호는 영문 대소문자와 숫자 4~12자리로 입력해야합니다")
  }
});
// email check
$("#email").change(function(){
    var email = $('#email').val();
    var emailRegExp = /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;
    if (!emailRegExp.test(email)){
      $("input[type=email][name=email]").val('');
      alert("email 형식이 올바르지 않습니다")
    }
  });

