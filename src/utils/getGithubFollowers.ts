import axios from "axios";

export type FollowersData = Follower[];

export default async function getGitHubFollowers (accountName: string) {
  const quantityOfFollowers = await axios.get<Profile>(
    `https://api.github.com/users/${accountName}`
  );
  const pages = Math.ceil(quantityOfFollowers.data.followers / 100);

  let followerList: Follower[] = [];

  for (let page = 1; page <= pages; page++) {
    const currentPage = await axios.get<GithubFollower[]>(
      `https://api.github.com/users/${accountName}/followers?page=${page}&per_page=100`
    );

    const shuffledFollowers = currentPage.data
      .map(info => {
        return {
          avatar_url: info.avatar_url,
          login: info.login,
          id: info.id,
          type: info.type,
          site_admin: info.site_admin,
        };
      })
      .sort(() => (Math.random() > 0.5 ? 1 : -1));

    followerList.push(...shuffledFollowers);
  }

  followerList = [...new Set(followerList)];

  return followerList
}
