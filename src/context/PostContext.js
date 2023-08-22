import { createContext, useState, useContext } from 'react';

const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);

  const addPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return <PostsContext.Provider value={{ posts, addPost }}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  return useContext(PostsContext);
}
