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
    $.ajax({
      url: "http://localhost:3000/voters",
      type: "GET",
      data:{},
      dataType: "json",
      contentType: "application/json"
    }).done(function(data) {
      $.each(data, function(key, value) {
        if (lastname==value.lastname && voterid==value.id) {
          error = false
          let votecheck = value.hasVoted
        }
      })
      if (error === false) {
        $("#loginform").attr("action", "dash.html")
        alert("success")
        document.location="/dash.html"
        localStorage.setItem("id", voterid)
        if (votecheck===true) {
          $(".vote").attr("disabled", true)
        } 
      }
      else {
        alert("Invalid Credentials!")
        document.location="#"
      }
    })
  })
  $("#logout").click(function(){
    localStorage.removeItem("id");
    document.location="/index.html"
  })
  $(".vote1").click(function() {
    let candidate;
    $.ajax({
      url: "http://localhost:3000/candidates/1",
      type: "GET",
      dataType : "json",
    }).done(function(result){
      candidate = result;
      console.log(candidate)
      votes = Number(candidate.votes) + 1;
      
      $.ajax({
        url: "http://localhost:3000/candidates/1",
        data: {votes: votes},
        type: "PATCH",
        dataType : "json",
      }).done(function() {
        $(".vote").hide()
      })
    })
  })
  $(".vote2").click(function() {
    let candidate;
    $.ajax({
      url: "http://localhost:3000/candidates/2",
      type: "GET",
      dataType : "json",
    }).done(function(result){

      candidate = result;
      console.log(candidate)
      votes = Number(candidate.votes) + 1;

      $.ajax({
        url: "http://localhost:3000/candidates/2",
        data: {votes: votes},
        type: "PATCH",
        dataType : "json",
      }).done(function() {
        $(".vote").hide()
      })
    })
  })
  $(".candidateDetails").click(function(){
    $.ajax({
      url: "http://localhost:3000/voters/"+localStorage.getItem("id"),
      type: "GET",
      data:{},
      dataType: "json",
      contentType: "application/json"
    }).done(function(data) {
      let votecheck = data.hasVoted
      if (votecheck===true) {
        $(".vote").attr("disabled", true)
      }
    })
  })
})

