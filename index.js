$(function(){

  // Populate Candidate Details in user dash
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

  // On click login, if user logged in before then go to dashboard
  $(".navlogin").click(function(){
    if (localStorage.getItem("id")!==null) {
      document.location=dash.html
    }
  })

  // Validate login and add user id to local storage
  $("#login2").click(function() {
    var ninlogin = $("#ninlogin").val()
    var passwordlogin = $("#passwordlogin").val()
    error = true
    $.ajax({
      url: "http://localhost:3000/voters",
      type: "GET",
      data:{},
      dataType: "json",
      contentType: "application/json"
    }).done(function(data) {
      $.each(data, function(key, value) {
        if (ninlogin==value.nin && passwordlogin==value.password) {
          error = false
          voterid = value.id
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

  // Populates db with new user details from signup
  $("#signup").click(function(){
    var firstnameSignup = $("#firstname").val()
    var lastnameSignup = $("#lastname").val()
    var emailSignup = $("#email").val()
    var passwordSignup = $("#password").val()
    var ninSignup = $("#nin").val()
    alreadyExists = false
    newUser = {
      "firstname": firstnameSignup, "lastname": lastnameSignup, "email": emailSignup, "password": passwordSignup, "hasVoted": false, "nin": ninSignup
    }

    $.ajax({
      url: "http://localhost:3000/voters",
      type: "POST",
      data: JSON.stringify(newUser),
      dataType: "json",
      contentType: "application/json"
    }).done(function() {
      alert("Registration Successful")
      // document.location="#"
    })
  })

  // Clear local storage on user log out
  $("#logout").click(function(){
    localStorage.removeItem("id");
    document.location="/index.html"
  })

  // When user votes, disable the user's ability to vote again
  $(".vote").click(function(){
    votecheck = {"hasVoted": true}
    $.ajax({
      url: "http://localhost:3000/voters/"+localStorage.getItem("id"),
      type: "PATCH",
      data:JSON.stringify(votecheck),
      dataType: "json",
      contentType: "application/json"
    }).done(alert("Thank you for participating!"))
  })

  // When user votes, update candidate1 vote count
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

  // When user votes, update candidate2 vote count
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

  // If user has voted before, disable vote button
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

