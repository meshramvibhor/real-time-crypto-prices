import React, { useState, useEffect } from "react";
import type { RootState } from "../store/index";
import { useSelector, useDispatch } from "react-redux";
import { add } from "../store/slice/index";
import io from "socket.io-client";

const index = () => {
  const latestEntries = useSelector(
    (state: RootState) => state.cryptoReducer.latestEntries
  );
  const dispatch = useDispatch();

  type CryptoEntry = {
    _id: string;
    symbol: string;
    price: number;
    timestamp: Date;
    __v: number;
  };

  const [showModal, setShowModal] = useState(false);
  const [coin, setCoin] = useState("bitcoin");
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");

  const displayedEntries = latestEntries[coin] || [];

  useEffect(() => {
    const socket = io("ws://localhost:5000");
    socket.on("latestEntries", (data: unknown) => {
      if (typeof data === "object" && data !== null) {
        dispatch(add(data as { [key: string]: CryptoEntry[] }));
        // setLatestValues(data as { [key: string]: CryptoEntry[] });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const coinArray = ["bitcoin", "ethereum", "dogecoin", "ripple", "litecoin"];

  useEffect(() => {
    console.log("I am outside");

    if (
      Object.keys(latestEntries).length === 0 &&
      latestEntries.constructor === Object
    ) {
      console.log("I am inside");
      const savedEntries = localStorage.getItem("cryptoEntry");
      const initialEntries = savedEntries ? JSON.parse(savedEntries) : {};
      if (Object.keys(initialEntries).length > 0) dispatch(add(initialEntries));
    }
    console.log("fetched entries are ->", latestEntries);
  }, [latestEntries]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div
      style={{
        background: "#e3e3e3",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Recent 20 price entries for {coin}</h1>

      <div
        className="table-container"
        style={{
          width: "50%",
          height: "400px",
          overflowY: "scroll",
        }}
      >
        <table className="table table-hover table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Symbol</th>
              <th scope="col">Price</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            {displayedEntries.map((entry: CryptoEntry, index: number) => (
              <tr key={entry._id}>
                <th scope="row">{index + 1}</th>
                <td>{entry.symbol}</td>
                <td>{entry.price}</td>
                <td>
                  {typeof entry.timestamp === "string"
                    ? new Date(entry.timestamp).toLocaleString()
                    : entry.timestamp.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="button-container text-center mt-3">
        <button
          type="button"
          className="btn btn-outline-dark"
          onClick={openModal}
        >
          Change Coin
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div>
          <div
            className="modal fade show"
            tabIndex={-1}
            role="dialog"
            style={{ display: "block", marginTop: "10rem" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Select Crypto Coin</h5>
                </div>
                <div className="modal-body ml-3">
                  <div className="input-group mb-3 ml-3">
                    <div className="input-group-prepend">
                      <label
                        className="input-group-text"
                        htmlFor="inputGroupSelect01"
                      >
                        Options
                      </label>
                    </div>
                    <select
                      className="custom-select"
                      id="inputGroupSelect01"
                      value={selectedCoin}
                      onChange={(e) => setSelectedCoin(e.target.value)}
                    >
                      <option value="">Choose coin</option>
                      {coinArray.map((coin) => (
                        <option key={coin} value={coin}>
                          {coin}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (selectedCoin) {
                        setCoin(selectedCoin);
                      }
                      closeModal();
                    }}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default index;
