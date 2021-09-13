import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const Tile = ({ setSelectedTileId }) => {
  let { id } = useParams();

  useEffect(() => {
    setSelectedTileId(id);
  }, [id, setSelectedTileId]);

  return (
    <div>
      <h1>{id}</h1>
      <Link to="/">Go back</Link>
    </div>
  );
};

export default Tile;
