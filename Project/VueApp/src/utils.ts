interface CurrentMessages {
    [key: string]: string | any;
}

function updateCurrentMessages(key: string, word: string, currentMessages: CurrentMessages) {
    let keys = key.includes('.') ? key.split('.') : []
    console.log(currentMessages)
    if (keys.length === 0) {
        currentMessages[key] = word
        return
    }
    else {
        let current = currentMessages
        for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) {
                current[keys[i]] = i === keys.length - 1 ? word : {}
            }
            else {
                current = current[keys[i]]
            }
        }
    }



}

function changeWord(key: string, word: string, locale: string, currentMessages: CurrentMessages) {
    console.log("change word " + locale);

    const url = 'http://localhost:5037/Idioms/' + locale + '/vocabulary'; //change to + locale.value when api is ready

    updateCurrentMessages(key, word, currentMessages);

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            key: key,
            value: word

        }),
    })
        .then(response => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });

}

function updateElement(key_to_change: string, word_to_change: string, locale: string, currentMessages: CurrentMessages, key: HTMLInputElement) {
    changeWord(key_to_change, word_to_change, locale, currentMessages);
    key.value = '';
}


//Edit button and PopUp

function addEditButton(element: HTMLElement, classes: DOMTokenList, locale: string, currentMessages: CurrentMessages) {
    const editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.classList.add('edit-button');
    console.log("add edit button : " + locale)
    editButton.addEventListener('click', () => {
        openPopUp(classes, locale, currentMessages);
    });
    element.insertBefore(editButton, element.firstChild);
}

function openPopUp(classes: DOMTokenList, locale: string, currentMessages: CurrentMessages) {
    console.log("open pop up : " + locale)
    const popUp = document.createElement('div');
    popUp.classList.add('pop-up');

    let key = cleanClasses(classes, locale);
    console.log("open pop up : " + locale)

    let ShowKey = document.createElement('p');
    ShowKey.style.color = 'black';
    console.log(key + ':' + locale + " whyyyyy");
    ShowKey.textContent = key + ':' + locale;

    popUp.appendChild(ShowKey);

    const newWord = document.createElement('input');
    newWord.placeholder = 'New word';
    popUp.appendChild(newWord);


    const saveButton = document.createElement('button');
    saveButton.innerHTML = 'Save';
    saveButton.addEventListener('click', () => {
        updateElement(key, newWord.value, locale, currentMessages, newWord);
        removePopUp(popUp);
    });
    popUp.appendChild(saveButton);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'Close';
    closeButton.addEventListener('click', () => {
        removePopUp(popUp);
    });
    popUp.appendChild(closeButton);

    document.body.appendChild(popUp);

}


function removeEditButton(element: HTMLElement) {
    const editButton = element.querySelector('.edit-button');
    if (editButton) {
        element.removeChild(editButton);
    }
}


function removePopUp(popUp: HTMLElement) {
    popUp.parentNode!.removeChild(popUp);
}

function cleanClasses(classes: DOMTokenList, locale: string) {
    let classList = Array.from(classes);
    let cleanClassList = classList.filter((item) => {
        return item != "router-link-active" && item != 'router-link-exact-active' && item != locale;
    });
    return cleanClassList[0];
}




function mouseOverHandler(newDiv: HTMLElement, element: Element, locale: string, currentMessages: CurrentMessages) {
    if (!newDiv.querySelector('.edit-button')) {
        addEditButton(newDiv, element.classList, locale, currentMessages);
    }
}


function mouseLeaveHandler(newDiv: HTMLElement) {
    removeEditButton(newDiv);
}



var utils = {
    handlers: new Map(),

    populateEditableElements(locale: string, currentMessages: CurrentMessages) {
        const elements = document.querySelectorAll('.' + locale);
        elements.forEach((element) => {
            const newDiv = document.createElement('div');
            element.parentNode!.replaceChild(newDiv, element);
            newDiv.appendChild(element);

            // Define the event handlers
            const mouseOverHandler = (e: Event) => {
                if (!newDiv.querySelector('.edit-button')) {
                    addEditButton(newDiv, element.classList, locale, currentMessages);
                }
            };
            const mouseLeaveHandler = (e: Event) => {
                removeEditButton(newDiv);
            };

            // If there are existing handlers, remove them
            if (this.handlers.has(element)) {
                const oldHandlers = this.handlers.get(element);
                element.removeEventListener('mouseover', oldHandlers.mouseOverHandler);
                newDiv.removeEventListener('mouseleave', oldHandlers.mouseLeaveHandler);
            }

            // Add the event listeners
            element.addEventListener('mouseover', mouseOverHandler);
            newDiv.addEventListener('mouseleave', mouseLeaveHandler);

            // Store the handlers
            this.handlers.set(element, { mouseOverHandler, mouseLeaveHandler });
        });
    },
}

export default utils;