import React, { useEffect } from 'react';

function Popup({onClose, isOpen, name, classname, children}) {
    
    function handleEsc(event) {
        if(event.key !== 'Escape') {
            return
        }
        onClose();
    }

    useEffect(() => {
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen]);

    return (
        <section className={`popup popup_type_${name} ${isOpen ? "popup_open" : ""}`}>
            <div className={classname}>
                <button
                    type="button"
                    aria-label="закрыть модальное окно"
                    className="button popup__close opacity"
                    onClick={onClose}>
                </button>
                {children}
            </div>
        </section>
    )
}

export default Popup;
