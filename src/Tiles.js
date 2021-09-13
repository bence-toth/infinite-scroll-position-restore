import { useEffect, useState, useCallback } from "react";
import "./Tiles.css";

const apiUrl = "https://www.reddit.com/r/photographs.json";

const fetchTilesPage = (afterId) => {
  if (afterId) {
    return fetch(`${apiUrl}?after=${afterId}`);
  } else {
    return fetch(apiUrl);
  }
};

const Tiles = () => {
  const [tiles, setTiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadAfterId, setLoadAfterId] = useState();

  useEffect(() => {
    setIsLoading(true);
    fetchTilesPage()
      .then((response) => response.json())
      .then((result) => {
        setTiles(
          result.data.children.map((child) => ({
            id: child.data.name,
            image: child.data.thumbnail,
          }))
        );
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (loadAfterId) {
      setIsLoading(true);
      fetchTilesPage(loadAfterId)
        .then((response) => response.json())
        .then((result) => {
          setTiles((tiles) => [
            ...tiles,
            ...result.data.children.map((child) => ({
              id: child.data.name,
              image: child.data.thumbnail,
            })),
          ]);
          setIsLoading(false);
          setLoadAfterId(undefined);
        });
    }
  }, [loadAfterId]);

  const handleOnScroll = useCallback(() => {
    const distanceFromBottom =
      document.querySelector("body").scrollHeight -
      window.scrollY -
      window.innerHeight;
    if (distanceFromBottom < 10) {
      if (!isLoading) {
        const lastTile = tiles[tiles.length - 1];
        setLoadAfterId(lastTile.id);
      }
    }
  }, [isLoading, tiles]);

  useEffect(() => {
    window.addEventListener("scroll", handleOnScroll);
    return () => {
      window.removeEventListener("scroll", handleOnScroll);
    };
  }, [handleOnScroll]);

  return (
    <div className="tilesContainer">
      {tiles.map(({ id, image }) => (
        <img key={id} src={image} alt="" />
      ))}
      {isLoading && <p className="loader">Loading...</p>}
    </div>
  );
};

export default Tiles;
