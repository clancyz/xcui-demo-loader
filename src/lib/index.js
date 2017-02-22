'use strict';

var markdownIt = require('markdown-it');
var subscript = require('markdown-it-sub');
var superscript = require('markdown-it-sup');
var footnote = require('markdown-it-footnote');
var deflist = require('markdown-it-deflist');
var abbr = require('markdown-it-abbr');
var insert = require('markdown-it-ins');
var mark = require('markdown-it-mark');
var container = require('markdown-it-container');
var Prism = require('prismjs');

function renderMarkdown(source) {
    var md = new markdownIt({
            highlight: function (str, lang) {
                var language = Prism.languages.javascript;
                switch (lang) {
                    case 'html':
                        language = Prism.languages.markup;
                        break;
                    case 'js':
                        language = Prism.languages.javascript;
                        break;
                    case 'javascript':
                        language = Prism.languages.javascript;
                        break;
                    case 'css':
                        language = Prism.languages.css;
                        break;
                }
                var code = Prism.highlight(str, language);
                return '<pre>' + code + '</pre>';
            }
        })
        .use(subscript)
        .use(superscript)
        .use(footnote)
        .use(deflist)
        .use(abbr)
        .use(insert)
        .use(mark)
        .use(container, 'demo', {
            validate: function (params) {
                return params.trim().match(/^demo\s*(.*)$/);
            },
            render: function (tokens, idx) {
                var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
                var ret = '';
                if (tokens[idx].nesting === 1) {
                    var mdIt = new markdownIt();
                    var infoCode = (m && m.length > 1) ? m[1] : '';
                    infoCode = mdIt.render(infoCode);
                    var sourceCode = tokens[idx + 1].content;
                    var highlightCode = mdIt.render(sourceCode);
                    var htmlCode = sourceCode.replace(/<(script|style)[^>]*?>(?:.|\n)*?<\/\s*\1\s*>/gm, function () {
                        return '';
                    }).replace(/<template[^>]*?>([\s\S][\w\W]*?)<\/template>/gm, function(match, pureCode){
                        return pureCode;
                    });

                    return `<xcui-demo>
                        <div slot="source">${htmlCode}</div>
                        <span slot="info-title">说明</span>
                        <div slot="info">${infoCode}</div>
                        <div slot="highlight">`;
                }
                return '</div></xcui-demo>\n';
            }
        });
    md.set({
        html: true,
        xhtmlOut: true,
        breaks: true,
        linkify: true,
        typographer: true,
        langPrefix: true,
        quotes: true
    });
    md.renderer.rules.table_open = function () {
        return `<table class="markdown-table">\n`;
    };
    var outHtml = md.render(source);
    return '<div>' + outHtml + '</div>';
}

module.exports = function (md) {
    var html = '';
    html = renderMarkdown(md);
    return html;
}
