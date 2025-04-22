import { useEffect, useState } from "react";
import { FaFacebook, FaTwitter, FaWhatsapp, FaInstagram, FaGithub} from 'react-icons/fa';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link, useLocation } from "react-router-dom";
import '../App.css';


function SearchBtn({ className }) {
  return (
    <button className={className}>Search</button>
  );
}

function LogInBtn({ className, onLoginSuccess, showToast }) {
  const [showPopup, setShowPopup] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLoginData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (!storedUser) {
      showToast('No registered account found.');
      return;
    }

    if (
      loginData.username === storedUser.username &&
      loginData.password === storedUser.password
    ) {
      showToast('Login successful.');
      setTimeout(() => {
        setShowPopup(false);
        localStorage.setItem('currentUser', JSON.stringify(storedUser)); // store for persistence
        if (onLoginSuccess) onLoginSuccess(storedUser); // pass user object
      }, 1500);
    } else {
      showToast('Incorrect username or password');
    }
  };

  return (
    <>
      <button className={className} onClick={() => setShowPopup(true)}>Log In</button>

      {showPopup &&(
        <div className='popup-overlay'>
          <div className='popup-form'>
            <h2>Login</h2>
            <div className='input-label'>
              <label for="username">Username</label>
              <input type='text' id='username' value={loginData.username} onChange={handleChange} placeholder='Username' />
            </div>
            <div className='input-label'>
              <label for="password">Password</label>
              <input type='password' id='password' value={loginData.password} onChange={handleChange} placeholder='Password' />
            </div>
            <div className='popup-buttons'>
              <button onClick={handleLogin}>Submit</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SignInBtn({ className, onSignupSuccess, showToast }) {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] =useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  }
  
  const handleSubmit = () => {
    const existingUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (existingUser && existingUser.email === formData.email) {
      showToast('Account already registered.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
        showToast('Password do not match');
      return;
    }
    localStorage.setItem('registeredUser', JSON.stringify(formData));
    localStorage.setItem('currentUser', JSON.stringify(formData));
    setShowPopup(false);
    alert('Sign Up Successful.');
    onSignupSuccess(formData);
  };

  return (
    <>
      <button className={className} onClick={() => setShowPopup(true)}>Sign Up</button>

      {showPopup &&(
        <div className='popup-overlay'>
          <div className='popup-form'>
            <h2>Sign Up</h2>
            <div className='input-label'>
              <label for="username">Username</label>
              <input type='text' id='username' value={formData.username} onChange={handleChange} placeholder='Username' />
            </div>
            <div className='input-label'>
              <label for="email">Email</label>
              <input type='text' id='email' value={formData.email} onChange={handleChange} placeholder='Email' />
            </div>
            <div className='input-label'> 
              <label for="password">Password</label>
              <input type='password' id='password' value={formData.password} onChange={handleChange} placeholder='Password' />
            </div>
            <div className='input-label'>
              <label for="confirm-password">Confirm Password</label>
              <input type='password' id='confirmPassword' value={formData.confirmPassword} onChange={handleChange} placeholder='Confirm Password' />
            </div>
            <div className='popup-buttons'>
              <button onClick={handleSubmit} >Submit</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Navigation() {
  const [showSearch, setShowSearch] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '');
 
  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    const storedPic = localStorage.getItem('profilePic');

    if (storedPic) setProfilePic(storedPic);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.username) {
          setUser(parsed);
        }
      } catch (err) {
        console.error("Invalid session data");
      }
    }
  }, []);  

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: Basic file type check
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Save to localStorage *and* update state
      const imageDataUrl = reader.result;
      localStorage.setItem('profilePic', imageDataUrl);
      setProfilePic(imageDataUrl);
    };
    reader.onerror = () => {
        console.error("Error reading file");
        alert("Sorry, there was an error uploading the image.");
    }
    reader.readAsDataURL(file); // Read file as Base64 Data URL
  };

  return (
    <div className='navigation'>
      <ToggleBtn className='sidebar-toggle' onClick={() => setSidebarOpen(prev => !prev)} />

      {isSidebarOpen && (
        <div className='sidebar-overlay' onClick={() => setSidebarOpen(false)}>
          <div className='sidebar open' onClick={(e) => e.stopPropagation()}>
            <div className='close'>
              <button className='close-btn' onClick={() => setSidebarOpen(false)}>X</button>
            </div>

            <div className="sidebar-account">
              {user ? (
                <div className="sidebar-profile"> 
                  <div>
                    <img
                      src={profilePic || '/images/default.png'}
                      alt="Profile Pic"
                      className="profile-pic"
                    />
                    <input
                      type="file"
                      className="hidden-file-input"
                      id="profilePicUpload"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <div>
                    <h2 className="sidebar-username">{user.username}</h2>
                  </div>
                </div>
              ) : (
                  <>
                    <LogInBtn
                      className="nav-button"
                      onLoginSuccess={(storedUser) => {
                        setSidebarOpen(false);
                        setUser(storedUser);
                      }}
                      showToast={showToast}
                    />
                    <SignInBtn
                      className="nav-button"
                      onSignupSuccess={(storedUser) => {
                        setSidebarOpen(false);
                        setUser(storedUser);
                      }}
                      showToast={showToast}
                    />
                    {toastMessage && <Toast message={toastMessage} />}
                  </>  
              )}
            </div>

            <ul>
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/components'>Profile</Link></li>
              <li>Favorites</li>
              <li>Settings</li>
              <li>Contact Us</li>
            </ul>
          </div>   
        </div>
      )}
      <div className='nav-division'>
        <ShowSearchBtn className='search-button' onClick={() => setShowSearch(prev => !prev)} />
        {showSearch && (
          <div className="search-area">
            <input className="search-input" />
            <SearchBtn className="nav-button" />
          </div>
        )}
        {user && <LogOutBtn onLogout={() => {
          localStorage.removeItem('currentUser');
          setUser(null);
        }} />}
      </div>
    </div>
  );
}

