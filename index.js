const express = require("express");
const path = require("path");
const axios = require("axios");
const cors = require("cors");

const app = express();

let corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "/client/build")));

function spliceIntoChunks(arr, chunkSize) {
  const res = [];
  while (arr.length > 0) {
    const chunk = arr.splice(0, chunkSize);
    res.push(chunk);
  }
  return res;
}

app.get("/data", (req, res) => {
  axios
    .get(
      // "https://storage.googleapis.com/test-ui-development.appspot.com/ai-processing/id-25_camera-0_2023-02-24T07_05_00_0800_0000000259.txt"
      "https://storage.googleapis.com/test-ui-development.appspot.com/ai-processing/id-25_camera-0_2023-02-27T13_01_34_0800_0000001227.txt"
    )
    .then((resp) => {
      const stringify = JSON.stringify(resp.data);

      let txtArray = stringify.split(" ");

      let outArray = spliceIntoChunks(txtArray, 15);

      const dataObject = [];

      outArray.forEach((o) => {
        if (o.length === 15) {
          const convertStringToNumber = {};

          let left;
          let top;

          o.forEach((el, i) => {
            if (i !== 0) {
              if (i === 4) {
                convertStringToNumber.left = parseInt(el);
                left = parseInt(el);
              }

              if (i === 5) {
                convertStringToNumber.top = parseInt(el);
                top = parseInt(el);
              }

              if (i === 6) {
                convertStringToNumber.width = parseInt(el) - left;
              }

              if (i === 7) {
                convertStringToNumber.height = parseInt(el) - top;
              }
            } else {
              // convertStringToNumber.push(el);
              convertStringToNumber.name = el.replace(/\\r|\\n|\"/g, "");
            }
          });

          dataObject.push(convertStringToNumber);
        }
      });

      res.send(dataObject);
    });
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/build/index.html"))
);

const PORT = process.env.PORT || 9999;

app.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
