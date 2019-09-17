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
  localStorage.setItem("id", "1")
  var voterid = localStorage.getItem("id")
  // console.log(parseInt(voterid))
  $("#login").click(function() {
    var lastname = $("#lastname").val()
    console.log(lastname)
    var voterid = $("#voterid").val()
    console.log("click")
    $.ajax({
      url: "http://localhost:3000/voters",
      type: "POST",
      dataType: "json",
      contentType: "application/json"
    }).done(function(data) {
      ans = data.filter(element => element["lastname"] === lastname && element["id"] === voterid)
      console.log(ans.length>0)
    })
  })
})

