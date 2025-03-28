import isEmailValid from "./isEmailValid";
import isLengthValid from "./isLengthValid";

const validate = (type: string, value: string, password?: string) => {
  switch (type) {
    case "email": {
      if (!isLengthValid(6, value)) {
        return "email should be at least 6 characters long";
      }
      return isEmailValid(value) ? "" : "email is not valid format";
    }

    case "username":
      return isLengthValid(3, value)
        ? ""
        : "username should be at least 3 characters long";
    case "password":
      if (password && value !== password) {
        return "passwords should match";
      }
      return isLengthValid(6, value)
        ? ""
        : "password should be at least 6 characters long";
    case "confirmPassword": {
      return password && value !== password ? "passwords should match" : "";
    }
  }
};
export default validate;
