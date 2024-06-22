import React, { useRef, useState } from "react";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";

export default function Meme() {
  // const [memeImage, setMemeImage] = React.useState("")
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    randomImage: "",
  });

  const [allMeme, setAllMeme] = React.useState([]);
  const memeContainerRef = useRef();

  React.useEffect(() => {
    setLoading(true);
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((file) => {
        setLoading(false);
        setAllMeme(file.data.memes);
        setDefaultMemeImage(file.data.memes);
      });
  }, []);

  function setDefaultMemeImage(memesArr) {
    const randomNumber = Math.floor(Math.random() * memesArr.length);
    const url = memesArr[randomNumber].url;
    setMeme((oldMeme) => ({
      ...oldMeme,
      randomImage: url,
    }));
  }

  async function downLoadMeme() {
    setDownloadLoading(true);
    const blob = await domtoimage.toBlob(memeContainerRef.current);
    saveAs(blob, "my-meme.png");

    setDownloadLoading(false);
  }

  function getMemeImage() {
    const randomNumber = Math.floor(Math.random() * allMeme.length);
    const url = allMeme[randomNumber].url;
    setMeme((oldMeme) => ({
      ...oldMeme,
      randomImage: url,
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setMeme((prevMeme) => ({
      ...prevMeme,
      [name]: value,
    }));
  }

  if (loading) {
    return <p>Loadng...</p>;
  }

  return (
    <main>
      <div className="form">
        <input
          type="text"
          placeholder="Top text"
          className="form--input"
          name="topText"
          value={meme.topText}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Bottom text"
          className="form--input"
          name="bottomText"
          value={meme.bottomText}
          onChange={handleChange}
        />
        <button className="form--button" onClick={getMemeImage}>
          Get a new meme image 🖼
        </button>
      </div>
      <div className="meme" ref={memeContainerRef}>
        <img src={meme.randomImage} className="meme--image" />
        <h2 className="meme--text top">{meme.topText}</h2>
        <h2 className="meme--text bottom">{meme.bottomText}</h2>
      </div>
      <button
        disabled={downloadLoading}
        className="button_download"
        onClick={downLoadMeme}
      >
        Download Meme
      </button>
    </main>
  );
}
