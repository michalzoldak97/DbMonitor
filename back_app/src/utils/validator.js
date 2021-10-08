exports.isValidEmail = email => {
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(pattern)) {
    return true;
  } else {
    return false;
  }
};

exports.isValidPasword = pass => {
  if (pass.length >= process.env.VAL_PASS_LEN && !pass.indexOf(' ') >= 0) {
    return true;
  } else {
    return false;
  }
};
