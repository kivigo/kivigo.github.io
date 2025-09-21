import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Documentation sidebar
  documentationSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/getting-started',
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/operations',
        'getting-started/examples',
      ],
    },
    {
      type: 'category',
      label: 'Backends',
      items: [
        'backends/overview',
        'backends/badger',
        'backends/redis',
        'backends/consul',
        'backends/etcd',
        'backends/local',
        'backends/memcached',
        'backends/mongodb',
        'backends/mysql',
        'backends/postgresql',
        'backends/azurecosmos',
        'backends/dynamodb',
      ],
    },
    {
      type: 'category',
      label: 'Encoders',
      items: [
        'encoders/overview',
        'encoders/json',
        'encoders/yaml',
        'encoders/encrypt',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/health-checks',
        'advanced/custom-backend',
        'advanced/mock-testing',
        'advanced/batch-operations',
        'advanced/hooks',
      ],
    },
  ],
};

export default sidebars;
