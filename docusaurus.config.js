// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Nickdocs',
  tagline: 'Let\'s learn together',
  url: 'https://nickdocs.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/nickdocs.svg',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nick-gabe', // Usually your GitHub org/user name.
  projectName: 'nickdocs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    localeConfigs: {
      en: {
        label: 'English'
      },
      pt: {
        label: 'Português'
      }
    }
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/nick-gabe/nickdocs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/nick-gabe/nickdocs/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Nickdocs',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo-light.svg',
          srcDark: 'img/logo-dark.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'introduction/intro',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left'
          },
          {
            label: 'locale',
            position: 'right',
            type: 'localeDropdown'
          },
          {
            href: 'https://github.com/nick-gabe/nickdocs',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Content',
            items: [
              {
                label: 'Docs',
                to: 'docs/introduction/intro',
              },
              {
                label: 'Blog',
                to: '/blog',
              },
            ],
          },
          {
            title: 'Social Medias',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/mynickisnick_',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/nick-gabe',
              },
              {
                label: 'LinkedIn',
                href: 'https://linkedin.com/in/nicolas-gabriel',
              },
            ],
          },
          {
            title: 'Contact',
            items: [
              {
                label: 'NicolasGabrielCtt@gmail.com',
                href: 'mailto:NicolasGabrielCtt@gmail.com'
              },
              {
                label: 'LinkedIn Message',
                href: 'https://linkedin.com/in/nicolas-gabriel',
              },
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Nícolas Gabriel. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
