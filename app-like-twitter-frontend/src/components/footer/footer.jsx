import React from "react";
import "./footer.css";
import "../../style/index.css";

const Footer = ({
  description = "A simple information sharing application modelled on twitter",
  author = "by lukioo",
}) => {
  return (
    <div className="footer">
      <p className="footer__description">{description}</p>
      <hr className="footer__separator" />
      <h6 className="footer__author">{author} </h6>
    </div>
  );
};

export default Footer;
