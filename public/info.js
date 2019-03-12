document.getElementById("login").addEventListener("click", login);
document.getElementById("create-post").addEventListener("click", writeNewPost);


getPosts();

function login() {

  // https://firebase.google.com/docs/auth/web/google-signin

  //Provider
    var provider = new firebase.auth.GoogleAuthProvider();

  //How to signin
    firebase.auth().signInWithPopup(provider)


  console.log("login")



}


function writeNewPost() {

  // https://firebase.google.com/docs/database/web/read-and-write

  //Values from HTML
    var text = document.getElementById("textInput").value;
    var name = firebase.auth().currentUser.displayName;
    
    var objectToSend = {
        message : text + " ",
        author : name
    };
    
    firebase.database().ref("test").push(objectToSend);
    
    console.log(objectToSend)

  // Values


  console.log("write");

}


function getPosts() {

  //Get messages

   firebase.database().ref('test').on('value', function(data) {
     var posts = document.getElementById("posts");
     posts.innerHTML = "";
     console.log(data.val());
     var messages = data.val();
       
     for (var key in messages) {
       var text = document.createElement("div");
       var element = messages[key];
  
       text.append(element.message);
       text.append(element.author);
       posts.append(text);
     }
   })

  console.log("getting posts");

}