// import pluginPkg from '../../package.json';
// //import pluginLogo from './assets/images/logo.svg';
// import App from './containers/App';
// import Initializer from './containers/Initializer';
// //import Link from './InjectedComponents/ContentManager/EditViewLink';
// //import Button from './InjectedComponents/ContentManager/EditSettingViewButton';
// import lifecycles from './lifecycles';
// import trads from './translations';
// import pluginId from './pluginId';

// export default strapi => {
//   const pluginDescription =
//     pluginPkg.strapi.description || pluginPkg.description;
//   const plugin = {
//     blockerComponent: null,
//     blockerComponentProps: {},
//     description: pluginDescription,
//     icon: pluginPkg.strapi.icon,
//     id: pluginId,
//     initializer: Initializer,
//     injectedComponents: [
//     ],
//     isRequired: pluginPkg.strapi.required || false,
//     layout: null,
//     lifecycles,
//     leftMenuLinks: [],
//     leftMenuSections: [],
//     mainComponent: App,
//     name: pluginPkg.strapi.name,
//     pluginLogo: null,
//     preventComponentRendering: false,
//     trads,
//     menu: {
//       // Set a link into the PLUGINS section
//       pluginsSectionLinks: [
//         {
//           destination: `/plugins/${pluginId}`, // Endpoint of the link
//           icon: pluginPkg.strapi.icon,
//           label: {
//             id: `${pluginId}.plugin.name`, // Refers to a i18n
//             defaultMessage: pluginPkg.strapi.name,
//           },
//           name: pluginPkg.strapi.name,
//           // If the plugin has some permissions on whether or not it should be accessible
//           // depending on the logged in user's role you can set them here.
//           // Each permission object performs an OR comparison so if one matches the user's ones
//           // the link will be displayed
//           permissions: [
// 		  // { action: `plugins::${pluginId}.read`, subject: null },
//           // {
//             // action: `plugins::${pluginId}.create`,
//             // subject: null,
//           // },
//           // {
//             // action: `plugins::${pluginId}.update`,
//             // subject: null,
//           // },
//         ],
//         },
//       ],
//     },
//   };

//   return strapi.registerPlugin(plugin);
// };


import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import App from './containers/App';
import Initializer from './containers/Initializer';
import lifecycles from './lifecycles';
import trads from './translations';

export default strapi => {
  const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
  const icon = pluginPkg.strapi.icon;
  const name = pluginPkg.strapi.name;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    mainComponent: App,
    name,
    preventComponentRendering: false,
    trads,
    menu: {
      pluginsSectionLinks: [
        {
          destination: `/plugins/${pluginId}`,
          icon,
          label: {
            id: `${pluginId}.plugin.name`,
            defaultMessage: name,
          },
          name,
          permissions: [
            // Uncomment to set the permissions of the plugin here
            // {
            //   action: '', // the action name should be plugins::plugin-name.actionType
            //   subject: null,
            // },
          ],
        },
      ],
    },
  };

  return strapi.registerPlugin(plugin);
};
