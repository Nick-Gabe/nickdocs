import React, { useEffect, useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Translate, { translate } from "@docusaurus/Translate";

import styles from "./index.module.css";
import FollowersBackground from "../components/FollowersBackground";
import getGitHubFollowers from "../utils/getGithubFollowers";

const Heading = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.header}>
      <div className="container">
        <h1 className={styles.heading}>{siteConfig.title}</h1>
        <p className="hero__subtitle">
          {translate({
            message: siteConfig.tagline,
            description: 'A short slogan'
          })}
        </p>
      </div>
    </header>
  );
};

export default function Home(): JSX.Element {
  const { siteConfig, ...info } = useDocusaurusContext();

  const [followersList, setFollowersList] = useState([]);

  useEffect(() => {
    if (followersList.length > 0) return;

    (async function () {
      const followers = await getGitHubFollowers("Nick-Gabe");
      setFollowersList(followers);
    })();
  }, []);

  return (
    <Layout
      title={`Home`}
      description="Description will go into a meta tag in <head />"
    >
      <main>
        <Heading />
        <FollowersBackground followers={followersList} />
      </main>
    </Layout>
  );
}
