import React from 'react';
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

  const [selectedCard, setSelectedCard] = React.useState({});

 
  function handleCardClick(dataCards) { 
    setSelectedCard(dataCards); 
    setImagePopupOpen(true); 
  } 

 function closeAllPopups(){
    setIsEditProfilePopupOpen (false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setImagePopupOpen(false);
    setSelectedCard({})
    setDeleteSubmitPopup(false)
  }

  React.useEffect(() => {
    const handleEsc = (event) => {
      const btnEscape = 27;
       if (event.keyCode === btnEscape) {
        closeAllPopups()
      }
    };

    if (isEditProfilePopupOpen === true || isEditAvatarPopupOpen === true || isAddPlacePopupOpen === true || isImagePopupOpen === true) {
      window.addEventListener('keydown', handleEsc);
    };

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
    
  }, [isEditProfilePopupOpen, isEditAvatarPopupOpen, isAddPlacePopupOpen, isImagePopupOpen]);

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

  return (
  <div className="root">
    <CurrentUserContext.Provider value={currentUser}>
        <Header />
        <Main 
          loader={userInfoGet}
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddCard ={handleAddPlaceClick}
          onCardClick={handleCardClick}
          cards = {currentCards} 
          onCardLike ={handleCardLike}
          onCardDelete ={handleDeleteSubmitPopup}
        />
        <Footer />
        <EditProfilePopup onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} />
        <EditAvatarPopup onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />
        <AddPlacePopup onAddPlace={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}/>
        <DeleteSubmitPopup card={deleteCard} isOpen={deleteSubmitPopup} onClose={closeAllPopups} onCardDelete={handleCardDelete}/>
        <ImagePopup card={selectedCard} onClose={closeAllPopups} isOpen={isImagePopupOpen}/>
      </CurrentUserContext.Provider>
  </div>
  );
}

export default App;
