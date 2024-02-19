module.exports = {
  extends: [
      "react-app",
      "plugin:jsx-a11y/recommended"
  ],
  plugins: [
      "jsx-a11y"
  ],
  "rules": {
    "jsx-a11y/label-has-associated-control": [ 2, {
      "required": {
        "some": [ "nesting", "id" ]
      }
    }],
  },
  globals: {
    adsbygoogle: "writable" // Позволяет использовать adsbygoogle как глобальную переменную
  }
};

