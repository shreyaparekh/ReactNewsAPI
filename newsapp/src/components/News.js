import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("general");
  const [totalResults, setTotalResults] = useState(0);
 

  const capitalizaFirstLatter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  const UpdateNews = async () => {
    console.log("UpdateNewscmd");
    props.setProgress(10);

    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    // this.setState({ loading: true });
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let pasrseddata = await data.json();
    console.log(pasrseddata);
    props.setProgress(50);
    setArticles(pasrseddata.articles);
    setTotalResults(pasrseddata.totalResults);
    setLoading(false);
    props.setProgress(100);
  };
  useEffect(() => {
    document.title = `${capitalizaFirstLatter(
      props.category
    )}- NewsMonkey`;
    UpdateNews();

  }, []);

  const handlePreviousClick = async () => {
    setPage(page - 1);
    UpdateNews();
  };
  const handleNextClick = async () => {
    setPage(page + 1);
    // this.setState({ page: this.state.page + 1 });
    UpdateNews();
  };
  const fetchMoreData = async () => {
    setPage(page + 1);
    setLoading(true);
    // this.setState({ page: this.state.page + 1, loading: true });
    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;

      let data = await fetch(url);
      let parsedData = await data.json();
      if (parsedData.articles) {
        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults);
     } else {
        console.warn("No articles found in parsed data:", parsedData);
     }
      console.log(parsedData);
     
      // this.setState({
      //   articles: articles.concat(parsedData.articles),
      //   totalResults: parsedData.totalResults,
      // });
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("render");
  return (
    <>
      <h1 className="text-center" style={{ margin: "40px 0px",marginTop:"90px" }}>
        NewsMonkey - Top {capitalizaFirstLatter(props.category)}
        Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles ? articles.length : 0}
        next={fetchMoreData}
        hasMore={articles ? articles.length < totalResults : false}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles &&
              articles.map((element, index) => {
                return (
                  <div className="col-md-3" key={`${element.url}-${index}`}>
                    <NewsItem
                      title={element.title ? element.title.slice(0, 8) : ""}
                      description={
                        element.description
                          ? element.description.slice(0, 88)
                          : ""
                      }
                      articles="todo"
                      imageUrl={
                        element.urlToImage
                          ? element.urlToImage
                          : "https://ichef.bbci.co.uk/news/1024/branded_news/F091/production/_131558516_uawstrike_reuters.jpg"
                      }
                      newsurl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    ></NewsItem>
                  </div>
                );
              })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};
export default News;
