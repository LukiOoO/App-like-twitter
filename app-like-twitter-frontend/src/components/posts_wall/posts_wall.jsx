import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./posts_wall.css";
import "../../style/index.css";
import { ReactComponent as Heart_icon } from "./heart-regular.svg";

function PostsWall() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [dots, setDots] = useState("");
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomedGif, setZoomedGif] = useState(false);
  const [zoomedImg, setZoomedImg] = useState(false);
  const postsContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/p_w/show_user_posts/?page=${page}`
        );
        setData((prevData) => [...prevData, ...response.data.results]);
        setIsLoading(false);
        // console.log(page);
        if (!response.data.next) {
          setHasMorePages(false);
        }
      } catch (e) {
        setError(e.message);
        setIsLoading(false);
        console.log(error);
      }
    };

    fetchData();
  }, [page]);

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  useEffect(() => {
    const debouncedHandleScroll = debounce(() => {
      if (
        !isLoading &&
        postsContainerRef.current.scrollHeight +
          postsContainerRef.current.scrollTop >=
          postsContainerRef.current.clientHeight - 10
      ) {
        setPage((prevSetPage) => prevSetPage + 1);
        setIsLoading(true);
      }
    }, 500);

    const scrollContainer = postsContainerRef.current;

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", debouncedHandleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", debouncedHandleScroll);
      }
    };
  }, [isLoading, postsContainerRef.current]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (dots.length < 3) {
        setDots((prevDots) => prevDots + ".");
      } else {
        setDots("");
      }
    }, 500);
    return () => clearInterval(interval);
  }, [dots]);

  const handleImageClick = () => {
    setZoomedImg(!zoomedImg);
  };
  const handleGifClick = () => {
    setZoomedGif(!zoomedGif);
  };

  console.log(data);
  if (data.length === 0) {
    return (
      <div className="loading-div">
        <span className="span-loading">Loading{dots}</span>
      </div>
    );
  }

  return (
    <div className="posts-container" ref={postsContainerRef}>
      {data.map((post, index) => (
        <div className="post" key={index}>
          <div className="post-wrapper">
            <h3>{post.user}</h3>
            <p className="post-text">{post.text}</p>
            {post.image && (
              <img
                className={zoomedImg ? "post-img-zoomed" : "post-img"}
                onClick={handleImageClick}
                src={post.image}
                alt="post img"
              />
            )}
            {post.gif && (
              <img
                className={zoomedGif ? "post-gif-zoomed" : "post-gif"}
                onClick={handleGifClick}
                src={post.gif}
                alt="post gif"
              />
            )}
            {post.video && (
              <video className="video" controls width="50%" height="50%">
                <source src={post.video} type="video/mp4"></source>
                Your browser does not support the video element.
              </video>
            )}
            <p>
              {post.tags.map((tag, tagIndex) => (
                <span className="tags" key={tagIndex}>
                  {tag}
                </span>
              ))}
            </p>
            <div className="bottom-div-part">
              <div className="bottom-like-part">
                <p className="likes">{post.likes.count}</p>
                <Heart_icon className="icon" />
              </div>
              <p className="cr_at">{post.created_at}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostsWall;
