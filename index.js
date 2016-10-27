'use strict';

var markdownIt = require('markdown-it');
var subscript = require('markdown-it-sub');
var superscript = require('markdown-it-sup');
var footnote = require('markdown-it-footnote');
var deflist = require('markdown-it-deflist');
var abbr = require('markdown-it-abbr');
var insert = require('markdown-it-ins');
var mark = require('markdown-it-mark');
var Prism = require('prismjs');

var md = new markdownIt();

function renderMarkdown(source) {
    md = new markdownIt({
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
        .use(mark);
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
        return `<table class="table">\n`;
    };
    var outHtml = md.render(source);
    return '<div>' + outHtml + '</div>';
}

function renderDemo(source) {
    var outHtml = String(source)
        .replace(/\r\n?|[\n\u2028\u2029]/g, '\n')
        .replace(/^\uFEFF/, '')
        .replace(/[\r\n]+/g, '\n')
        .replace(/^\n+|\s+$/mg, '')
        .replace('<demo>', '<div class="xcui-demo-container col-md-12 col-xs-12 col-lg-12">')
        .replace('</demo>', '</div>')
        .replace(
            /^(.*#\{[^}]*\}.*|[ \t]*[&=:|].*|[ \w\t_$]*([^&\^?|\n\w\/'"{}\[\]+\-():;, \t=\.$_]|:\/\/).*$|(?!\s*(else|do|try|finally|void|typeof\s[\w$_]*)\s*$)[^'":;{}()\[\],\n|=&\/^?]+$)\s?/mg,
            function (expression) {
                expression = expression
                    .replace(/\n/g, '\\n')
                    .replace(/^'',|,''$/g, '');
                return expression;
            })
        .replace(/<example title=\"([^\"]*)\"[^>]*>([\s\S][\w\W]*?)<\/example>/gmi, function (s, title, code) {
            var esCode = Prism.highlight(code, Prism.languages.markup, 'markup')
                        .replace(/\s+$/gi, '')
                        .replace(/{/g, '<span class="token punctuation">{</span>')
                        .replace(/}/g, '<span class="token punctuation">}</span>')
            esCode = removeIndent(esCode);
            var str = `<div class="col-md-12 col-xs-12 col-lg-12 xcui-example-container">
                    <h3>${title}</h3>
                    <div class="xcui-demo-wrap col-xs-12 col-md-6 col-lg-6">${code}</div>
                    <div class="xcui-code-wrap col-xs-12 col-md-6 col-lg-6"><pre>${esCode}</pre></div>
                    </div>`;
            return str;
        })
        .replace(/\\n/g, '\n');

    return outHtml;
}

function removeIndent(source) {
    var indents = source.match(/\\n(\s{2,})/gmi);
    if (!indents || !indents[0].length) {
        return source;
    }
    indents.sort(function (a, b) {
        return a.length - b.length; });
    if (!indents[0].length){
        return source;
    }
    return source.replace(new RegExp(`\\\\n\\s{${indents[0].length-2}}`, 'gm'), '\\n');
}

module.exports = function (md) {
    var html = '';
    html = renderMarkdown(md);
    html = renderDemo(html);
    return html;
}
