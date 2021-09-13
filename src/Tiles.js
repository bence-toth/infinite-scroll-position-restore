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

const extractTilesData = (result) =>
  result.data.children.map((child) => ({
    id: child.data.name,
    image: child.data.thumbnail,
    imageWidth: child.data.thumbnail_width,
    imageHeight: child.data.thumbnail_height,
  }));

const Tiles = ({ tiles, setTiles, selectedTileId, setSelectedTileId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadAfterId, setLoadAfterId] = useState();

  // Load first page of tiles if no tiles have been loaded yet
  useEffect(() => {
    if (tiles.length === 0) {
      setIsLoading(true);
      fetchTilesPage()
        .then((response) => response.json())
        .then((result) => {
          setTiles(extractTilesData(result));
          setIsLoading(false);
        });
    }
  }, [tiles, setTiles]);

  // Load next page of tiles when `loadAfterId` changes
  useEffect(() => {
    if (loadAfterId) {
      setIsLoading(true);
      fetchTilesPage(loadAfterId)
        .then((response) => response.json())
        .then((result) => {
          setTiles((tiles) => [...tiles, ...extractTilesData(result)]);
          setIsLoading(false);
          setLoadAfterId(undefined);
        });
    }
  }, [loadAfterId, setTiles]);

  // Scroll back to the selected tile when coming from the Tile component
  useEffect(() => {
    if (selectedTileId) {
      const positionToScrollTo =
        document.getElementById(selectedTileId).offsetTop;
      console.log(positionToScrollTo);
      window.scrollTo(0, positionToScrollTo);
      setSelectedTileId(undefined);
    }
  }, [selectedTileId, setSelectedTileId]);

  // Load next page if scrolled close to the bottom
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

  // Call `handleOnScroll` when the body is being scrolled
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
