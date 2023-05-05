import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Card.css";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const Card = () => {
  const [cardData, setCardData] = useState(null);
  const [tipsLength, setTipsLength] = useState();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      const response1 = await axios.get(`${process.env.REACT_APP_LOCAL_BACKEND_URL}/getall`);
      const length = Object.keys(response1.data.tips).length;
      
      setTipsLength(length);
      setDataLoaded(true);
      
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData2 = async () => {
      let randId = 1;
      console.log(tipsLength);
      if(dataLoaded) {
        randId = Math.floor(Math.random() * (tipsLength-1)) + 1;
        console.log(tipsLength);
        console.log(randId);
      const response = await axios.get(`${process.env.REACT_APP_LOCAL_BACKEND_URL}/${randId}`);
      setCardData(response.data.tip);
      console.log(response);
      }
    };
    fetchData2();
  }, [dataLoaded, tipsLength])

  useEffect(() => {
    const interval = setInterval(() => {
      handleRefreshClick();
    }, 500);
  
    return () => clearInterval(interval);
  }, []);

  const handleRefreshClick = async () => {
    const response1 = await axios.get(`${process.env.REACT_APP_LOCAL_BACKEND_URL}/getall`);
    const length = Object.keys(response1.data.tips).length;
    const randId = Math.floor(Math.random() * (length-1)) + 1;
    console.log(randId)
    const response = await axios.get(`${process.env.REACT_APP_LOCAL_BACKEND_URL}/${randId}`);
    setCardData(response.data.tip);
  };

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