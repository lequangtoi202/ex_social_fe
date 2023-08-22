import { createContext, useEffect, useState } from 'react';
import { auth, db } from '~/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const UserContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const userRef = doc(db, 'users', userId);

        getDoc(userRef).then((doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setCurrentUser({
              ...user,
              userId: userData.userId,
            });
          }
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>;
};

export { UserContext, AuthProvider };
