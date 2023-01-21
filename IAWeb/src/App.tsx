import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./routes/Home"));
const Desktop = lazy(() => import("./routes/Desktop"));
const VR = lazy(() => import("./routes/VR"));
const Replay = lazy(() => import("./routes/Replay"));
const ReplayPanel = lazy(() => import("./replay/ReplayPanel"));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/desktop/:dim/:dataset/:roomId/:userId"
          element={<Desktop />}
        />
        <Route path="/vr/:dim/:dataset/:roomId/:userId" element={<VR />} />
        <Route path="/replay" element={<Replay />}>
          <Route path=":userId/:roomId" element={<ReplayPanel />} />
        </Route>
      </Routes>
    </Suspense>
  </Router>
);

export default App;
