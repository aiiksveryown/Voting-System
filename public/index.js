$(function(){
  // Countdown timer
  $('#countdown-timer').countdown('2019/09/20', function(event) {
    $(this).html(event.strftime('%d Days, %H Hours, %M Minutes and %S Seconds left to vote!'));
  });

  // Date picker
  $("#date-picker").click(function(){
    $(".datepicker").pickadate();
  })

  // Populate Candidate Details in user dash
  $.ajax({
    url: "http://localhost:3000/candidates",
    data: {
    },
    type: "GET",
    dataType : "json",
  }).done(function(data) {
    $("#candidate-1-name").text(data[0]["firstname"]+" "+data[0]["lastname"])
    $("#candidate-2-name").text(data[1]["firstname"]+" "+data[1]["lastname"])
    $("#candidate-1-manifesto").text(data[0]["manifesto"])
    $("#candidate-2-manifesto").text(data[1]["manifesto"])
    $("#candidate-1-vote").text("Vote for "+data[0]["firstname"])
    $("#candidate-2-vote").text("Vote for "+data[1]["firstname"])
    $("#candidate-1-vote").attr("userid", data[0]["id"])
    $("#candidate-2-vote").attr("userid", data[1]["id"])

    // Populating admin dashboard table with candidate details
    let count = 0
    $.each(data, function(key, value) {
      count++
      appendData = ""
      appendData += '<tr><th scope="row">'+count+'</th><td>'+value.firstname+' '+value.lastname+'</td><td>'+value.election+'</td><td>'+value.party+'</td><td>'+value.votes+'</td><td><button class="editbtn" userid="'+value.id+'" data-toggle="modal" data-target=".modal-edit-candidate">Edit</button><button class="deletebtn" userid="'+value.id+'" data-target="#ModalDanger" data-toggle="modal">Delete</button></td></tr>'
      
      $("tbody").append(appendData)
    })
  })

  // Admin Login
  $("#admin-login-btn").click(function() {
    var admin_login = $("#admin-username").val()
    var admin_pass = $("#admin-pass").val()
    error = true
    $.ajax({
      url: "http://localhost:3000/admins",
      type: "GET",
      data:{},
      dataType: "json",
      contentType: "application/json"
    }).done(function(data) {
      $.each(data, function(key, value) {
        if (admin_login==value.username && admin_pass==value.password) {
          error = false
        }
      })
      if (error === false) {
        alert("success")
        document.location="/admindash.html"
      }
      else {
        alert("Invalid Credentials!")
        document.location="#"
      }
    })
  })

  // Registers a new candidate
  $("#add-candidate").click(function(){
    var newfirstname = $("#add-candidate-firstname").val()
    var newlastname = $("#add-candidate-lastname").val()
    var newparty = $("#add-candidate-party").val()
    var newmanifesto = $("#add-candidate-manifesto").val()
    var newelection = $("#add-candidate-election").val()
    var new_details = {
      "party": newparty,
      "firstname": newfirstname,
      "lastname": newlastname,
      "manifesto": newmanifesto,
      "votes": 0,
      "election": newelection
    }
    $.ajax({
      url: "http://localhost:3000/candidates/",
      type: "POST",
      data:JSON.stringify(new_details),
      dataType: "json",
      contentType: "application/json"
    }).done(alert("Update Successful!"))
  })

  // Edit button click, assign userid of "make changes" to the selected candidate's id, and prefills edit form with existing candidate data
  $("tbody").on("click", ".editbtn", function() {
    let btn_id = $(this).attr("userid");
    $("#edit-candidate").attr("userid", btn_id)




  })


  // Gets the user input and updates/edits the candidate 
  $("#edit-candidate").click(function(){
    console.log("edit clicked")
    var edituserid = $(this).attr("userid")
    var editfirstname = $("#edit-candidate-firstname").val()
    var editlastname = $("#edit-candidate-lastname").val()
    var editparty = $("#edit-candidate-party").val()
    var editmanifesto = $("#edit-candidate-manifesto").val()
    var editelection = $("#edit-candidate-election").val()
    var new_edit_details = {
      "party": editparty,
      "firstname": editfirstname,
      "lastname": editlastname,
      "manifesto": editmanifesto,
      "election": editelection
    }
    $.ajax({
      url: "http://localhost:3000/candidates/"+edituserid,
      type: "PATCH",
      data:JSON.stringify(new_edit_details),
      dataType: "json",
      contentType: "application/json"
    }).done(alert("Update Successful!"))
  })

  // Deletes a user
  $("tbody").on("click", ".deletebtn", function() {
    let btn_id = $(this).attr("userid");
    $("#delete-candidate").attr("userid", btn_id)
  })
  $("#delete-candidate").click(function(){
    var deleteuserid = $(this).attr("userid")
    $.ajax({
      url: "http://localhost:3000/candidates/"+deleteuserid,
      type: "DELETE",
      dataType: "json",
      contentType: "application/json"
    }).done(alert("Delete Successful!"))
  })

  // On click login, if user logged in before then go to dashboard
  $(".navlogin").click(function(){
    if (localStorage.getItem("id")!==null) {
      document.location=dashboard.html
    }
  })

  // Validate login and add user id to local storage
  $("#login-btn").click(function() {
    console.log("click")
    var ninlogin = $("#nin-login").val()
    var passwordlogin = $("#password-login").val()
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
        document.location="/dashboard.html"
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
    var firstnameSignup = $("#firstname-signup").val()
    var lastnameSignup = $("#lastname-signup").val()
    var emailSignup = $("#email-signup").val()
    var passwordSignup = $("#password-signup").val()
    var ninSignup = $("#nin-signup").val()
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

  // Logging off
  // Clear local storage on user log out
  $("#logout").click(function(){
    localStorage.removeItem("id");
    document.location="/index.html"
  })

  // Admin logout
  $("#adminlogout").click(function(){
    localStorage.removeItem("id");
    document.location="/adminindex.html"
  })

  localStorage.setItem("id", 2)
  // When user votes, disable the user's ability to vote again
  $(".vote").click(function(){
    candidate_id = $(this).attr("userid")
    if (localStorage.getItem("id")==null) {
      $(".alert-danger").fadeIn()
      console.log("not logged in")
      
    }
    else {
      $.ajax({
        url: "http://localhost:3000/voters/"+localStorage.getItem("id"),
        type: "GET",
        data:{},
        dataType: "json",
        contentType: "application/json"
      }).done(function(data) {
        let vote_check = data.hasVoted
        console.log(vote_check)
        if (vote_check===true) {
          $(".vote").attr("disabled", true)
          alert("You have already voted!")
        }
        else {
          $("#vote-confirmation").modal("toggle")
          $("#confirmed-vote").attr("userid", candidate_id)
          console.log($("#confirmed-vote").attr("userid"))    
        }
      })
    }
  })

  // When user votes, update candidate1 vote count
  $("#confirmed-vote").click(function() {
    candidate_id = $("#confirmed-vote").attr("userid")
    let candidate;
    $.ajax({
      url: "http://localhost:3000/candidates/"+candidate_id,
      type: "GET",
      dataType : "json",
    }).done(function(result){
      candidate = result;
      console.log(candidate)
      votes = Number(candidate.votes) + 1;
      
      $.ajax({
        url: "http://localhost:3000/candidates/"+candidate_id,
        data: {votes: votes},
        type: "PATCH",
        dataType : "json",
      }).done(function() {
        $(".vote").hide()
      })
    })
    votecheck = {"hasVoted": true}
    $.ajax({
      url: "http://localhost:3000/voters/"+localStorage.getItem("id"),
      type: "PATCH",
      data:JSON.stringify(votecheck),
      dataType: "json",
      contentType: "application/json"
    }).done(console.log("Thank you for participating!"))
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

