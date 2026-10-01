export function validString(string) {
  if (string && string.trim() === "") {
    return false;
  }
  return true;
}

export function validEmail(email) {
  if (email && !email.trim() === "" && !string.includes("@")) {
    return false;
  }
  return true;
}
