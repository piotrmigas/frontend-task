import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, CircularProgress, Typography, Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import Masonry from "react-masonry-css";
import { fetchBooks, sortBooks, loadMoreBooks, setStartIndex } from "../redux/bookSlice";
import Search from "../components/Search";
import BookCard from "../components/BookCard";
import FilterBtn from "../components/FilterBtn";

const useStyles = makeStyles({
  spinner: {
    textAlign: "center",
  },
  header: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  buttons: { display: "flex", justifyContent: "center", marginBottom: 20 },
  button: { marginTop: 10, marginBottom: 10, marginRight: 20 },
});

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { status, books, filterBy, totalItems, searchTerm, startIndex } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchBooks({ searchTerm, filterBy }));
  }, [dispatch, searchTerm, filterBy]);

  const breakpoints = {
    default: 3,
    1100: 2,
    700: 1,
  };

  const loadMore = () => {
    dispatch(setStartIndex(startIndex + 11));
    dispatch(loadMoreBooks({ searchTerm, filterBy, startIndex }));
  };

  return (
    <Container>
      <Search />
      <Typography variant="h5" className={classes.header}>
        {`${searchTerm ? "Search results" : "Programming books"}:`}
      </Typography>
      <div className={classes.buttons}>
        <Button
          variant="contained"
          className={classes.button}
          color="primary"
          onClick={() => dispatch(sortBooks({ searchTerm, filterBy }))}
        >
          Sort by newest
        </Button>
        <FilterBtn searchTerm={searchTerm} />
      </div>
      {status === "failed" && <p>Error fetching books</p>}
      {searchTerm && books.length === undefined && <h3>No matching books found!</h3>}
      <Masonry breakpointCols={breakpoints} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
        {books.map((book) => (
          <BookCard book={book} key={book.id} />
        ))}
      </Masonry>
      {status === "loading" && (
        <div className={classes.spinner}>
          <CircularProgress />
        </div>
      )}
      {books.length < totalItems && status === "success" && (
        <div className={classes.buttons}>
          <Button variant="contained" color="primary" onClick={loadMore}>
            Load More
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Home;
