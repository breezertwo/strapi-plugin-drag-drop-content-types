# Strapi Plugin Drag Drop Content Types

Order your content types by rank easily via drag and drop. Simply add a rank field to your content types to get ready for sorting. Supports stable ranks across multiple locales even when a content type is not translated for all locales.

<center>
  <a href="https://www.npmjs.com/package/@breezertwo/strapi-plugin-drag-drop-content-types">
      <img src="https://img.shields.io/npm/v/%40breezertwo%2Fstrapi-plugin-drag-drop-content-types?style=flat-square&color=blue" alt="NPM Version" />
  </a>
  <a href="https://github.com/strapi/strapi">
    <img src="https://img.shields.io/badge/strapi-v5.0.0+-green?style=flat-square" alt="Strapi Version 5+" />
  </a>
  <a href="https://github.com/breezertwo/strapi-plugin-drag-drop-content-types/actions/workflows/test.yaml">
    <img src="https://img.shields.io/github/license/breezertwo/strapi-plugin-drag-drop-content-types" alt="MIT License" />
  </a>
</center>

## ✨ Features

- **Simple Ordering** via modal in the content manager list view
- **Drag and Drop** or **Buttons** for moving content types up and down
- **Multi-Locale Support** Updates all related available locales
- **Permission Management**: Select which users can use the plugin with a specific permission

![dragdropcrop](https://s14.gifyu.com/images/bTE3p.gif)

## 📦 Installation

```bash
npm i @breezertwo/strapi-plugin-drag-drop-content-types
```

## 🚀 Quick Start

1. **Install the plugin**

2. **Enable the plugin** in your `config/plugins.ts`:

```ts
module.exports = {
  'drag-drop-content-types': {
    enabled: true,
  },
};
```

4. **Restart** your Strapi application in development mode

5. **Setup the plugin**
   - Go to `Settings` → `Drag Drop Content Type` → `Configuration`
   - (Optional) Add the _Rank Field Name_ used for sorting. Default field name is `rank`
   - Create a `Number` field called `rank` (or your custom field name) and `Number format: integer` in the content types you want to be sortable. Make the field optional & not localized.
6. **Restart** your Strapi application

7. **Access sorting** via the Drag icon in the right top corner of the ListView

## 🔧 Other config options

- You can set a custom _TitleFieldName_ that will be used to display the title in the drag list instead of the default `mainField`
- A second field can be displayed in the menu via the _SubtitleFieldName_. It can be either a string-like field or an object such as a relation, that has a `title` field named the same as the _TitleFieldName_.
- You can enable webhooks to trigger after updating the order.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

- Built for [Strapi](https://strapi.io/) - The leading open-source headless CMS
- Uses [Strapi Design System](https://design-system.strapi.io/) for UI components
- Based on [drag-drop-content-types-strapi5](https://github.com/cslegany-synerinsoft/drag-drop-content-types-strapi5)

---

<div align="center">
  <strong>⭐ If this plugin helped you, please consider giving it a star on GitHub! ⭐</strong>
</div>
