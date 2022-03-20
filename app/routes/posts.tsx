import React, { useEffect } from "react";
import { Link, Outlet } from "remix";
import highlight from "highlight.js";

const Posts = () => {
  useEffect(() => {
    highlight.highlightAll();
  }, []);

  return (
    <>
      <Link to="/"> &lt; home</Link>
      <Outlet />
      <Link to="/"> &lt; home</Link>
    </>
  );
};

export default Posts;
