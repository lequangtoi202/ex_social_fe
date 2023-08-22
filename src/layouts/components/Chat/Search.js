import styles from '~/pages/HomeChat/HomeChat.module.scss';
import classNames from 'classnames/bind';
import { useContext, useState } from 'react';
import { db } from '~/config/firebase';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { UserContext } from '~/auth/AuthContext';

const cx = classNames.bind(styles);
function Search() {
  const { currentUser } = useContext(UserContext);
  const [usernameInput, setUsernameInput] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const handleSearch = async () => {
    const q = query(collection(db, 'users'), where('displayName', '==', usernameInput));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch();
  };

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, 'userChats', currentUser.uid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });

        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsernameInput('');
  };

  return (
    <div className={cx('search')}>
      <div className={cx('searchForm')}>
        <input
          type="text"
          placeholder="Find a user"
          value={usernameInput}
          onKeyDown={handleKey}
          onChange={(e) => setUsernameInput(e.target.value)}
        />
      </div>
      {err && <span>User not found</span>}
      {user && (
        <div className={cx('userChat')} onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className={cx('userChatInfo')}>
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