function ToggleBtn({ className, onClick }) {
  return (
    <button className={className} onClick={onClick} >
      <i className='fas fa-bars fa-rotate-180'></i>
    </button>
  );
}

function ShowSearchBtn({ className, onClick }) {
  return (
    <button className={className} onClick={onClick}>
      <i className='fas fa-magnifying-glass'></i>
    </button>
  );
}

function Toast({ message, onClose }) {
  useEffect(() =>{
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className='toast'>
      {message}
    </div>
  );
}

function LogOutBtn({ onLogout }) {
  const handleLogout = () => {
    console.log("Logout clicked");
    onLogout(); // Trigger state cleanup from parent
  };

  return (
    <button onClick={handleLogout} className="nav-button">
      Log Out
    </button>
  );
}

const Profile = ({
  favorites,
  handleRemoveFromFavorites,
  currentSong,
  setCurrentSong,
  isPlaying,
  setIsPlaying,
  isAudioVisible,
  setIsAudioVisible,
  currentIndex,
  setCurrentIndex,
  handleAddToFavorites,
  setCurrentSongSource,
}) => {
  const location = useLocation(); 

  useEffect(() => {
    if (location.hash === "#favorites") {
      const element = document.getElementById("favorites");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser')) || { username: 'Guest' };
    setUser(storedUser);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result;
      localStorage.setItem('profilePic', imageDataUrl);
      setProfilePic(imageDataUrl);
    };
    reader.onerror = () => {
      console.error("Error reading file");
      alert("Sorry, there was an error uploading the image.");
    };
    reader.readAsDataURL(file);
  };

  const handleSongClick = (song) => {
    const index = favorites.findIndex((s) => s.id === song.id);
    setCurrentIndex(index);
    setCurrentSong(song);
    setCurrentSongSource("favorites");
    setIsPlaying(true);
    setIsAudioVisible(true);
  };    

  if (!user) return <p>Please log in to view your profile</p>;

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-title">
          <div className="title">
            <img src="/images/logo.png" alt="Logo" />
            <h1 className='title-text'>Musicoo</h1>
          </div>
          <nav className='title-nav'>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><a href="index.js">Favorites</a></li>
              <li><a href="index.js">Categories</a></li>
              <li><a href="index.js">Contact</a></li>
            </ul>
          </nav>
        </div>
        <Navigation />
        <main className="profile-main">
          <div className="user-profile">
            <div className="profile-container">
              <div className="profile">
                <div className="profile-image-wrapper">
                  <img
                    src={profilePic || '/images/default.png'}
                    alt="Profile Pic"
                    className="profile-pic"
                  />
                  <input
                    type="file"
                    className="hidden-file-input"
                    id="profilePicUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="profilePicUpload" className="upload-btn">Change Pic</label>
                </div>
                <div className="profile-info">
                  <h2 className="username">{user.username}</h2>
                </div>
              </div>
              <div className="social-icons">
                <a href="Profile.js"><FaFacebook /></a>
                <a href="Profile.js"><FaTwitter /></a>
                <a href="Profile.js"><FaInstagram /></a>
                <a href="Profile.js"><FaWhatsapp /></a>
                <a href="Profile.js"><FaGithub /></a>
              </div>
            </div>
          </div>

          <div id="favorites">
            <h3>Favorites</h3>
            <nav className="ordered-list">
              <ul>
                {favorites.map((song) => (
                  <li key={song.id}>
                    <div className='song-details' onClick={() => handleSongClick(song, 'favorites')}>
                      <div className='song'>
                        <img src={song.thumbnail} alt='Thumbnail' />
                        <div className='names'>
                          <p>{song.title}</p>
                          <p>{song.genre}</p>
                        </div>
                        <button
                          className="likeBtn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromFavorites(song.id);
                            setIsAudioVisible(false);
                          }}
                        >
                          💔
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </main>
      </header>
    </div>
  );
};

export default Profile;