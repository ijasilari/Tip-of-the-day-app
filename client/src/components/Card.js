import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Card.css";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const Card = () => {
  const [cardData, setCardData] = useState(null);
  const [cardCategory, setCardCategory] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);


  const categoryOptions = [
    {value: 0, label: "Other"},
    {value: 1, label: "CSS"},
    {value: 2, label: "Java"},
    {value: 3, label: "JavaScript"},
    {value: 4, label: "HTTP"},
    {value: 5, label: "Python"},
    {value: 6, label: "CPP"},
    {value: 7, label: "Dart"},
    {value: 8, label: "Flutter"},
    {value: 9, label: "Rust"},
    {value: 10, label: "Linux"}
  ]

  let responseCategoryNum = 0;
  let categoryLabel = "";
  const fetchCardData = async () => {

    const response = await axios.get(`${process.env.REACT_APP_LOCAL_BACKEND_URL}/randomtip`);
    setCardData(response.data.tip);
    setCardCategory(response.data.tip.category);
    //console.log(response);

    responseCategoryNum = response.data.tip.category
    categoryLabel = categoryOptions[responseCategoryNum]
    //console.log(k)
    setCardCategory(categoryLabel.label);
  };

  useEffect(() => {
    fetchCardData();
    setDataLoaded(true);
  }, [])

  useEffect(() => {
    if(dataLoaded){

      const interval = setInterval(() => {
        fetchCardData();
      }, 12000);
      return () => clearInterval(interval);
    }
    
  }, [dataLoaded]);

  return (
    <div className="card-container">
      {cardData ? (
        <div className="card">
          <h2 className="title">{cardCategory}</h2>
          <ReactMarkdown
                    children={cardData.description}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            children={String(children).replace(/\n$/, "")}
                            language={match[1]}
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
        <div className="loading">Loading...</div>
      )}
    </div>
  );
};

export default Card;