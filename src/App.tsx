import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import UploadSection from './components/UploadSection';
import { useEffect } from 'react';
import { fetchInitialDataAction } from './store/user/userActions';
import { selectUserId, setUserId } from './store/user/userSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';

function App() {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUserId(user.uid));
      } else {
        dispatch(setUserId(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchInitialDataAction({ userId }));
    }
  }, [userId, dispatch]);

  return (
    <BrowserRouter>
      <MainLayout isLoggedIn={!!userId}>
        <Routes>
          <Route path="/" element={<LandingPage page=""/>} />\
          <Route path="/home" element={userId ? <LandingPage /> : <LandingPage page="home"/>} />
          <Route path="/upload" element={userId ? <UploadSection /> : <LandingPage page="upload"/>} />
          <Route path="/profile" element={userId ? <Profile /> : <LandingPage page="profile"/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;