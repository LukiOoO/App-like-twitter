import React, { useEffect, useState } from "react";
import "./style/App.css";
import "./style/index.css";
import NavBar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import PostsWall from "./components/posts_wall/posts_wall";
import SearchWindow from "./components/search/search";
import CreatePost from "./components/posts_wall/create_post";

const App = () => {
  return (
    <React.Fragment>
      <NavBar />
      <div className="grid-container">
        <SearchWindow />
        <PostsWall />
        <CreatePost />
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default App;
