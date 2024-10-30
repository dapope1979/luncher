import { useEffect } from "react";

const Test = () => {
  useEffect(() => {
    const scanForGames = async () => {
      const response = await window.api.scan();
      console.log("aaa", response); // prints out 'pong'
    };

    scanForGames();
  }, []);

  return <div>hey</div>;
};

export default Test;
