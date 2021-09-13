import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import "./Tiles.css";

const apiUrl = "https://www.reddit.com/r/photographs.json";

const fetchTilesPage = (afterId) => {
  if (afterId) {
    return fetch(`${apiUrl}?after=${afterId}`);
  } else {
    return fetch(apiUrl);
  }
};

const Tiles = ({ tiles, setTiles }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadAfterId, setLoadAfterId] = useState();

  useEffect(() => {
    if (tiles.length === 0) {
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
    }
  }, [tiles, setTiles]);

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
  }, [loadAfterId, setTiles]);

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
        <Link key={id} to={`/tile/${id}`}>
          <img src={image} alt="" />
        </Link>
      ))}
      {isLoading && <p className="loader">Loading...</p>}
    </div>
  );
};

export default Tiles;
