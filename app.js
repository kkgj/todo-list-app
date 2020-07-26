var firebaseConfig = {
    apiKey: "AIzaSyACkYvm8t9vAscandf08M14DWcpSMXtOZA",
    authDomain: "chat-app--desktop-version.firebaseapp.com",
    databaseURL: "https://chat-app--desktop-version.firebaseio.com",
    projectId: "chat-app--desktop-version",
    storageBucket: "chat-app--desktop-version.appspot.com",
    messagingSenderId: "224944114456",
    appId: "1:224944114456:web:5a8dc6e843fb8cab876c6d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Reference to auth method of Firebase
const auth = firebase.auth();

// Access elements that need to be hidden or show based on auth state
const hideWhenSignedIn = document.querySelectorAll('.hide-when-signed-in')
const hideWhenSignedOut = document.querySelectorAll('.hide-when-signed-out')

// Access the modal element
const modal = document.getElementById('modal');

// Access the element that closes the modal
const closeButton = document.getElementById('close');

// When the user clicks the (x) button close the modal
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

auth.onAuthStateChanged(user => {
    if (user) {
        // Everything inside here happens if user is signed in
        console.log(user)
        console.log(user.email)
        // this assigns a value to the variable 'uid'
        uid = user.uid
        modal.style.display = `none`
        // Hides or shows elements depending on if user is signed out
        hideWhenSignedIn.forEach(eachItem => {
            eachItem.classList.add('hide')
        });
        hideWhenSignedOut.forEach(eachItem => {
            eachItem.classList.remove('hide')
        });
        // Greet the user with a message and make it personal by using their name
        if (user.displayName) {
            console.log(user.displayName)
            document.getElementById('display-name-header').textContent = `Hello, ${user.displayName}`
        }
        db.collection('to-do-lists').doc(uid).collection('my-list')
		.onSnapshot(snapshot => {
			document.getElementById('to-do-list-items').innerHTML = '';
			snapshot.forEach(element => {
				let p = document.createElement('p');
                p.textContent = element.data().item;
                let deleteButton = document.createElement('button');
				deleteButton.textContent = 'x';
				deleteButton.classList.add('delete-button');
				deleteButton.setAttribute('data', element.id);
				p.appendChild(deleteButton);
				document.getElementById('to-do-list-items').appendChild(p);
				document.getElementById('to-do-list-items').appendChild(p);
			});
		});

    } else {
        // Everything inside here happens if user is not signed in
        console.log('not signed in')
        // Hides or shows elements depending on if user is signed out
        hideWhenSignedIn.forEach(eachItem => {
            eachItem.classList.remove('hide')
        });
        hideWhenSignedOut.forEach(eachItem => {
            eachItem.classList.add('hide')
        });
    }
});

signOut = () => {
    auth.signOut();
    this.hideAuthElements();
}

// Access the message HTML element
const authMessage = document.getElementById('message');

// Makes the messageTimeout global so that the clearTimeout method will work when invoked
let messageTimeout;

// Error and message handling
displayMessage = (type, message) => {
    if (type === 'error') {
        authMessage.style.borderColor = 'red'
        authMessage.style.color = 'red'
        authMessage.style.display = 'block'
    } else if (type === 'success') {
        authMessage.style.borderColor = 'green'
        authMessage.style.color = 'green'
        authMessage.style.display = 'block'
    }
    authMessage.innerHTML = message
    messageTimeout = setTimeout(() => {
        authMessage.innerHTML = ''
        authMessage.style.display = 'none'
    }, 6000)
}

clearMessage = () => {
    clearTimeout(messageTimeout)
    authMessage.innerHTML = ''
    authMessage.style.display = 'none'
}

// When the user clicks anywhere outside of the modal close it.
window.addEventListener('click', () => {
    if (event.target == modal) {
        modal.style.display = `none`;
    };
});

// Access the forms for email and password authentication
const createUserForm = document.getElementById('create-user-form')
const signInForm = document.getElementById('sign-in-form')
const forgotPasswordForm = document.getElementById('forgot-password-form')
const signInDialog = document.getElementById('sign-in-dialog')
const createUserDialog = document.getElementById('create-user-dialog')
const haveOrNeedAccountDialog = document.getElementById('have-or-need-account-dialog')

// Create user form submit event
createUserForm.addEventListener('submit', event => {
    event.preventDefault();
    this.loading('show');
    // Grab values from form
    const displayName = document.getElementById(`create-user-display-name`).value;
    const email = document.getElementById(`create-user-email`).value;
    const password = document.getElementById(`create-user-password`).value;
    // Send values to Firebase
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            auth.currentUser.updateProfile({
                displayName: displayName
            }).then(() => {
                document.getElementById('display-name-header').textContent = `Hello, ${auth.currentUser.displayName}`
            })
            createUserForm.reset();
            this.hideAuthElements();
        }).catch(error => {
            displayMessage('error', error.message);
            this.loading('hide');
        });
});

