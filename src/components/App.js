import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import api from '../utils/Api';
import '../index.css';
import '../App.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteSubmitPopup from './DeleteSubmitPopup';
import Register from './Register';
import Login from './Login';
import * as auth from '../utils/auth';
import ProtectedRoute from './ProtectedRoute';
import IhfoTooltip from './InfoTooltip';


function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  
  function handleEditAvatarClick (){
    setIsEditAvatarPopupOpen(true)
  }

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);

  function handleEditProfileClick (){
     setIsEditProfilePopupOpen (true)
  }

  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);

  function handleAddPlaceClick (){
    setIsAddPlacePopupOpen(true)
  }

  const [deleteSubmitPopup, setDeleteSubmitPopup] = React.useState(false);

  const [deleteCard, setDeleteCard] = React.useState({});

  function handleDeleteSubmitPopup (card){
    setDeleteCard(card)
    setDeleteSubmitPopup(true)
  }

  const [isImagePopupOpen, setImagePopupOpen] = React.useState(false); 

  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = useState(false);

  const [selectedCard, setSelectedCard] = React.useState({});

  const [loggedIn, setLoggedIn] = useState(false);

  const [email, setEmail] = useState('');

  const [isSuccessful, setIsSuccessful] = useState(false);

  const [message, setMessage] = useState('');

  const history = useHistory();

 
  function handleCardClick(dataCards) { 
    setSelectedCard(dataCards); 
    setImagePopupOpen(true); 
  } 

 function closeAllPopups(){
    setIsEditProfilePopupOpen (false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setImagePopupOpen(false);
    setSelectedCard({});
    setDeleteSubmitPopup(false);
    setInfoTooltipPopupOpen(false);
  }

  React.useEffect(() => {
    const handleEsc = (event) => {
      const btnEscape = 27;
       if (event.keyCode === btnEscape) {
        closeAllPopups()
      }
    };

    if (isEditProfilePopupOpen === true || isEditAvatarPopupOpen === true || isAddPlacePopupOpen === true || isImagePopupOpen === true || isInfoTooltipPopupOpen === true) {
      window.addEventListener('keydown', handleEsc);
    };

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
    
  }, [isEditProfilePopupOpen, isEditAvatarPopupOpen, isAddPlacePopupOpen, isImagePopupOpen, isInfoTooltipPopupOpen]);

  const [currentUser,setCurrentUser] = React.useState({});

  const [userInfoGet, setUserInfoGet] = React.useState(false);

  const [currentCards,setCurrentCards] = React.useState([])

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getCards()])
      .then(([userInfo, cardList]) => {
        setCurrentUser(userInfo);
        setCurrentCards(cardList);
        setUserInfoGet(true);
      })
      .catch((err) => console.log(err));
  }, []);

  
  function handleUpdateUser (e){
    api.changeUserInfo(e)
    .then((res)=>{
      setCurrentUser(res)
      closeAllPopups()
    })
    .catch(res=>{
      console.log(`Ошибка:${res}`)
    })
  }

  function handleUpdateAvatar(e){
    api.changeUserImage(e)
    .then((res)=>{
      setCurrentUser(res)
      closeAllPopups()
    })
    .catch(res=>{
      console.log(`Ошибка:${res}`)
    })
  }

  
 //Функция лайка карточки
 function handleCardLike(card) {
  //Проверяем, есть ли уже лайк на этой карточке
  const isLiked = card.likes.some(i => i._id === currentUser._id);
  // Отправляем запрос в API и получаем обновлённые данные карточки
  api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
    // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
    const newCards = currentCards.map((c) => c._id === card._id ? newCard : c);
    // Обновляем стейт
    setCurrentCards(newCards);
  })
    .catch(err => console.log(err));
}

 
  //Функция удаления карточки, по аналогии с функцией лайка
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCurrentCards(currentCards.filter(item => item._id !== card._id));
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }


   function handleAddPlaceSubmit(e){
    api.addCard(e)
    .then( newCard =>{
      setCurrentCards([newCard, ...currentCards]);
      closeAllPopups();
    })
    .catch(newCard=>{
      console.log(`Error:${newCard}`)
    })
   }

   // Проверить токен
   React.useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.getContent(jwt)
        .then((res) => {
          setLoggedIn(true);
          setEmail(res.data.email);
          history.push('/');
        })
        .catch(err => console.log(err));
    }
  }, [history]);

  // Регистрация
  function handleRegister(password, email) {
    auth.register(escape(password), email)
      .then(() => {
        setMessage({ iconPath: resolvePath, text: 'Вы успешно зарегистрировались!' });
      })
      .catch((err) => setMessage({ iconPath: rejectPath, text: err.message }));
    setInfoTooltipOpen(true);
  }

  // Авторизация
  function handleLogin(password, email) {
    auth.authorize(escape(password), email)
      .then((data) => {
        auth.getContent(data)
          .then((res) => {
            setEmail(res.data.email);
          })
          .catch(err => console.log(err));
        setLoggedIn(true);
        setMessage({ iconPath: resolvePath, text: 'Вы успешно вошли в приложение!' });
        history.push('/');
      })
      .catch((err) => setMessage({ iconPath: rejectPath, text: err.message }))
    setInfoTooltipOpen(true);
  }

  // Выход
  function handleSignOut() {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    setEmail('');
    history.push('/sign-in');
  }

  React.useEffect(() => {
    tokenCheck();
  }, []);

   return (
    <div className="root">
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header
            emailUser={email} 
            routePathName={ 'Выход' } 
            routePath={ '/sign-in' } 
            loggedIn={loggedIn} 
            onSignOut={handleSignOut}
          />
          <Switch>
            <Route path="/sign-up"> {/* регистрация пользователя */}
              <Header routePathName={ 'Войти' } routePath={ '/sign-in' } />
              <Register onRegister={handleRegister} />
            </Route>

            <Route path="/sign-in"> {/* авторизация пользователя - вход */}
              <Header routePathName={ 'Регистрация' } routePath={ '/sign-up' } />
              <Login onLogin={handleLogin}/>
            </Route>

            <ProtectedRoute path="/" 
                loggedIn={loggedIn} 
                component={Main} 
                loader={userInfoGet}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddCard ={handleAddPlaceClick}
                onCardClick={handleCardClick}
                cards = {currentCards} 
                onCardLike ={handleCardLike}
                onCardDelete ={handleDeleteSubmitPopup} />
          </Switch>

          <Route>
            {loggedIn === false ? <Redirect to='/sign-in' /> : <Redirect to='/' />}
          </Route>

          <Route path="*">
            <Redirect to='/sign-in' />
          </Route>
          <EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} />
          <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />
          <AddPlacePopup onAddPlace={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}/>
          <DeleteSubmitPopup card={deleteCard} isOpen={deleteSubmitPopup} onClose={closeAllPopups} onCardDelete={handleCardDelete}/>
          <ImagePopup card={selectedCard} onClose={closeAllPopups} isOpen={isImagePopupOpen}/>
          <IhfoTooltip onClose={closeAllPopups} isOpen={isInfoTooltipPopupOpen}  loggedIn={loggedIn} message={message}/>
        </div>
      </CurrentUserContext.Provider>
    </div>
    );
  }
  
  export default App;
