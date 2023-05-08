import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Card.css";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const Card = () => {
  const [cardData, setCardData] = useState(null);

  const fetchCardData = async () => {
    const response = await axios.get(`${process.env.REACT_APP_LOCAL_BACKEND_URL}/randomtip`);
    setCardData(response.data.tip);
    console.log(response);
  };

  useEffect(() => {
    fetchCardData();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCardData();
    }, 15000);
  
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-container">
      {cardData ? (
        <div className="card">
          <h2 className="title">{cardData.id}</h2>
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