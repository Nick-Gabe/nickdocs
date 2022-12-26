import React, { useEffect, useState } from "react";
import { drawRandomElement} from '../../utils/array';
import { drawRandomNum } from '../../utils/number';
import styles from './styles.module.css';

type IFollowerProps = {
  followers: Follower[];
}

const FollowersBackground = (props: IFollowerProps) => {
  const [intervalTime, setIntervalTime] = useState(2000);
  const [followers, setFollowers] = useState([]);
  const [gridSize, setGridSize] = useState(0);

  useEffect(() => {
    if(followers.length === 0 && props.followers.length > 1) setFollowers(props.followers.slice(0, 150));

    const switchRandomFollower = () => {
      const randomPos = drawRandomNum(0, followers.length);
      const followersCopy = [...followers];

      const unlistedFollowers = props.followers.filter(
        flw => !followers.some(listedFlw => listedFlw?.id === flw?.id)
      );

      const newRandomFollower = drawRandomElement(unlistedFollowers);
      followersCopy[randomPos] = newRandomFollower;

      setFollowers(followersCopy);
    };

    const interval = setInterval(() => {
      setIntervalTime(drawRandomNum(300, 600));
      if(document.hidden) return;

      switchRandomFollower();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [followers, intervalTime, props.followers]);

  useEffect(() => {

    const calculateGridSize = () => {
      const pixels = document.body.clientHeight * document.body.clientWidth;
      const pixPerGrid = pixels / 100;
      const gridRoot = Math.sqrt(pixPerGrid);
      setGridSize(gridRoot);
    };

    document.body.onresize = calculateGridSize;
    calculateGridSize();
    
  }, []);

  return (
    <div className={styles.bgContainer}>
      {followers.filter(x => x).map((follower, i) => {
        return (
          <img
            className={styles.followerAnimation}
            key={follower.login + i}
            src={follower.avatar_url}
            loading="lazy"
            alt=""
            style={{
              width: `${gridSize}px`,
              height: `${gridSize}px`,
              aspectRatio: 1 / 1,
            }}
          />
        );
      })}
    </div>
  );
};

export default FollowersBackground;
