import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup (props){
  const cardsNameRef = React.useRef();
  const cardsLinkRef = React.useRef();
  
  React.useEffect(() => {
    cardsNameRef.current.value = ""
    cardsLinkRef.current.value = ""
  }, [props.isOpen])
  
  function handleSubmit (e){
      e.preventDefault();
      props.onAddPlace({
          name :cardsNameRef.current.value,
          link :cardsLinkRef.current.value,
      });
  }

    return(
        <PopupWithForm name ="popup_add-cards "  title ="Новое место" submitText={'Загрузить фото'} onSubmit={handleSubmit} isOpen={props.isOpen} onClose={props.onClose}>
            <fieldset className="form__input-container">
            <div className="form__item-container">
              <input
                ref={cardsNameRef}
                type="text"
                className="form__item form__item_type_title"
                id="title-input"
                name="name"
                placeholder="Название"
                minLength={2}
                maxLength={30}
                required
              />
              <span className="form__input-error title-input-error" />
            </div>
            <div className="form__item-container">
              <input
                ref={cardsLinkRef}
                type="url"
                className="form__item form__item_type_link"
                id="link-input"
                name="link"
                placeholder="Ссылка на картинку"
                required
              />
              <span className="form__input-error link-input-error" />
            </div>
          </fieldset>
        </PopupWithForm> 
    )
}
export default AddPlacePopup ;