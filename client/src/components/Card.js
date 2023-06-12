import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Card.css";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Card = (props) => {
  const [cardData, setCardData] = useState(null);
  const [cardCategory, setCardCategory] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  let textColor = "";
  if (props.theme === "light") {
    textColor = "black";
  } else {
    textColor = "#ECECEC";
  }

  const categoryOptions = [
    { value: 0, label: "Other" },
    { value: 1, label: "CSS" },
    { value: 2, label: "Java" },
    { value: 3, label: "JavaScript" },
    { value: 4, label: "HTTP" },
    { value: 5, label: "Python" },
    { value: 6, label: "CPP" },
    { value: 7, label: "Dart" },
    { value: 8, label: "Flutter" },
    { value: 9, label: "Rust" },
    { value: 10, label: "Linux" },
  ];

  let responseCategoryNum = 0;
  let categoryLabel = "";
  const fetchCardData = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/randomtip`
    );
    setCardData(response.data.tip);
    setCardCategory(response.data.tip.category);

    responseCategoryNum = response.data.tip.category;
    categoryLabel = categoryOptions[responseCategoryNum];

    setCardCategory(categoryLabel.label);
  };

  useEffect(() => {
    fetchCardData();
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (dataLoaded) {
      const interval = setInterval(() => {
        fetchCardData();
      }, 12000);
      return () => clearInterval(interval);
    }
  }, [dataLoaded]);

  const [animationParent] = useAutoAnimate();

  return (
    <div className="card-container">
      {cardData ? (
        <div className="card" ref={animationParent}>
          <h2 className="title">{cardCategory}</h2>
          <ReactMarkdown
            children={cardData.description}
            components={{
              p: ({ node, ...props }) => (
                <p style={{ color: textColor }} {...props} />
              ),
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    style={tomorrow}
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>
      ) : (
        <div className="loading" style={{ textAlign: "center" }}>
          Loading...
        </div>
      )}
    </div>
  );
};

export default Card;
