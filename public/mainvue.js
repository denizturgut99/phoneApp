var app = new Vue({
    el: "#app",
    data: {
        data: data,
        "view": "home",
        selectedTeam: "",
        teamPosition: 0,
        memberPosition: 0
    },
    methods: {
        checkTeam(page, index) {
            this.view = page;
        },
        selectTeam(name) {
            this.selectedTeam = name
        },
        login() {
            // https://firebase.google.com/docs/auth/web/google-signin

            //Provider
            var provider = new firebase.auth.GoogleAuthProvider();

            //How to signin
            firebase.auth().signInWithPopup(provider)
            .then(function (result) {
                   if (result.credential) {
                       app.getPost();
                   }
            })
            
            document.getElementById("login").classList.add("pages");
            document.getElementById("logout").classList.remove("pages");
            document.getElementById("goneAfterLogin").classList.add("pages");
            document.getElementById("posts").classList.remove("pages");
            document.getElementById("mainButtons").classList.remove("pages");

            console.log("login")
        },
        
        getPost() {
            firebase.database().ref('test').on('value', function (data) {
                var posts = document.getElementById("posts");
                posts.innerHTML = "";
                console.log(data.val());
                var messages = data.val();

                for (var key in messages) {
                    var text = document.createElement("div");
                    var element = messages[key];
                    var node1 = document.createElement("p");
                    var node2 = document.createElement("p");
                    var node3 = document.createElement("p");

                    if (element.author == firebase.auth().currentUser.displayName) {
                        text.classList.add("chatBox2")
                        text.classList.add("box2")
                    } else {
                        text.classList.add("chatBox1")
                        text.classList.add("box1")
                    }

                    //                    text.setAttribute("class", "chatBox");

                    node1.append(element.author);
                    node2.append(element.message);
                    node3.append(element.dateStamp);

                    text.append(node1, node2, node3);
                    posts.append(text);
                    document.getElementById("posts").scrollTop = document.getElementById("posts").scrollHeight;
                }
            })
        },
        
        logout() {
            firebase.auth().signOut()
                .then(function () {
                    console.log("logout")
                    document.getElementById("login").classList.remove("pages");
                    document.getElementById("logout").classList.add("pages");
                    document.getElementById("goneAfterLogin").classList.remove("pages");
                    document.getElementById("posts").classList.add("pages");
                    document.getElementById("mainButtons").classList.add("pages");

                    // Sign-out successful.
                })
                .catch(function (error) {
                    // An error happened
                });
        },
        checkUser() {
            var user = firebase.auth().currentUser;

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    document.getElementById("mainButtons").classList.add("inputs")
                    document.getElementById("posts").classList.remove("pages")
                } else {
                    // No user is signed in.
                    document.getElementById("posts").classList.add("pages")
                    document.getElementById("mainButtons").classList.remove("inputs")
                }
            })

        },
        writeNewPost() {

            // https://firebase.google.com/docs/database/web/read-and-write

            //Values from HTML
            var text = document.getElementById("textInput").value;
            var name = firebase.auth().currentUser.displayName;
            var time = moment().format('MMMM Do YYYY, h:mm:ss a'); 

            var objectToSend = {
                author: name,
                message: text,
                dateStamp: time
            };

            firebase.database().ref("test").push(objectToSend);

            console.log(objectToSend)

            // Values
            document.getElementById("posts").scrollTop = document.getElementById("posts").scrollHeight;
            document.getElementById("textInput").value = "";
            console.log("write");

        },
        chatScroll() {
            document.getElementById("posts").scrollTop = document.getElementById("posts").scrollHeight
        }

    },
    computed: {
        decidedPlayers() {
            var teams = this.data.teams;
            for (var i = 0; i < teams.length; i++) {
                if (teams[i].teamName === this.selectedTeam) {
                    return teams[i].players;
                }
            }
        },
        quarterFinals() {
            return data.tournaments.qFinalMatches;
        },
        semiFinals() {
            return data.tournaments.sFinalMatches;
        },
        finals() {
            return data.tournaments.finalMatches;
        }
    },

});

app.checkUser()