// Sign in form submit event
signInForm.addEventListener(`submit`, event => {
    event.preventDefault();
    this.loading('show');
    // Grab values from form
    const email = document.getElementById(`sign-in-email`).value;
    const password = document.getElementById(`sign-in-password`).value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            signInForm.reset();
            hideAuthElements();
        }).catch(error => {
            displayMessage('error', error.message);
            this.loading('hide');
        })
});

// Forgot password form submit event
forgotPasswordForm.addEventListener(`submit`, event => {
    event.preventDefault();
    this.loading('show');
    // Grab value from form
    var emailAddress = document.getElementById(`forgot-password-email`).value;
    // Send value to Firebase
    auth.sendPasswordResetEmail(emailAddress)
        .then(() => {
            forgotPasswordForm.reset();
            displayMessage('success', 'Message sent. Please check your email');
        }).catch(error => {
            displayMessage('error', error.message);
            this.loading('hide');
        });
});

// Invoked when user wants to create a new user account
showCreateUserForm = () => {
    hideAuthElements()
    modal.style.display = 'block'
    createUserForm.classList.remove('hide')
    signInDialog.classList.remove('hide')
    // haveOrNeedAccountDialog.classList.remove('hide')
}

// Invoked when a user wants to sign in
showSignInForm = () => {
    hideAuthElements()
    modal.style.display = 'block'
    signInForm.classList.remove('hide')
    createUserDialog.classList.remove('hide')
    // haveOrNeedAccountDialog.classList.remove('hide')
}

// Invoked when a user wants reset their password
showForgotPasswordForm = () => {
    hideAuthElements()
    modal.style.display = 'block'
    forgotPasswordForm.classList.remove('hide')
}

// Access auth elements to listen for auth actions
const authAction = document.querySelectorAll('.auth');

// Loop through elements and use the associated auth attribute to determine what action to take when clicked
authAction.forEach(eachItem => {
    eachItem.addEventListener('click', event => {
        let chosen = event.target.getAttribute('auth');
        if (chosen == 'show-create-user-form') {
            this.showCreateUserForm();
        } else if (chosen == 'show-sign-in-form') {
            this.showSignInForm();
        } else if (chosen === 'show-forgot-password-form') {
            this.showForgotPasswordForm();
        } else if (chosen === `sign-out`) {
            this.signOut();
        }
    });
});

// Invoked at the start of auth functions in order to hide everything before selectively showing the correct form
hideAuthElements = () => {
    this.loading('hide');
    this.clearMessage()
    createUserForm.classList.add('hide')
    signInForm.classList.add('hide')
    forgotPasswordForm.classList.add('hide')
    createUserDialog.classList.add('hide')
    signInDialog.classList.add('hide')
    // haveOrNeedAccountDialog.classList.add('hide')
}

// Function to hide and show the loading visual cue
loading = (action) => {
    if (action === 'show') {
        document.getElementById('loading-outer-container').style.display = 'block'
    } else if (action === 'hide') {
        document.getElementById('loading-outer-container').style.display = 'none'
    } else {
        console.log('loading error')
    }
}

// Get the to do list form for item submissions
const toDoListForm = document.getElementById('to-do-list-form');

// Add to-do item submit event
toDoListForm.addEventListener('submit', event => {
    console.log("Added item!")
    event.preventDefault()
    // Send value to Firebase
    db.collection('to-do-lists').doc(uid).collection('my-list').add({
        // Grab value from from form
        item: document.getElementById('item').value,
    });
    // reset form
    toDoListForm.reset()
});

// Delete a to do list item
document.body.addEventListener('click', event => {
	if (event.target.matches('.delete-button')) {
		key = event.target.getAttribute('data');
		db.collection('to-do-lists').doc(uid).collection('my-list').doc(key).delete();
	};
});