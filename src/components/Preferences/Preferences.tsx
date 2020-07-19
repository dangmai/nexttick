import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.css";

import * as api from "../../api";

export function Preferences() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    async function fetchData() {
      const preferences = await api.getPreferences();
      setWidth(preferences.data.width);
      setHeight(preferences.data.height);
    }
    fetchData();
  }, []);

  const updatePreferences = async () => {
    await api.setPreferences(width, height);
  };

  return (
    <form>
      <div className="form-group">
        <label htmlFor="width">Width</label>
        <input
          id="width"
          className="form-control"
          type="number"
          value={width}
          onChange={(e) => setWidth(parseInt(e.target.value))}
        ></input>
      </div>
      <div className="form-group">
        <label htmlFor="height">Height</label>
        <input
          id="height"
          className="form-control"
          type="number"
          value={height}
          onChange={(e) => setHeight(parseInt(e.target.value))}
        ></input>
      </div>
      <button onClick={updatePreferences} className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}
