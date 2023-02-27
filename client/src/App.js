import React, { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";

import s from "./styles.module.css";

const Canvas = ({ imgWidth, imgHeight, imageSrc }) => {
  // const { id } = useParams();

  // const getItems = () => {
  //   try {
  //     let dacDt = localStorage.getItem("DAC") || "[]";
  //     return JSON.parse(dacDt);
  //   } catch (err) {
  //     return [];
  //   }
  // };

  // const loadData = (selected, type) => {
  //   let dacDt = getItems();
  //   dacDt = dacDt.find((i) => i.id === id);

  //   if (dacDt && dacDt[type] && dacDt[type][selected]) {
  //     return dacDt[type][selected];
  //   }

  //   return type === "dis" ? 0 : [];
  // };

  const saveData = () => {
    // let localData = getItems();

    // let coor = {
    //   N: body.DetectionZoneCoordinates.NorthboundRegion,
    //   S: body.DetectionZoneCoordinates.SouthboundRegion,
    // };

    let distance = {
      N: body.distance.N,
      S: body.distance.S,
    };

    // let check = localData.findIndex((i) => i.id === id);

    // const obj = {
    //   id: id,
    //   coor: coor,
    //   dis: distance,
    // };

    // if (check !== -1) {
    //   localData[check] = obj;
    // } else {
    //   localData.push(obj);
    // }

    // localStorage.setItem("DAC", JSON.stringify(localData));
  };

  // sample data DetectionZoneCoordinates
  //  [
  //     {
  //       X: 180,
  //       Y: 120,
  //       height: 111,
  //       width: 124,
  //     },
  //   ]

  const [body, setBody] = useState({
    type: "N",
    zoom: 1,
    SiteImageUrl: imageSrc,
    id: 1,
    // DetectionZoneCoordinates: {
    //   NorthboundRegion: loadData("N", "coor"),
    //   SouthboundRegion: loadData("S", "coor"),
    // },
    // distance: {
    //   N: loadData("N", "dis"),
    //   S: loadData("S", "dis"),
    // },
  });

  const backgroundCanvasRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isFristTime = useRef(true);
  const bgArea = useRef(null);

  let mouseDown = false;
  let initialPositionX;
  let initialPositionY;

  let width = imgWidth;
  let height = imgHeight;
  let zoom = body.zoom;

  // let NorthboundRegion = body.DetectionZoneCoordinates.NorthboundRegion;
  // let SouthboundRegion = body.DetectionZoneCoordinates.SouthboundRegion;

  let typeRect = body.type;

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;
  };

  const redrawBackground = () => {
    const ressRef = backgroundCanvasRef.current;
    const ressRef2D = ressRef.getContext("2d");

    // const canvRef = canvasRef.current;
    // const canvRef2D = canvRef.getContext("2d");

    if (bgArea.current) {
      ressRef2D.drawImage(bgArea.current, 0, 0);
    }
  };

  function drawTextBG(ctx, txt, font, x, y) {
    /// lets save current state as we make a lot of changes
    ctx.save();
    /// set font
    ctx.font = font;
    /// draw text from top - makes life easier at the moment
    ctx.textBaseline = "top";
    /// color for background
    ctx.fillStyle = "#000";
    /// get width of text
    var width = ctx.measureText(txt).width;
    /// draw background rect assuming height of font
    /// for 11 px font -> 11
    ctx.fillRect(x, y, width, parseInt(font, 11));
    /// text color
    ctx.fillStyle = "#fff";
    /// draw text on top
    ctx.fillText(txt, x, y);
    /// restore original state
    ctx.restore();
  }

  const initDraw = () => {
    console.log(backgroundCanvasRef.current.height);
    console.log(backgroundCanvasRef.current.width);

    backgroundCanvasRef.current.height = imgHeight;
    backgroundCanvasRef.current.width = imgWidth;

    console.log(backgroundCanvasRef.current);

    canvasRef.current.height = imgHeight;
    canvasRef.current.width = imgWidth;

    // resize(backgroundCanvasRef.current);
    // resize(canvasRef.current);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // contextRef.current = context;
    // const ressRef = backgroundCanvasRef.current;
    // const ressRef2D = ressRef.getContext("2d");

    context.beginPath();
    context.rect(664, 354, 27, 50);
    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.stroke();

    // context.fillText("My text", 664, 349);

    drawTextBG(context, " Hello World ", "14px Arial", 664, 336);
    context.textBaseline = "top";
  };

  useEffect(() => {
    initDraw();

    redrawBackground();

    if (isFristTime) {
      var background = new Image();
      background.src = body.SiteImageUrl;
      background.onload = function () {
        bgArea.current = background;
        redrawBackground();
      };
      isFristTime.current = false;
    }
  });

  return (
    <>
      <div
        className={s.canvasContainer}
        style={{
          width: imgWidth,
          height: imgHeight,
        }}
      >
        <div className={s.canvasLoc}>
          <canvas className={s.canvasBg} ref={backgroundCanvasRef} />
          <canvas className={s.canvasDrawer} ref={canvasRef} />
        </div>
      </div>
    </>
  );
};

const Component = () => {
  const img = new Image();

  const imageSrc =
    "https://storage.googleapis.com/test-ui-development.appspot.com/ai-processing/id-25_camera-0_2023-02-24T07_05_00_0800_0000000259.jpg";

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  img.onload = function () {
    setWidth(this.width);
    setHeight(this.height);
  };

  img.src = imageSrc;

  return (
    <div>
      <div className="row">
        <div
          className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
          style={{ display: "flex", position: "relative" }}
        >
          <Canvas imageSrc={imageSrc} imgWidth={width} imgHeight={height} />
        </div>
      </div>
    </div>
  );
};

export default Component;
