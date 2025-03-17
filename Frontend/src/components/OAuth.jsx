import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../lib/firebase.js";
import userAuthStatus from "../lib/userAuthStatus.js";

export default function OAuth() {
    const {isLoggingIn, fireBaseAuth} = userAuthStatus();
    const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const formData = {
        username : result.user.displayName,
        email : result.user.email,
        avatar : result.user.photoURL
      }
      fireBaseAuth(formData);
    } catch (err) {
      console.log("could not sign with google !", err);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-500 w-full text-white  font-semibold uppercase hover:opacity-85 disabled:opacity-70 p-2 rounded-md cursor-pointer"
      disabled={isLoggingIn}
    >
      Google verify
    </button>
  );
}