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

const Tiles = ({ tiles, setTiles, selectedTileId, setSelectedTileId }) => {
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
              imageWidth: child.data.thumbnail_width,
              imageHeight: child.data.thumbnail_height,
            }))
          );
          setIsLoading(false);
        });
    }
  }, [tiles, setTiles]);

  useEffect(() => {
    if (selectedTileId) {
      const positionToScrollTo =
        document.getElementById(selectedTileId).offsetTop;
      console.log(positionToScrollTo);
      window.scrollTo(0, positionToScrollTo);
      setSelectedTileId(undefined);
    }
  }, [selectedTileId, setSelectedTileId]);

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
              imageWidth: child.data.thumbnail_width,
              imageHeight: child.data.thumbnail_height,
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
      {tiles.map(({ id, image, imageWidth, imageHeight }) => (
        <Link key={id} id={id} to={`/tile/${id}`}>
          <img
            src={image}
            alt=""
            style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
          />
        </Link>
      ))}
      {isLoading && <p className="loader">Loading...</p>}
    </div>
  );
};

export default Tiles;
