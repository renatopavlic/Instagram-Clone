import React, { useEffect, useState } from "react";
import './App.css';
import Post from "./Post";
import { db, auth } from "./firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";


// Material UI styling
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

// Material UI styling
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  // Material UI styles
  const classes = useStyles();
  // Material UI styling
  const [modalStyle] = useState(getModalStyle);


  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);


  const signUp = e => {
    // Prevent Refresh
    e.preventDefault();

    // Create a user
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile( {
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  };

  
  const signIn = e => {
    // Prevent Refresh
    e.preventDefault();

    // Firebase sign in
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

      // Close modal
      setOpenSignIn(false);


  };


  useEffect(() => {
  
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        setUser(authUser);

      } else {
        // user has signed out...
        setUser(null);
      }
    })

    return () => {
      // Cleanup action
      unsubscribe();
    }

  }, [user, username])

  useEffect(() => {
    // Database data
    db.collection("posts").orderBy("timestamp", "desc" ).onSnapshot( snapshot => {
      setPosts( snapshot.docs.map( doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })

  }, []);

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="ap__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram-logo"
              />

            </center>

            <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={ e => setUsername(e.target.value)} 
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={ e => setEmail(e.target.value)} 
              />

            <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={ e => setPassword(e.target.value)} 
            />

            <Button onClick={signUp}>Sign Up</Button>

          </form>


        </div>
      </Modal>


      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="ap__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram-logo"
              />

            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={ e => setEmail(e.target.value)} 
              />

            <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={ e => setPassword(e.target.value)} 
            />

            <Button type="submit" onClick={signIn}>Sign In</Button>


          </form>


        </div>
      </Modal>

      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

          {user ? (
            <Button type="submit" onClick={() => auth.signOut()}>Logout</Button>
          ) : (
            <div className="app__loginContainer">
              <Button type="submit" onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button type="submit" onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}

      </div>

      <div className="app__posts">
      {
      posts.map( ( { id, post } ) => (
      <Post key={id} postId= {id} username={post.username} user={user} caption={post.caption} imageUrl={post.imageUrl} />
      ))
      }

      </div>

      {/* Instagram feed */}

      <InstagramEmbed
            url="https://www.instagram.com/p/B_uf9dmAGPw/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />


      {user?.displayName ? (
      <ImageUpload username={user.displayName}/>
      ) : (
      <h3>Sorry you need to login to upload</h3>
      )}      

    </div>
  );
}

export default App;
