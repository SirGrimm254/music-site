import React, {useState, useEffect, useRef} from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRepeat, faRandom, faForward, faBackward, faPlay, faPause, faVolumeUp, faVolumeOff, faVolumeDown } from '@fortawesome/free-solid-svg-icons';
import './hooks/UniversalTools'
import './App.css';


import Profile from './components/Profile';

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
              <li><Link to='/profile'>Profile</Link></li>
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

function LikeBtn({ className, handleAddToFavorites, song }) {
  return (
    <button className={className} onClick={() => handleAddToFavorites(song)}>
      🤍
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

const AudioPlayer = ({ song, currentFavoriteIndex, setCurrentFavoriteIndex, handleAddToFavorites, isPlaying, setIsPlaying, currentIndex, setCurrentIndex, songs, setCurrentSong, setIsAudioVisible, currentSongSource, setCurrentSongSource, favorites}) => {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('Off'); // 'off' | 'All' | '1'
  const playedIndicesRef = useRef(new Set());

  const sourceList = currentSongSource === "favorites" ? favorites : songs;

  const getNextShuffledIndex = (list, currentIdx) => {
    let availableIndices = list.map((_, i) => i).filter(i => i !== currentIdx);

    if (repeatMode !== 'All') {
      availableIndices = availableIndices.filter(i => !playedIndicesRef.current.has(i));
      if (availableIndices.length === 0) return null;
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    playedIndicesRef.current.add(randomIndex);
    return randomIndex;
  };

  const playNext = () => {
    const currentListIndex = sourceList.findIndex(item => item.id === song.id);
  
    if (sourceList.length === 0 || currentListIndex === -1) {
      setIsPlaying(false);
      return;
    }
  
    let nextIndex;
  
    if (isShuffle) {
      nextIndex = getNextShuffledIndex(sourceList, currentListIndex);
      if (nextIndex === null) {
        setIsPlaying(false);
        return;
      }
    } else if (currentListIndex < sourceList.length - 1) {
      nextIndex = currentListIndex + 1;
    } else if (repeatMode === 'All') {
      nextIndex = 0;
    } else {
      setIsPlaying(false);
      return;
    }
  
    setCurrentSong(sourceList[nextIndex]);
  
    if (currentSongSource === 'favorites') {
      setCurrentFavoriteIndex(nextIndex);
    } else {
      setCurrentIndex(nextIndex);
    }
  
    setIsPlaying(true);
  };  

  const playPrev = () => {
    const currentListIndex = sourceList.findIndex(item => item.id === song.id);
  
    if (sourceList.length === 0 || currentListIndex === -1) {
      setIsPlaying(false);
      return;
    }
  
    let prevIndex;
  
    if (isShuffle) {
      const availableIndices = sourceList.map((_, i) => i).filter(i => i !== currentListIndex);
      if (availableIndices.length > 0) {
        prevIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      } else {
        setIsPlaying(false);
        return;
      }
    } else if (currentListIndex > 0) {
      prevIndex = currentListIndex - 1;
    } else {
      prevIndex = sourceList.length - 1;
    }
  
    setCurrentSong(sourceList[prevIndex]);
  
    if (currentSongSource === 'favorites') {
      setCurrentFavoriteIndex(prevIndex);
    } else {
      setCurrentIndex(prevIndex);
    }
  
    setIsPlaying(true);
  };  

  useEffect(() => {
    const audio = audioRef.current;
    if (song && audio) {
      const handleCanPlay = async () => {
        if (isPlaying) {
          try {
            await audio.play();
          } catch (err) {
            console.error("Playback error:", err);
          }
        }
      };

      audio.addEventListener('canplaythrough', handleCanPlay);
      audio.src = song.src;
      audio.load();

      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlay);
      };
    }
  }, [song, isPlaying]); 
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
  
    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };
  
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime); // Ensure duration loads
  
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
  
    const handleEnded = () => {
      const sourceList = currentSongSource === "favorites" ? favorites : songs;
  
      if (repeatMode === '1') {
        audio.currentTime = 0;
        audio.play();
      } else if (isShuffle) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * sourceList.length);
        } while (randomIndex === currentIndex && sourceList.length > 1);
        setCurrentIndex(randomIndex);
        setCurrentSong(sourceList[randomIndex]);
        setIsPlaying(true);
      } else {
        const nextIndex = currentIndex + 1;
        if (nextIndex < sourceList.length) {
          setCurrentIndex(nextIndex);
          setCurrentSong(sourceList[nextIndex]);
          setIsPlaying(true);
        } else if (repeatMode === 'All') {
          setCurrentIndex(0);
          setCurrentSong(sourceList[0]);
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      }
    };
  
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, songs, favorites, currentSongSource, isShuffle, repeatMode, setCurrentIndex, setCurrentSong, setIsPlaying]);  
    
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    const audio =audioRef.current;

    if (!audio || !audio.src) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  return (
    <> 
      {song && (
        <div className='original-audio-section' id='original-audio-section'>
          <div className='audio-player'>
            <div className='audio-thumbnail'>
              <img src={song?.thumbnail || 'images/logo.png'} alt='thumbnail' id='audio-thumbnail-original' width="80" height="80" />
            </div>
            <div className='audio-details'>
              <p id='audio-title' className='audio-title'>{song?.title || 'Now Playing'}</p>
              <div className='progress-container'>
                <input
                  id='progress-bar'
                  type='range'
                  value={duration ? (currentTime / duration)* 100 : 0}
                  step='1'
                  min='0'
                  max='100'
                  onChange={(e) => {
                    const newTime = (e.target.value / 100) * duration;
                    audioRef.current.currentTime = newTime;
                    setCurrentTime(newTime);
                  }}
                />
                <span id='audio-duration'>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

              </div>
            </div>
            <audio ref={audioRef} id='audio-element'>
              {song && <source src={song.src} type='audio/mpeg' />}
            </audio>
            <div className='controlz'> 
              <div className='audio-controls'>
                <ShuffleBtn isShuffle={isShuffle} setIsShuffle={setIsShuffle} />
                <RepeatBtn repeatMode={repeatMode} setRepeatMode={setRepeatMode} />
                <PrevBtn onClick={playPrev} />
                <PlayPause isPlaying={isPlaying} onTogglePlay={togglePlay} />
                <NextBtn onClick={playNext} />
              </div>
              <div >
                <VolumeBtn volume={volume} setVolume={setVolume} />
              </div>
            </div>
            <LikeBtn
              className="likeBtn"
              song={song}
              onLike={handleAddToFavorites}
            />
            <div className='close-audio'>
              <button className='close-audio-btn' onClick={() => setIsAudioVisible(false)}>X</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { AudioPlayer };

function VolumeBtn({ volume, setVolume}) {
  const getVolumeIcon = () => {
    if (volume === 0) return faVolumeOff;
    if (volume < 0.5) return faVolumeDown;
    return faVolumeUp;
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className='volume-control'>
      <button>
        <FontAwesomeIcon icon={getVolumeIcon()} />
      </button>
      <input
        id='volume-bar'
        type='range'
        min='0'
        max='1'
        step='0.01'
        value={volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
}

function ShuffleBtn({ isShuffle, setIsShuffle }) {
  const getIconStyle = () => ({
    color: isShuffle ? '#1db954' : 'inherit' // hover color active
  });

  return (
    <button
      onClick={() => setIsShuffle(prev => !prev)}
      className={`shuffle-btn ${isShuffle ? 'active' : ''}`}
      title="Shuffle"
    >
      <FontAwesomeIcon icon={faRandom} style={getIconStyle()} />
    </button>
  );
}

function RepeatBtn({ repeatMode, setRepeatMode }) {
  const cycleRepeatMode = () => {
    setRepeatMode(prev =>
      prev === 'Off' ? 'All' : prev === 'All' ? '1' : 'Off'
    );
  };

  const getIconStyle = () => ({
    color: repeatMode !== 'Off' ? '#1db954' : 'inherit' // hover color active
  });

  return (
    <button onClick={cycleRepeatMode} title={`Repeat: ${repeatMode}`}>
      <FontAwesomeIcon
        icon={faRepeat}
        style={getIconStyle()}
      />
      {repeatMode === '1' && <span className="repeat-label">1</span>}
    </button>
  );
}

function PrevBtn({ onClick }) {
  return (
    <button onClick={onClick}><FontAwesomeIcon icon={faBackward} /></button>
  );
}

function PlayPause({ isPlaying, onTogglePlay}) {
  return (
    <button onClick={onTogglePlay}>
      <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
    </button>
  );
}

function NextBtn({ onClick }) {
  return (
    <button onClick={onClick}><FontAwesomeIcon icon={faForward} /></button>
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

export const songs = [
  {
    id: 1,
    title: 'Vybz Kartel - Drag Dem Bat',
    genre: 'Dancehall',
    src: 'songs/Dragdembat.mp3',
    thumbnail: 'images/dragdembat.jpg',
    artist: 'images/vybzkartel.jpeg',
    details: 'Adidja Azim Palmer (born 7 January 1976), better known as Vybz Kartel, is a Jamaican dancehall deejay.'
  },
  {
    id: 2,
    title: 'Gunna - One of Wun',
    genre: 'Trap/Hiphop',
    src: 'songs/Oneofone.mp3',
    thumbnail: 'images/oneofone.jpg',
    artist: 'images/gunna.jpeg',
    details: 'Sergio Giavanni Kitchens (born June 14, 1993), better known by his stage name Gunna, is an American rapper and singer.'
  },
  {
    id: 3,
    title: 'Travis Scott - Butterfly Effects',
    genre: 'Trap/Hiphop',
    src: 'songs/Butterflyeffects.mp3',
    thumbnail: 'images/butterflyeffects.jpg',
    artist: 'images/travisscott.jpeg',
    details: 'Jacques Bermon Webster II (born April 30, 1991), known professionally as Travis Scott (formerly stylized as Travi$ Scott), is an American rapper, singer, songwriter, and record producer.'
  },
  {
    id: 4,
    title: 'Vybz Kartel - Drone Dem',
    genre: 'Dancehall',
    src: 'songs/Dronedem.mp3',
    thumbnail: 'images/drone.jpeg',
    artist: 'images/vybzkartel.jpeg',
    details: 'Adidja Azim Palmer (born 7 January 1976), better known as Vybz Kartel, is a Jamaican dancehall deejay.'
  },
  {
    id: 5,
    title: 'Kendrick Lamar - Euphoria',
    genre: 'Trap/Hiphop',
    src: 'songs/Euphoria.mp3',
    thumbnail: 'images/euphoria.jpeg',
    artist: 'images/kendrick.jpeg',
    details: 'Kendrick Lamar Duckworth was born on June 17, 1987, in Compton, California.'
  },
  {
    id: 6,
    title: 'Skeng - 23 ft Rvssian',
    genre: 'Dancehall',
    src: 'songs/23.mp3',
    thumbnail: 'images/23.jpeg',
    artist: 'images/skeng.jpeg',
    details: 'Kevon Douglas known professionally as Skeng is a Jamaican Dancehall artist Skeng came on the scene in 2021 with his infectious hit “Gvnman shift” and gained international recognition'
  },
  {
    id: 7,
    title: 'Skeng - Vibes',
    genre: 'Dancehall',
    src: 'songs/Vibes.mp3',
    thumbnail: 'images/vibes.jpeg',
    artist: 'images/skeng.jpeg',
    details: 'Kevon Douglas known professionally as Skeng is a Jamaican Dancehall artist Skeng came on the scene in 2021 with his infectious hit “Gvnman shift” and gained international recognition'
  },
  {
    id: 8,
    title: 'Skeng - London',
    genre: 'Dancehall',
    src: 'songs/London.mp3',
    thumbnail: 'images/london.jpg',
    artist: 'images/skeng.jpeg',
    details: 'Kevon Douglas known professionally as Skeng is a Jamaican Dancehall artist Skeng came on the scene in 2021 with his infectious hit “Gvnman shift” and gained international recognition'
  },
];


function Home({ handleAddToFavorites, handleSongClick, currentSong }) {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-title">
          <div className="title">
            <img src="/images/logo.png" alt="Logo" />
            <h1 className="title-text">Musicoo</h1>
          </div>
          <nav className="title-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/profile#favorites">Favorites</Link></li>
              <li><a href="index.js">Categories</a></li>
              <li><a href="index.js">Contact</a></li>
            </ul>
          </nav>
        </div>

        <Navigation />

        <main>
          <div className="song-list">
            <h2>Popular Songs</h2>
            <nav className="ordered-list">
              <ol>
                {songs.map((song) => (
                  <li key={song.id}>
                    <div className="song-details">
                      <div className="song"
                        onClick={() => handleSongClick(song, 'home')}
                      >
                        <img src={song.thumbnail} alt="Thumbnail" />
                        <div className="names">
                          <p>{song.title}</p>
                          <p>{song.genre}</p>
                        </div>
                      </div>
                      <LikeBtn
                        className="likeBtn"
                        song={song}
                        handleAddToFavorites={handleAddToFavorites}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="description">
            <h3>Artist Bio</h3>
            <div className="decription-window">
              <ul className="description-ul">
                {currentSong && (
                  <li key={currentSong.id}>
                    <img
                      id="artist-image"
                      src={currentSong.artist}
                      alt="Artist Pic"
                      width="100"
                      height="100"
                    />
                    <p>{currentSong.genre}</p>
                    <p>{currentSong.details}</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </main>
      </header>
    </div>
  );
}

function App() {
  const [favorites, setFavorites] = useState([]);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSongSource, setCurrentSongSource] = useState('home');
  const [currentFavoriteIndex, setCurrentFavoriteIndex] = useState(0);

  const navigate = useNavigate();
  const isAuthenticated = () => {
    return !!localStorage.getItem('currentUser');
  };

  const handleAddToFavorites = (song) => {
    setFavorites((prev) => {
      const updated = prev.find((s) => s.id === song.id) ? prev : [...prev, song];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
    navigate("/profile#favorites");
  };

  const handleSongClick = (song, source = 'home') => {
    setCurrentSong(song);
    setIsPlaying(true);
    setIsAudioVisible(true);
    setCurrentSongSource(source);
  
    if (source === 'favorites') {
      const indexInFavorites = favorites.findIndex((favSong) => favSong.id === song.id);
      setCurrentFavoriteIndex(indexInFavorites !== -1 ? indexInFavorites : 0);
      setCurrentIndex(indexInFavorites !== -1 ? indexInFavorites : 0);
    } else {
      const indexInSongs = songs.findIndex((s) => s.id === song.id);
      setCurrentIndex(indexInSongs !== -1 ? indexInSongs : 0);
    }
  };  

  const handleRemoveFromFavorites = (songId) => {
    setFavorites((prev) => {
      const updated = prev.filter((s) => s.id !== songId);
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              favorites={favorites}
              handleAddToFavorites={handleAddToFavorites}
              handleSongClick={handleSongClick}
              currentSong={currentSong}
              setCurrentSong={setCurrentSong}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              isAudioVisible={isAudioVisible}
              setIsAudioVisible={setIsAudioVisible}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              currentFavoriteIndex={currentFavoriteIndex}
              setCurrentFavoriteIndex={setCurrentFavoriteIndex}
            />
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated() ? (
              <Profile
                favorites={favorites}
                handleRemoveFromFavorites={handleRemoveFromFavorites}
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                isAudioVisible={isAudioVisible}
                setIsAudioVisible={setIsAudioVisible}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                handleSongClick={handleSongClick}
                setCurrentSongSource={setCurrentSongSource}
                currentFavoriteIndex={currentFavoriteIndex}
                setCurrentFavoriteIndex={setCurrentFavoriteIndex}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>

      {isAudioVisible && currentSong && (
        <div className="audio-bar">
          <AudioPlayer
            song={currentSong}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            songs={songs}
            setCurrentSong={setCurrentSong}
            setIsAudioVisible={setIsAudioVisible}
            currentSongSource={currentSongSource}
            favorites={favorites}
            currentFavoriteIndex={currentFavoriteIndex} // Pass this
            setCurrentFavoriteIndex={setCurrentFavoriteIndex}
            setCurrentSongSource={setCurrentSongSource} // Pass this
          />
        </div>
      )}
    </>
  );
}

export default App;