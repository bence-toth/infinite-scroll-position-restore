import { useState } from "react";

import Tiles from "./Tiles";
import Tile from "./Tile";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  const [tiles, setTiles] = useState([]);
  const [selectedTileId, setSelectedTileId] = useState();

  return (
    <Router>
      <Switch>
        <Route path="/tile/:id">
          <Tile setSelectedTileId={setSelectedTileId} />
        </Route>
        <Route path="/">
          <Tiles
            tiles={tiles}
            setTiles={setTiles}
            selectedTileId={selectedTileId}
            setSelectedTileId={setSelectedTileId}
          />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
