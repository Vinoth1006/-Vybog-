function emailValidation(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email) {
        return emailRegex.test(email);
    }
   else{
    return 0;
   }
}

function phoneValidation(phone) {
    const phoneRegex = /^\d{6,}$/;
    return phone ? phoneRegex.test(phone) : false;
}

// Password validation function
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

module.exports = { emailValidation, phoneValidation, validatePassword };