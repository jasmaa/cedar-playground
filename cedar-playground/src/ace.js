import ace from "ace-builds";

ace.define("ace/mode/cedar", [], function (require, exports, module) {
  var oop = require("ace/lib/oop");
  var TextMode = require("ace/mode/text").Mode;
  var MatchingBraceOutdent =
    require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
  var CstyleBehaviour = require("ace/mode/behaviour/cstyle").CstyleBehaviour;
  var CStyleFoldMode = require("ace/mode/folding/cstyle").FoldMode;
  var CedarHighlightRules =
    require("ace/mode/cedar_highlight_rules").CedarHighlightRules;

  var Mode = function () {
    this.HighlightRules = CedarHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
  };
  oop.inherits(Mode, TextMode);

  (function () {
    this.$id = "ace/mode/cedar";
  }).call(Mode.prototype);

  exports.Mode = Mode;
});

// TODO: improve highlighter: https://ace.c9.io/tool/mode_creator.html
ace.define(
  "ace/mode/cedar_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (require, exports, module) {
    var oop = require("../lib/oop");
    var TextHighlightRules =
      require("./text_highlight_rules").TextHighlightRules;

    var CedarHighlightRules = function () {
      // regexp must not have capturing parentheses. Use (?:) instead.
      // regexps are ordered -> the first match is used
      this.$rules = {
        start: [
          {
            token: "string", // single line
            regex: '"',
            next: "string",
          },
          {
            token: "constant.numeric", // hex
            regex: "0[xX][0-9a-fA-F]+\\b",
          },
          {
            token: "constant.numeric", // float
            regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
          },
          {
            token: "constant.language.boolean",
            regex: "(?:true|false)\\b",
          },
          {
            token: "comment",
            regex: "\\/\\/.*$",
          },
          {
            token: "comment.start",
            regex: "\\/\\*",
            next: "comment",
          },
          {
            token: "paren.lparen",
            regex: "[[({]",
          },
          {
            token: "paren.rparen",
            regex: "[\\])}]",
          },
          {
            token: "punctuation.operator",
            regex: /(?:,|::|;|==|!=|>|<|>=|<=|&&|\|\||\.)/,
          },
          {
            token: "variable.language",
            regex: /\b(?:resource|principal|context|resource|action|this)\b/,
          },
          {
            token: "keyword",
            regex:
              /\b(?:forbid|permit|def|let|else|then|if|has|advice|is|where|in|unless|when|for)\b/,
          },
        ],
        string: [
          {
            token: "constant.language.escape",
            regex: /\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|["\\\/bfnrt])/,
          },
          {
            token: "string",
            regex: '"|$',
            next: "start",
          },
          {
            defaultToken: "string",
          },
        ],
        comment: [
          {
            token: "comment.end",
            regex: "\\*\\/",
            next: "start",
          },
          {
            defaultToken: "comment",
          },
        ],
      };
    };

    oop.inherits(CedarHighlightRules, TextHighlightRules);

    exports.CedarHighlightRules = CedarHighlightRules;
  }
);

export default ace;
