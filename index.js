$(function(){
  $.ajax({
    url: "http://localhost:3000/candidates",
    data: {
    },
    type: "GET",
    dataType : "json",
  }).done(function(data) {
      $(".name1").text(data[0]["firstname"]+" "+data[0]["lastname"])
      $(".name2").text(data[1]["firstname"]+" "+data[1]["lastname"])
      $(".manifesto1").text(data[0]["manifesto"])
      $(".manifesto2").text(data[1]["manifesto"])
  })
  console.log(localStorage.getItem("id"))
  if (localStorage.getItem("id")!==null) {
    
  }
  $("#login2").click(function() {
    var lastname = $("#lastname").val()
    var voterid = $("#voterid").val()
    error = true
    console.log(lastname)
    $.ajax({
      url: "http://localhost:3000/voters",
      type: "GET",
      data:{},
      dataType: "json",
      contentType: "application/json"
    }).done(function(data) {
      console.log(data)
      ans = data.filter(element => element["lastname"] === lastname && element["id"] === voterid)
      console.log(ans)
      $.each(data, function(key, value) {
        if (lastname==value.lastname && voterid==value.id) {
          error = false
          console.log("okay")
        }
      })
      if (error === false) {
        $("#loginform").attr("action", "dash.html")
        alert("success")
        document.location="/dash.html"
        localStorage.setItem("id", voterid)
      }
      else {alert("Invalid Credentials!")}
    })
  })
  $("#logout").click(function(){
    localStorage.removeItem("id");
    document.location="/index.html"
  })
  $(".vote1").click(function() {
    $.ajax({
      url: "http://localhost:3000/candidates?id=1",
      data: {
      },
      type: "GET",
      dataType : "json",
    }).done(function(){
      var votes = data[0].votes;
      console.log(votes);
    })
    votesObject = {"votes":votes+1}
    $.ajax({
      url: "http://localhost:3000/candidates?id=1",
      data: JSON.stringify(votesObject),
      type: "PATCH",
      dataType : "json",
    }).done()
  })
})